import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  ExternalLink, 
  FileText, 
  HardDrive, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ChatMessage, DriveDocument } from '../../types';
import { useFormFlow } from '../../contexts/FormFlowContext';
import { MCPIcon } from '../common/MCPIcon';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const { 
    documents, 
    openDocPreview, 
    applications, 
    openApprovalModal,
    updateOpportunityStatus 
  } = useFormFlow();
  const [showMcpDetails, setShowMcpDetails] = useState(false);

  const isUser = message.sender === 'user';

  const findDocByName = (name: string): DriveDocument | undefined => {
    return documents.find(d => d.name === name || d.name.toLowerCase().includes(name.toLowerCase()));
  };

  return (
    <div className={`py-4 px-4 sm:px-6 w-full ${isUser ? '' : ''}`}>
      <div className="max-w-3xl mx-auto flex gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center text-xs font-semibold shadow-xs">
              DK
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-sky-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles size={16} />
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0 space-y-3.5">
          {/* Header info */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-900">
              {isUser ? 'You' : 'FormFlow Assistant'}
            </span>
            <span className="text-[11px] text-zinc-400">{message.timestamp}</span>
          </div>

          {/* MCP Execution Steps Disclosure (if present) */}
          {message.mcpSteps && message.mcpSteps.length > 0 && (
            <div className="border border-zinc-200/80 rounded-xl bg-zinc-50/70 overflow-hidden text-xs">
              <button
                onClick={() => setShowMcpDetails(prev => !prev)}
                className="w-full px-3 py-2 flex items-center justify-between text-zinc-600 hover:bg-zinc-100/70 transition-colors font-medium"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Executed {message.mcpSteps.length} MCP Tools</span>
                  <span className="text-zinc-400 font-normal">
                    ({message.mcpSteps.map(s => s.server.replace(' MCP', '')).join(', ')})
                  </span>
                </div>
                {showMcpDetails ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {showMcpDetails && (
                <div className="p-3 border-t border-zinc-200/60 space-y-2 bg-white">
                  {message.mcpSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-700">
                      <div className="p-1 rounded bg-zinc-100 mt-0.5">
                        <MCPIcon server={step.server} size={13} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-800">{step.server}</span>
                          <span className="font-mono text-[11px] text-zinc-500">
                            → {step.toolName}()
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-600 mt-0.5">{step.outputSnippet}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Main Text Content */}
          <div className="chat-markdown">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>

          {/* Sources Cited Pills (Drive-First Transparency) */}
          {message.sourcesCited && message.sourcesCited.length > 0 && (
            <div className="pt-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                Sources Cited From Your Google Drive:
              </span>
              <div className="flex flex-wrap gap-2">
                {message.sourcesCited.map((source, idx) => {
                  const doc = findDocByName(source.docName);
                  return (
                    <button
                      key={idx}
                      onClick={() => doc && openDocPreview(doc)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 text-xs transition-colors border border-zinc-200/70 text-left"
                      title={source.snippet}
                    >
                      <HardDrive size={12} className="text-brand-600 shrink-0" />
                      <span className="truncate max-w-[200px] font-medium">{source.docName}</span>
                      <ExternalLink size={10} className="text-zinc-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Inline Readiness Score Card (Feature 6) */}
          {message.readinessCard && (
            <div className="border border-zinc-200 rounded-2xl p-4.5 bg-gradient-to-br from-white to-zinc-50 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-zinc-500">Readiness Assessment</span>
                  <h4 className="text-sm font-semibold text-zinc-900">
                    {message.readinessCard.applicationTitle}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-emerald-600">
                    {message.readinessCard.score}%
                  </span>
                  <span className="text-[10px] text-zinc-400 block -mt-1">Readiness Score</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${message.readinessCard.score}%` }} 
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <span className="font-semibold text-emerald-700 block text-sm">
                    {message.readinessCard.matched}
                  </span>
                  <span className="text-[11px] text-emerald-800">Verified Matched</span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100">
                  <span className="font-semibold text-amber-700 block text-sm">
                    {message.readinessCard.issues}
                  </span>
                  <span className="text-[11px] text-amber-800">Discrepancy Note</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-100 border border-zinc-200">
                  <span className="font-semibold text-zinc-700 block text-sm">
                    {message.readinessCard.missing}
                  </span>
                  <span className="text-[11px] text-zinc-600">Missing Files</span>
                </div>
              </div>
            </div>
          )}

          {/* Inline Human Approval Card (Feature 9) */}
          {message.approvalCard && (
            <div className="border-2 border-emerald-500/30 bg-emerald-50/40 rounded-2xl p-4.5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-700 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-950">
                      Approval & Audit Checkpoint Ready
                    </h4>
                    <p className="text-xs text-emerald-800">
                      {message.approvalCard.fieldsCount} source-backed fields are pre-filled and waiting for your review.
                    </p>
                  </div>
                </div>
                <Badge variant={message.approvalCard.status === 'approved' ? 'success' : 'warning'}>
                  {message.approvalCard.status === 'approved' ? 'Approved' : 'Pending Approval'}
                </Badge>
              </div>

              <div className="pt-1 flex flex-wrap gap-2.5">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<ShieldCheck size={14} />}
                  onClick={() => {
                    const targetApp = applications.find(a => a.id === message.approvalCard?.applicationId);
                    if (targetApp) openApprovalModal(targetApp);
                  }}
                >
                  Review & Authorize Submission
                </Button>
              </div>
            </div>
          )}

          {/* Inline Opportunity Recommendations (Feature 12) */}
          {message.recommendations && message.recommendations.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Recommended Opportunities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {message.recommendations.slice(0, 2).map((opp) => (
                  <div 
                    key={opp.id} 
                    className="border border-zinc-200 bg-white p-3.5 rounded-2xl shadow-2xs space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="purple" size="sm">{opp.matchScore}% Match</Badge>
                        <span className="text-[11px] text-zinc-400 font-mono">Due {opp.deadline}</span>
                      </div>
                      <h5 className="font-semibold text-zinc-900 text-xs mt-1.5 leading-snug">
                        {opp.title}
                      </h5>
                      <p className="text-xs font-medium text-emerald-700 mt-1">{opp.awardAmount}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs border-t border-zinc-100">
                      <a
                        href={opp.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-600 hover:underline flex items-center gap-1 font-medium text-xs"
                      >
                        Official Portal <ExternalLink size={11} />
                      </a>
                      <button
                        onClick={() => updateOpportunityStatus(opp.id, 'saved')}
                        className="text-zinc-500 hover:text-zinc-900 text-xs font-medium"
                      >
                        {opp.status === 'saved' ? 'Saved ✓' : 'Save'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
