import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subtext, icon }) => {
  return (
    <div className="p-4 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-1">
      <div className="flex items-center justify-between text-zinc-500 text-xs">
        <span>{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-zinc-900">{value}</div>
      {subtext && <p className="text-[11px] text-zinc-400">{subtext}</p>}
    </div>
  );
};
