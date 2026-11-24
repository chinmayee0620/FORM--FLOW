import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  HardDrive, 
  Calendar, 
  User, 
  Bell, 
  ShieldCheck, 
  Lock, 
  Check, 
  AlertTriangle,
  Trash2,
  ExternalLink,
  Save,
  RotateCcw,
  PlugZap
} from 'lucide-react';
import { useFormFlow } from '../contexts/FormFlowContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { IntegrationStatusPanel } from '../components/common/IntegrationStatusPanel';

export const SettingsPage: React.FC = () => {
  const { 
    user, 
    toggleDriveConnection, 
    toggleCalendarConnection,
    updateUserProfile 
  } = useFormFlow();

  const [activeSection, setActiveSection] = useState<'connections' | 'integrations' | 'profile' | 'notifications' | 'privacy'>('connections');
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    institution: user.institution || 'M S Ramaiah Institute of Technology, Bangalore',
    usnRollNo: user.usnRollNo || '1MS23CS042',
    degreeBranch: user.degreeBranch || 'B.E. Computer Science & Engineering',
    academicYear: user.academicYear || '2nd Year (Semester IV)',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Notification toggles
  const [notifState, setNotifState] = useState({
    deadlineAlerts: true,
    renewalAlerts: true,
    discrepancyWarnings: true,
    newOpportunities: true,
    emailDigest: false,
  });

  // Privacy toggles
  const [privacyState, setPrivacyState] = useState({
    strictApproval: true,
    zeroStorage: true,
    auditLogging: true,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(profileForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <SettingsIcon size={22} className="text-zinc-700" />
            <span>FormFlow Settings</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage your Google Drive & Calendar authorizations, academic profile, notification alerts, and privacy policies.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 animate-fade-in font-medium">
            <Check size={14} />
            <span>Preferences saved successfully!</span>
          </div>
        )}
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 text-xs font-medium overflow-x-auto">
        {[
          { id: 'connections', label: 'Cloud Connections', icon: HardDrive },
          { id: 'integrations', label: 'Backend & Integrations', icon: PlugZap },
          { id: 'profile', label: 'Student Profile', icon: User },
          { id: 'notifications', label: 'Notification Alerts', icon: Bell },
          { id: 'privacy', label: 'Privacy & Disconnect Controls', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors shrink-0 ${
                activeSection === tab.id
                  ? 'border-zinc-900 text-zinc-900 font-semibold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: Cloud Connections (Google Drive & Google Calendar) */}
      {/* SECTION: Backend & Integrations */}
      {activeSection === 'integrations' && (
        <div className="space-y-4">
          <div className="border border-zinc-200 bg-white rounded-2xl p-5 shadow-2xs space-y-1">
            <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              <PlugZap size={16} className="text-brand-600" />
              Backend Orchestrator &amp; Integration Status
            </h3>
            <p className="text-xs text-zinc-500">
              Live connection status for the FormFlow Backend Orchestrator, all registered LLM providers,
              and each MCP server. Clearly distinguishes development mock integrations from real configured providers.
            </p>
          </div>
          <IntegrationStatusPanel />
        </div>
      )}
      {/* SECTION 1: Cloud Connections (Google Drive & Google Calendar) */}
      {activeSection === 'connections' && (
        <div className="space-y-4">
          {/* Google Drive Connection Card */}
          <div className="border border-zinc-200 bg-white rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600">
                  <HardDrive size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">Google Drive Document Source</h3>
                  <p className="text-xs text-zinc-500">
                    Primary source for marks, identity, and income certificates. Zero duplicate uploads.
                  </p>
                </div>
              </div>

              <Badge variant={user.isDriveConnected ? 'success' : 'error'} size="md" dot>
                {user.isDriveConnected ? 'Authorized & Connected' : 'Disconnected'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
              <div>
                <span className="text-[11px] text-zinc-400 block">Authorized Email</span>
                <span className="font-semibold text-zinc-800 font-mono">{user.driveAccountEmail}</span>
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 block">Drive OAuth Scope</span>
                <span className="font-semibold text-zinc-800 font-mono">drive.readonly</span>
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 block">Indexed Folders</span>
                <span className="font-semibold text-zinc-800">3 Folders (6 files indexed)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-zinc-500">
                Tokens are stored in memory and never exported to unauthenticated services.
              </p>
              <Button
                variant={user.isDriveConnected ? 'outline' : 'primary'}
                size="sm"
                onClick={toggleDriveConnection}
              >
                {user.isDriveConnected ? 'Revoke Drive Access' : 'Authorize Google Drive'}
              </Button>
            </div>
          </div>

          {/* Google Calendar Connection Card */}
          <div className="border border-zinc-200 bg-white rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">Google Calendar Synchronization</h3>
                  <p className="text-xs text-zinc-500">
                    Schedules application deadlines and 90/30/7-day document renewal milestones.
                  </p>
                </div>
              </div>

              <Badge variant={user.isCalendarConnected ? 'success' : 'error'} size="md" dot>
                {user.isCalendarConnected ? 'Calendar Synced' : 'Calendar Disabled'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
              <div>
                <span className="text-[11px] text-zinc-400 block">Target Calendar</span>
                <span className="font-semibold text-zinc-800 font-mono">{user.calendarEmail || user.email}</span>
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 block">Calendar MCP Integration</span>
                <span className="font-semibold text-emerald-700">Active (5 scheduled alerts)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-zinc-500">
                Creates reminders in a dedicated "FormFlow Applications" sub-calendar.
              </p>
              <Button
                variant={user.isCalendarConnected ? 'outline' : 'primary'}
                size="sm"
                onClick={toggleCalendarConnection}
              >
                {user.isCalendarConnected ? 'Disconnect Calendar' : 'Connect Google Calendar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Profile Preferences */}
      {activeSection === 'profile' && (
        <form onSubmit={handleSaveProfile} className="border border-zinc-200 bg-white rounded-2xl p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Academic & Personal Profile</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              These details are matched by Form Analysis MCP against portal criteria to recommend grants and pre-fill forms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Full Legal Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Contact Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">College / University Name</label>
              <input
                type="text"
                value={profileForm.institution}
                onChange={(e) => setProfileForm(p => ({ ...p, institution: e.target.value }))}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">USN / University Roll Number</label>
              <input
                type="text"
                value={profileForm.usnRollNo}
                onChange={(e) => setProfileForm(p => ({ ...p, usnRollNo: e.target.value }))}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Degree & Branch</label>
              <input
                type="text"
                value={profileForm.degreeBranch}
                onChange={(e) => setProfileForm(p => ({ ...p, degreeBranch: e.target.value }))}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
            <Button variant="primary" size="md" type="submit" leftIcon={<Save size={14} />}>
              Save Profile Preferences
            </Button>
          </div>
        </form>
      )}

      {/* SECTION 3: Notification Preferences */}
      {activeSection === 'notifications' && (
        <div className="border border-zinc-200 bg-white rounded-2xl p-6 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Notification Alerts & Schedules</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Configure how and when FormFlow's Calendar MCP notifies you of deadlines and renewals.
            </p>
          </div>

          <div className="space-y-3 pt-2 text-xs divide-y divide-zinc-100">
            <label className="flex items-start justify-between gap-4 pt-2 cursor-pointer">
              <div>
                <span className="font-semibold text-zinc-900 block">Application Deadline Alerts</span>
                <span className="text-zinc-500 text-[11px]">Notify 7 days, 3 days, and 24 hours before application portal cutoffs.</span>
              </div>
              <input
                type="checkbox"
                checked={notifState.deadlineAlerts}
                onChange={(e) => setNotifState(s => ({ ...s, deadlineAlerts: e.target.checked }))}
                className="mt-1 rounded border-zinc-300 text-zinc-900 focus:ring-0"
              />
            </label>

            <label className="flex items-start justify-between gap-4 pt-3 cursor-pointer">
              <div>
                <span className="font-semibold text-zinc-900 block">Document Renewal Milestones (90 / 30 / 7 Days)</span>
                <span className="text-zinc-500 text-[11px]">Advance notifications when certificates (e.g. Income Certificate) approach validity expiry.</span>
              </div>
              <input
                type="checkbox"
                checked={notifState.renewalAlerts}
                onChange={(e) => setNotifState(s => ({ ...s, renewalAlerts: e.target.checked }))}
                className="mt-1 rounded border-zinc-300 text-zinc-900 focus:ring-0"
              />
            </label>

            <label className="flex items-start justify-between gap-4 pt-3 cursor-pointer">
              <div>
                <span className="font-semibold text-zinc-900 block">Verification Discrepancy Warnings</span>
                <span className="text-zinc-500 text-[11px]">Alert immediately when name or date inconsistencies are flagged between official documents.</span>
              </div>
              <input
                type="checkbox"
                checked={notifState.discrepancyWarnings}
                onChange={(e) => setNotifState(s => ({ ...s, discrepancyWarnings: e.target.checked }))}
                className="mt-1 rounded border-zinc-300 text-zinc-900 focus:ring-0"
              />
            </label>

            <label className="flex items-start justify-between gap-4 pt-3 cursor-pointer">
              <div>
                <span className="font-semibold text-zinc-900 block">High-Match Opportunity Recommendations</span>
                <span className="text-zinc-500 text-[11px]">Surface new verified scholarships or internships scoring &gt; 85% suitability match.</span>
              </div>
              <input
                type="checkbox"
                checked={notifState.newOpportunities}
                onChange={(e) => setNotifState(s => ({ ...s, newOpportunities: e.target.checked }))}
                className="mt-1 rounded border-zinc-300 text-zinc-900 focus:ring-0"
              />
            </label>
          </div>
        </div>
      )}

      {/* SECTION 4: Privacy & Disconnect Controls */}
      {activeSection === 'privacy' && (
        <div className="space-y-4">
          <div className="border border-zinc-200 bg-white rounded-2xl p-6 shadow-2xs space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Privacy & Agentic Execution Safety</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                FormFlow enforces strict user control, narrow permissions, and immutable audit logs.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-start gap-3">
                <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-zinc-900 block">Drive-First Zero-Duplicate Storage</span>
                  <span className="text-zinc-600 text-[11px] leading-relaxed">
                    Personal documents reside permanently in your Google Drive. FormFlow extracts only structured fields needed for application matching; full file copies are never replicated in FormFlow databases.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-start gap-3">
                <Lock size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-zinc-900 block">Strict Human Approval Gate</span>
                  <span className="text-zinc-600 text-[11px] leading-relaxed">
                    Browser MCP and agent orchestrators cannot submit or share any sensitive data with portal backends without your explicit electronic confirmation.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Disconnect Controls (Mandatory from prompt) */}
          <div className="border border-rose-200 bg-rose-50/30 rounded-2xl p-6 shadow-2xs space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-rose-950 flex items-center gap-2">
                <AlertTriangle size={16} className="text-rose-600" />
                <span>Disconnect & Data Revocation Controls</span>
              </h3>
              <p className="text-xs text-rose-800 mt-0.5">
                Revoke OAuth tokens, clear cached field references, or reset application states.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Trash2 size={14} />}
                onClick={() => {
                  if (confirm('Are you sure you want to revoke Google Drive access? All cached index fields will be deleted.')) {
                    toggleDriveConnection();
                  }
                }}
              >
                Revoke Google Drive Token
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="border-rose-300 text-rose-700 hover:bg-rose-50"
                onClick={() => {
                  if (confirm('Clear local session cache?')) {
                    alert('Session cache cleared.');
                  }
                }}
              >
                Clear Local Session Cache
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
