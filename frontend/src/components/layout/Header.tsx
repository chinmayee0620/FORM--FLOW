import React, { useState } from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  PanelLeft,
  Menu,
  Command,
  X
} from 'lucide-react';
import { useFormFlow } from '../../contexts/FormFlowContext';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const { 
    isSidebarCollapsed, 
    toggleSidebar, 
    toggleMobileMenu, 
    openSettings 
  } = useFormFlow();
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [hasNotifications] = useState(true);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <header className="h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0 bg-[#FAF6EF]/95 backdrop-blur-md transition-colors border-b border-[#E8DFC8]/60">
      {/* Left: Mobile Hamburger OR Desktop Collapse Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-xl text-[#0B3D2E] hover:bg-[#F0E8D8] transition-colors active:scale-95"
          title="Open navigation menu"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Mobile Brand Logo */}
        <div className="md:hidden flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-[#0B3D2E] flex items-center justify-center text-white font-serif font-bold text-sm shadow-2xs">
            F
          </div>
          <span className="font-semibold text-sm tracking-tight text-[#0B3D2E]">FormFlow</span>
        </div>

        {/* Desktop Collapse Toggle (when collapsed) */}
        {isSidebarCollapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden md:block p-2 rounded-xl text-[#0B3D2E] hover:bg-[#F0E8D8] transition-colors"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <PanelLeft size={18} />
          </button>
        )}
      </div>

      {/* Center: Clean Linear Pill Search Bar (Responsive) */}
      <div className={`flex-1 max-w-xl mx-2 sm:mx-4 ${isMobileSearchActive ? 'fixed inset-x-3 top-2.5 z-40 bg-white p-1 rounded-full shadow-lg md:relative md:inset-auto md:bg-transparent md:p-0 md:shadow-none' : 'hidden sm:block'}`}>
        <div className="relative flex items-center">
          <Search size={15} className="absolute left-3.5 text-[#77776E] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search applications, documents..."
            className="w-full pl-9 pr-10 sm:pr-12 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#F5EDE1]/80 hover:bg-[#F2E8DA] focus:bg-white text-[#202720] placeholder-[#77776E] rounded-full border border-[#E8DFC8] focus:border-[#087F5B] focus:ring-2 focus:ring-[#BDE9D4]/50 focus:outline-hidden transition-all shadow-2xs"
          />
          {/* Desktop ⌘ K Badge */}
          <div className="hidden sm:flex absolute right-3 items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[#77776E] bg-white/70 rounded-md border border-[#E8DFC8]">
            <Command size={10} />
            <span>K</span>
          </div>

          {/* Mobile search close button */}
          {isMobileSearchActive && (
            <button
              onClick={() => setIsMobileSearchActive(false)}
              className="sm:hidden absolute right-2.5 p-1 text-[#77776E] hover:text-[#202720]"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Search Trigger (Mobile), Theme Toggle, Notifications, Profile Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Mobile Search Open Trigger */}
        <button
          onClick={() => setIsMobileSearchActive(true)}
          className="sm:hidden p-2 rounded-full text-[#202720]/80 hover:text-[#0B3D2E] hover:bg-[#F0E8D8] transition-colors"
          title="Search"
          aria-label="Open search"
        >
          <Search size={18} />
        </button>

        {/* Theme Toggle (Sun/Moon icon) */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-1.5 sm:p-2 rounded-full text-[#202720]/80 hover:text-[#0B3D2E] hover:bg-[#F0E8D8] transition-colors"
          title={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
        >
          {isDarkMode ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        {/* Notification Bell with alert dot */}
        <div className="relative">
          <button
            className="p-1.5 sm:p-2 rounded-full text-[#202720]/80 hover:text-[#0B3D2E] hover:bg-[#F0E8D8] transition-colors"
            title="Notifications"
          >
            <Bell size={17} />
          </button>
          {hasNotifications && (
            <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 w-2 h-2 rounded-full bg-[#E99A89] ring-2 ring-[#FAF6EF]" />
          )}
        </div>

        {/* User Profile Avatar */}
        <button
          onClick={openSettings}
          className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-[#E8DFC8] hover:ring-2 hover:ring-[#087F5B] transition-all bg-[#E2F5ED] shrink-0 active:scale-95 ml-0.5"
          title="Account Profile"
        >
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" 
            alt="Ananya Sharma" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="font-semibold text-[11px] sm:text-xs text-[#064E3B]">AS</span>
        </button>
      </div>
    </header>
  );
};
