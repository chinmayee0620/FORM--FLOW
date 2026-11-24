import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  Search, 
  Globe, 
  ArrowRight, 
  X, 
  GraduationCap,
  Building2,
  School,
  Briefcase
} from 'lucide-react';
import { useBrowser } from '../../contexts/BrowserContext';

export const BrowserAddressBar: React.FC = () => {
  const { url, navigate, isSearch } = useBrowser();
  const [inputValue, setInputValue] = useState(url);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(url);
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    navigate(inputValue.trim());
    inputRef.current?.blur();
    setIsFocused(false);
  };

  const handleSelectSuggestion = (suggested: string) => {
    setInputValue(suggested);
    navigate(suggested);
    setIsFocused(false);
  };

  const suggestions = [
    { label: 'Scholarship: Reliance Foundation STEM 2026', query: 'https://www.reliancefoundation.org/scholarships/ug-stem-2026', type: 'scholarship' },
    { label: 'Government: Karnataka State Scholarship Portal (SSP)', query: 'https://ssp.postmatric.karnataka.gov.in', type: 'government' },
    { label: 'Admission: MSRIT Central UG Admissions 2026-27', query: 'https://admissions.msrit.edu/ug-2026', type: 'admission' },
    { label: 'Job: National Career Service Placements', query: 'https://careers.ncs.gov.in/tech-fellowship-2026', type: 'job' },
    { label: 'Search: "Engineering scholarships in India"', query: 'Engineering scholarships in India', type: 'search' },
    { label: 'Search: "Karnataka government student schemes"', query: 'Karnataka government student schemes', type: 'search' },
  ];

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'scholarship': return <GraduationCap size={13} className="text-purple-600 shrink-0" />;
      case 'government': return <Building2 size={13} className="text-amber-600 shrink-0" />;
      case 'admission': return <School size={13} className="text-blue-600 shrink-0" />;
      case 'job': return <Briefcase size={13} className="text-emerald-600 shrink-0" />;
      default: return <Search size={13} className="text-zinc-500 shrink-0" />;
    }
  };

  return (
    <div className="relative flex-1 max-w-2xl min-w-0">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        {/* Left Icon (Lock for SSL, Search for Query) */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-zinc-400 pointer-events-none">
          {isSearch ? (
            <Search size={13} className="text-brand-600" />
          ) : (
            <Lock size={12} className="text-emerald-600" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Enter website URL or search query..."
          className="w-full pl-8 pr-16 py-1.5 text-xs bg-zinc-100 hover:bg-zinc-100/90 focus:bg-white text-zinc-900 border border-transparent focus:border-zinc-300 rounded-xl focus:outline-none transition-colors shadow-2xs font-mono"
        />

        {/* Right Actions: Clear and Go */}
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue('');
                inputRef.current?.focus();
              }}
              className="p-1 text-zinc-400 hover:text-zinc-600 rounded-md"
              title="Clear address bar"
            >
              <X size={12} />
            </button>
          )}

          <button
            type="submit"
            className="p-1 text-zinc-400 hover:text-zinc-900 rounded-md"
            title="Navigate / Search (Enter)"
          >
            <ArrowRight size={13} />
          </button>
        </div>
      </form>

      {/* Autocomplete / Suggested Portals Dropdown */}
      {isFocused && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-zinc-200 shadow-modal rounded-2xl p-2 z-40 animate-fade-in text-xs space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 px-2 py-1 flex items-center justify-between">
            <span>Sample Prototype Portals & Searches</span>
            <span className="text-zinc-400 font-normal">Press Enter to Navigate</span>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-0.5">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onMouseDown={() => handleSelectSuggestion(item.query)}
                className="w-full text-left p-2 rounded-xl hover:bg-zinc-50 flex items-center justify-between gap-2 transition-colors group"
              >
                <div className="flex items-center gap-2 truncate">
                  {getSuggestionIcon(item.type)}
                  <span className="font-medium text-zinc-800 truncate">{item.label}</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono truncate max-w-[150px]">
                  {item.query}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
