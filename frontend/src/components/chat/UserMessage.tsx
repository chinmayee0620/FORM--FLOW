import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { ChatMessage } from '../../types';

interface UserMessageProps {
  message: ChatMessage;
}

export const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-3 px-4 sm:px-6 w-full group">
      <div className="max-w-3xl mx-auto flex justify-end gap-3 items-start">
        {/* Action icons on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 self-center">
          <button
            onClick={handleCopy}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            title="Copy message"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
          </button>
        </div>

        {/* User Bubble */}
        <div className="max-w-[85%] sm:max-w-[75%] bg-[#f4f4f4] text-zinc-900 rounded-3xl px-4.5 py-3 shadow-2xs border border-zinc-200/60">
          <p className="text-[14px] leading-relaxed whitespace-pre-wrap font-sans">
            {message.content}
          </p>
        </div>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-2xs mt-0.5">
          DK
        </div>
      </div>
    </div>
  );
};
