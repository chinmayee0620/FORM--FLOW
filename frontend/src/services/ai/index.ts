/**
 * AI Assistant Orchestration Service.
 * Coordinates intent detection, active LLM provider (Mock or Gemini),
 * and integrates with FormFlow browser context and Google Drive files.
 */

import { LLMProviderInterface, AIConversationContext, AIResponseResult, AssistantIntent } from './types';
import { mockAIProvider } from './mockProvider';
import { geminiAIProvider } from './geminiProvider';

export * from './types';
export * from './mockResponses';
export { mockAIProvider } from './mockProvider';
export { geminiAIProvider } from './geminiProvider';

class AIAssistantService {
  private activeProvider: LLMProviderInterface = mockAIProvider;

  setProvider(providerName: 'mock' | 'gemini') {
    if (providerName === 'gemini') {
      this.activeProvider = geminiAIProvider;
    } else {
      this.activeProvider = mockAIProvider;
    }
  }

  getActiveProvider(): LLMProviderInterface {
    return this.activeProvider;
  }

  detectIntent(query: string, context?: AIConversationContext): AssistantIntent {
    return this.activeProvider.detectIntent(query, context);
  }

  async processMessage(query: string, context: AIConversationContext): Promise<AIResponseResult> {
    return this.activeProvider.generateResponse(query, context);
  }
}

export const aiAssistantService = new AIAssistantService();
