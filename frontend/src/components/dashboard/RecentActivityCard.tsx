import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle2, Calendar } from 'lucide-react';

export const RecentActivityCard: React.FC = () => {
  const navigate = useNavigate();

  const activities = [
    {
      id: 1,
      icon: FileText,
      iconBg: 'bg-[#FAF6EF]',
      iconColor: 'text-[#087F5B]',
      hasDot: true,
      title: 'Application progress updated',
      subtitle: 'ABC Scholarship Form • 2m ago',
    },
    {
      id: 2,
      icon: CheckCircle2,
      iconBg: 'bg-[#0B3D2E]',
      iconColor: 'text-white',
      hasDot: false,
      title: 'New document matched',
      subtitle: 'Resume.pdf • 12m ago',
    },
    {
      id: 3,
      icon: Calendar,
      iconBg: 'bg-[#FAF6EF]',
      iconColor: 'text-[#064E3B]',
      hasDot: false,
      title: 'Reminder set',
      subtitle: 'Application deadline • 1h ago',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-7 border border-[#E8DFC8] shadow-editorial transition-all hover:border-[#D6CAB2]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-sm sm:text-lg font-bold font-sans tracking-tight text-[#202720]">
          Recent Activity
        </h2>
        <button
          onClick={() => navigate('/audit')}
          className="text-xs sm:text-sm font-medium text-[#77776E] hover:text-[#0B3D2E] flex items-center gap-1 transition-colors group shrink-0"
        >
          View all 
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Horizontal Items Row on desktop, vertical stack on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#E8DFC8]/60 pt-1">
        {activities.map((act, index) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              onClick={() => navigate('/audit')}
              className={`flex items-center gap-3 pt-2.5 md:pt-0 ${
                index > 0 ? 'md:pl-4' : ''
              } cursor-pointer group active:scale-[0.99]`}
            >
              {act.hasDot && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
              )}

              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${act.iconBg} ${act.iconColor} border border-[#E8DFC8]/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                <Icon size={15} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-semibold text-[#202720] truncate group-hover:text-[#0B3D2E] transition-colors">
                  {act.title}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-[#77776E] mt-0.5 truncate">
                  {act.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
