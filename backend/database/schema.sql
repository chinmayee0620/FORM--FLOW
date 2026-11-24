-- ==============================================================================
-- FORMFLOW DATABASE SCHEMA & ROW LEVEL SECURITY (SUPABASE POSTGRESQL)
-- Project: FormFlow - Intelligent Application & Form Assistant
-- Design System: Vibrant Editorial × Linear
-- PRIVACY PRINCIPLE: Zero document contents stored in DB. Only authorized metadata.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USER PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    academic_program TEXT DEFAULT 'Computer Science & Engineering',
    academic_year TEXT DEFAULT '2nd Year',
    institution TEXT DEFAULT 'MSRIT Bangalore',
    drive_connected BOOLEAN DEFAULT FALSE,
    drive_account_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. ENCRYPTED GOOGLE OAUTH TOKENS (Stored encrypted via Fernet AES-256)
CREATE TABLE IF NOT EXISTS public.google_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    account_email TEXT NOT NULL,
    encrypted_access_token TEXT NOT NULL,
    encrypted_refresh_token TEXT,
    token_expiry TIMESTAMP WITH TIME ZONE,
    scope TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT uq_user_token UNIQUE (user_id, account_email)
);

-- 3. APPLICATIONS & WORKFLOWS
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    deadline DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'drafting', -- 'analyzing', 'drafting', 'ready_for_review', 'submitted'
    readiness_score INTEGER DEFAULT 0 CHECK (readiness_score >= 0 AND readiness_score <= 100),
    official_url TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    requirements JSONB DEFAULT '[]'::jsonb,
    field_mappings JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. DOCUMENTS METADATA (Privacy strictly preserved - NO permanent text or blobs)
CREATE TABLE IF NOT EXISTS public.documents_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    google_drive_file_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size_bytes BIGINT,
    modified_time TIMESTAMP WITH TIME ZONE,
    category TEXT DEFAULT 'general', -- 'identity', 'academic', 'income', 'resume', 'general'
    verification_status TEXT DEFAULT 'unverified', -- 'verified', 'discrepancy', 'unverified'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT uq_user_drive_file UNIQUE (user_id, google_drive_file_id)
);

-- 5. UPCOMING DEADLINES & REMINDERS
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_date DATE NOT NULL,
    related_entity TEXT,
    priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    type TEXT DEFAULT 'deadline',   -- 'deadline', 'renewal', 'verification'
    status TEXT DEFAULT 'pending',  -- 'pending', 'completed', 'overdue'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 6. HUMAN APPROVAL AUDIT LOGS (Safety Gate)
CREATE TABLE IF NOT EXISTS public.human_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL, -- 'form_submission', 'data_extraction', 'credential_share'
    status TEXT NOT NULL DEFAULT 'approved', -- 'approved', 'rejected', 'pending'
    user_signature TEXT NOT NULL,
    user_notes TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 7. ACTIVITY & PRIVACY AUDIT TRAIL
CREATE TABLE IF NOT EXISTS public.activity_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL, -- 'application', 'document', 'reminder', 'auth'
    target_id TEXT,
    details TEXT,
    ip_address TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.human_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_history ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update only their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Google Tokens: Strictly isolated to owner
CREATE POLICY "Users can manage own tokens" ON public.google_tokens
    FOR ALL USING (auth.uid() = user_id);

-- Applications: User isolation
CREATE POLICY "Users can manage own applications" ON public.applications
    FOR ALL USING (auth.uid() = user_id);

-- Documents Metadata: User isolation
CREATE POLICY "Users can manage own documents metadata" ON public.documents_metadata
    FOR ALL USING (auth.uid() = user_id);

-- Reminders: User isolation
CREATE POLICY "Users can manage own reminders" ON public.reminders
    FOR ALL USING (auth.uid() = user_id);

-- Human Approvals: User isolation
CREATE POLICY "Users can view own approvals" ON public.human_approvals
    FOR ALL USING (auth.uid() = user_id);

-- Activity History: User isolation
CREATE POLICY "Users can view own activity history" ON public.activity_history
    FOR ALL USING (auth.uid() = user_id);
