/**
 * Mock AI Provider implementation of LLMProviderInterface.
 * Detects conversational intents and generates context-aware responses.
 * Designed to be swapped seamlessly with Gemini or other LLM providers.
 */

import { AssistantIntent, AIConversationContext, AIResponseResult, LLMProviderInterface } from './types';
import { 
  generateFillApplicationResponse,
  generateRequirementsResponse,
  generateFindDocumentsResponse,
  generateCheckStatusResponse,
  generateDeadlinesResponse,
  generateSetReminderResponse,
  generateFindFormsResponse,
  generateGeneralResponse,
} from './mockResponses';

export class MockAIProvider implements LLMProviderInterface {
  providerId = 'mock-ai';
  displayName = 'FormFlow Mock AI Provider (Development Engine)';
  isMock = true;

  detectIntent(query: string, context?: AIConversationContext): AssistantIntent {
    const lower = query.toLowerCase().trim();

    // 1. Filling application forms (Requirement 4)
    if (
      lower.includes('help me fill this application') ||
      lower.includes('help me fill') ||
      lower.includes('fill application') ||
      lower.includes('fill form') ||
      lower.includes('autofill') ||
      lower.includes('pre-fill') ||
      lower.includes('prefill') ||
      lower.includes('prepare application')
    ) {
      return 'fill_application_form';
    }

    // 2. Open portal in split browser
    if (
      lower.includes('open this scholarship website') ||
      lower.includes('open scholarship') ||
      lower.includes('open portal') ||
      lower.includes('open website') ||
      lower.includes('launch portal')
    ) {
      return 'open_portal';
    }

    // 3. Explain active browser page
    if (
      lower.includes('explain this page') ||
      lower.includes('explain the page') ||
      lower.includes('what is this page') ||
      lower.includes('summarize this page')
    ) {
      return 'explain_page';
    }

    // 4. Understanding application requirements
    if (
      lower.includes('requirement') ||
      lower.includes('eligibility') ||
      lower.includes('criteria') ||
      lower.includes('who can apply') ||
      lower.includes('cutoff') ||
      lower.includes('qualify')
    ) {
      return 'understand_requirements';
    }

    // 5. Finding required documents & checking missing files
    if (
      lower.includes('document') ||
      lower.includes('missing file') ||
      lower.includes('certificate') ||
      lower.includes('marksheet') ||
      lower.includes('what documents') ||
      lower.includes('check missing')
    ) {
      return 'find_required_documents';
    }

    // 6. Setting reminders
    if (
      lower.includes('set reminder') ||
      lower.includes('remind me') ||
      lower.includes('add reminder') ||
      lower.includes('calendar reminder') ||
      lower.includes('schedule alert')
    ) {
      return 'set_reminders';
    }

    // 7. Finding deadlines
    if (
      lower.includes('deadline') ||
      lower.includes('due date') ||
      lower.includes('last date') ||
      lower.includes('closing date') ||
      lower.includes('when is it due')
    ) {
      return 'find_deadlines';
    }

    // 8. Checking application status
    if (
      lower.includes('status') ||
      lower.includes('track') ||
      lower.includes('progress') ||
      lower.includes('pipeline') ||
      lower.includes('my applications')
    ) {
      return 'check_application_status';
    }

    // 9. Finding application forms / scholarships
    if (
      lower.includes('find application forms') ||
      lower.includes('find forms') ||
      lower.includes('find scholarship') ||
      lower.includes('scholarships i am eligible for') ||
      lower.includes('scholarships i\'m eligible for') ||
      lower.includes('available opportunities') ||
      lower.includes('recommend forms')
    ) {
      return 'find_forms';
    }

    return 'general_query';
  }

  async generateResponse(query: string, context: AIConversationContext): Promise<AIResponseResult> {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const intent = this.detectIntent(query, context);

    // Simulate realistic processing latency (600ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    switch (intent) {
      case 'fill_application_form':
        return generateFillApplicationResponse(context, nowStr);

      case 'open_portal': {
        const fillRes = generateFillApplicationResponse(context, nowStr);
        fillRes.intent = 'open_portal';
        fillRes.shouldOpenBrowser = true;
        return fillRes;
      }

      case 'explain_page':
        return generateRequirementsResponse(context, nowStr);

      case 'understand_requirements':
        return generateRequirementsResponse(context, nowStr);

      case 'find_required_documents':
        return generateFindDocumentsResponse(context, nowStr);

      case 'check_application_status':
        return generateCheckStatusResponse(context, nowStr);

      case 'find_deadlines':
        return generateDeadlinesResponse(context, nowStr);

      case 'set_reminders':
        return generateSetReminderResponse(context, nowStr);

      case 'find_forms':
        return generateFindFormsResponse(context, nowStr);

      case 'general_query':
      default:
        return generateGeneralResponse(query, context, nowStr);
    }
  }
}

export const mockAIProvider = new MockAIProvider();
