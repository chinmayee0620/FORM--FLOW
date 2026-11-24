import React, { createContext, useContext, useState, useCallback } from 'react';
import { BrowserPageContext, SearchResultItem } from '../types/browser';
import { browserService } from '../services/browser/browserService';

interface BrowserContextType {
  isBrowserOpen: boolean;
  isBrowserExpanded: boolean;
  splitRatio: number; // percentage of space for browser (e.g. 55)
  url: string;
  displayTitle: string;
  isLoading: boolean;
  error: string | null;
  canGoBack: boolean;
  canGoForward: boolean;
  isSearch: boolean;
  searchResults: SearchResultItem[];
  activePageContext: BrowserPageContext | null;

  // Actions
  openBrowser: (initialUrl?: string) => void;
  closeBrowser: () => void;
  toggleExpand: () => void;
  setSplitRatio: (ratio: number) => void;
  navigate: (urlOrQuery: string) => Promise<void>;
  goBack: () => void;
  goForward: () => void;
  goHome: () => void;
  reload: () => void;
  clearError: () => void;
}

const DEFAULT_URL = 'https://www.reliancefoundation.org/scholarships/ug-stem-2026';

const BrowserContext = createContext<BrowserContextType | undefined>(undefined);

export const BrowserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [isBrowserExpanded, setIsBrowserExpanded] = useState(false);
  const [splitRatio, setSplitRatio] = useState(55); // Default: Chat 45%, Browser 55%
  
  const [url, setUrl] = useState(DEFAULT_URL);
  const [displayTitle, setDisplayTitle] = useState('Reliance Foundation Undergraduate STEM Scholarship 2026 Portal');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [history, setHistory] = useState<string[]>([DEFAULT_URL]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [isSearch, setIsSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [activePageContext, setActivePageContext] = useState<BrowserPageContext | null>(null);

  const performNavigation = useCallback(async (target: string, pushToHistory = true) => {
    setIsLoading(true);
    setError(null);

    // Realistic navigation latency
    setTimeout(async () => {
      try {
        const result = await browserService.navigate(target);

        setUrl(result.url);
        setDisplayTitle(result.title);
        setIsSearch(result.isSearch);
        setSearchResults(result.searchResults || []);
        setActivePageContext(result.pageContext);

        if (result.error) {
          setError(result.error);
        }

        if (pushToHistory) {
          setHistory(prev => {
            const newHistory = prev.slice(0, historyIndex + 1);
            return [...newHistory, result.url];
          });
          setHistoryIndex(prev => prev + 1);
        }
      } catch (err: any) {
        setError(`Failed to load page: ${err?.message || 'Network resolution error'}`);
      } finally {
        setIsLoading(false);
      }
    }, 450);
  }, [historyIndex]);

  const openBrowser = useCallback((initialUrl?: string) => {
    setIsBrowserOpen(true);
    const target = initialUrl || url;
    performNavigation(target, false);
  }, [url, performNavigation]);

  const closeBrowser = useCallback(() => {
    setIsBrowserOpen(false);
    setIsBrowserExpanded(false);
  }, []);

  const toggleExpand = useCallback(() => {
    setIsBrowserExpanded(prev => !prev);
  }, []);

  const navigate = useCallback(async (urlOrQuery: string) => {
    await performNavigation(urlOrQuery, true);
  }, [performNavigation]);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      performNavigation(history[nextIndex], false);
    }
  }, [historyIndex, history, performNavigation]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      performNavigation(history[nextIndex], false);
    }
  }, [historyIndex, history, performNavigation]);

  const goHome = useCallback(() => {
    performNavigation('formflow://home', true);
  }, [performNavigation]);

  const reload = useCallback(() => {
    performNavigation(url, false);
  }, [url, performNavigation]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <BrowserContext.Provider
      value={{
        isBrowserOpen,
        isBrowserExpanded,
        splitRatio,
        url,
        displayTitle,
        isLoading,
        error,
        canGoBack: historyIndex > 0,
        canGoForward: historyIndex < history.length - 1,
        isSearch,
        searchResults,
        activePageContext,
        openBrowser,
        closeBrowser,
        toggleExpand,
        setSplitRatio,
        navigate,
        goBack,
        goForward,
        goHome,
        reload,
        clearError,
      }}
    >
      {children}
    </BrowserContext.Provider>
  );
};

export const useBrowser = () => {
  const context = useContext(BrowserContext);
  if (!context) {
    throw new Error('useBrowser must be used within a BrowserProvider');
  }
  return context;
};
