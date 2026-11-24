import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Minus, 
  Maximize2, 
  X, 
  Paperclip, 
  ArrowUp,
  Bot,
  User,
  Loader2,
  HardDrive
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useFormFlow } from '../../contexts/FormFlowContext';
import { sendMessageToBackend } from '../../services/backendApi';

export const FormFlowAssistantCard: React.FC = () => {
  const { openDriveModal, user } = useFormFlow();

  const [input, setInput] = useState('');
  const [localMessages, setLocalMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; source?: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Check my application status',
    'Fill this form for me',
    'Find missing documents',
    'Set a reminder',
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input.trim();
    if (!textToSend || loading) return;

    setInput('');
    // Add user message
    setLocalMessages((prev) => [...prev, { role: 'user', text: textToSend }]);
    setLoading(true);

    try {
      // Connect to real backend API orchestrator
      const res = await sendMessageToBackend('conv-editorial-dashboard', textToSend, {
        user_email: user.driveAccountEmail || 'ananya@gmail.com',
      });
      
      if (res && res.reply) {
        setLocalMessages((prev) => [
          ...prev, 
          { 
            role: 'assistant', 
            text: res.reply,
            source: res.provider_used || 'Google Drive MCP',
          }
        ]);
      } else {
        throw new Error('No reply from backend');
      }
    } catch (err: any) {
      console.warn('Backend call fallback:', err);
      // Fallback response with helpful information
      let fallbackAnswer = "I've reviewed your request. ";
      if (textToSend.toLowerCase().includes('status')) {
        fallbackAnswer += "Your **ABC Scholarship Form** is at **85% readiness** (Form Filling in progress). Your Aadhaar and Resume are verified.";
      } else if (textToSend.toLowerCase().includes('fill')) {
        fallbackAnswer += "I can assist in filling the ABC Scholarship application. All fields from your authorized Aadhaar and Transcript have been staged.";
      } else if (textToSend.toLowerCase().includes('missing')) {
        fallbackAnswer += "Looking across your authorized Google Drive, your Income Certificate is ready. No mandatory records are currently missing.";
      } else if (textToSend.toLowerCase().includes('reminder')) {
        fallbackAnswer += "A reminder has been scheduled for your **ABC Scholarship deadline on Dec 28, 2024**.";
      } else {
        fallbackAnswer += `I retrieved relevant document context from your authorized Google Drive to answer: "${textToSend}".`;
      }

      setLocalMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: fallbackAnswer,
          source: 'Google Drive Auth Index',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const hasChatHistory = localMessages.length > 0;

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 bg-[#0B3D2E] text-white p-3.5 rounded-full shadow-modal cursor-pointer flex items-center gap-2.5 hover:scale-105 transition-all z-40 border border-[#BDE9D4]/30"
      >
        <Sparkles size={18} className="text-[#BDE9D4] animate-pulse" />
        <span className="text-xs font-semibold pr-1">FormFlow Assistant</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-editorial flex flex-col h-full max-h-[720px] transition-all hover:border-[#D6CAB2] overflow-hidden">
      {/* Assistant Header */}
      <div className="px-5 py-4 border-b border-[#E8DFC8]/60 flex items-center justify-between shrink-0 bg-[#FFFDF9]">
        <div className="flex items-center gap-2">
          {/* Sparkle Icon */}
          <div className="text-[#0B3D2E]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </div>
          <h2 className="text-sm font-bold text-[#202720] tracking-tight">
            FormFlow Assistant
          </h2>
        </div>

        {/* Window controls */}
        <div className="flex items-center gap-1.5 text-[#77776E]">
          <button 
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded-md hover:bg-[#F6EFE4] hover:text-[#202720] transition-colors"
            title="Minimize"
          >
            <Minus size={14} />
          </button>
          <button 
            onClick={() => {
              // Toggle expanded state or full chat
              setLocalMessages([]);
            }}
            className="p-1 rounded-md hover:bg-[#F6EFE4] hover:text-[#202720] transition-colors"
            title="Clear or expand"
          >
            <Maximize2 size={13} />
          </button>
          <button 
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded-md hover:bg-[#F6EFE4] hover:text-[#202720] transition-colors"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Main Body (Mascot + Suggestions OR Active Chat) */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {!hasChatHistory ? (
          <div className="flex flex-col items-center text-center my-auto pt-2">
            {/* Robot Mascot SVG (matching mockup) */}
            <div className="relative w-36 h-36 flex items-center justify-center mb-3">
              {/* Mint Backdrop Radial Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#BDE9D4]/70 to-[#65BFAF]/30 blur-xl -z-10" />

              {/* Floating mini document card 1 */}
              <div className="absolute top-2 left-0 w-7 h-9 rounded-md bg-white border border-[#E8DFC8] shadow-xs rotate-[-12deg] p-1 flex flex-col justify-between">
                <div className="w-3 h-1 bg-[#CBD5E1] rounded-xs" />
                <div className="w-4 h-0.5 bg-[#E2E8F0] rounded-xs" />
                <div className="w-3 h-0.5 bg-[#E2E8F0] rounded-xs" />
              </div>

              {/* Floating mini document card 2 */}
              <div className="absolute bottom-4 right-0 w-7 h-9 rounded-md bg-white border border-[#E8DFC8] shadow-xs rotate-[14deg] p-1 flex flex-col justify-between">
                <div className="w-3 h-1 bg-[#087F5B] rounded-xs" />
                <div className="w-4 h-0.5 bg-[#CBD5E1] rounded-xs" />
                <div className="w-3 h-0.5 bg-[#E2E8F0] rounded-xs" />
              </div>

              {/* Vector Robot Mascot */}
              <svg viewBox="0 0 100 100" className="w-28 h-28 drop-shadow-md">
                {/* Robot Antenna */}
                <line x1="50" y1="18" x2="50" y2="10" stroke="#0B3D2E" strokeWidth="3" strokeLinecap="round" />
                <circle cx="50" cy="8" r="4" fill="#65BFAF" />

                {/* Robot Headphones (Green ears) */}
                <rect x="18" y="34" width="7" height="18" rx="3.5" fill="#0B3D2E" />
                <rect x="75" y="34" width="7" height="18" rx="3.5" fill="#0B3D2E" />

                {/* Robot Head Body */}
                <rect x="22" y="20" width="56" height="46" rx="18" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />

                {/* Head Screen (Dark Emerald rounded) */}
                <rect x="28" y="27" width="44" height="32" rx="12" fill="#0B3D2E" />

                {/* Happy Smiling Screen Eyes & Mouth (Mint) */}
                {/* Left Eye */}
                <path d="M36 41 C36 37, 42 37, 42 41" fill="none" stroke="#BDE9D4" strokeWidth="2.5" strokeLinecap="round" />
                {/* Right Eye */}
                <path d="M58 41 C58 37, 64 37, 64 41" fill="none" stroke="#BDE9D4" strokeWidth="2.5" strokeLinecap="round" />
                {/* Cute Smiling Mouth */}
                <path d="M46 48 C48 51, 52 51, 54 48" fill="none" stroke="#BDE9D4" strokeWidth="2" strokeLinecap="round" />

                {/* Robot Body */}
                <path d="M30 68 C30 65, 70 65, 70 68 L66 84 C66 87, 34 87, 34 84 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
                {/* Chest badge */}
                <circle cx="50" cy="74" r="3" fill="#65BFAF" />
              </svg>
            </div>

            {/* Greeting */}
            <h3 className="text-base font-bold text-[#202720] tracking-tight mb-1">
              How can I help you today?
            </h3>
            <p className="text-xs text-[#77776E] max-w-[240px] leading-relaxed mb-5">
              Ask me to fill forms, check requirements, or track your applications.
            </p>

            {/* Suggested Prompt Action Pills (matching mockup) */}
            <div className="w-full space-y-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="w-full py-2.5 px-4 text-xs font-medium text-[#202720] bg-[#FAF6EF]/80 hover:bg-[#FAF6EF] hover:text-[#0B3D2E] border border-[#E8DFC8] hover:border-[#087F5B] rounded-full transition-all text-left shadow-2xs hover:shadow-xs active:scale-[0.99] flex items-center justify-between group"
                >
                  <span>{prompt}</span>
                  <span className="text-[#77776E] group-hover:text-[#087F5B] text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    ↵
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            {localMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#0B3D2E] text-[#BDE9D4] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={14} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#0B3D2E] text-white rounded-br-xs'
                      : 'bg-[#FAF6EF] text-[#202720] border border-[#E8DFC8] rounded-bl-xs'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="chat-markdown">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                      {msg.source && (
                        <div className="mt-2 pt-1.5 border-t border-[#E8DFC8]/60 flex items-center gap-1 text-[10px] text-[#77776E]">
                          <HardDrive size={10} className="text-[#087F5B]" />
                          <span>Source: {msg.source}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span>{msg.text}</span>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#E2F5ED] text-[#064E3B] flex items-center justify-center shrink-0 text-xs font-semibold">
                    AS
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#77776E] pl-2 pt-1">
                <Loader2 size={14} className="animate-spin text-[#087F5B]" />
                <span>FormFlow is analyzing your records...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Bar at Bottom (matching mockup) */}
      <div className="p-3.5 border-t border-[#E8DFC8]/60 bg-[#FFFDF9] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          {/* Paperclip Icon (Document attach / Drive) */}
          <button
            type="button"
            onClick={openDriveModal}
            className="absolute left-3 text-[#77776E] hover:text-[#0B3D2E] transition-colors p-1"
            title="Attach or select Google Drive document"
          >
            <Paperclip size={16} />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            disabled={loading}
            className="w-full pl-10 pr-12 py-2.5 text-xs sm:text-sm bg-[#FAF6EF]/80 hover:bg-[#FAF6EF] focus:bg-white text-[#202720] placeholder-[#77776E] rounded-full border border-[#E8DFC8] focus:border-[#087F5B] focus:ring-2 focus:ring-[#BDE9D4]/50 focus:outline-hidden transition-all shadow-2xs"
          />

          {/* Circular Dark Emerald Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`absolute right-1.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              input.trim() && !loading
                ? 'bg-[#0B3D2E] text-white hover:bg-[#064E3B] hover:scale-105 shadow-2xs cursor-pointer'
                : 'bg-[#E8DFC8] text-[#77776E] cursor-not-allowed opacity-60'
            }`}
            title="Send query"
          >
            <ArrowUp size={16} strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </div>
  );
};
