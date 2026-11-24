import React from 'react';
import { Globe, Sparkles } from 'lucide-react';

export const BrowserLoading: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white text-zinc-600 space-y-4 animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 animate-pulse">
          <Globe size={24} />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
          <Sparkles size={10} />
        </div>
      </div>

      <div className="text-center space-y-1">
        <h4 className="text-xs font-semibold text-zinc-800">
          FormFlow Browser MCP is Navigating...
        </h4>
        <p className="text-[11px] text-zinc-400">
          Connecting to application portal and inspecting form structure
        </p>
      </div>

      {/* Modern thin loading progress bar */}
      <div className="w-48 bg-zinc-100 h-1 rounded-full overflow-hidden">
        <div className="h-full bg-brand-600 rounded-full animate-pulse" style={{ width: '70%' }} />
      </div>
    </div>
  );
};
