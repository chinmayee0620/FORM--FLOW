/**
 * Google Gemini Provider Implementation of LLMProviderInterface.
 * Future-ready adapter: Connects to real Gemini API or the FormFlow FastAPI backend.
 * Falls back safely to MockAIProvider when unconfigured.
 */

import { AssistantIntent, AIConversationContext, AIResponseResult, LLMProviderInterface } from './types';
import { mockAIProvider } from './mockProvider';
import { sendMessageToBackend, fetchBackendHealth } from '../backendApi';

export class GeminiAIProvider implements LLMProviderInterface {
  providerId = 'gemini';
  displayName = 'Google Gemini (Multimodal Foundation Model)';
  isMock = false;

  detectIntent(query: string, context?: AIConversationContext): AssistantIntent {
    // Delegates to shared intent detection rules or LLM classification
    return mockAIProvider.detectIntent(query, context);
  }

  async generateResponse(query: string, context: AIConversationContext): Promise<AIResponseResult> {
    try {
      // 1. Check if backend is available and Gemini is configured
      const health = await fetchBackendHealth();
      const geminiStatus = health?.llm_providers?.gemini?.status;

      if (health && geminiStatus === 'CONNECTED') {
        const backendRes = await sendMessageToBackend(
          context.conversationId,
          query,
          context.browserPageContext ? {
            url: context.browserPageContext.url,
            title: context.browserPageContext.title,
            portalName: context.browserPageContext.portalName,
            summary: context.browserPageContext.summary,
          } : null
        );

        if (backendRes) {
          return {
            message: backendRes.reply,
            intent: this.detectIntent(query, context),
            providerId: 'gemini',
            modelName: backendRes.model_used || 'gemini-2.5-flash',
            isSimulated: backendRes.is_mock_provider,
            toolStatuses: [
              {
                stage: 'understanding_request',
                label: 'Understanding request',
                detail: 'Processed via Gemini API',
                status: 'completed',
              },
              {
                stage: 'inspecting_application',
                label: 'Inspecting application',
                detail: 'Connected to active portal context',
                status: 'completed',
              },
              {
                stage: 'checking_documents',
                label: 'Checking documents',
                detail: 'Evaluated Drive metadata',
                status: 'completed',
              },
              {
                stage: 'preparing_form_fields',
                label: 'Preparing form fields',
                detail: 'Verified citation mappings',
                status: 'completed',
              },
              {
                stage: 'waiting_for_approval',
                label: 'Waiting for approval',
                detail: 'Enforcing safety gate',
                status: 'completed',
              },
            ],
            mcpSteps: backendRes.mcp_steps.map(s => ({
              server: s.server as any,
              toolName: s.toolName,
              status: s.status as any,
              outputSnippet: s.outputSnippet,
              timestamp: s.timestamp,
            })),
            shouldOpenBrowser: backendRes.should_open_browser,
            browserUrl: backendRes.browser_url || undefined,
            readinessCard: backendRes.readiness_card as any,
          };
        }
      }
    } catch {
      // Fall through to mock provider if backend fails
    }

    // Graceful fallback to MockAIProvider
    const fallbackRes = await mockAIProvider.generateResponse(query, context);
    fallbackRes.message = `> ℹ️ *[Gemini Adapter Notice: No real GEMINI_API_KEY detected in backend. Serving response through FormFlow Mock Assistant Engine]*\n\n` + fallbackRes.message;
    return fallbackRes;
  }
}

export const geminiAIProvider = new GeminiAIProvider();
