import React, { useState } from 'react';
import { 
  CalendarClock, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Edit2, 
  Info,
  Calendar,
  Clock,
  CheckSquare,
  Square,
  AlertCircle
} from 'lucide-react';
import { useFormFlow } from '../contexts/FormFlowContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { CalendarReminder } from '../types';

export const RemindersPage: React.FC = () => {
  const { 
    reminders, 
    toggleReminderStatus, 
    addReminder, 
    editReminder, 
    deleteReminder 
  } = useFormFlow();

  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'overdue' | 'deadline' | 'document_renewal' | 'followup'>('all');
  
  // Modal state for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<CalendarReminder | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'deadline' as CalendarReminder['type'],
    dueDate: '',
    priority: 'medium' as CalendarReminder['priority'],
    relatedEntity: '',
    notes: '',
    actionUrl: '',
  });

  const handleOpenAdd = () => {
    setEditingReminder(null);
    setFormData({
      title: '',
      type: 'deadline',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
      relatedEntity: '',
      notes: '',
      actionUrl: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rem: CalendarReminder) => {
    setEditingReminder(rem);
    setFormData({
      title: rem.title,
      type: rem.type,
      dueDate: rem.dueDate,
      priority: rem.priority,
      relatedEntity: rem.relatedEntity,
      notes: rem.notes || '',
      actionUrl: rem.actionUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.dueDate) return;

    // Calculate days remaining
    const dueTime = new Date(formData.dueDate).getTime();
    const nowTime = new Date().getTime();
    const daysRemaining = Math.ceil((dueTime - nowTime) / (1000 * 60 * 60 * 24));
    const status = daysRemaining < 0 ? 'overdue' : daysRemaining <= 7 ? 'due_soon' : 'upcoming';

    if (editingReminder) {
      editReminder(editingReminder.id, {
        ...formData,
        daysRemaining,
        status,
      });
    } else {
      addReminder({
        ...formData,
        daysRemaining,
        status,
      });
    }

    setIsModalOpen(false);
  };

  const filteredReminders = reminders.filter((rem) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'overdue') return rem.status === 'overdue' || rem.daysRemaining < 0;
    if (activeTab === 'upcoming') return rem.status === 'upcoming' || rem.status === 'due_soon';
    return rem.type === activeTab;
  });

  const overdueCount = reminders.filter(r => (r.status === 'overdue' || r.daysRemaining < 0) && r.status !== 'completed').length;
  const renewalCount = reminders.filter(r => r.type === 'document_renewal' && r.status !== 'completed').length;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <CalendarClock size={22} className="text-rose-600" />
            <span>Reminders & Calendar Milestones</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Synchronized via Calendar MCP: Tracks application deadlines, proactive 90/30/7-day document renewals, and follow-up tasks.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus size={16} />}
          onClick={handleOpenAdd}
        >
          Add Reminder
        </Button>
      </div>

      {/* Accuracy & UIDAI Policy Notice */}
      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
        <Info size={18} className="shrink-0 text-amber-700 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-semibold text-amber-900">
            Document Date Accuracy & UIDAI Policy
          </h4>
          <p className="text-amber-800 leading-relaxed">
            FormFlow uses confirmed dates found directly in documents. For Aadhaar, per official UIDAI rules, cards do not have an expiration date. UIDAI’s voluntary 10-year demographic update advisory is tracked without inventing false expiries.
          </p>
        </div>
      </div>

      {/* Filter Tabs (Upcoming, Overdue, Application Deadlines, Document Renewal, Follow-up) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Reminders' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'overdue', label: `Overdue (${overdueCount})` },
          { id: 'deadline', label: 'Application Deadlines' },
          { id: 'document_renewal', label: `Document Renewals (${renewalCount})` },
          { id: 'followup', label: 'Follow-up Tasks' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
              activeTab === tab.id
                ? 'bg-zinc-900 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="p-12 text-center border border-zinc-200 bg-white rounded-2xl text-xs text-zinc-500">
            No reminders found in this category.
          </div>
        ) : (
          filteredReminders.map((rem) => {
            const isDone = rem.status === 'completed';
            const isOverdue = (rem.status === 'overdue' || rem.daysRemaining < 0) && !isDone;

            return (
              <div
                key={rem.id}
                className={`p-4.5 rounded-2xl border transition-all space-y-3 ${
                  isDone
                    ? 'bg-zinc-50/70 border-zinc-200 opacity-60'
                    : isOverdue
                    ? 'bg-rose-50/40 border-rose-200 shadow-2xs'
                    : 'bg-white border-zinc-200 shadow-2xs hover:border-zinc-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleReminderStatus(rem.id)}
                      className="mt-0.5 text-zinc-400 hover:text-zinc-900"
                    >
                      {isDone ? (
                        <CheckSquare size={18} className="text-emerald-600" />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-sm font-semibold ${isDone ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>
                          {rem.title}
                        </h3>
                        <Badge
                          variant={
                            rem.type === 'document_renewal'
                              ? 'warning'
                              : isOverdue
                              ? 'error'
                              : 'purple'
                          }
                          size="sm"
                          className="capitalize"
                        >
                          {rem.type.replace(/_/g, ' ')}
                        </Badge>
                        <Badge
                          variant={rem.priority === 'high' ? 'error' : rem.priority === 'medium' ? 'warning' : 'default'}
                          size="sm"
                        >
                          {rem.priority} priority
                        </Badge>
                      </div>

                      <p className="text-xs text-zinc-500 truncate">
                        Associated: {rem.relatedEntity}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <div>
                      <span className="text-sm font-bold text-zinc-800 font-mono block">
                        {rem.dueDate}
                      </span>
                      <span className={`text-[11px] font-medium block ${
                        isDone
                          ? 'text-zinc-400'
                          : isOverdue
                          ? 'text-rose-600 font-bold'
                          : rem.daysRemaining <= 7
                          ? 'text-amber-600 font-bold'
                          : 'text-zinc-500'
                      }`}>
                        {isDone ? 'Completed' : isOverdue ? `${Math.abs(rem.daysRemaining)} days overdue` : `${rem.daysRemaining} days left`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(rem)}
                        className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded"
                        title="Edit Reminder"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteReminder(rem.id)}
                        className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-zinc-100 rounded"
                        title="Delete Reminder"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {rem.notes && (
                  <p className="text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                    {rem.notes}
                  </p>
                )}

                {rem.actionUrl && (
                  <div className="pt-1 flex items-center justify-between text-xs">
                    <span className="text-zinc-400 text-[11px]">Calendar MCP: 90d, 30d, 7d alerts scheduled</span>
                    <a
                      href={rem.actionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-600 hover:underline flex items-center gap-1 font-medium"
                    >
                      Action / Portal Link <ExternalLink size={11} />
                    </a>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Reminder Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
        subtitle="Manage deadline, certificate renewal, or application follow-up"
        maxWidth="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Reminder
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-zinc-700 block mb-1">Reminder Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Upload College Fee Receipt"
              className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Category</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none bg-white"
              >
                <option value="deadline">Application Deadline</option>
                <option value="document_renewal">Document Renewal</option>
                <option value="followup">Follow-up Task</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none bg-white"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-zinc-700 block mb-1">Due Date</label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-zinc-700 block mb-1">Associated Entity / Application</label>
            <input
              type="text"
              value={formData.relatedEntity}
              onChange={(e) => setFormData(prev => ({ ...prev, relatedEntity: e.target.value }))}
              placeholder="e.g. Reliance Foundation STEM 2026"
              className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-zinc-700 block mb-1">Notes / Instructions</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional renewal guidance, portal timings..."
              className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none resize-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
