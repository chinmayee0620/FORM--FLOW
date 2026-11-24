import React from 'react';
import { ChatMessage } from '../../types';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';

interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: () => void;
  isLast?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onRetry, isLast }) => {
  if (message.sender === 'user') {
    return <UserMessage message={message} />;
  }
  return <AssistantMessage message={message} onRetry={onRetry} isLast={isLast} />;
};
