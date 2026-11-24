import React from 'react';
import { AlertCircle, RotateCcw, Home, Globe } from 'lucide-react';
import { Button } from '../common/Button';

interface BrowserErrorProps {
  error: string;
  url: string;
  onRetry: () => void;
  onGoHome: () => void;
}

export const BrowserError: React.FC<BrowserErrorProps> = ({
  error,
  url,
  onRetry,
  onGoHome,
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-zinc-50 text-center space-y-4 animate-fade-in">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
        <AlertCircle size={24} />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-sm font-semibold text-zinc-900">
          Navigation Error
        </h3>
        <p className="text-xs text-zinc-500 font-mono break-all">{url}</p>
        <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200 mt-2">
          {error}
        </p>
      </div>

      <p className="text-[11px] text-zinc-400 max-w-xs leading-relaxed">
        FormFlow Browser MCP could not establish connection to the remote portal. Verify URL syntax or choose a supported portal bookmark.
      </p>

      <div className="flex items-center gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RotateCcw size={13} />}
          onClick={onRetry}
        >
          Try Again
        </Button>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Home size={13} />}
          onClick={onGoHome}
        >
          Default Portal
        </Button>
      </div>
    </div>
  );
};
