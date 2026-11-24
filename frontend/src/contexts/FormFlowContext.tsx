import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  DriveDocument, 
  Application, 
  Opportunity, 
  CalendarReminder, 
  AuditRecord, 
  ChatMessage,
  Conversation
} from '../types';
import { 
  INITIAL_USER, 
  MOCK_DRIVE_DOCUMENTS, 
  MOCK_APPLICATIONS, 
  MOCK_OPPORTUNITIES, 
  MOCK_REMINDERS, 
  MOCK_AUDIT_LOGS 
} from '../services/mockData';
import { chatService, INITIAL_CONVERSATIONS } from '../services/chatService';
import { fetchGoogleDriveStatus } from '../services/backendApi';
import { useBrowser } from './BrowserContext';

interface FormFlowContextType {
  user: UserProfile;
  documents: DriveDocument[];
  applications: Application[];
  opportunities: Opportunity[];
  reminders: CalendarReminder[];
  auditLogs: AuditRecord[];
  
  // Multi-conversation state
  conversations: Conversation[];
  activeConversationId: string;
  activeConversation: Conversation | undefined;
  isAnalyzing: boolean;
  selectConversation: (id: string) => void;
  createNewConversation: () => Promise<string>;
  deleteConversation: (id: string) => Promise<void>;
  renameConversation: (id: string, newTitle: string) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  regenerateLastResponse: () => Promise<void>;

  // Global modals & previews
  activeDocPreview: DriveDocument | null;
  activeApprovalModal: Application | null;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  isDriveModalOpen: boolean;
  openDriveModal: () => void;
  closeDriveModal: () => void;
  openDocPreview: (doc: DriveDocument) => void;
  closeDocPreview: () => void;
  openApprovalModal: (app: Application) => void;
  closeApprovalModal: () => void;

  // Sidebar & actions
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleDriveConnection: () => void;
  toggleCalendarConnection: () => void;
  updateUserProfile: (updated: Partial<UserProfile>) => void;
  approveApplication: (appId: string) => void;
  updateOpportunityStatus: (id: string, status: Opportunity['status']) => void;
  
  // Reminders CRUD
  addReminder: (reminder: Omit<CalendarReminder, 'id'>) => void;
  editReminder: (id: string, updated: Partial<CalendarReminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminderStatus: (id: string) => void;

  // Tasks & Applications
  toggleApplicationTask: (appId: string, taskId: string) => void;
  updatePreparedFieldValue: (appId: string, fieldId: string, newValue: string) => void;
  addApplicationFromPrompt: (title: string, category: Application['category']) => void;
}

const FormFlowContext = createContext<FormFlowContextType | undefined>(undefined);

export const FormFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { openBrowser, activePageContext } = useBrowser();
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [documents] = useState<DriveDocument[]>(MOCK_DRIVE_DOCUMENTS);
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [reminders, setReminders] = useState<CalendarReminder[]>(MOCK_REMINDERS);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(MOCK_AUDIT_LOGS);

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>(INITIAL_CONVERSATIONS[0].id);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Modals & UI
  const [activeDocPreview, setActiveDocPreview] = useState<DriveDocument | null>(null);
  const [activeApprovalModal, setActiveApprovalModal] = useState<Application | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Sync Google Drive status on mount
  useEffect(() => {
    fetchGoogleDriveStatus().then(status => {
      if (status) {
        setUser(prev => ({
          ...prev,
          isDriveConnected: status.is_connected,
          driveAccountEmail: status.google_account_email || prev.driveAccountEmail
        }));
      }
    });
  }, []);

  const openDriveModal = () => setIsDriveModalOpen(true);
  const closeDriveModal = () => {
    setIsDriveModalOpen(false);
    // Refresh drive status upon closing
    fetchGoogleDriveStatus().then(status => {
      if (status) {
        setUser(prev => ({
          ...prev,
          isDriveConnected: status.is_connected,
          driveAccountEmail: status.google_account_email || prev.driveAccountEmail
        }));
      }
    });
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const toggleDriveConnection = () => {
    openDriveModal();
  };

  const toggleCalendarConnection = () => {
    setUser(prev => {
      const nextState = !prev.isCalendarConnected;
      const newAudit: AuditRecord = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        action: nextState ? 'Google Calendar Synchronized' : 'Google Calendar Disconnected',
        mcpServer: 'Calendar MCP',
        details: nextState 
          ? `Authorized Google Calendar sync for ${prev.email}`
          : `Google Calendar sync disconnected.`,
        status: 'confirmed'
      };
      setAuditLogs(logs => [newAudit, ...logs]);
      return {
        ...prev,
        isCalendarConnected: nextState,
      };
    });
  };

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
  };

  const selectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const createNewConversation = async (): Promise<string> => {
    const newConv = await chatService.createConversation();
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    return newConv.id;
  };

  const deleteConversation = async (id: string) => {
    await chatService.deleteConversation(id);
    setConversations(prev => {
      const remaining = prev.filter(c => c.id !== id);
      if (activeConversationId === id && remaining.length > 0) {
        setActiveConversationId(remaining[0].id);
      }
      return remaining;
    });
  };

  const renameConversation = async (id: string, newTitle: string) => {
    await chatService.renameConversation(id, newTitle);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    let targetConvId = activeConversationId;
    if (!activeConversation) {
      targetConvId = await createNewConversation();
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: text,
    };

    setConversations(prev => prev.map(c => {
      if (c.id === targetConvId) {
        return {
          ...c,
          messages: [...c.messages, userMsg],
          updatedAt: 'Just now'
        };
      }
      return c;
    }));

    setIsAnalyzing(true);

    setTimeout(async () => {
      const pageCtx = activePageContext ? {
        url: activePageContext.url,
        title: activePageContext.title,
        portalName: activePageContext.portalName,
        summary: activePageContext.summary
      } : null;

      const { assistantMessage, updatedTitle, shouldOpenBrowser, browserUrl } = await chatService.sendMessage(
        targetConvId, 
        text,
        pageCtx,
        {
          userProfile: user,
          documents,
          applications,
          reminders
        }
      );

      if (shouldOpenBrowser) {
        openBrowser(browserUrl);
      }

      setConversations(prev => prev.map(c => {
        if (c.id === targetConvId) {
          return {
            ...c,
            title: updatedTitle || c.title,
            messages: [...c.messages, assistantMessage],
            updatedAt: 'Just now'
          };
        }
        return c;
      }));

      setIsAnalyzing(false);
    }, 1100);
  };

  const regenerateLastResponse = async () => {
    if (!activeConversation || activeConversation.messages.length === 0) return;

    setIsAnalyzing(true);
    setTimeout(async () => {
      const newResponse = await chatService.regenerateLastResponse(activeConversation.id);
      if (newResponse) {
        const updated = await chatService.getConversations();
        setConversations(updated);
      }
      setIsAnalyzing(false);
    }, 1000);
  };

  const approveApplication = (appId: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: 'approved',
          isApproved: true,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return app;
    }));

    const newAudit: AuditRecord = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      action: 'Explicit Human Approval Granted',
      mcpServer: 'Approval & Audit MCP',
      details: `User explicitly approved form mapping and data transmission for application: ${appId}. Ready for assisted submission.`,
      status: 'confirmed'
    };
    setAuditLogs(prev => [newAudit, ...prev]);
    setActiveApprovalModal(null);
  };

  const updateOpportunityStatus = (id: string, status: Opportunity['status']) => {
    setOpportunities(prev => prev.map(opp => opp.id === id ? { ...opp, status } : opp));
  };

  // Reminders CRUD
  const addReminder = (newRemData: Omit<CalendarReminder, 'id'>) => {
    const newRem: CalendarReminder = {
      ...newRemData,
      id: `rem-${Date.now()}`,
    };
    setReminders(prev => [newRem, ...prev]);
  };

  const editReminder = (id: string, updated: Partial<CalendarReminder>) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const toggleReminderStatus = (id: string) => {
    setReminders(prev => prev.map(rem => {
      if (rem.id === id) {
        const nextStatus = rem.status === 'completed' ? 'upcoming' : 'completed';
        return { ...rem, status: nextStatus };
      }
      return rem;
    }));
  };

  // Tasks
  const toggleApplicationTask = (appId: string, taskId: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId && app.tasks) {
        return {
          ...app,
          tasks: app.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        };
      }
      return app;
    }));
  };

  const openDocPreview = (doc: DriveDocument) => setActiveDocPreview(doc);
  const closeDocPreview = () => setActiveDocPreview(null);
  const openApprovalModal = (app: Application) => setActiveApprovalModal(app);
  const closeApprovalModal = () => setActiveApprovalModal(null);

  const updatePreparedFieldValue = (appId: string, fieldId: string, newValue: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          preparedFields: app.preparedFields.map(f => {
            if (f.id === fieldId) {
              return { ...f, mappedValue: newValue, status: 'verified' as const };
            }
            return f;
          })
        };
      }
      return app;
    }));
  };

  const addApplicationFromPrompt = (title: string, category: Application['category']) => {
    const newApp: Application = {
      id: `app-${Date.now()}`,
      title,
      category,
      provider: 'Verified Portal Authority',
      portalUrl: 'https://scholarships.gov.in',
      deadline: '2027-01-31',
      status: 'analyzing',
      readinessScore: 65,
      description: `Analysis in progress for ${title}. Form Analysis MCP is indexing requirements.`,
      targetFolder: 'My Drive / Applications',
      humanApprovalRequired: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      requirements: [
        {
          id: `r-${Date.now()}-1`,
          title: 'Identity & Enrollment Proof',
          type: 'document',
          requirement: 'Student College ID and Class 12 Marks',
          status: 'matched',
          sourceDocument: 'College_ID_Card_MSRIT.pdf'
        }
      ],
      preparedFields: []
    };
    setApplications(prev => [newApp, ...prev]);
  };

  return (
    <FormFlowContext.Provider
      value={{
        user,
        documents,
        applications,
        opportunities,
        reminders,
        auditLogs,
        conversations,
        activeConversationId,
        activeConversation,
        isAnalyzing,
        selectConversation,
        createNewConversation,
        deleteConversation,
        renameConversation,
        sendMessage,
        regenerateLastResponse,
        activeDocPreview,
        activeApprovalModal,
        isSettingsOpen,
        openSettings,
        closeSettings,
        isDriveModalOpen,
        openDriveModal,
        closeDriveModal,
        openDocPreview,
        closeDocPreview,
        openApprovalModal,
        closeApprovalModal,
        isSidebarCollapsed,
        toggleSidebar,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
        toggleDriveConnection,
        toggleCalendarConnection,
        updateUserProfile,
        approveApplication,
        updateOpportunityStatus,
        addReminder,
        editReminder,
        deleteReminder,
        toggleReminderStatus,
        toggleApplicationTask,
        updatePreparedFieldValue,
        addApplicationFromPrompt,
      }}
    >
      {children}
    </FormFlowContext.Provider>
  );
};

export const useFormFlow = () => {
  const context = useContext(FormFlowContext);
  if (!context) {
    throw new Error('useFormFlow must be used within a FormFlowProvider');
  }
  return context;
};
