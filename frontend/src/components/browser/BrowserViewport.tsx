import React, { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  HardDrive, 
  ShieldCheck, 
  FileText, 
  Info,
  Building2,
  Calendar,
  Lock,
  GraduationCap,
  School,
  Briefcase,
  ArrowRight,
  Check,
  HelpCircle,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useBrowser } from '../../contexts/BrowserContext';
import { useFormFlow } from '../../contexts/FormFlowContext';
import { BrowserLoading } from './BrowserLoading';
import { BrowserError } from './BrowserError';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { PROTOTYPE_BANNER_TEXT, HOME_PORTAL_URL, QUICK_BOOKMARKS } from '../../services/browser/mockBrowserData';

export const BrowserViewport: React.FC = () => {
  const { 
    url, 
    displayTitle, 
    isLoading, 
    error, 
    isSearch, 
    searchResults, 
    activePageContext, 
    reload, 
    navigate 
  } = useBrowser();

  const { openDocPreview, documents, openApprovalModal, applications, sendMessage } = useFormFlow();
  const [activeTab, setActiveTab] = useState<'form' | 'criteria' | 'documents'>('form');

  if (isLoading) {
    return <BrowserLoading />;
  }

  if (error) {
    return (
      <BrowserError
        error={error}
        url={url}
        onRetry={reload}
        onGoHome={() => navigate(HOME_PORTAL_URL)}
      />
    );
  }

  const findDocByName = (name?: string) => {
    if (!name) return undefined;
    return documents.find(d => d.name === name || d.name.toLowerCase().includes(name.toLowerCase()));
  };

  const handleTriggerSubmit = () => {
    const targetApp = applications[0];
    if (targetApp) {
      openApprovalModal(targetApp);
    }
  };

  // ───────────────────────────────────────────────────────────
  // VIEW 1: HOME PORTAL DIRECTORY (formflow://home)
  // ───────────────────────────────────────────────────────────
  if (!isSearch && (url === HOME_PORTAL_URL || url === 'about:blank' || !activePageContext)) {
    return (
      <div className="w-full h-full overflow-y-auto bg-zinc-50/70 p-6 space-y-6 animate-fade-in flex flex-col">
        {/* Prototype Indicator Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-900 rounded-xl px-3.5 py-2 text-xs flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold">{PROTOTYPE_BANNER_TEXT}</span>
          </div>
          <Badge variant="warning" size="sm">Prototype v1.0</Badge>
        </div>

        {/* Directory Header */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-sky-500 flex items-center justify-center text-white shadow-xs">
              <Globe size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-zinc-900">FormFlow Browser Workspace Directory</h1>
              <p className="text-xs text-zinc-500">
                Explore local simulated application portals with pre-mapped Google Drive verification.
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed pt-1">
            FormFlow allows you to inspect websites side-by-side with your AI Assistant. Select any of the four verified prototype portals below to experience automated form mapping, eligibility auditing, and safety checkpoints.
          </p>
        </div>

        {/* 4 Sample Websites Cards */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Available Prototype Portals ({QUICK_BOOKMARKS.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Scholarship Portal Card */}
            <div 
              onClick={() => navigate('https://www.reliancefoundation.org/scholarships/ug-stem-2026')}
              className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-purple-300 hover:shadow-xs transition-all cursor-pointer group space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <GraduationCap size={16} />
                  </div>
                  <Badge variant="purple" size="sm">Scholarship Portal</Badge>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 group-hover:text-purple-700 transition-colors">
                  Reliance Foundation STEM Scholarship 2026
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  Merit-cum-means financial grant of ₹2,00,000/yr for undergraduate engineering and computer science students.
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono text-[11px]">reliancefoundation.org</span>
                <span className="text-purple-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Launch Portal <ArrowRight size={12} />
                </span>
              </div>
            </div>

            {/* 2. Government Portal Card */}
            <div 
              onClick={() => navigate('https://ssp.postmatric.karnataka.gov.in')}
              className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer group space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Building2 size={16} />
                  </div>
                  <Badge variant="warning" size="sm">Government Portal</Badge>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 group-hover:text-amber-700 transition-colors">
                  Karnataka State Scholarship Portal (SSP)
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  State government fee reimbursement and maintenance scheme linked with Seva Sindhu Revenue certificates.
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono text-[11px]">ssp.postmatric.karnataka.gov.in</span>
                <span className="text-amber-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Launch Portal <ArrowRight size={12} />
                </span>
              </div>
            </div>

            {/* 3. College Admission Portal Card */}
            <div 
              onClick={() => navigate('https://admissions.msrit.edu/ug-2026')}
              className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer group space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <School size={16} />
                  </div>
                  <Badge variant="info" size="sm">College Admission</Badge>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 group-hover:text-blue-700 transition-colors">
                  MSRIT Central UG Admissions 2026-27
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  Official counseling and seat allotment verification portal for B.E. Computer Science, AI, and Engineering branches.
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono text-[11px]">admissions.msrit.edu</span>
                <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Launch Portal <ArrowRight size={12} />
                </span>
              </div>
            </div>

            {/* 4. Job Application Portal Card */}
            <div 
              onClick={() => navigate('https://careers.ncs.gov.in/tech-fellowship-2026')}
              className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer group space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Briefcase size={16} />
                  </div>
                  <Badge variant="success" size="sm">Job Application</Badge>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors">
                  National Career Service – Graduate Placements
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  Ministry of Labour & Employment technical apprenticeship and campus hiring program for engineering graduates.
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono text-[11px]">careers.ncs.gov.in</span>
                <span className="text-emerald-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Launch Portal <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Prototype Information Note */}
        <div className="p-4 rounded-xl bg-zinc-100/80 border border-zinc-200 text-xs text-zinc-600 space-y-1">
          <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
            <Info size={14} className="text-brand-600" />
            Browser Prototype Architecture Note
          </span>
          <p className="text-[11px] leading-relaxed">
            This browser workspace is completely sandboxed in the frontend without external iframe embeds or headless browser processes. Form field detection and citation mapping simulate the upcoming FastMCP Browser integration.
          </p>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────
  // VIEW 2: MOCK SEARCH RESULTS (formflow://search?q=...)
  // ───────────────────────────────────────────────────────────
  if (isSearch) {
    return (
      <div className="w-full h-full overflow-y-auto bg-white p-6 space-y-6 animate-fade-in flex flex-col">
        {/* Prototype Indicator Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-900 rounded-xl px-3.5 py-2 text-xs flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold">{PROTOTYPE_BANNER_TEXT}</span>
          </div>
          <Badge variant="warning" size="sm">Search Simulation</Badge>
        </div>

        <div className="border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Search size={14} className="text-brand-600" />
            <span>FormFlow Web Navigator · Portal Discovery</span>
          </div>
          <h2 className="text-lg font-bold text-zinc-900">{displayTitle}</h2>
          
          <div className="mt-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <Info size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Simulated Search Notice</span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                These search results are simulated demonstrations of FormFlow's portal index. Clicking any verified result below will open its prototype page in this viewport.
              </p>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4 max-w-2xl flex-1">
          {searchResults.map((result) => (
            <div
              key={result.id}
              onClick={() => navigate(result.url)}
              className="p-4 rounded-2xl border border-zinc-200 hover:border-brand-400 bg-white hover:bg-zinc-50/60 shadow-2xs hover:shadow-xs cursor-pointer transition-all space-y-1.5 group"
            >
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Globe size={12} className="text-brand-600" />
                <span className="font-mono text-[11px] text-zinc-500">{result.source}</span>
                <span>•</span>
                <Badge variant="purple" size="sm">{result.category}</Badge>
              </div>

              <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-brand-700 transition-colors">
                {result.title}
              </h3>

              <p className="text-xs text-zinc-600 leading-relaxed">
                {result.snippet}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────
  // VIEW 3: SAMPLE WEBSITE VIEWPORT (4 Portal Categories)
  // ───────────────────────────────────────────────────────────
  if (!activePageContext) {
    return null;
  }

  const isReliance = url.includes('reliancefoundation.org');
  const isSSP = url.includes('ssp.postmatric.karnataka.gov.in');
  const isMSRIT = url.includes('msrit.edu');
  const isNCS = url.includes('ncs.gov.in');

  const getPortalBadge = () => {
    if (isReliance) return { label: 'Scholarship Portal', variant: 'purple' as const, icon: GraduationCap };
    if (isSSP) return { label: 'Government Portal', variant: 'warning' as const, icon: Building2 };
    if (isMSRIT) return { label: 'College Admission Portal', variant: 'info' as const, icon: School };
    if (isNCS) return { label: 'Job Application Portal', variant: 'success' as const, icon: Briefcase };
    return { label: 'Web Portal', variant: 'default' as const, icon: Globe };
  };

  const portalBadge = getPortalBadge();
  const IconComp = portalBadge.icon;

  return (
    <div className="w-full h-full overflow-y-auto bg-zinc-50/60 animate-fade-in flex flex-col">
      {/* 1. Mandatory Clear Prototype Indicator Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-900 px-4 py-2 text-xs flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <span className="font-semibold truncate">{PROTOTYPE_BANNER_TEXT}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="warning" size="sm">Interactive Prototype</Badge>
        </div>
      </div>

      {/* 2. FormFlow Browser MCP Active Assistant Strip */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-950 text-white px-4 py-2.5 text-xs flex items-center justify-between shadow-2xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold tracking-tight">FormFlow Assistant Hooked</span>
          <span className="hidden sm:inline text-brand-200 text-[11px]">
            — Cross-referenced with authorized Google Drive records
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm" dot>
            Drive Citations Active
          </Badge>
        </div>
      </div>

      {/* 3. Portal Header Bar */}
      <div className="bg-white border-b border-zinc-200 p-5 shadow-2xs">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {isReliance ? 'RF' : isSSP ? 'SSP' : isMSRIT ? 'MSR' : isNCS ? 'NCS' : 'WEB'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base sm:text-lg font-bold text-zinc-900">
                    {activePageContext.portalName}
                  </h1>
                  <Badge variant={portalBadge.variant} size="sm">
                    <IconComp size={11} className="inline mr-1" />
                    {portalBadge.label}
                  </Badge>
                </div>
                <span className="text-xs text-zinc-500 font-mono block mt-0.5">{url}</span>
              </div>
            </div>

            {activePageContext.deadline && (
              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Closing Deadline</span>
                <span className="text-xs font-bold text-rose-600 font-mono">{activePageContext.deadline}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed">
            {activePageContext.summary}
          </p>

          {/* Portal Navigation Tabs */}
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`pb-1.5 px-2.5 border-b-2 transition-colors ${
                activeTab === 'form'
                  ? 'border-brand-600 text-brand-700 font-semibold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Application Form ({activePageContext.fieldsDetected} Fields)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('criteria')}
              className={`pb-1.5 px-2.5 border-b-2 transition-colors ${
                activeTab === 'criteria'
                  ? 'border-brand-600 text-brand-700 font-semibold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Eligibility Criteria ({activePageContext.eligibilityCriteria.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('documents')}
              className={`pb-1.5 px-2.5 border-b-2 transition-colors ${
                activeTab === 'documents'
                  ? 'border-brand-600 text-brand-700 font-semibold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Required Documents ({activePageContext.requiredDocs.length})
            </button>
          </div>
        </div>
      </div>

      {/* 4. Portal Body Content */}
      <div className="flex-1 p-5 max-w-4xl w-full mx-auto space-y-6">
        {/* TAB 1: FORM VIEW */}
        {activeTab === 'form' && (
          <div className="space-y-5">
            <div className="border border-zinc-200 bg-white rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">
                    Online Candidate Application Form
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Pre-filled with verified credentials from your authorized Google Drive repository.
                  </p>
                </div>

                <Badge variant="success" size="sm">
                  <ShieldCheck size={12} className="inline mr-1" />
                  Source-Backed
                </Badge>
              </div>

              {/* Form Input Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activePageContext.formFields?.map((field, idx) => {
                  const doc = findDocByName(field.sourceDoc);
                  return (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-xl border transition-all ${
                        field.status === 'warning'
                          ? 'border-amber-300 bg-amber-50/40'
                          : 'border-zinc-200 bg-zinc-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-zinc-700 block">
                          {field.label}
                        </label>
                        {field.status === 'warning' && (
                          <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5">
                            <AlertTriangle size={11} /> Name Variation
                          </span>
                        )}
                        {field.status === 'mapped' && (
                          <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5">
                            <CheckCircle2 size={11} /> Verified
                          </span>
                        )}
                      </div>

                      <div className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 font-medium select-text">
                        {field.value || <span className="text-zinc-400 italic">Pending user input</span>}
                      </div>

                      {/* Source Document Citation Chip */}
                      {field.sourceDoc && (
                        <div className="mt-1.5 flex items-center justify-between text-[10px]">
                          <span className="text-zinc-400 truncate max-w-[170px]" title={field.sourceDoc}>
                            Source: {field.sourceDoc}
                          </span>
                          {doc && (
                            <button
                              type="button"
                              onClick={() => openDocPreview(doc)}
                              className="text-brand-600 hover:underline flex items-center gap-0.5 font-medium shrink-0"
                            >
                              <HardDrive size={10} /> View
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Actions & Human Approval Gate Trigger */}
              <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Lock size={13} className="text-emerald-600" />
                  <span>Mandatory safety checkpoint enforced prior to submission.</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage(`Explain requirements for ${activePageContext.portalName}`)}
                  >
                    Ask AI Assistant
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<ShieldCheck size={14} />}
                    onClick={handleTriggerSubmit}
                  >
                    Authorize Submission
                  </Button>
                </div>
              </div>
            </div>

            {/* Related Sample Portals Cross-Navigation (Requirement 5) */}
            <div className="p-4 rounded-2xl border border-zinc-200 bg-white space-y-2.5 shadow-2xs">
              <span className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                <Layers size={14} className="text-brand-600" />
                Cross-Navigate to Other Sample Portals:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {QUICK_BOOKMARKS.filter(b => !url.includes(b.url)).slice(0, 3).map((item, bIdx) => (
                  <button
                    key={bIdx}
                    type="button"
                    onClick={() => navigate(item.url)}
                    className="p-2.5 rounded-xl border border-zinc-200 hover:border-brand-400 bg-zinc-50 hover:bg-white text-left transition-all text-xs group flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-zinc-900 block group-hover:text-brand-700">{item.label}</span>
                      <span className="text-[10px] text-zinc-400">{item.tag}</span>
                    </div>
                    <ChevronRight size={13} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ELIGIBILITY CRITERIA */}
        {activeTab === 'criteria' && (
          <div className="border border-zinc-200 bg-white rounded-2xl p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900">
              Mandatory Eligibility Requirements
            </h3>
            <div className="space-y-2.5">
              {activePageContext.eligibilityCriteria.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-700">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REQUIRED DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="border border-zinc-200 bg-white rounded-2xl p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900">
              Required Source Documents for Verification
            </h3>
            <div className="space-y-2.5">
              {activePageContext.requiredDocs.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-700">
                  <div className="flex items-center gap-2.5">
                    <FileText size={15} className="text-brand-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                  <Badge variant="success" size="sm">Drive Synced</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
