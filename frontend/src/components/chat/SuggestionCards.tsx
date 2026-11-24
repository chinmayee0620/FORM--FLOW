import React from 'react';
import { 
  Sparkles, 
  GraduationCap, 
  ClipboardCheck, 
  FolderSearch, 
  FileEdit,
  ArrowUpRight
} from 'lucide-react';

interface SuggestionCardsProps {
  onSelectSuggestion: (text: string) => void;
}

export const SuggestionCards: React.FC<SuggestionCardsProps> = ({ onSelectSuggestion }) => {
  const cards = [
    {
      title: "Find scholarships I'm eligible for.",
      desc: "Matches your degree, merit percentage, and income against verified programs",
      icon: GraduationCap,
      color: "text-purple-600 bg-purple-50 group-hover:bg-purple-100",
      query: "Find scholarships I'm eligible for.",
    },
    {
      title: "Analyse my application requirements.",
      desc: "Inspects portal criteria, formats, deadlines, and flags name/date mismatches",
      icon: ClipboardCheck,
      color: "text-blue-600 bg-blue-50 group-hover:bg-blue-100",
      query: "Analyse my application requirements.",
    },
    {
      title: "Check my missing documents.",
      desc: "Audits your Google Drive folders and detects missing documents for portals",
      icon: FolderSearch,
      color: "text-amber-600 bg-amber-50 group-hover:bg-amber-100",
      query: "Check my missing documents.",
    },
    {
      title: "Help me prepare an application.",
      desc: "Pre-fills portal fields backed by Drive citations with human approval checkpoints",
      icon: FileEdit,
      color: "text-emerald-600 bg-emerald-50 group-hover:bg-emerald-100",
      query: "Help me prepare an application.",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 flex flex-col items-center text-center space-y-7 animate-fade-in">
      {/* FormFlow Brand Icon */}
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-sky-500 text-white flex items-center justify-center shadow-md">
        <Sparkles size={24} />
      </div>

      {/* Main Heading & Subtitle as requested */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
          Your applications, simplified.
        </h2>
        <p className="text-sm sm:text-base text-zinc-500 max-w-md mx-auto leading-relaxed">
          Find documents, understand requirements and complete applications with AI.
        </p>
      </div>

      {/* Four Suggestion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full pt-2">
        {cards.map((card, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectSuggestion(card.query)}
            className="p-4 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50/90 hover:border-zinc-300 transition-all text-left group shadow-xs hover:shadow-sm space-y-2.5 relative flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${card.color}`}>
                <card.icon size={17} />
              </div>
              <ArrowUpRight size={14} className="text-zinc-300 group-hover:text-zinc-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-brand-700 transition-colors">
                {card.title}
              </h3>
              <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                {card.desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Browser Workspace Quick Prompts */}
      <div className="pt-2 w-full space-y-2">
        <span className="text-[11px] font-medium text-zinc-400 block uppercase tracking-wider">
          Or try split-screen browser interactions:
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Open this scholarship website",
            "Explain this page",
            "Help me fill this application"
          ].map((promptText, pIdx) => (
            <button
              key={pIdx}
              type="button"
              onClick={() => onSelectSuggestion(promptText)}
              className="px-3 py-1.5 rounded-full text-xs bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 border border-zinc-200 transition-colors flex items-center gap-1.5"
            >
              <Sparkles size={11} className="text-brand-600" />
              <span>"{promptText}"</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
