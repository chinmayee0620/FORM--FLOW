import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowUp, 
  Paperclip, 
  Sparkles, 
  HardDrive, 
  Layers, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { useFormFlow } from '../../contexts/FormFlowContext';

export const ChatInputBar: React.FC = () => {
  const { sendMessage, isAnalyzing, documents, openDocPreview } = useFormFlow();
  const [text, setText] = useState('');
  const [isDrivePickerOpen, setIsDrivePickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isAnalyzing) return;
    sendMessage(text);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const quickPrompts = [
    'Analyze Reliance STEM Scholarship 2026',
    'Check Income Certificate renewal due date',
    'Recommend top engineering scholarships for me',
    'Verify name spellings across my Marksheet & Aadhaar',
  ];

  return (
    <div className="w-full bg-gradient-to-t from-white via-white/95 to-transparent pt-4 pb-4 px-4 sticky bottom-0 z-10">
      <div className="max-w-3xl mx-auto space-y-2">
        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setText(prompt);
                textareaRef.current?.focus();
              }}
              className="shrink-0 px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 border border-zinc-200/60 transition-colors text-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Box Card (ChatGPT Style) */}
        <div className="relative bg-[#f4f4f4] rounded-3xl border border-zinc-200/80 shadow-xs focus-within:border-zinc-400 focus-within:bg-white focus-within:shadow-md transition-all">
          {/* Drive attachment picker dropdown */}
          {isDrivePickerOpen && (
            <div className="absolute bottom-full mb-2 left-2 w-80 bg-white border border-zinc-200 shadow-modal rounded-2xl p-3 z-30 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800">
                  <HardDrive size={13} className="text-brand-600" />
                  <span>Select from Authorized Drive</span>
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
                      setText(prev => `${prev} [Referencing Drive Document: ${doc.name}]`);
                      setIsDrivePickerOpen(false);
                      textareaRef.current?.focus();
                    }}
                    className="w-full text-left p-1.5 rounded-lg hover:bg-zinc-100 text-xs text-zinc-700 flex items-center gap-2 truncate"
                  >
                    <FileText size={13} className="text-zinc-400 shrink-0" />
                    <span className="truncate">{doc.name}</span>
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
              placeholder="Ask FormFlow to inspect an application, check document dates, or prepare a form..."
              className="w-full px-4 pt-3.5 pb-2 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 resize-none focus:outline-none max-h-48 leading-relaxed font-sans"
            />

            <div className="px-3 pb-2.5 pt-1 flex items-center justify-between">
              {/* Left action tools */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsDrivePickerOpen(prev => !prev)}
                  className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors flex items-center gap-1 text-xs"
                  title="Attach Google Drive document context"
                >
                  <Paperclip size={16} />
                  <span className="hidden sm:inline text-[11px] font-medium">Drive Files</span>
                </button>

                <div className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-400 px-2 py-0.5 rounded-full bg-zinc-200/50">
                  <Layers size={11} className="text-zinc-500" />
                  <span>6 MCP Tools Ready</span>
                </div>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!text.trim() || isAnalyzing}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  text.trim() && !isAnalyzing
                    ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-xs'
                    : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                }`}
                aria-label="Send message"
              >
                {isAnalyzing ? (
                  <span className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowUp size={16} />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Disclaimer (ChatGPT Style) */}
        <p className="text-center text-[11px] text-zinc-400">
          FormFlow coordinates data from your authorized Google Drive. Form submissions and sensitive data sharing require explicit human approval.
        </p>
      </div>
    </div>
  );
};
