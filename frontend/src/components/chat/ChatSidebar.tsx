import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  LayoutDashboard, 
  Bot, 
  FileText, 
  FolderSync, 
  Sparkles, 
  Calendar, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  HardDrive 
} from 'lucide-react';
import { useFormFlow } from '../../contexts/FormFlowContext';
import { ConversationHistory } from './ConversationHistory';
import { Badge } from '../common/Badge';

interface ChatSidebarProps {
  onOpenSettings?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ onOpenSettings }) => {
  const { 
    user, 
    isSidebarCollapsed, 
    toggleSidebar, 
    toggleDriveConnection,
    conversations,
    activeConversationId,
    selectConversation,
    createNewConversation,
    deleteConversation,
    renameConversation
  } = useFormFlow();

  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Assistant', path: '/', icon: Bot },
    { name: 'My Applications', path: '/applications', icon: FileText },
    { name: 'My Documents', path: '/documents', icon: FolderSync },
    { name: 'Opportunities', path: '/opportunities', icon: Sparkles },
    { name: 'Reminders', path: '/reminders', icon: Calendar },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleNewChat = async () => {
    navigate('/');
    await createNewConversation();
  };

  return (
    <aside
      className={`relative h-screen flex flex-col bg-[#f9f9f9] border-r border-zinc-200/80 transition-all duration-300 select-none z-30 shrink-0 ${
        isSidebarCollapsed ? 'w-[68px]' : 'w-[270px]'
      }`}
    >
      {/* Top Branding & New Chat */}
      <div className="p-3.5 pb-2 border-b border-zinc-200/60">
        <div className="flex items-center justify-between mb-3 px-1">
          {!isSidebarCollapsed && (
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-sky-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <span className="font-bold text-sm tracking-tighter">FF</span>
              </div>
              <div>
                <span className="font-semibold text-zinc-900 text-sm tracking-tight block">FormFlow</span>
                <span className="text-[10px] text-zinc-500 block -mt-0.5">Intelligent Application AI</span>
              </div>
            </div>
          )}

          {isSidebarCollapsed && (
            <div 
              onClick={() => navigate('/')}
              className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-brand-700 to-sky-500 flex items-center justify-center text-white cursor-pointer shadow-xs"
              title="FormFlow Home"
            >
              <span className="font-bold text-sm">FF</span>
            </div>
          )}

          <button
            type="button"
            onClick={toggleSidebar}
            className={`text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 p-1.5 rounded-lg transition-colors ${
              isSidebarCollapsed ? 'hidden' : 'block'
            }`}
            title="Collapse sidebar"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* New Chat Button (ChatGPT style) */}
        <button
          type="button"
          onClick={handleNewChat}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-zinc-200/90 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-zinc-800 text-sm font-medium shadow-xs transition-all duration-150 active:scale-[0.99] ${
            isSidebarCollapsed ? 'justify-center p-2.5' : ''
          }`}
          title="New Chat"
        >
          <Plus size={16} className="text-zinc-700 shrink-0" />
          {!isSidebarCollapsed && <span>New Chat</span>}
        </button>

        {/* Search Conversations Input */}
        {!isSidebarCollapsed && (
          <div className="relative mt-2.5">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-zinc-100/80 hover:bg-zinc-100 focus:bg-white border border-transparent focus:border-zinc-300 rounded-lg focus:outline-none transition-colors text-zinc-800 placeholder:text-zinc-400"
            />
          </div>
        )}
      </div>

      {/* Main Navigation & Conversation History */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
        {/* Workspace Links */}
        <div className="space-y-0.5">
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-2.5 mb-1">
            {!isSidebarCollapsed ? 'Navigation' : ''}
          </div>
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-200/85 text-zinc-900 font-semibold'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`
              }
              title={item.name}
            >
              <item.icon size={15} className="shrink-0" />
              {!isSidebarCollapsed && (
                <span className="truncate flex-1 text-left">{item.name}</span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Recent Conversation History (ChatGPT Style) */}
        <div>
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-2.5 mb-1.5">
            {!isSidebarCollapsed ? 'Recent Chats' : ''}
          </div>
          <ConversationHistory
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={(id) => {
              navigate('/');
              selectConversation(id);
            }}
            onDeleteConversation={deleteConversation}
            onRenameConversation={renameConversation}
            searchQuery={searchQuery}
            isCollapsed={isSidebarCollapsed}
          />
        </div>
      </div>

      {/* Google Drive Status Section */}
      <div className="p-3 border-t border-zinc-200/70 bg-white/70">
        {!isSidebarCollapsed ? (
          <div className="rounded-xl border border-zinc-200/80 p-2.5 bg-white shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800">
                <HardDrive size={13} className="text-brand-600" />
                <span>Google Drive</span>
              </div>
              <Badge variant={user.isDriveConnected ? 'success' : 'error'} size="sm" dot>
                {user.isDriveConnected ? 'Authorized' : 'Disconnected'}
              </Badge>
            </div>

            <p className="text-[11px] text-zinc-500 truncate">
              {user.isDriveConnected ? user.driveAccountEmail : 'Drive access revoked'}
            </p>

            <div className="pt-1 flex items-center justify-between text-[11px]">
              <span className="text-zinc-500">{user.connectedFoldersCount} authorized folders</span>
              <button
                type="button"
                onClick={toggleDriveConnection}
                className="text-brand-600 hover:text-brand-700 font-medium hover:underline text-[11px]"
              >
                {user.isDriveConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={toggleDriveConnection}
            className="w-9 h-9 mx-auto rounded-xl flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-700 cursor-pointer"
            title={`Google Drive: ${user.isDriveConnected ? 'Connected' : 'Disconnected'}`}
          >
            <HardDrive size={16} className={user.isDriveConnected ? 'text-emerald-600' : 'text-zinc-400'} />
          </div>
        )}

        {/* User Profile Bar at bottom */}
        <div className={`mt-2.5 flex items-center gap-2.5 px-1 ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center text-xs font-semibold shrink-0">
            DK
          </div>
          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-900 truncate">{user.name}</p>
              <p className="text-[11px] text-zinc-500 truncate">Engineering · 2nd Year</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating expand button when collapsed */}
      {isSidebarCollapsed && (
        <button
          type="button"
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 bg-white border border-zinc-200 shadow-xs rounded-full p-1 text-zinc-500 hover:text-zinc-800 z-40"
          title="Expand sidebar"
        >
          <ChevronRight size={13} />
        </button>
      )}
    </aside>
  );
};
