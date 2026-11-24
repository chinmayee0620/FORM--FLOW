import axios from 'axios';
import { 
  Application, 
  DriveDocument, 
  Opportunity, 
  CalendarReminder, 
  AuditRecord 
} from '../types';
import { 
  MOCK_DRIVE_DOCUMENTS, 
  MOCK_APPLICATIONS, 
  MOCK_OPPORTUNITIES, 
  MOCK_REMINDERS, 
  MOCK_AUDIT_LOGS 
} from './mockData';

// Reusable Axios instance ready for future FastAPI + Google Cloud Run backend
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mockable service methods enabling seamless future backend connection
export const FormFlowService = {
  // Drive Documents (Document MCP)
  async getDocuments(): Promise<DriveDocument[]> {
    // In future: return (await apiClient.get('/documents')).data;
    return Promise.resolve([...MOCK_DRIVE_DOCUMENTS]);
  },

  async searchDrive(query: string): Promise<DriveDocument[]> {
    const q = query.toLowerCase();
    return Promise.resolve(
      MOCK_DRIVE_DOCUMENTS.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.contentSummary.toLowerCase().includes(q) ||
        d.extractedFields.some(f => String(f.value).toLowerCase().includes(q) || f.label.toLowerCase().includes(q))
      )
    );
  },

  // Applications (Form Analysis & Browser MCP)
  async getApplications(): Promise<Application[]> {
    return Promise.resolve([...MOCK_APPLICATIONS]);
  },

  async getApplicationById(id: string): Promise<Application | undefined> {
    return Promise.resolve(MOCK_APPLICATIONS.find(a => a.id === id));
  },

  async approveApplication(id: string): Promise<Application | undefined> {
    const app = MOCK_APPLICATIONS.find(a => a.id === id);
    if (app) {
      app.isApproved = true;
      app.status = 'approved';
    }
    return Promise.resolve(app);
  },

  // Opportunities & Recommendations
  async getOpportunities(): Promise<Opportunity[]> {
    return Promise.resolve([...MOCK_OPPORTUNITIES]);
  },

  // Reminders & Calendar (Calendar MCP)
  async getReminders(): Promise<CalendarReminder[]> {
    return Promise.resolve([...MOCK_REMINDERS]);
  },

  // Audit Logs (Approval & Audit MCP)
  async getAuditLogs(): Promise<AuditRecord[]> {
    return Promise.resolve([...MOCK_AUDIT_LOGS]);
  }
};
