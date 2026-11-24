import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Clock, 
  ShieldCheck, 
  ChevronDown, 
  ChevronRight,
  Sparkles,
  Search,
  FileCheck,
  FileText,
  Lock
} from 'lucide-react';

export interface ToolStatusStep {
  id: string;
  label: string;
  desc: string;
  status: 'pending' | 'in_progress' | 'completed' | 'waiting';
}

const DEFAULT_STAGES: ToolStatusStep[] = [
  { id: '1', label: 'Understanding request.', desc: 'Parsing intent and query constraints', status: 'completed' },
  { id: '2', label: 'Inspecting application.', desc: 'Connecting to portal DOM schema & active viewport', status: 'completed' },
  { id: '3', label: 'Checking documents.', desc: 'Auditing records in authorized Google Drive', status: 'completed' },
  { id: '4', label: 'Preparing form fields.', desc: 'Mapping citations and confidence scores', status: 'completed' },
  { id: '5', label: 'Waiting for approval.', desc: 'Safety gate active prior to submission', status: 'waiting' },
];

export const LiveToolStatusProgress: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStepIndex(1), 220);
    const timer2 = setTimeout(() => setCurrentStepIndex(2), 480);
    const timer3 = setTimeout(() => setCurrentStepIndex(3), 750);
    const timer4 = setTimeout(() => setCurrentStepIndex(4), 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const getStageIcon = (idx: number) => {
    switch (idx) {
      case 0: return <Sparkles size={13} />;
      case 1: return <Search size={13} />;
      case 2: return <FileText size={13} />;
      case 3: return <FileCheck size={13} />;
      case 4: return <Lock size={13} />;
      default: return <Clock size={13} />;
    }
  };

  return (
    <div className="w-full max-w-xl p-3.5 bg-gradient-to-br from-zinc-50 to-white rounded-2xl border border-zinc-200/90 shadow-2xs space-y-2.5 animate-fade-in text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
          <span className="font-semibold text-zinc-900">FormFlow AI Tool Execution</span>
        </div>
        <span className="text-[11px] text-zinc-400 font-mono">Stage {currentStepIndex + 1} of 5</span>
      </div>

      <div className="space-y-1.5">
        {DEFAULT_STAGES.map((stage, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isPending = idx > currentStepIndex;

          return (
            <div 
              key={stage.id} 
              className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                isCurrent 
                  ? 'bg-brand-50/70 border border-brand-200 text-brand-950 font-medium' 
                  : isDone
                  ? 'bg-zinc-50 text-zinc-700'
                  : 'text-zinc-400 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1 rounded-lg ${
                  isCurrent ? 'bg-brand-100 text-brand-700' : isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-400'
                }`}>
                  {getStageIcon(idx)}
                </div>
                <div>
                  <span className="font-semibold block">{stage.label}</span>
                  <span className="text-[10px] text-zinc-500">{stage.desc}</span>
                </div>
              </div>

              <div className="shrink-0">
                {isCurrent && <Loader2 size={13} className="animate-spin text-brand-600" />}
                {isDone && <CheckCircle2 size={13} className="text-emerald-600" />}
                {isPending && <Clock size={12} className="text-zinc-300" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const StaticToolStatusTracker: React.FC<{
  stages?: ToolStatusStep[];
}> = ({ stages = DEFAULT_STAGES }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-zinc-200/90 rounded-xl bg-zinc-50/80 overflow-hidden text-xs">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full px-3 py-2 flex items-center justify-between text-zinc-700 hover:bg-zinc-100/70 transition-colors font-medium text-left"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="font-semibold text-zinc-900">AI Tool-Status Pipeline Completed</span>
          <span className="text-zinc-400 text-[11px] hidden sm:inline">
            (Understanding request → Inspecting application → Checking documents → Preparing form fields → Waiting for approval)
          </span>
        </div>
        {isOpen ? <ChevronDown size={14} className="text-zinc-400" /> : <ChevronRight size={14} className="text-zinc-400" />}
      </button>

      {isOpen && (
        <div className="p-3 border-t border-zinc-200/70 space-y-2 bg-white animate-fade-in">
          {stages.map((stage, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs text-zinc-700 py-0.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span className="font-semibold text-zinc-900">{stage.label}</span>
                <span className="text-zinc-400 text-[11px]">— {stage.desc}</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">Stage {idx + 1}/5</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
