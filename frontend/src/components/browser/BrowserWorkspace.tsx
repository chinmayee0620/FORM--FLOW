import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  GripVertical, 
  MessageSquare, 
  Globe, 
  PanelRightClose, 
  PanelRightOpen,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useBrowser } from '../../contexts/BrowserContext';
import { ChatWindow } from '../chat/ChatWindow';
import { BrowserToolbar } from './BrowserToolbar';
import { BrowserNavigation } from './BrowserNavigation';
import { BrowserViewport } from './BrowserViewport';
import { BrowserStatus } from './BrowserStatus';

export const BrowserWorkspace: React.FC = () => {
  const { 
    isBrowserOpen, 
    isBrowserExpanded, 
    splitRatio, 
    setSplitRatio,
    openBrowser,
    closeBrowser 
  } = useBrowser();

  const [mobileTab, setMobileTab] = useState<'chat' | 'browser'>('chat');
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Resize Drag Handling
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newBrowserWidth = rect.right - e.clientX;
    const ratio = (newBrowserWidth / rect.width) * 100;
    // Clamp ratio between 30% and 75%
    if (ratio >= 25 && ratio <= 75) {
      setSplitRatio(Math.round(ratio));
    }
  }, [isDragging, setSplitRatio]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // When browser is opened, switch mobile tab to browser
  useEffect(() => {
    if (isBrowserOpen) {
      setMobileTab('browser');
    }
  }, [isBrowserOpen]);

  // If browser is closed, render ChatWindow normally
  if (!isBrowserOpen) {
    return <ChatWindow />;
  }

  const chatPercentage = isBrowserExpanded ? 0 : 100 - splitRatio;
  const browserPercentage = isBrowserExpanded ? 100 : splitRatio;

  return (
    <div 
      ref={containerRef} 
      className={`flex-1 flex flex-col sm:flex-row h-[calc(100vh-3.5rem)] overflow-hidden bg-white select-none relative ${
        isDragging ? 'cursor-col-resize select-none' : ''
      }`}
    >
      {/* Mobile Screen Tab Switcher */}
      <div className="sm:hidden flex items-center border-b border-zinc-200 bg-zinc-50 p-1 shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab('chat')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === 'chat' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500'
          }`}
        >
          <MessageSquare size={13} />
          <span>FormFlow Assistant</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('browser')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === 'browser' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500'
          }`}
        >
          <Globe size={13} />
          <span>Browser Workspace</span>
        </button>
      </div>

      {/* LEFT: CHAT PANEL */}
      <div
        style={{ width: `${chatPercentage}%` }}
        className={`h-full flex flex-col border-r border-zinc-200/90 overflow-hidden min-w-0 transition-all ${
          isBrowserExpanded ? 'hidden' : 'block'
        } ${mobileTab === 'browser' ? 'hidden sm:flex' : 'flex'}`}
      >
        <ChatWindow />
      </div>

      {/* DRAGGABLE RESIZER DIVIDER (Desktop Only) */}
      {!isBrowserExpanded && (
        <div
          onMouseDown={handleMouseDown}
          className="hidden sm:flex w-2 bg-zinc-100 hover:bg-brand-500 cursor-col-resize items-center justify-center transition-colors group z-20 shrink-0 border-x border-zinc-200/60"
          title="Drag to resize Chat and Browser split ratio"
        >
          <GripVertical size={12} className="text-zinc-400 group-hover:text-white" />
        </div>
      )}

      {/* RIGHT: BROWSER PANEL */}
      <div
        style={{ width: `${browserPercentage}%` }}
        className={`h-full flex flex-col bg-white overflow-hidden min-w-0 ${
          mobileTab === 'chat' ? 'hidden sm:flex' : 'flex'
        }`}
      >
        {/* Browser Top Controls */}
        <BrowserToolbar />

        {/* Portal Quick Bookmarks */}
        <BrowserNavigation />

        {/* Browser Viewport (Web content or portal simulation) */}
        <div className="flex-1 overflow-hidden relative">
          <BrowserViewport />
        </div>

        {/* Browser Bottom Status Bar */}
        <BrowserStatus />
      </div>
    </div>
  );
};
