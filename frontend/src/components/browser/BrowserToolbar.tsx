import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Home,
  Maximize2, 
  Minimize2, 
  X, 
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';
import { useBrowser } from '../../contexts/BrowserContext';
import { BrowserAddressBar } from './BrowserAddressBar';

export const BrowserToolbar: React.FC = () => {
  const { 
    canGoBack, 
    canGoForward, 
    goBack, 
    goForward, 
    goHome,
    reload, 
    isLoading, 
    isBrowserExpanded, 
    toggleExpand, 
    closeBrowser,
    url 
  } = useBrowser();

  return (
    <div className="h-12 border-b border-zinc-200/90 bg-white px-3 flex items-center justify-between gap-2.5 shrink-0 select-none">
      {/* Navigation Controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={goBack}
          disabled={!canGoBack}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Back"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          type="button"
          onClick={goForward}
          disabled={!canGoForward}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Forward"
        >
          <ChevronRight size={16} />
        </button>

        <button
          type="button"
          onClick={reload}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          title="Reload page"
        >
          <RotateCw size={14} className={isLoading ? 'animate-spin text-brand-600' : ''} />
        </button>

        <button
          type="button"
          onClick={goHome}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          title="Home (Portal Directory)"
        >
          <Home size={15} />
        </button>
      </div>

      {/* Address Bar */}
      <BrowserAddressBar />

      {/* Window & Expansion Controls */}
      <div className="flex items-center gap-1">
        {/* Open in external browser tab if valid HTTP URL */}
        {/^https?:\/\//i.test(url) && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors hidden sm:block"
            title="Open in external browser window"
          >
            <ExternalLink size={14} />
          </a>
        )}

        {/* Maximize / Restore Split View */}
        <button
          type="button"
          onClick={toggleExpand}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          title={isBrowserExpanded ? 'Restore split-screen' : 'Expand full screen'}
        >
          {isBrowserExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>

        {/* Close Browser Workspace */}
        <button
          type="button"
          onClick={closeBrowser}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Close browser panel"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
