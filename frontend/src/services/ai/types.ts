import { BrowserPageContext } from '../../types/browser';
import { 
  UserProfile, 
  DriveDocument, 
  Application, 
  CalendarReminder, 
  ChatMessage, 
  MCPExecutionStep, 
  Opportunity 
} from '../../types';

export type AssistantIntent =
  | 'find_forms'
  | 'understand_requirements'
  | 'find_required_documents'
  | 'check_application_status'
  | 'fill_application_form'
  | 'find_deadlines'
  | 'set_reminders'
  | 'explain_page'
  | 'open_portal'
  | 'general_query';

export type ToolStatusStage =
  | 'understanding_request'
  | 'inspecting_application'
  | 'checking_documents'
  | 'preparing_form_fields'
  | 'waiting_for_approval'
  | 'completed';

export interface ToolStatusMessage {
  stage: ToolStatusStage;
  label: string;
  detail: string;
  status: 'pending' | 'in_progress' | 'completed' | 'waiting';
  timestamp?: string;
}

export interface AIConversationContext {
  conversationId: string;
  browserPageContext?: BrowserPageContext | null;
  userProfile?: UserProfile;
  documents?: DriveDocument[];
  applications?: Application[];
  reminders?: CalendarReminder[];
  conversationHistory?: ChatMessage[];
}

export interface AIResponseResult {
  message: string;
  intent: AssistantIntent;
  providerId: string;
  modelName: string;
  isSimulated: boolean;
  toolStatuses: ToolStatusMessage[];
  mcpSteps: MCPExecutionStep[];
  shouldOpenBrowser?: boolean;
  browserUrl?: string;
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
}

export interface LLMProviderInterface {
  providerId: string;
  displayName: string;
  isMock: boolean;
  detectIntent(query: string, context?: AIConversationContext): AssistantIntent;
  generateResponse(query: string, context: AIConversationContext): Promise<AIResponseResult>;
}
