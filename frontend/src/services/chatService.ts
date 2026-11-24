import { 
  Conversation, 
  ChatMessage, 
  MCPExecutionStep 
} from '../types';
import { INITIAL_CHAT_MESSAGES, MOCK_OPPORTUNITIES } from './mockData';
import { aiAssistantService, AIConversationContext } from './ai';
import { sendMessageToBackend } from './backendApi';

// Initial preloaded conversations for demonstration
export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-reliance-stem',
    title: 'Reliance STEM Scholarship 2026 Analysis',
    createdAt: '2026-11-23 23:40',
    updatedAt: '2026-11-23 23:45',
    pinned: true,
    messages: [...INITIAL_CHAT_MESSAGES]
  },
  {
    id: 'conv-missing-docs',
    title: 'Missing Documents & SSP Fee Receipt',
    createdAt: '2026-11-22 14:15',
    updatedAt: '2026-11-22 14:22',
    messages: [
      {
        id: 'msg-ssp-user',
        sender: 'user',
        timestamp: '02:15 PM',
        content: 'Check my missing documents for the Karnataka SSP Post-Matric Scholarship.'
      },
      {
        id: 'msg-ssp-ai',
        sender: 'assistant',
        timestamp: '02:16 PM',
        content: `I scanned your authorized Google Drive repository for **Karnataka State Scholarship Portal (SSP) Post-Matric 2026** requirements.

### 📋 Document Audit Results:

| Required Document | Drive Status | Source File Detected | Action Needed |
| :--- | :--- | :--- | :--- |
| **Karnataka Domicile Proof** | ✅ Verified | \`Government_Income_Certificate_2025.pdf\` | Verified (Bangalore North resident) |
| **Aadhaar Seeded Bank A/C** | ✅ Verified | \`Canara_Bank_Account_Passbook.pdf\` | Active Direct Benefit Transfer (DBT) |
| **10th & 12th Marksheets** | ✅ Verified | \`10th_CBSE_Board_Marksheet_Darshan.pdf\` | 94.2% & 96.0% verified |
| **College Fee Receipt (2025-26)** | ❌ **Missing** | *Not found in Drive* | **Upload to Google Drive > College / Fees** |

### Next Step:
Save your College Admission Fee Receipt PDF into your authorized Google Drive folder. FormFlow's **Document MCP** will automatically index it and increase your readiness score to 100%.`,
        mcpSteps: [
          {
            server: 'Document MCP',
            toolName: 'scan_drive_folder_for_criteria',
            status: 'completed',
            outputSnippet: 'Scanned 3 authorized folders. 3 of 4 required files matched; fee receipt missing.',
            timestamp: '02:15:30'
          },
          {
            server: 'Verification MCP',
            toolName: 'compute_checklist_readiness',
            status: 'warning',
            outputSnippet: 'Readiness score evaluated at 75%. 1 mandatory document missing.',
            timestamp: '02:15:34'
          }
        ],
        sourcesCited: [
          { docName: 'Government_Income_Certificate_2025.pdf', folder: 'My Drive / Government Certificates', snippet: 'Resident of Karnataka' },
          { docName: 'Canara_Bank_Account_Passbook.pdf', folder: 'My Drive / Financial', snippet: 'DBT enabled savings account' }
        ]
      }
    ]
  },
  {
    id: 'conv-renewals',
    title: 'Income Certificate Validity & UIDAI Check',
    createdAt: '2026-11-20 18:30',
    updatedAt: '2026-11-20 18:35',
    messages: [
      {
        id: 'msg-ren-user',
        sender: 'user',
        timestamp: '06:30 PM',
        content: 'When does my income certificate expire and do I need to update Aadhaar?'
      },
      {
        id: 'msg-ren-ai',
        sender: 'assistant',
        timestamp: '06:31 PM',
        content: `### 🗓️ Document Validity & Renewal Intelligence

1. **Government Income Certificate (\`Government_Income_Certificate_2025.pdf\`)**:
   - **Issued:** 02 April 2025 by Tahsildar Bangalore North
   - **Expiry Date:** **31 March 2026** (128 days remaining)
   - **Status:** 🟡 **Renewal Needed Before Next FY**
   - **Action:** Apply on Karnataka Nadakacheri portal (\`nadakacheri.karnataka.gov.in\`) in February 2026. A 90-day alert is scheduled in Calendar MCP.

2. **UIDAI Aadhaar Card (\`Aadhaar_Card_UIDAI_Masked.pdf\`)**:
   - **Accuracy Policy Note:** Per UIDAI official directives, **Aadhaar cards do not expire**. No arbitrary validity date is assigned.
   - **Advisory:** UIDAI recommends updating biometric data and proof of address every 10 years at myaadhaar.uidai.gov.in.`,
        mcpSteps: [
          {
            server: 'Document MCP',
            toolName: 'parse_validity_metadata',
            status: 'completed',
            outputSnippet: 'Parsed issue and validity dates. Income cert expires 31/03/2026. Aadhaar confirmed permanent.',
            timestamp: '06:30:45'
          }
        ]
      }
    ]
  }
];

class ChatService {
  private conversations: Conversation[] = [...INITIAL_CONVERSATIONS];

  async getConversations(): Promise<Conversation[]> {
    return Promise.resolve([...this.conversations]);
  }

  async getConversation(id: string): Promise<Conversation | null> {
    const found = this.conversations.find(c => c.id === id);
    return Promise.resolve(found ? { ...found } : null);
  }

  async createConversation(title?: string): Promise<Conversation> {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: title || 'New Application Workflow',
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      updatedAt: 'Just now',
      messages: []
    };
    this.conversations.unshift(newConv);
    return Promise.resolve(newConv);
  }

  async deleteConversation(id: string): Promise<void> {
    this.conversations = this.conversations.filter(c => c.id !== id);
    return Promise.resolve();
  }

  async renameConversation(id: string, newTitle: string): Promise<void> {
    const conv = this.conversations.find(c => c.id === id);
    if (conv) {
      conv.title = newTitle;
      conv.updatedAt = 'Just now';
    }
    return Promise.resolve();
  }

  /**
   * AI Orchestrator service connecting to the modular AI assistant
   * (supporting mock intent detection or real LLM provider).
   */
  async sendMessage(
    conversationId: string, 
    userText: string,
    currentBrowserContext?: { url: string; title: string; portalName: string; summary: string } | null,
    extraContext?: Partial<AIConversationContext>
  ): Promise<{ assistantMessage: ChatMessage; updatedTitle?: string; shouldOpenBrowser?: boolean; browserUrl?: string }> {
    const conv = this.conversations.find(c => c.id === conversationId);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Prepare context for AI Assistant
    const aiContext: AIConversationContext = {
      conversationId,
      browserPageContext: currentBrowserContext ? {
        url: currentBrowserContext.url,
        title: currentBrowserContext.title,
        portalName: currentBrowserContext.portalName,
        fieldsDetected: 6,
        eligibilityCriteria: [],
        requiredDocs: [],
        summary: currentBrowserContext.summary,
        formFields: []
      } : null,
      conversationHistory: conv?.messages || [],
      ...extraContext
    };

    // 1. Try real FastAPI backend orchestrator with real Google Drive MCP tools first
    const backendRes = await sendMessageToBackend(
      conversationId,
      userText,
      currentBrowserContext ? {
        url: currentBrowserContext.url,
        title: currentBrowserContext.title,
        portalName: currentBrowserContext.portalName,
        summary: currentBrowserContext.summary
      } : null
    );

    let assistantMessage: ChatMessage;
    let shouldOpenBrowser = false;
    let browserUrl: string | undefined;

    if (backendRes) {
      assistantMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: now,
        content: backendRes.reply,
        isSimulated: backendRes.is_mock_provider,
        mcpSteps: backendRes.mcp_steps.map(s => ({
          server: s.server as any,
          toolName: s.toolName,
          status: s.status as any,
          outputSnippet: s.outputSnippet,
          timestamp: s.timestamp
        })),
        readinessCard: backendRes.readiness_card as any,
      };
      shouldOpenBrowser = backendRes.should_open_browser;
      browserUrl = backendRes.browser_url || undefined;
    } else {
      // 2. Fallback to local AI assistant processing
      const result = await aiAssistantService.processMessage(userText, aiContext);
      assistantMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: now,
        content: result.message,
        isSimulated: result.isSimulated,
        intent: result.intent,
        mcpSteps: result.mcpSteps,
        readinessCard: result.readinessCard,
        approvalCard: result.approvalCard,
        sourcesCited: result.sourcesCited,
        recommendations: result.recommendations
      };
      shouldOpenBrowser = !!result.shouldOpenBrowser;
      browserUrl = result.browserUrl;
    }

    // Dynamic title generator based on detected intent or prompt
    let updatedTitle: string | undefined;
    if (conv && conv.messages.length <= 1) {
      const lower = userText.toLowerCase();
      if (lower.includes('10th') || lower.includes('marksheet')) {
        updatedTitle = '10th Marksheet & Percentage';
      } else if (lower.includes('income')) {
        updatedTitle = 'Income Certificate Audit';
      } else {
        updatedTitle = userText.length > 30 ? userText.substring(0, 30) + '...' : userText;
      }
    }

    if (conv) {
      conv.messages.push(assistantMessage);
      conv.updatedAt = 'Just now';
      if (updatedTitle) {
        conv.title = updatedTitle;
      }
    }

    return Promise.resolve({
      assistantMessage,
      updatedTitle,
      shouldOpenBrowser,
      browserUrl
    });
  }

  async regenerateLastResponse(conversationId: string): Promise<ChatMessage | null> {
    const conv = this.conversations.find(c => c.id === conversationId);
    if (!conv || conv.messages.length === 0) return null;

    let lastUserIndex = -1;
    for (let i = conv.messages.length - 1; i >= 0; i--) {
      if (conv.messages[i].sender === 'user') {
        lastUserIndex = i;
        break;
      }
    }

    if (lastUserIndex === -1) return null;

    conv.messages = conv.messages.slice(0, lastUserIndex + 1);
    const userText = conv.messages[lastUserIndex].content;

    const { assistantMessage } = await this.sendMessage(conversationId, userText);
    return assistantMessage;
  }
}

export const chatService = new ChatService();
