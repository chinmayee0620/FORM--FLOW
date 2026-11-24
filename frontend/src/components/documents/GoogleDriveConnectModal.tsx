import React, { useState, useEffect } from 'react';
import { 
  HardDrive, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  AlertCircle, 
  Trash2, 
  Lock, 
  Eye, 
  RefreshCw,
  X
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { 
  startGoogleDriveOAuth, 
  disconnectGoogleDrive, 
  revokeGoogleDriveAccess,
  fetchGoogleDriveStatus,
  GoogleDriveStatus 
} from '../../services/backendApi';

interface GoogleDriveConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (status: GoogleDriveStatus) => void;
}

export const GoogleDriveConnectModal: React.FC<GoogleDriveConnectModalProps> = ({
  isOpen,
  onClose,
  onStatusChange,
}) => {
  const [status, setStatus] = useState<GoogleDriveStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [authInProgress, setAuthInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);

  const loadStatus = async () => {
    setLoading(true);
    const data = await fetchGoogleDriveStatus();
    if (data) {
      setStatus(data);
      if (onStatusChange) onStatusChange(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  // Listen for popup OAuth postMessage
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'GOOGLE_DRIVE_OAUTH_RESULT') {
        setAuthInProgress(false);
        if (event.data.success) {
          loadStatus();
        } else {
          setError(event.data.error || 'Google authentication was not completed.');
        }
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

  if (!isOpen) return null;

  const handleStartOAuth = async () => {
    setError(null);
    setInfoNotice(null);
    setAuthInProgress(true);

    const res = await startGoogleDriveOAuth();
    if (!res || !res.auth_url) {
      setError('Unable to initiate Google OAuth flow. Please ensure backend is running.');
      setAuthInProgress(false);
      return;
    }

    if (!res.is_configured) {
      setInfoNotice('Google Cloud credentials not yet set in backend/.env. Running interactive dev mode with sample authorized account.');
    }

    // Open actual Google OAuth window popup
    const width = 540;
    const height = 660;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      res.auth_url,
      'Google Drive Authorization',
      `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`
    );

    // Fallback polling if popup blocked or closed
    const timer = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(timer);
        setAuthInProgress(false);
        loadStatus();
      }
    }, 1000);
  };

  const handleDisconnect = async () => {
    setLoading(true);
    await disconnectGoogleDrive();
    await loadStatus();
    setLoading(false);
  };

  const handleRevoke = async () => {
    if (!window.confirm('Are you sure you want to revoke Google Drive access? Stored tokens will be permanently deleted and Google will revoke this app.')) {
      return;
    }
    setLoading(true);
    await revokeGoogleDriveAccess();
    await loadStatus();
    setLoading(false);
  };

  const isConnected = status?.is_connected;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-zinc-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-blue-600 flex items-center justify-center text-white shadow-xs">
              <HardDrive size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 text-sm">Google Drive Connection</h3>
              <p className="text-xs text-zinc-500">Official OAuth 2.0 Integration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {infoNotice && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{infoNotice}</span>
            </div>
          )}

          {isConnected ? (
            /* Connected View */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-900">Connected to Google Drive</span>
                  </div>
                  <p className="text-xs text-emerald-700 font-mono">
                    {status?.google_account_email}
                  </p>
                </div>
                <Badge variant="success" size="sm" dot>Active</Badge>
              </div>

              {/* Security & Scopes Details */}
              <div className="bg-zinc-50 rounded-xl p-3.5 border border-zinc-200/80 space-y-2 text-xs">
                <div className="flex justify-between items-center text-zinc-600">
                  <span>Authorized Scope:</span>
                  <code className="font-mono bg-zinc-200/60 px-1.5 py-0.5 rounded text-[11px] text-zinc-800">
                    drive.readonly
                  </code>
                </div>
                <div className="flex justify-between items-center text-zinc-600">
                  <span>Token Security:</span>
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck size={13} /> Encrypted at rest (AES-256)
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-600">
                  <span>Privacy Mode:</span>
                  <span className="text-zinc-800 font-medium">On-Demand Only (Zero Auto-Sync)</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  disabled={loading}
                >
                  Disconnect
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleRevoke}
                  disabled={loading}
                  className="flex items-center gap-1.5"
                >
                  <Trash2 size={14} />
                  <span>Revoke Access</span>
                </Button>
              </div>
            </div>
          ) : (
            /* Disconnected / Before Connection View */
            <div className="space-y-4">
              {/* Mandatory Privacy Guarantee Banner */}
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-zinc-900 font-semibold">
                  <Lock size={15} className="text-brand-600" />
                  <span>Privacy-First Drive Architecture</span>
                </div>
                <p className="text-zinc-600 leading-relaxed">
                  Connecting Google Drive lets FormFlow search for relevant marks cards or certificates 
                  <strong> only when you ask</strong>.
                </p>
                <div className="space-y-1.5 pt-1 text-[11px] text-zinc-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span><strong>No automatic scanning</strong> or indexing of your Drive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span><strong>No permanent copies</strong> or document databases created</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span><strong>Zero document text</strong> stored in application logs</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2 font-medium"
                  onClick={handleStartOAuth}
                  disabled={authInProgress || loading}
                >
                  {authInProgress ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Waiting for Google Authorization...</span>
                    </>
                  ) : (
                    <>
                      <HardDrive size={16} />
                      <span>Connect Google Drive</span>
                      <ExternalLink size={14} className="opacity-70" />
                    </>
                  )}
                </Button>
                <p className="text-center text-[11px] text-zinc-400 mt-2">
                  Opens Google's official OAuth consent popup. You can disconnect or revoke access at any time.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
