import React, { useState } from 'react';
import { 
  Settings, 
  HardDrive, 
  Cpu, 
  ShieldCheck, 
  Bell, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { useFormFlow } from '../../contexts/FormFlowContext';
import { Modal } from './Modal';
import { Badge } from './Badge';
import { Button } from './Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, toggleDriveConnection } = useFormFlow();
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'groq'>('gemini');
  const [humanApprovalStrict, setHumanApprovalStrict] = useState(true);
  const [renewalNotifications, setRenewalNotifications] = useState(true);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="FormFlow Settings & Integrations"
      subtitle="Manage Google Drive authorization, AI model selection, and safety policies"
      maxWidth="xl"
      footer={
        <Button variant="primary" onClick={onClose}>
          Save & Done
        </Button>
      }
    >
      <div className="space-y-6 text-xs text-zinc-700">
        {/* Google Drive Connection Section */}
        <div className="space-y-2.5">
          <h4 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <HardDrive size={14} className="text-brand-600" />
            <span>Google Drive Document Connection</span>
          </h4>

          <div className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-800">{user.driveAccountEmail}</span>
                <Badge variant={user.isDriveConnected ? 'success' : 'error'} size="sm" dot>
                  {user.isDriveConnected ? 'Authorized' : 'Disconnected'}
                </Badge>
              </div>
              <p className="text-[11px] text-zinc-500">
                Scope: drive.readonly · 3 Authorized Folders · 6 Files Indexed
              </p>
            </div>

            <Button
              variant={user.isDriveConnected ? 'outline' : 'primary'}
              size="sm"
              onClick={toggleDriveConnection}
            >
              {user.isDriveConnected ? 'Revoke Access' : 'Connect Account'}
            </Button>
          </div>
        </div>

        {/* AI Model Preferences (Gemini / Groq) */}
        <div className="space-y-2.5">
          <h4 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Cpu size={14} className="text-purple-600" />
            <span>AI Orchestration Engine (FastAPI Backend Ready)</span>
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedModel('gemini')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedModel === 'gemini'
                  ? 'border-brand-500 bg-brand-50/50 shadow-2xs'
                  : 'border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-900">Gemini 1.5 Flash</span>
                {selectedModel === 'gemini' && <Check size={14} className="text-brand-600" />}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Primary model for multimodal OCR and complex reasoning.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedModel('groq')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedModel === 'groq'
                  ? 'border-brand-500 bg-brand-50/50 shadow-2xs'
                  : 'border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-900">Groq Fallback</span>
                {selectedModel === 'groq' && <Check size={14} className="text-brand-600" />}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                High-speed fallback model for portal requirement parsing.
              </p>
            </button>
          </div>
        </div>

        {/* Safety & Human Approval Policies */}
        <div className="space-y-2.5">
          <h4 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Safety & Human Control Policies</span>
          </h4>

          <div className="space-y-2 border border-zinc-200 rounded-2xl p-3.5 bg-white">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={humanApprovalStrict}
                onChange={(e) => setHumanApprovalStrict(e.target.checked)}
                className="mt-0.5 rounded border-zinc-300 text-zinc-900 focus:ring-0"
              />
              <div>
                <span className="font-semibold text-zinc-900 block">
                  Enforce Explicit Human Approval Checkpoint
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  Halts Browser MCP before any external portal form entry until you review mapped values.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-zinc-100">
              <input
                type="checkbox"
                checked={renewalNotifications}
                onChange={(e) => setRenewalNotifications(e.target.checked)}
                className="mt-0.5 rounded border-zinc-300 text-zinc-900 focus:ring-0"
              />
              <div>
                <span className="font-semibold text-zinc-900 block">
                  Document Renewal Intelligence (90 / 30 / 7 Days)
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  Proactively alert for approaching certificate expiry dates (adheres to UIDAI guidelines).
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
};
