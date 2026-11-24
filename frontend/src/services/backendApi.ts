/**
 * Backend API service for FormFlow.
 * Uses Axios with configurable base URL.
 * Falls back gracefully when backend is unavailable.
 */
import axios from 'axios';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const backendApi = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 15000,
  headers: { 
    'Content-Type': 'application/json',
    'X-User-Id': 'user_darshan'
  },
});

// ───────────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────────

export interface LLMProviderStatus {
  provider_id: string;
  status: 'CONNECTED' | 'NOT_CONFIGURED' | 'ERROR' | 'DEGRADED';
  is_mock: boolean;
  model_name: string | null;
  message: string;
  latency_ms: number | null;
}

export interface MCPServerStatus {
  server_id: string;
  name: string;
  description: string;
  transport: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'NOT_CONFIGURED';
  is_mock: boolean;
  tool_count: number;
  tools: Array<{ name: string; server_id: string; description: string }>;
  endpoint: string | null;
  error_message: string | null;
}

export interface BackendHealth {
  status: string;
  app_name: string;
  version: string;
  active_llm_provider: string;
  is_mock_llm: boolean;
  llm_providers: Record<string, LLMProviderStatus>;
  mcp_servers_total: number;
  mcp_servers_connected: number;
  mcp_servers: MCPServerStatus[];
}

export interface BackendChatResponse {
  conversation_id: string;
  reply: string;
  provider_used: string;
  model_used: string;
  is_mock_provider: boolean;
  mcp_steps: Array<{ server: string; toolName: string; status: string; outputSnippet: string; timestamp: string }>;
  should_open_browser: boolean;
  browser_url: string | null;
  readiness_card: Record<string, unknown> | null;
}

export interface GoogleDriveStatus {
  user_id: string;
  is_connected: boolean;
  google_account_email: string | null;
  connection_status: string;
  connected_at: number | null;
  scopes: string[];
  is_configured_gcp: boolean;
}

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  category?: string;
  webViewLink?: string;
}

export interface DriveSearchResponse {
  files: DriveFileItem[];
  nextPageToken?: string | null;
  total_matched: number;
  is_demo_fallback?: boolean;
}

export interface DriveActivityItem {
  id: string;
  timestamp: number;
  timestamp_formatted: string;
  action: string;
  details: string;
  status: string;
  document_name?: string | null;
}

export interface FileContentResult {
  file_id: string;
  file_name: string;
  mime_type: string;
  extracted_text: string;
  char_count: number;
  is_demo_fallback?: boolean;
}

// ───────────────────────────────────────────────────────────
// Core API Calls
// ───────────────────────────────────────────────────────────

export async function fetchBackendHealth(): Promise<BackendHealth | null> {
  try {
    const res = await backendApi.get<BackendHealth>('/api/health');
    return res.data;
  } catch {
    return null;
  }
}

export async function sendMessageToBackend(
  conversationId: string,
  message: string,
  context?: Record<string, unknown> | null
): Promise<BackendChatResponse | null> {
  try {
    const res = await backendApi.post<BackendChatResponse>('/api/chat/message', {
      conversation_id: conversationId,
      message,
      context,
    });
    return res.data;
  } catch {
    return null;
  }
}

export async function fetchMCPServers(): Promise<MCPServerStatus[]> {
  try {
    const res = await backendApi.get<{ servers: MCPServerStatus[] }>('/api/mcp/servers');
    return res.data.servers;
  } catch {
    return [];
  }
}

export async function connectMCPServer(serverId: string): Promise<boolean> {
  try {
    const res = await backendApi.post(`/api/mcp/servers/${serverId}/connect`);
    return res.data.success;
  } catch {
    return false;
  }
}

export async function disconnectMCPServer(serverId: string): Promise<boolean> {
  try {
    const res = await backendApi.post(`/api/mcp/servers/${serverId}/disconnect`);
    return res.data.success;
  } catch {
    return false;
  }
}

export async function setActiveLLMProvider(providerId: string): Promise<boolean> {
  try {
    const res = await backendApi.post('/api/llm/active', { provider_id: providerId });
    return res.data.success;
  } catch {
    return false;
  }
}

// ───────────────────────────────────────────────────────────
// Real Google Drive & OAuth API Calls
// ───────────────────────────────────────────────────────────

export async function fetchGoogleDriveStatus(): Promise<GoogleDriveStatus | null> {
  try {
    const res = await backendApi.get<GoogleDriveStatus>('/api/auth/google/drive/status');
    return res.data;
  } catch {
    return null;
  }
}

export async function startGoogleDriveOAuth(): Promise<{ auth_url: string; state: string; is_configured: boolean; notice: string } | null> {
  try {
    const res = await backendApi.post('/api/auth/google/drive/start');
    return res.data;
  } catch {
    return null;
  }
}

export async function disconnectGoogleDrive(): Promise<boolean> {
  try {
    const res = await backendApi.post('/api/auth/google/drive/disconnect');
    return res.data.success;
  } catch {
    return false;
  }
}

export async function revokeGoogleDriveAccess(): Promise<boolean> {
  try {
    const res = await backendApi.post('/api/auth/google/drive/revoke');
    return res.data.success;
  } catch {
    return false;
  }
}

export async function searchDriveFiles(query: string = '', mimeType?: string): Promise<DriveSearchResponse | null> {
  try {
    const res = await backendApi.post<DriveSearchResponse>('/api/drive/search', {
      query,
      mime_type: mimeType,
      page_size: 20
    });
    return res.data;
  } catch {
    return null;
  }
}

export async function readDriveFileContent(fileId: string, purpose: string = 'user_preview'): Promise<FileContentResult | null> {
  try {
    const res = await backendApi.post<FileContentResult>(`/api/drive/files/${fileId}/read`, {
      purpose
    });
    return res.data;
  } catch {
    return null;
  }
}

export async function fetchDriveActivity(limit: number = 20): Promise<DriveActivityItem[]> {
  try {
    const res = await backendApi.get<{ activities: DriveActivityItem[] }>('/api/drive/activity', {
      params: { limit }
    });
    return res.data.activities;
  } catch {
    return [];
  }
}

export async function clearDriveTemporaryData(): Promise<boolean> {
  try {
    const res = await backendApi.delete('/api/drive/temporary-data');
    return res.data.success;
  } catch {
    return false;
  }
}
