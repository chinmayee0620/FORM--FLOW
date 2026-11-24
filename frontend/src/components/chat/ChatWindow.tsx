import React, { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useFormFlow } from '../../contexts/FormFlowContext';
import { SuggestionCards } from './SuggestionCards';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { LiveToolStatusProgress } from './AIToolStatusTracker';

export const ChatWindow: React.FC = () => {
  const { 
    activeConversation, 
    sendMessage, 
    regenerateLastResponse, 
    isAnalyzing 
  } = useFormFlow();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, isAnalyzing]);

  const messages = activeConversation?.messages || [];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-white relative">
      {/* Scrollable Conversation View */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <SuggestionCards onSelectSuggestion={(query) => sendMessage(query)} />
        ) : (
          <div className="divide-y divide-zinc-100/60 pb-6 pt-2">
            {messages.map((msg, index) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onRetry={regenerateLastResponse}
                isLast={index === messages.length - 1 && msg.sender === 'assistant'}
              />
            ))}

            {/* Interactive Tool-Status Messages during Analysis */}
            {isAnalyzing && (
              <div className="py-4 px-4 sm:px-6 w-full animate-fade-in">
                <div className="max-w-3xl mx-auto flex gap-3.5 sm:gap-4 items-start">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-sky-500 text-white flex items-center justify-center shadow-xs shrink-0 animate-pulse mt-0.5">
                    <Sparkles size={16} />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-900">FormFlow AI Assistant</span>
                      <span className="text-[11px] text-zinc-400">Executing tool-status sequence...</span>
                    </div>

                    <LiveToolStatusProgress />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ChatGPT-Style Fixed Bottom Chat Input */}
      <ChatInput
        onSendMessage={(text) => sendMessage(text)}
        isLoading={isAnalyzing}
      />
    </div>
  );
};
