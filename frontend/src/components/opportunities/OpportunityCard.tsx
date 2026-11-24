import React from 'react';
import { ExternalLink, Bookmark } from 'lucide-react';
import { Opportunity } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSave?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onSave,
  onDismiss,
}) => {
  return (
    <div className="border border-zinc-200 bg-white rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <Badge variant="purple" size="md">
            {opportunity.matchScore}% Match Fit
          </Badge>
          <span className="text-xs text-zinc-400 font-mono">
            Deadline: {opportunity.deadline}
          </span>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-zinc-900 leading-snug">
            {opportunity.title}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">Provider: {opportunity.provider}</p>
        </div>

        <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-between text-xs">
          <span className="text-zinc-500">Award Amount:</span>
          <span className="font-bold text-emerald-700 font-mono">{opportunity.awardAmount}</span>
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
            Why FormFlow Recommended This:
          </span>
          <ul className="text-xs text-zinc-600 space-y-1 pl-1">
            {opportunity.matchReasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
        <a
          href={opportunity.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="text-brand-600 hover:underline flex items-center gap-1 font-semibold text-xs"
        >
          Official Portal <ExternalLink size={12} />
        </a>

        <div className="flex items-center gap-2">
          {onSave && (
            <Button
              variant={opportunity.status === 'saved' ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<Bookmark size={13} />}
              onClick={() => onSave(opportunity.id)}
            >
              {opportunity.status === 'saved' ? 'Saved' : 'Save'}
            </Button>
          )}
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismiss(opportunity.id)}
              className="text-zinc-400 hover:text-zinc-700"
            >
              Dismiss
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
