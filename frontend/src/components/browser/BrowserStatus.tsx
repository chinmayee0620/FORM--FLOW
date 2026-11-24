import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  FileEdit, 
  HelpCircle,
  Layers
} from 'lucide-react';
import { useBrowser } from '../../contexts/BrowserContext';
import { useFormFlow } from '../../contexts/FormFlowContext';

export const BrowserStatus: React.FC = () => {
  const { activePageContext, isSearch } = useBrowser();
  const { sendMessage } = useFormFlow();

  const handleExplainPage = () => {
    sendMessage('Explain this page');
  };

  const handleHelpFill = () => {
    sendMessage('Help me fill this application');
  };

  return (
    <div className="h-8 border-t border-zinc-200/90 bg-white px-3 flex items-center justify-between text-[11px] text-zinc-500 shrink-0 select-none">
      {/* Security & MCP Hook Status */}
      <div className="flex items-center gap-2.5 truncate">
        <span className="flex items-center gap-1 text-emerald-700 font-medium shrink-0">
          <ShieldCheck size={13} className="text-emerald-600" />
          <span>TLS 1.3 Verified</span>
        </span>

        <span className="text-zinc-300 hidden sm:inline">•</span>

        <span className="hidden sm:flex items-center gap-1 text-purple-700 font-medium shrink-0">
          <Cpu size={12} className="text-purple-600" />
          <span>Browser MCP: Hooked</span>
        </span>

        <span className="text-zinc-300 hidden md:inline">•</span>

        <span className="hidden md:inline-flex items-center px-1.5 py-0.2 rounded text-[10px] bg-amber-50 text-amber-800 border border-amber-200/80 font-medium">
          Simulated Prototype Viewport
        </span>

        {activePageContext?.fieldsDetected ? (
          <>
            <span className="text-zinc-300 hidden lg:inline">•</span>
            <span className="hidden lg:inline text-zinc-600 font-mono">
              {activePageContext.fieldsDetected} Form Fields Detected
            </span>
          </>
        ) : null}
      </div>

      {/* Quick Agent Actions when inspecting a portal */}
      {!isSearch && activePageContext && (
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleExplainPage}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium transition-colors text-[10px]"
            title="Ask FormFlow assistant to summarize and explain this portal"
          >
            <Sparkles size={11} />
            <span>Explain Page</span>
          </button>

          <button
            type="button"
            onClick={handleHelpFill}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium transition-colors text-[10px]"
            title="Assisted form filling with Google Drive verified records"
          >
            <FileEdit size={11} />
            <span>Help Fill Form</span>
          </button>
        </div>
      )}
    </div>
  );
};
