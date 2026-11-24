import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Folder, 
  Globe, 
  Clock, 
  Sliders, 
  Settings, 
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react';
import { useFormFlow } from '../../contexts/FormFlowContext';
import { Logo } from '../common/Logo';

export const Sidebar: React.FC = () => {
  const { 
    user, 
    isSidebarCollapsed, 
    toggleSidebar, 
    isMobileMenuOpen,
    closeMobileMenu,
    openDriveModal,
    openSettings,
    applications 
  } = useFormFlow();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/', icon: Home },
    { name: 'Applications', path: '/applications', icon: FileText, count: applications.length },
    { name: 'Documents', path: '/documents', icon: Folder },
    { name: 'Browser Workspace', path: '/workspace', icon: Globe },
    { name: 'Reminders', path: '/reminders', icon: Clock },
    { name: 'Activity History', path: '/audit', icon: Sliders },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    closeMobileMenu();
  };

  return (
    <aside
      className={`fixed md:relative inset-y-0 left-0 h-screen flex flex-col bg-[#0B3D2E] text-white transition-all duration-300 select-none z-50 shrink-0 border-r border-[#083427] shadow-xl ${
        isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
      } ${
        isSidebarCollapsed ? 'md:w-[72px]' : 'md:w-[250px]'
      } w-[280px] max-w-[85vw]`}
    >
      {/* Background Subtle Wave Lines Graphic (matching mockup) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
        <svg
          viewBox="0 0 250 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-16 -left-12 w-[320px] h-[340px]"
        >
          <path
            d="M-20 280 C60 210, 140 320, 260 250"
            stroke="#BDE9D4"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M-20 300 C70 230, 150 340, 270 270"
            stroke="#65BFAF"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M-20 320 C80 250, 160 360, 280 290"
            stroke="#BDE9D4"
            strokeWidth="0.8"
            fill="none"
          />
          <path
            d="M-20 340 C90 270, 170 380, 290 310"
            stroke="#65BFAF"
            strokeWidth="0.6"
            fill="none"
          />
        </svg>
      </div>

      {/* Top Branding & Close Button */}
      <div className="p-4 pt-5 pb-3 flex items-center justify-between border-b border-[#083829]/60 relative z-10">
        <div 
          onClick={() => handleNavClick('/')} 
          className="cursor-pointer group flex items-center"
        >
          <Logo variant="on-dark" size="md" />
        </div>

        <div className="flex items-center gap-1">
          {/* Mobile close button */}
          <button
            onClick={closeMobileMenu}
            className="md:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Close menu"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={toggleSidebar}
            className={`hidden md:block text-white/60 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors ${
              isSidebarCollapsed ? 'hidden' : 'block'
            }`}
            title="Collapse sidebar"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 relative z-10">
        {navItems.map((item) => {
          const isActive = 
            item.path === '/' 
              ? location.pathname === '/' || location.pathname === '/dashboard'
              : location.pathname.startsWith(item.path);

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => handleNavClick(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#0E523E] text-white shadow-xs font-semibold'
                  : 'text-white/70 hover:bg-white/8 hover:text-white'
              } ${isSidebarCollapsed ? 'md:justify-center md:px-0' : ''}`}
              title={item.name}
            >
              <item.icon 
                size={18} 
                className={`shrink-0 ${isActive ? 'text-[#BDE9D4]' : 'text-white/70'}`} 
              />
              <span className={`truncate flex-1 tracking-tight text-left ${isSidebarCollapsed ? 'md:hidden' : 'block'}`}>
                {item.name}
              </span>
              {item.count !== undefined && (
                <span className={`px-1.5 py-0.5 text-[10px] bg-white/15 text-white/90 rounded-full font-mono ${isSidebarCollapsed ? 'md:hidden' : 'inline-block'}`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Area: Google Drive Card + Profile Card */}
      <div className="p-3 space-y-3 relative z-10 border-t border-[#083829]/60 bg-[#072F23]/80">
        {/* Connected Google Drive Widget */}
        <div className={`p-3 rounded-2xl bg-[#05291E]/90 border border-[#165641]/60 hover:border-[#1F7A5D] transition-colors shadow-xs ${isSidebarCollapsed ? 'md:hidden' : 'block'}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 p-1.5">
              <svg viewBox="0 0 87.3 78" className="w-full h-full">
                <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5l5.4 9.35z" fill="#0066da"/>
                <path d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44C.4 49.9 0 51.45 0 53h27.5l16.15-28z" fill="#00ac47"/>
                <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15 7.9 13.65z" fill="#ea4335"/>
                <path d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.4-4.5 1.2l13.75 23.8z" fill="#00832d"/>
                <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.4 4.5-1.2L59.8 53z" fill="#2684fc"/>
                <path d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 59.8 53h27.5c0-1.55-.4-3.1-1.2-4.5l-12.7-22z" fill="#ffba00"/>
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-[#BDE9D4] font-medium leading-none">
                {user.isDriveConnected ? 'Connected' : 'Connect'}
              </div>
              <div className="text-xs font-semibold text-white tracking-tight truncate mt-0.5">
                Google Drive
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => {
                openDriveModal();
                closeMobileMenu();
              }}
              className="text-white/80 hover:text-[#BDE9D4] font-medium flex items-center gap-1 transition-colors"
            >
              Manage <span className="text-xs">→</span>
            </button>
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" title="Drive sync active" />
          </div>
        </div>

        {/* User Profile Bar */}
        <div 
          onClick={() => {
            openSettings();
            closeMobileMenu();
          }}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/8 cursor-pointer transition-colors"
          title="Account Settings"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 shrink-0 bg-[#E2F5ED] flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" 
              alt="Ananya Sharma" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="font-semibold text-xs text-[#064E3B]">AS</span>
          </div>

          <div className={`flex-1 min-w-0 ${isSidebarCollapsed ? 'md:hidden' : 'block'}`}>
            <p className="text-xs font-semibold text-white tracking-tight truncate">
              Ananya Sharma
            </p>
            <p className="text-[11px] text-white/60 truncate">
              ananya@gmail.com
            </p>
          </div>
          <ChevronRight size={14} className={`text-white/40 shrink-0 ${isSidebarCollapsed ? 'md:hidden' : 'block'}`} />
        </div>
      </div>
    </aside>
  );
};
