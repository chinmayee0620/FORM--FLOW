import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const UpcomingDeadlinesCard: React.FC = () => {
  const navigate = useNavigate();

  const deadlines = [
    {
      id: 1,
      date: 'Dec 28, 2024',
      title: 'Application for ABC Scholarship',
      badgeText: 'In 3 days',
      badgeBg: 'bg-[#D1FAE5]',
      badgeColor: 'text-[#064E3B]',
      dotColor: 'bg-[#087F5B]',
    },
    {
      id: 2,
      date: 'Jan 10, 2025',
      title: 'Document Verification Period',
      badgeText: 'In 16 days',
      badgeBg: 'bg-[#FEF3C7]',
      badgeColor: 'text-[#92400E]',
      dotColor: 'bg-[#F59E0B]',
    },
    {
      id: 3,
      date: 'Jan 20, 2025',
      title: 'Final Submission Deadline',
      badgeText: 'In 26 days',
      badgeBg: 'bg-[#FEE2E2]',
      badgeColor: 'text-[#991B1B]',
      dotColor: 'bg-[#EF4444]',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-7 border border-[#E8DFC8] shadow-editorial transition-all hover:border-[#D6CAB2] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h2 className="text-sm sm:text-lg font-bold font-sans tracking-tight text-[#202720]">
          Upcoming Deadlines
        </h2>
        <button
          onClick={() => navigate('/reminders')}
          className="text-xs sm:text-sm font-medium text-[#77776E] hover:text-[#0B3D2E] flex items-center gap-1 transition-colors group shrink-0"
        >
          View calendar 
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-5 sm:pl-6 space-y-4 sm:space-y-6">
        <div className="absolute left-[7px] top-2 bottom-3 w-[2px] bg-[#E8DFC8]" />

        {deadlines.map((item) => (
          <div 
            key={item.id} 
            className="relative flex items-center justify-between gap-2.5 sm:gap-3 group cursor-pointer"
            onClick={() => navigate('/reminders')}
          >
            <div
              className={`absolute -left-5 sm:-left-6 top-1 sm:top-1.5 w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full ${item.dotColor} ring-4 ring-white shadow-2xs group-hover:scale-110 transition-transform`}
            />

            <div className="min-w-0 flex-1">
              <span className="text-[11px] sm:text-xs font-bold text-[#202720] block">
                {item.date}
              </span>
              <p className="text-[11px] sm:text-xs text-[#77776E] mt-0.5 truncate group-hover:text-[#0B3D2E] transition-colors">
                {item.title}
              </p>
            </div>

            <div className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold shrink-0 ${item.badgeBg} ${item.badgeColor}`}>
              {item.badgeText}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
