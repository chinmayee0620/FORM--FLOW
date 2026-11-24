import React from 'react';
import { ExternalLink } from 'lucide-react';
import { CalendarReminder } from '../../types';
import { Badge } from '../common/Badge';

interface ReminderItemProps {
  reminder: CalendarReminder;
  onToggleStatus: (id: string) => void;
}

export const ReminderItem: React.FC<ReminderItemProps> = ({ reminder, onToggleStatus }) => {
  return (
    <div
      className={`p-4.5 rounded-2xl border transition-all space-y-3 ${
        reminder.status === 'completed'
          ? 'bg-zinc-50/80 border-zinc-200 opacity-60'
          : 'bg-white border-zinc-200 shadow-2xs hover:border-zinc-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={reminder.status === 'completed'}
            onChange={() => onToggleStatus(reminder.id)}
            className="mt-1 rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer"
          />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-semibold ${reminder.status === 'completed' ? 'line-through text-zinc-500' : 'text-zinc-900'}`}>
                {reminder.title}
              </h3>
              <Badge
                variant={reminder.type === 'document_renewal' ? 'warning' : 'default'}
                size="sm"
              >
                {reminder.type === 'document_renewal' ? 'Document Renewal' : 'Portal Cutoff'}
              </Badge>
            </div>
            <p className="text-xs text-zinc-500">Associated: {reminder.relatedEntity}</p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-sm font-bold text-zinc-800 font-mono">
            {reminder.dueDate}
          </div>
          <span className="text-[11px] text-rose-600 font-medium block">
            {reminder.daysRemaining} days remaining
          </span>
        </div>
      </div>

      {reminder.notes && (
        <p className="text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
          {reminder.notes}
        </p>
      )}

      {reminder.actionUrl && (
        <div className="pt-1 flex items-center justify-between text-xs">
          <span className="text-zinc-400">Milestone schedule: 90d, 30d, 7d advance alerts</span>
          <a
            href={reminder.actionUrl}
            target="_blank"
            rel="noreferrer"
            className="text-brand-600 hover:underline flex items-center gap-1 font-medium"
          >
            Official Renewal / Portal Link <ExternalLink size={11} />
          </a>
        </div>
      )}
    </div>
  );
};
