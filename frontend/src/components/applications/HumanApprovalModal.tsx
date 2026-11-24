import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Lock, 
  ArrowRight,
  Info
} from 'lucide-react';
import { useFormFlow } from '../../contexts/FormFlowContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const HumanApprovalModal: React.FC = () => {
  const { 
    activeApprovalModal, 
    closeApprovalModal, 
    approveApplication,
    updatePreparedFieldValue 
  } = useFormFlow();

  const [hasAgreed, setHasAgreed] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState('');

  if (!activeApprovalModal) return null;

  const handleStartEdit = (fieldId: string, currentValue: string) => {
    setEditingFieldId(fieldId);
    setEditedValue(currentValue);
  };

  const handleSaveEdit = (fieldId: string) => {
    updatePreparedFieldValue(activeApprovalModal.id, fieldId, editedValue);
    setEditingFieldId(null);
  };

  const handleApprove = () => {
    approveApplication(activeApprovalModal.id);
  };

  return (
    <Modal
      isOpen={!!activeApprovalModal}
      onClose={closeApprovalModal}
      title="Human Approval & Verification Checkpoint"
      subtitle={`Application: ${activeApprovalModal.title}`}
      maxWidth="2xl"
      footer={
        <>
          <Button variant="ghost" onClick={closeApprovalModal}>
            Cancel & Return
          </Button>
          <Button
            variant="primary"
            disabled={!hasAgreed}
            leftIcon={<ShieldCheck size={16} />}
            onClick={handleApprove}
          >
            Authorize & Approve Field Mappings
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Safety Callout Box */}
        <div className="border border-emerald-200 bg-emerald-50/60 rounded-2xl p-4 text-xs text-emerald-900 flex items-start gap-3">
          <ShieldCheck size={20} className="text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-emerald-950 text-sm">
              User-Controlled Execution Boundary
            </h4>
            <p className="text-emerald-800 leading-relaxed">
              FormFlow’s <strong>Approval & Audit MCP</strong> pauses execution before any external portal interaction. You must review the source-backed values below. No data is submitted or shared without your explicit consent.
            </p>
          </div>
        </div>

        {/* Readiness Snapshot */}
        <div className="flex items-center justify-between p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl">
          <div>
            <span className="text-xs text-zinc-500 block">Calculated Readiness Score</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-bold text-zinc-900">{activeApprovalModal.readinessScore}%</span>
              <Badge variant={activeApprovalModal.readinessScore >= 80 ? 'success' : 'warning'} size="sm">
                {activeApprovalModal.readinessScore >= 80 ? 'Optimal Readiness' : 'Review Required'}
              </Badge>
            </div>
          </div>
          <div className="text-right text-xs text-zinc-500">
            <span>Target Portal:</span>
            <a
              href={activeApprovalModal.portalUrl}
              target="_blank"
              rel="noreferrer"
              className="text-brand-600 hover:underline flex items-center gap-1 justify-end font-medium"
            >
              Portal Link <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Mapped Fields Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Source-Backed Mapped Fields ({activeApprovalModal.preparedFields.length})
            </h4>
            <span className="text-[11px] text-zinc-400">Click any field to edit before approval</span>
          </div>

          <div className="border border-zinc-200 rounded-xl divide-y divide-zinc-100 overflow-hidden text-xs">
            {activeApprovalModal.preparedFields.map((field) => (
              <div key={field.id} className="p-3 hover:bg-zinc-50/80 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-zinc-800">{field.fieldName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-zinc-100 text-zinc-500 rounded">
                        {field.section}
                      </span>
                      {field.status === 'warning' && (
                        <Badge variant="warning" size="sm">Discrepancy Note</Badge>
                      )}
                    </div>

                    {editingFieldId === field.id ? (
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                          className="px-2.5 py-1 text-xs border border-brand-500 rounded-lg focus:outline-none w-full"
                          autoFocus
                        />
                        <Button size="sm" variant="primary" onClick={() => handleSaveEdit(field.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingFieldId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => handleStartEdit(field.id, field.mappedValue)}
                        className="mt-1 font-semibold text-zinc-900 font-mono cursor-pointer hover:text-brand-600 flex items-center gap-1.5"
                        title="Click to override value"
                      >
                        <span>{field.mappedValue}</span>
                        <span className="text-[10px] text-zinc-400 font-sans font-normal">(Edit)</span>
                      </div>
                    )}

                    {field.discrepancyWarning && (
                      <p className="mt-1 text-[11px] text-amber-700 bg-amber-50 p-1.5 rounded-md border border-amber-200/60">
                        ⚠️ {field.discrepancyWarning}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-zinc-400 block">Source Document:</span>
                    <span className="text-[11px] text-zinc-700 font-medium truncate max-w-[150px] block" title={field.sourceDocument}>
                      {field.sourceDocument}
                    </span>
                    <span className="text-[10px] text-emerald-600 block">
                      {Math.round(field.confidence * 100)}% verified
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Agreement Checkbox */}
        <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl">
          <label className="flex items-start gap-2.5 text-xs text-zinc-700 cursor-pointer">
            <input
              type="checkbox"
              checked={hasAgreed}
              onChange={(e) => setHasAgreed(e.target.checked)}
              className="mt-0.5 rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer"
            />
            <span>
              I confirm that I have reviewed the mapped information extracted from my Google Drive documents and authorize FormFlow to proceed with assisted portal preparation.
            </span>
          </label>
        </div>
      </div>
    </Modal>
  );
};
