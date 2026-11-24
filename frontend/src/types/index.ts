export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  institution?: string;
  usnRollNo?: string;
  degreeBranch?: string;
  academicYear?: string;
  avatarUrl?: string;
  isDriveConnected: boolean;
  driveAccountEmail?: string;
  connectedFoldersCount: number;
  lastSyncedAt?: string;
  isCalendarConnected?: boolean;
  calendarEmail?: string;
}

export interface DriveDocument {
  id: string;
  name: string;
  category: 'academic' | 'identity' | 'income' | 'certificates' | 'other';
  fileType: 'pdf' | 'jpg' | 'png';
  size: string;
  modifiedDate: string;
  folderPath: string;
  extractedFields: ExtractedField[];
  validity?: DocumentValidity;
  contentSummary: string;
  previewSnippet?: string;
  verificationStatus?: 'verified' | 'pending' | 'discrepancy';
}

export interface ExtractedField {
  key: string;
  label: string;
  value: string | number;
  confidence: number;
  sourceDocName: string;
  sourcePage?: number;
  verified: boolean;
}

export interface DocumentValidity {
  issueDate?: string;
  expiryDate?: string;
  validityPeriod?: string;
  status: 'valid' | 'due_soon' | 'expiring' | 'expired' | 'no_expiry_required';
  daysRemaining?: number;
  isUserConfirmed: boolean;
  renewalGuidance?: string;
  officialPortalUrl?: string;
  note?: string;
}

export interface RequirementItem {
  id: string;
  title: string;
  type: 'document' | 'criteria' | 'data_field';
  requirement: string;
  status: 'matched' | 'missing' | 'discrepancy' | 'verified';
  userValue?: string;
  sourceDocument?: string;
  details?: string;
}

export interface ApplicationTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  requiredDoc?: string;
}

export interface ApplicationTimelineEvent {
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface PreparedField {
  id: string;
  fieldKey: string;
  fieldName: string;
  section: string;
  mappedValue: string;
  sourceDocument: string;
  sourcePage?: number;
  confidence: number;
  status: 'verified' | 'warning' | 'manual_input';
  discrepancyWarning?: string;
}

export interface Application {
  id: string;
  title: string;
  category: 'scholarship' | 'internship' | 'admission' | 'government_scheme' | 'job';
  provider: string;
  portalUrl: string;
  deadline: string;
  status: 'drafting' | 'analyzing' | 'ready_for_review' | 'approved' | 'submitted';
  readinessScore: number;
  description: string;
  requirements: RequirementItem[];
  preparedFields: PreparedField[];
  tasks?: ApplicationTask[];
  timeline?: ApplicationTimelineEvent[];
  createdAt: string;
  updatedAt: string;
  targetFolder: string;
  humanApprovalRequired: boolean;
  isApproved?: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  category: 'scholarship' | 'internship' | 'admission' | 'government_scheme' | 'job';
  provider: string;
  awardAmount: string;
  deadline: string;
  matchScore: number;
  matchReasons: string[];
  eligibilitySummary: string;
  officialUrl: string;
  status: 'recommended' | 'saved' | 'dismissed' | 'applied';
  verifiedSource: boolean;
  postedDate: string;
  location?: string;
  type?: string;
}

export interface CalendarReminder {
  id: string;
  title: string;
  type: 'deadline' | 'document_renewal' | 'followup';
  dueDate: string;
  daysRemaining: number;
  priority: 'high' | 'medium' | 'low';
  relatedEntity: string;
  status: 'upcoming' | 'due_soon' | 'overdue' | 'completed';
  notes?: string;
  actionUrl?: string;
}

export type MCPServerName = 
  | 'Document MCP'
  | 'Form Analysis MCP'
  | 'Verification MCP'
  | 'Browser MCP'
  | 'Calendar MCP'
  | 'Approval & Audit MCP';

export interface MCPExecutionStep {
  server: MCPServerName;
  toolName: string;
  status: 'completed' | 'in_progress' | 'warning';
  outputSnippet: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  isStreaming?: boolean;
  mcpSteps?: MCPExecutionStep[];
  readinessCard?: {
    applicationId: string;
    applicationTitle: string;
    score: number;
    matched: number;
    missing: number;
    issues: number;
  };
  approvalCard?: {
    applicationId: string;
    applicationTitle: string;
    fieldsCount: number;
    targetPortal: string;
    status: 'pending' | 'approved' | 'rejected';
  };
  sourcesCited?: {
    docName: string;
    page?: number;
    folder: string;
    snippet: string;
  }[];
  recommendations?: Opportunity[];
  isSimulated?: boolean;
  intent?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  pinned?: boolean;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  action: string;
  mcpServer: MCPServerName;
  details: string;
  status: 'allowed' | 'requires_consent' | 'confirmed';
  ipAddress?: string;
}
