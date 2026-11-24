/**
 * Browser Service Abstraction for FormFlow Split-Screen Workspace.
 * Uses mock browser data stored separately in mockBrowserData.ts.
 * Supports URL navigation, mock search queries, and home portal directory.
 */

import { BrowserPageContext, SearchResultItem } from '../../types/browser';
import { SAMPLE_PORTALS, MOCK_SEARCH_DATABASE, HOME_PORTAL_URL } from './mockBrowserData';

export interface NavigationResult {
  url: string;
  title: string;
  isSearch: boolean;
  searchResults?: SearchResultItem[];
  pageContext: BrowserPageContext | null;
  error?: string | null;
}

// Backwards-compatible export
export const KNOWN_PORTALS = SAMPLE_PORTALS;

class BrowserService {
  /**
   * Navigates to a given URL or executes a mock search query.
   */
  async navigate(input: string): Promise<NavigationResult> {
    const trimmed = input.trim();

    // 1. Home Directory Navigation
    if (!trimmed || trimmed === 'formflow://home' || trimmed === 'about:blank' || trimmed === 'about:home') {
      return {
        url: HOME_PORTAL_URL,
        title: 'FormFlow Portal Directory · Local Workspace Prototype',
        isSearch: false,
        pageContext: {
          url: HOME_PORTAL_URL,
          title: 'FormFlow Portal Directory',
          portalName: 'FormFlow Portal Directory & Navigator',
          fieldsDetected: 0,
          eligibilityCriteria: [
            'Interactive local prototype environment',
            'Pre-configured sample portals available for exploration',
            'Cross-document data mapping active with Google Drive'
          ],
          requiredDocs: [
            '10th CBSE Marksheet',
            '12th CBSE Marksheet',
            'College Bonafide Certificate',
            'Government Income Certificate',
            'Aadhaar Identity Card'
          ],
          summary: 'Welcome to the FormFlow Browser Workspace Prototype. Select any of the four verified portals below or enter an address in the omnibar to begin guided application workflows.'
        }
      };
    }

    // 2. Check if input is a URL
    const isUrl = /^https?:\/\//i.test(trimmed) || 
                  trimmed.includes('.gov') || 
                  trimmed.includes('.org') || 
                  trimmed.includes('.edu') || 
                  trimmed.includes('.com') || 
                  trimmed.includes('.in') ||
                  trimmed.startsWith('formflow://');

    if (isUrl) {
      let normalizedUrl = trimmed;
      if (!/^https?:\/\//i.test(normalizedUrl) && !normalizedUrl.startsWith('formflow://')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }

      // Check if URL matches one of our 4 sample portals
      const matchedKey = Object.keys(SAMPLE_PORTALS).find(k => 
        normalizedUrl.toLowerCase().includes(k.toLowerCase()) || 
        k.toLowerCase().includes(normalizedUrl.toLowerCase())
      );

      if (matchedKey) {
        const portal = SAMPLE_PORTALS[matchedKey];
        return {
          url: portal.url,
          title: portal.title,
          isSearch: false,
          pageContext: portal
        };
      }

      // Realistic generic web portal fallback
      const domain = normalizedUrl.replace(/^https?:\/\//i, '').split('/')[0];
      return {
        url: normalizedUrl,
        title: `${domain} | Official Web Portal`,
        isSearch: false,
        pageContext: {
          url: normalizedUrl,
          title: `${domain} Portal`,
          portalName: domain.toUpperCase(),
          fieldsDetected: 6,
          eligibilityCriteria: [
            'Official application credentials required',
            'Verification against registered educational records',
            'Valid Indian identity proof'
          ],
          requiredDocs: [
            'Secondary School Marksheet (DOB proof)',
            'Standard Identity Verification Card',
            'Current Institution Enrollment Proof'
          ],
          summary: `Simulated portal session loaded for ${domain}. FormFlow Browser Workspace is inspecting form schemas and mapping fields to your authorized Google Drive repository.`,
          formFields: [
            { name: 'full_name', label: 'Candidate Full Name', value: 'Darshan Kumar', type: 'text', status: 'mapped', sourceDoc: '10th_CBSE_Board_Marksheet_Darshan.pdf' },
            { name: 'email', label: 'Email Address', value: 'darshan.k@example.com', type: 'email', status: 'mapped', sourceDoc: 'Google Account Authorization' },
            { name: 'college', label: 'College / University', value: 'M S Ramaiah Institute of Technology, Bangalore', type: 'text', status: 'mapped', sourceDoc: 'College_ID_Card_MSRIT.pdf' }
          ]
        }
      };
    }

    // 3. Search Query Handling
    const queryLower = trimmed.toLowerCase();
    const matchedResults = MOCK_SEARCH_DATABASE.filter(item => 
      item.title.toLowerCase().includes(queryLower) ||
      item.snippet.toLowerCase().includes(queryLower) ||
      item.category.toLowerCase().includes(queryLower)
    );

    const results = matchedResults.length > 0 ? matchedResults : MOCK_SEARCH_DATABASE;

    return {
      url: `formflow://search?q=${encodeURIComponent(trimmed)}`,
      title: `Search: "${trimmed}" – FormFlow Web Navigator`,
      isSearch: true,
      searchResults: results,
      pageContext: {
        url: `formflow://search?q=${encodeURIComponent(trimmed)}`,
        title: `Search Results for "${trimmed}"`,
        portalName: 'FormFlow Search Aggregator (Simulated)',
        fieldsDetected: 0,
        eligibilityCriteria: [],
        requiredDocs: [],
        summary: `Search results for query "${trimmed}". Results are simulated for prototype verification before backend connection.`
      }
    };
  }

  /**
   * Returns page context for the currently loaded URL
   */
  async getPageContext(url: string): Promise<BrowserPageContext | null> {
    const matchedKey = Object.keys(SAMPLE_PORTALS).find(k => url.toLowerCase().includes(k.toLowerCase()));
    if (matchedKey) {
      return SAMPLE_PORTALS[matchedKey];
    }
    return null;
  }
}

export const browserService = new BrowserService();
