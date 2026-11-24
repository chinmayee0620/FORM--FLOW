import React from 'react';
import { 
  ShieldCheck, 
  HardDrive, 
  CheckCircle2, 
  FileText, 
  ExternalLink,
  Info,
  Clock,
  Lock
} from 'lucide-react';
import { useFormFlow } from '../contexts/FormFlowContext';

export const AuditPage: React.FC = () => {
  const { auditLogs } = useFormFlow();

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-5 sm:space-y-6 animate-fade-in bg-[#FAF6EF]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFC8]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#087F5B] uppercase tracking-wider mb-1">
            <span>✦</span>
            <span>Safety Gate & Privacy Logging</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#202720]">
            Activity History & Safety Trail
          </h1>
          <p className="text-xs sm:text-sm text-[#77776E] mt-1">
            Zero unauthorized submissions enforced. Complete transparent timeline of document searches, form fills, and user checkpoints.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF8F1] border border-[#BDE9D4] text-xs font-semibold text-[#064E3B]">
          <span className="w-2 h-2 rounded-full bg-[#087F5B] animate-pulse" />
          <span>Human Approval Gate Active</span>
        </div>
      </div>

      {/* Security Policies Overview (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-5 bg-white border border-[#E8DFC8] rounded-3xl shadow-editorial space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-[#0B3D2E]">
            <HardDrive size={16} className="text-[#087F5B]" />
            <span>Drive-First Architecture</span>
          </div>
          <p className="text-[#77776E] leading-relaxed">
            FormFlow reads authorized files directly via Google Drive OAuth. No duplicate documents or permanent text databases are created.
          </p>
        </div>

        <div className="p-5 bg-white border border-[#E8DFC8] rounded-3xl shadow-editorial space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-[#0B3D2E]">
            <ShieldCheck size={16} className="text-[#087F5B]" />
            <span>Human Approval Gate</span>
          </div>
          <p className="text-[#77776E] leading-relaxed">
            Form filling halts before any portal form entry until you review and explicitly authorize the exact mapped field values.
          </p>
        </div>

        <div className="p-5 bg-white border border-[#E8DFC8] rounded-3xl shadow-editorial space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-[#0B3D2E]">
            <Lock size={16} className="text-[#087F5B]" />
            <span>Ephemeral In-Memory Parsing</span>
          </div>
          <p className="text-[#77776E] leading-relaxed">
            When document files are inspected, contents are parsed in RAM and purged immediately upon question completion.
          </p>
        </div>
      </div>

      {/* Audit Log Timeline */}
      <div className="bg-white border border-[#E8DFC8] rounded-3xl p-6 shadow-editorial space-y-4">
        <h3 className="text-sm font-bold text-[#202720] uppercase tracking-wider">
          Recent Security & Tool Invocations
        </h3>

        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-[#FAF6EF]/70 border border-[#E8DFC8] hover:border-[#D6CAB2] transition-colors flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#E8DFC8] flex items-center justify-center shrink-0 mt-0.5 text-[#087F5B]">
                  <CheckCircle2 size={16} />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#202720]">{log.action}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E2F5ED] text-[#064E3B] font-mono">
                      {log.mcpServer}
                    </span>
                  </div>
                  <p className="text-xs text-[#77776E] leading-relaxed">{log.details}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono text-[#77776E] flex items-center gap-1 justify-end">
                  <Clock size={11} />
                  <span>{log.timestamp}</span>
                </span>
                <span className="text-[10px] text-[#087F5B] font-semibold block mt-0.5">
                  Verified Safe
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
