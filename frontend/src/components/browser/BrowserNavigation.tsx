import React from 'react';
import { Bookmark, Globe, GraduationCap, Building2, School, Briefcase } from 'lucide-react';
import { useBrowser } from '../../contexts/BrowserContext';
import { QUICK_BOOKMARKS } from '../../services/browser/mockBrowserData';

export const BrowserNavigation: React.FC = () => {
  const { url, navigate } = useBrowser();

  const getIcon = (tag: string) => {
    switch (tag) {
      case 'Scholarship': return <GraduationCap size={12} className="text-purple-600" />;
      case 'Government': return <Building2 size={12} className="text-amber-600" />;
      case 'Admission': return <School size={12} className="text-blue-600" />;
      case 'Job': return <Briefcase size={12} className="text-emerald-600" />;
      default: return <Globe size={12} className="text-zinc-500" />;
    }
  };

  return (
    <div className="h-9 border-b border-zinc-200/80 bg-zinc-50/80 px-3 flex items-center gap-1.5 overflow-x-auto shrink-0 select-none no-scrollbar">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1 shrink-0 mr-1.5">
        <Bookmark size={11} />
        <span>Portals:</span>
      </span>

      {QUICK_BOOKMARKS.map((bm, idx) => {
        const isActive = url.toLowerCase().includes(bm.url.toLowerCase());
        return (
          <button
            key={idx}
            type="button"
            onClick={() => navigate(bm.url)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
              isActive
                ? 'bg-white text-zinc-900 shadow-2xs border border-zinc-200/90 font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
            }`}
          >
            {getIcon(bm.tag)}
            <span>{bm.label}</span>
          </button>
        );
      })}
    </div>
  );
};
