import React from 'react';
import { 
  FileText, 
  Calendar, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  HardDrive, 
  ShieldCheck, 
  Info 
} from 'lucide-react';
import { useFormFlow } from '../../contexts/FormFlowContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const DocumentPreviewModal: React.FC = () => {
  const { activeDocPreview, closeDocPreview } = useFormFlow();

  if (!activeDocPreview) return null;

  return (
    <Modal
      isOpen={!!activeDocPreview}
      onClose={closeDocPreview}
      title={activeDocPreview.name}
      subtitle={`Source: Google Drive > ${activeDocPreview.folderPath}`}
      maxWidth="2xl"
      footer={
        <>
          <Button variant="ghost" onClick={closeDocPreview}>
            Close
          </Button>
          <Button
            variant="outline"
            leftIcon={<ExternalLink size={14} />}
            onClick={() => window.open('#drive', '_blank')}
          >
            Open in Google Drive
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Document Metadata Strip */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 bg-zinc-50 p-3 rounded-xl border border-zinc-200/80">
          <div className="flex items-center gap-1.5">
            <HardDrive size={13} className="text-brand-600" />
            <span>Format: {activeDocPreview.fileType.toUpperCase()}</span>
          </div>
          <span>•</span>
          <div>Size: {activeDocPreview.size}</div>
          <span>•</span>
          <div>Modified: {activeDocPreview.modifiedDate}</div>
          <span>•</span>
          <Badge variant="success" size="sm" dot>
            Document MCP Indexed
          </Badge>
        </div>

        {/* OCR / Content Excerpt */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
            Document Content Excerpt (Retrieved via Document MCP)
          </h4>
          <div className="bg-zinc-900 text-zinc-200 p-3.5 rounded-xl font-mono text-xs leading-relaxed border border-zinc-800">
            {activeDocPreview.previewSnippet || activeDocPreview.contentSummary}
          </div>
        </div>

        {/* Extracted Structured Fields */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2.5">
            Extracted Key Fields & Confidence
          </h4>
          <div className="border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-100">
            {activeDocPreview.extractedFields.map((field) => (
              <div key={field.key} className="p-3 flex items-center justify-between text-xs hover:bg-zinc-50 transition-colors">
                <div>
                  <span className="font-medium text-zinc-700 block">{field.label}</span>
                  <span className="text-[11px] text-zinc-400">Key: {field.key}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-zinc-900 block font-mono">{String(field.value)}</span>
                  <span className="text-[11px] text-emerald-600">
                    {Math.round(field.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Validity Intelligence (Feature 11) */}
        {activeDocPreview.validity && (
          <div className="border border-amber-200/80 bg-amber-50/50 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-amber-700" />
                <h5 className="text-xs font-semibold text-amber-900">
                  Document Renewal & Validity Intelligence
                </h5>
              </div>
              <Badge 
                variant={activeDocPreview.validity.status === 'due_soon' ? 'warning' : 'info'} 
                size="sm"
              >
                {activeDocPreview.validity.status === 'due_soon' ? 'Renewal Alert Active' : 'No Expiry Needed'}
              </Badge>
            </div>

            {activeDocPreview.validity.expiryDate && (
              <p className="text-xs text-amber-800">
                <strong>Expiry Date:</strong> {activeDocPreview.validity.expiryDate} ({activeDocPreview.validity.daysRemaining} days remaining)
              </p>
            )}

            {activeDocPreview.validity.note && (
              <p className="text-xs text-amber-900/80 flex items-start gap-1.5">
                <Info size={13} className="shrink-0 mt-0.5 text-amber-700" />
                <span>{activeDocPreview.validity.note}</span>
              </p>
            )}

            {activeDocPreview.validity.renewalGuidance && (
              <div className="mt-2 text-xs bg-white/80 p-2.5 rounded-lg border border-amber-200 text-amber-900">
                <span className="font-semibold block mb-0.5">Renewal Process Guidance:</span>
                {activeDocPreview.validity.renewalGuidance}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
