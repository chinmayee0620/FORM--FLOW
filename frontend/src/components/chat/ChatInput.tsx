import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowUp, 
  Paperclip, 
  Mic, 
  HardDrive, 
  FileText, 
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { useFormFlow } from '../../contexts/FormFlowContext';
import { useBrowser } from '../../contexts/BrowserContext';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  disabled = false,
}) => {
  const { documents } = useFormFlow();
  const { activePageContext } = useBrowser();
  const [text, setText] = useState('');
  const [isDrivePickerOpen, setIsDrivePickerOpen] = useState(false);
  const [attachedDocName, setAttachedDocName] = useState<string | null>(null);
  const [isMicActive, setIsMicActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading || disabled) return;

    let fullMessage = text.trim();
    if (attachedDocName) {
      fullMessage += `\n\n[Referencing Google Drive Document: "${attachedDocName}"]`;
    }

    onSendMessage(fullMessage);
    setText('');
    setAttachedDocName(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleMic = () => {
    setIsMicActive(prev => !prev);
    // Voice UI simulation
    if (!isMicActive) {
      setTimeout(() => {
        setIsMicActive(false);
      }, 3000);
    }
  };

  const portalName = activePageContext?.portalName;
  const suggestedPrompts = [
    'Help me fill this application.',
    portalName ? `What are the requirements for ${portalName.split(' ')[0]}?` : 'Understand application requirements.',
    'Check my missing documents.',
    'What is the application deadline?',
    'Set a deadline reminder.',
    'Check my application status.',
    'Find application forms for me.',
  ];

  return (
    <div className="w-full bg-gradient-to-t from-white via-white/95 to-transparent pt-3 pb-4 px-4 sticky bottom-0 z-20">
      <div className="max-w-3xl mx-auto space-y-2">
        {/* Drive Document Reference Pill (if attached) */}
        {attachedDocName && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 border border-brand-200 text-brand-900 rounded-full text-xs animate-fade-in">
            <HardDrive size={13} className="text-brand-600" />
            <span className="font-medium truncate max-w-[240px]">{attachedDocName}</span>
            <button
              type="button"
              onClick={() => setAttachedDocName(null)}
              className="text-brand-400 hover:text-brand-700 ml-1"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* ChatGPT-Style Input Container */}
        <div className="relative bg-[#f4f4f4] rounded-3xl border border-zinc-200/90 shadow-xs focus-within:border-zinc-400 focus-within:bg-white focus-within:shadow-md transition-all">
          {/* Drive attachment popup */}
          {isDrivePickerOpen && (
            <div className="absolute bottom-full mb-2 left-2 w-80 bg-white border border-zinc-200 shadow-modal rounded-2xl p-3 z-30 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800">
                  <HardDrive size={13} className="text-brand-600" />
                  <span>Attach from Google Drive</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrivePickerOpen(false)}
                  className="text-xs text-zinc-400 hover:text-zinc-600"
                >
                  Close
                </button>
              </div>

              <div className="py-2 max-h-48 overflow-y-auto space-y-1">
                {documents.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => {
                      setAttachedDocName(doc.name);
                      setIsDrivePickerOpen(false);
                      textareaRef.current?.focus();
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 text-xs text-zinc-700 flex items-center gap-2 truncate transition-colors"
                  >
                    <FileText size={13} className="text-zinc-400 shrink-0" />
                    <span className="truncate flex-1">{doc.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{doc.size}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col">
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled || isLoading}
              placeholder="Ask FormFlow to inspect an application, check document dates, or prepare a form..."
              className="w-full px-4 pt-3.5 pb-2 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 resize-none focus:outline-none max-h-48 leading-relaxed font-sans"
            />

            {/* Bottom Bar inside input: Attachment, Mic, MCP Badge, Send Button */}
            <div className="px-3 pb-2.5 pt-1 flex items-center justify-between">
              {/* Left action tools */}
              <div className="flex items-center gap-1">
                {/* Attachment Icon */}
                <button
                  type="button"
                  onClick={() => setIsDrivePickerOpen(prev => !prev)}
                  className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors flex items-center gap-1 text-xs"
                  title="Attach Google Drive document context"
                >
                  <Paperclip size={17} />
                  <span className="hidden sm:inline text-[11px] font-medium text-zinc-600">Drive</span>
                </button>

                {/* Microphone Icon (UI only) */}
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`p-1.5 rounded-full transition-colors ${
                    isMicActive
                      ? 'text-rose-600 bg-rose-50 animate-pulse'
                      : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60'
                  }`}
                  title={isMicActive ? 'Listening (Voice input simulation)...' : 'Dictate with voice (UI Only)'}
                >
                  <Mic size={17} />
                </button>

                {/* MCP Active Badge */}
                <div className="hidden md:flex items-center gap-1 text-[11px] text-zinc-400 px-2 py-0.5 rounded-full bg-zinc-200/50 ml-1">
                  <Layers size={11} className="text-zinc-500" />
                  <span>6 MCP Tools Ready</span>
                </div>
              </div>

              {/* Send Button & Loading Indicator */}
              <div className="flex items-center gap-2">
                {isLoading && (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
                    <span className="hidden sm:inline text-[11px]">Thinking...</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!text.trim() || isLoading || disabled}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    text.trim() && !isLoading
                      ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-xs active:scale-95'
                      : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  }`}
                  aria-label="Send message"
                  title="Send message (Enter)"
                >
                  {isLoading ? (
                    <span className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowUp size={16} />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Suggested Prompts Tray Below Input (Requirement 6) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 select-none">
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider shrink-0 mr-0.5">
            Suggested:
          </span>
          {suggestedPrompts.map((promptText, pIdx) => (
            <button
              key={pIdx}
              type="button"
              disabled={isLoading || disabled}
              onClick={() => onSendMessage(promptText)}
              className="px-2.5 py-1 rounded-full text-[11px] bg-zinc-100/90 hover:bg-zinc-200/80 text-zinc-700 border border-zinc-200/70 whitespace-nowrap transition-colors shrink-0 flex items-center gap-1 group active:scale-95 disabled:opacity-50"
            >
              <Sparkles size={10} className="text-brand-600 group-hover:scale-110 transition-transform shrink-0" />
              <span>{promptText}</span>
            </button>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[11px] text-zinc-400">
          FormFlow coordinates data from your authorized Google Drive. Sensitive actions require explicit human approval.
        </p>
      </div>
    </div>
  );
};
