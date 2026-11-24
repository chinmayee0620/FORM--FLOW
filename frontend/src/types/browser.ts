export interface BrowserPageContext {
  url: string;
  title: string;
  portalName: string;
  fieldsDetected: number;
  eligibilityCriteria: string[];
  requiredDocs: string[];
  deadline?: string;
  summary: string;
  formFields?: {
    name: string;
    label: string;
    value?: string;
    type: string;
    status: 'mapped' | 'unmapped' | 'warning';
    sourceDoc?: string;
  }[];
}

export interface SearchResultItem {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source: string;
  category: string;
  isMock: boolean;
}

export interface BrowserSession {
  url: string;
  title: string;
  isLoading: boolean;
  error: string | null;
  canGoBack: boolean;
  canGoForward: boolean;
  history: string[];
  historyIndex: number;
  isSecure: boolean;
  pageContext: BrowserPageContext | null;
}
