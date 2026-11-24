import React from 'react';
import { 
  FileSearch, 
  ScanLine, 
  CheckCheck, 
  Globe, 
  CalendarClock, 
  ShieldCheck, 
  Cpu 
} from 'lucide-react';
import { MCPServerName } from '../../types';

interface MCPIconProps {
  server: MCPServerName | string;
  size?: number;
  className?: string;
}

export const MCPIcon: React.FC<MCPIconProps> = ({ server, size = 15, className = '' }) => {
  switch (server) {
    case 'Document MCP':
      return <FileSearch size={size} className={`text-blue-600 ${className}`} />;
    case 'Form Analysis MCP':
      return <ScanLine size={size} className={`text-purple-600 ${className}`} />;
    case 'Verification MCP':
      return <CheckCheck size={size} className={`text-emerald-600 ${className}`} />;
    case 'Browser MCP':
      return <Globe size={size} className={`text-amber-600 ${className}`} />;
    case 'Calendar MCP':
      return <CalendarClock size={size} className={`text-rose-600 ${className}`} />;
    case 'Approval & Audit MCP':
      return <ShieldCheck size={size} className={`text-indigo-600 ${className}`} />;
    default:
      return <Cpu size={size} className={`text-zinc-600 ${className}`} />;
  }
};
