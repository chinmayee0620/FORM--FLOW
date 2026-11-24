import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  HardDrive, 
  Edit3,
  Calendar,
  Clock,
  Building2,
  CheckSquare,
  Square,
  ListTodo,
  Milestone
} from 'lucide-react';
import { useFormFlow } from '../contexts/FormFlowContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    applications, 
    openApprovalModal, 
    openDocPreview, 
    documents,
    updatePreparedFieldValue,
    toggleApplicationTask 
  } = useFormFlow();

  const [activeTab, setActiveTab] = useState<'requirements' | 'tasks' | 'timeline' | 'fields'>('requirements');
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [tempVal, setTempVal] = useState('');

  const application = applications.find(a => a.id === id);

  if (!application) {
    return (
      <div className="p-8 text-center space-y-4">
        <h3 className="text-base font-semibold text-zinc-900">Application not found</h3>
        <Button variant="outline" onClick={() => navigate('/applications')}>
          Back to Applications
        </Button>
      </div>
    );
  }

  const findDocByName = (name: string) => {
    return documents.find(d => d.name === name || d.name.toLowerCase().includes(name.toLowerCase()));
  };

  const handleStartEdit = (fId: string, val: string) => {
    setEditingFieldId(fId);
    setTempVal(val);
  };

  const handleSaveEdit = (fId: string) => {
    updatePreparedFieldValue(application.id, fId, tempVal);
    setEditingFieldId(null);
  };

  const completedTasksCount = application.tasks?.filter(t => t.completed).length || 0;
  const totalTasksCount = application.tasks?.length || 0;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Back button & Breadcrumb */}
      <button
        onClick={() => navigate('/applications')}
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to Applications</span>
      </button>

      {/* Hero Header */}
      <div className="border border-zinc-200 bg-white rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="purple" size="sm" className="capitalize">
                {application.category.replace(/_/g, ' ')}
              </Badge>
              <Badge variant={application.isApproved ? 'success' : 'warning'} size="sm">
                {application.isApproved ? 'Human Approved' : 'Review Required'}
              </Badge>
              <Badge variant="default" size="sm">
                Status: {application.status.replace(/_/g, ' ')}
              </Badge>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
              {application.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Building2 size={13} className="text-zinc-400" />
                <span>{application.provider}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Clock size={12} className="text-zinc-400" />
                <span>Deadline: {application.deadline}</span>
              </span>
              <span>•</span>
              <a
                href={application.portalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-brand-600 hover:underline flex items-center gap-1 font-medium"
              >
                Official Portal Link <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-3xl font-extrabold text-zinc-900 font-mono">
              {application.readinessScore}%
            </div>
            <span className="text-xs text-zinc-400 block -mt-1">Readiness Score</span>
          </div>
        </div>

        <p className="text-xs text-zinc-600 leading-relaxed max-w-3xl">
          {application.description}
        </p>

        {/* Action strip */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>Tasks: <strong>{completedTasksCount}/{totalTasksCount} completed</strong></span>
            <span>•</span>
            <span>Target Drive Folder: <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded">{application.targetFolder}</code></span>
          </div>

          {!application.isApproved && application.preparedFields.length > 0 && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ShieldCheck size={16} />}
              onClick={() => openApprovalModal(application)}
            >
              Approve Form Submission
            </Button>
          )}
        </div>
      </div>

      {/* Tabs as requested in prompt */}
      <div className="flex items-center gap-2 border-b border-zinc-200 text-xs font-medium overflow-x-auto">
        <button
          onClick={() => setActiveTab('requirements')}
          className={`pb-2.5 px-3 border-b-2 transition-colors shrink-0 ${
            activeTab === 'requirements'
              ? 'border-zinc-900 text-zinc-900 font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Requirements & Verification ({application.requirements.length})
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`pb-2.5 px-3 border-b-2 transition-colors shrink-0 ${
            activeTab === 'tasks'
              ? 'border-zinc-900 text-zinc-900 font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Completed & Pending Tasks ({totalTasksCount})
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-2.5 px-3 border-b-2 transition-colors shrink-0 ${
            activeTab === 'timeline'
              ? 'border-zinc-900 text-zinc-900 font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Application Timeline
        </button>

        {application.preparedFields.length > 0 && (
          <button
            onClick={() => setActiveTab('fields')}
            className={`pb-2.5 px-3 border-b-2 transition-colors shrink-0 ${
              activeTab === 'fields'
                ? 'border-zinc-900 text-zinc-900 font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Assisted Form Fields ({application.preparedFields.length})
          </button>
        )}
      </div>

      {/* Tab 1: Requirements & Required Documents */}
      {activeTab === 'requirements' && (
        <div className="space-y-3">
          {application.requirements.map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-2 hover:border-zinc-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">
                    {req.status === 'verified' && <CheckCircle2 size={16} className="text-emerald-600" />}
                    {req.status === 'matched' && <CheckCircle2 size={16} className="text-emerald-600" />}
                    {req.status === 'discrepancy' && <AlertTriangle size={16} className="text-amber-600" />}
                    {req.status === 'missing' && <AlertTriangle size={16} className="text-rose-600" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-900">{req.title}</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">{req.requirement}</p>
                  </div>
                </div>

                <Badge
                  variant={
                    req.status === 'verified' || req.status === 'matched'
                      ? 'success'
                      : req.status === 'discrepancy'
                      ? 'warning'
                      : 'error'
                  }
                  size="sm"
                >
                  {req.status}
                </Badge>
              </div>

              {req.userValue && (
                <div className="p-2.5 bg-zinc-50 rounded-lg text-xs font-mono text-zinc-800">
                  <span className="text-zinc-400 font-sans">Extracted Value:</span> {req.userValue}
                </div>
              )}

              {req.details && (
                <p className="text-[11px] text-zinc-500 italic bg-zinc-50/50 p-2 rounded border border-zinc-100">
                  {req.details}
                </p>
              )}

              {req.sourceDocument && (
                <div className="pt-1 flex items-center gap-1.5 text-xs text-zinc-400">
                  <span>Source Document in Google Drive:</span>
                  <button
                    onClick={() => {
                      const doc = findDocByName(req.sourceDocument!);
                      if (doc) openDocPreview(doc);
                    }}
                    className="text-brand-600 hover:underline font-medium text-xs flex items-center gap-1"
                  >
                    <HardDrive size={11} /> {req.sourceDocument}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Completed and Pending Tasks */}
      {activeTab === 'tasks' && (
        <div className="border border-zinc-200 bg-white rounded-2xl p-4.5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Application Task Checklist
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Check off tasks as you prepare required files in Google Drive.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-zinc-800">
              {completedTasksCount} / {totalTasksCount} Completed
            </span>
          </div>

          <div className="space-y-2.5">
            {application.tasks && application.tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleApplicationTask(application.id, task.id)}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                  task.completed
                    ? 'bg-zinc-50/60 border-zinc-200 text-zinc-400'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {task.completed ? (
                    <CheckSquare size={17} className="text-emerald-600 shrink-0" />
                  ) : (
                    <Square size={17} className="text-zinc-400 shrink-0" />
                  )}
                  <span className={`text-xs font-medium truncate ${task.completed ? 'line-through text-zinc-400' : 'text-zinc-800'}`}>
                    {task.title}
                  </span>
                </div>

                {task.dueDate && (
                  <span className="text-[11px] text-zinc-400 font-mono shrink-0">
                    Due: {task.dueDate}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Application Timeline */}
      {activeTab === 'timeline' && (
        <div className="border border-zinc-200 bg-white rounded-2xl p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 pb-2 border-b border-zinc-100">
            Application Progress Timeline
          </h3>

          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
            {application.timeline && application.timeline.map((event, idx) => (
              <div key={idx} className="relative space-y-1">
                <span className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 border-white ${
                  event.status === 'completed' 
                    ? 'bg-emerald-500' 
                    : event.status === 'current' 
                    ? 'bg-brand-500 ring-4 ring-brand-100' 
                    : 'bg-zinc-300'
                }`} />
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-zinc-900">{event.title}</span>
                  <span className="text-[10px] text-zinc-400 font-mono">({event.date})</span>
                  {event.status === 'current' && (
                    <Badge variant="purple" size="sm">Active Stage</Badge>
                  )}
                </div>
                <p className="text-xs text-zinc-600">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Assisted Form Fields */}
      {activeTab === 'fields' && (
        <div className="border border-zinc-200 bg-white rounded-2xl divide-y divide-zinc-100 overflow-hidden shadow-2xs">
          {application.preparedFields.map((field) => (
            <div key={field.id} className="p-4 hover:bg-zinc-50/70 transition-colors text-xs space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900">{field.fieldName}</span>
                    <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded text-zinc-500">
                      {field.section}
                    </span>
                  </div>

                  {editingFieldId === field.id ? (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={tempVal}
                        onChange={(e) => setTempVal(e.target.value)}
                        className="px-2.5 py-1 text-xs border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-500 w-full"
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
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-800 font-mono">
                        {field.mappedValue}
                      </span>
                      <button
                        onClick={() => handleStartEdit(field.id, field.mappedValue)}
                        className="text-zinc-400 hover:text-zinc-700"
                        title="Edit field value"
                      >
                        <Edit3 size={13} />
                      </button>
                    </div>
                  )}

                  {field.discrepancyWarning && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 p-1.5 rounded border border-amber-200">
                      ⚠️ {field.discrepancyWarning}
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0 space-y-0.5">
                  <span className="text-[11px] text-zinc-400 block">Drive Source:</span>
                  <button
                    onClick={() => {
                      const doc = findDocByName(field.sourceDocument);
                      if (doc) openDocPreview(doc);
                    }}
                    className="text-brand-600 hover:underline font-medium text-[11px] block truncate max-w-[170px]"
                  >
                    {field.sourceDocument}
                  </button>
                  <span className="text-[10px] text-emerald-600 block">
                    {Math.round(field.confidence * 100)}% verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
