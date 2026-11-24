import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Clock, Sparkles, ArrowRight } from 'lucide-react';

export const ApplicationJourneyCard: React.FC = () => {
  const navigate = useNavigate();

  const stages = [
    {
      id: 1,
      name: 'Form Analysis',
      status: 'Completed',
      state: 'completed',
    },
    {
      id: 2,
      name: 'Document Match',
      status: 'Completed',
      state: 'completed',
    },
    {
      id: 3,
      name: 'Form Filling',
      status: 'In Progress',
      state: 'current',
    },
    {
      id: 4,
      name: 'Verification',
      status: 'Pending',
      state: 'pending',
    },
    {
      id: 5,
      name: 'Submission',
      status: 'Upcoming',
      state: 'upcoming',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-7 border border-[#E8DFC8] shadow-editorial transition-all hover:border-[#D6CAB2]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-sm sm:text-lg font-bold font-sans tracking-tight text-[#202720]">
            Your Application Journey
          </h2>
          <span className="sm:hidden text-[10px] text-[#77776E]">Swipe to inspect milestones →</span>
        </div>
        <button
          onClick={() => navigate('/applications')}
          className="text-xs sm:text-sm font-medium text-[#77776E] hover:text-[#0B3D2E] flex items-center gap-1 transition-colors group shrink-0"
        >
          View all 
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Stepper Timeline (Horizontally scrollable with snap on mobile, grid on laptop) */}
      <div className="relative overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-none">
        {/* Horizontal Connecting Track for widescreen */}
        <div className="absolute top-4 left-6 right-6 h-0.5 -translate-y-1/2 z-0 hidden sm:block">
          <div className="h-full bg-[#087F5B] w-[45%]" />
          <div className="absolute top-0 right-0 h-full bg-[#E8DFC8] w-[55%]" />
        </div>

        {/* 5 Stages Grid / Flex */}
        <div className="flex sm:grid sm:grid-cols-5 gap-3 sm:gap-4 min-w-[520px] sm:min-w-0 relative z-10">
          {stages.map((stage) => {
            const isCompleted = stage.state === 'completed';
            const isCurrent = stage.state === 'current';

            return (
              <div 
                key={stage.id} 
                className="flex-1 flex flex-col items-center text-center cursor-pointer group p-1.5 rounded-xl hover:bg-[#FAF6EF]/60 transition-colors"
                onClick={() => navigate('/applications')}
              >
                {/* Circle Icon Indicator */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all mb-2 ${
                    isCompleted
                      ? 'bg-[#087F5B] text-white shadow-xs'
                      : isCurrent
                      ? 'bg-white border-2 border-[#0B3D2E] text-[#0B3D2E] ring-4 ring-[#BDE9D4]/40'
                      : 'bg-white border border-[#D5CBB5] text-[#77776E]'
                  }`}
                >
                  {isCompleted && <Check size={14} strokeWidth={2.8} />}
                  {isCurrent && (
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#0B3D2E] animate-pulse" />
                  )}
                  {stage.state === 'pending' && <Clock size={13} strokeWidth={2} />}
                  {stage.state === 'upcoming' && <Sparkles size={13} strokeWidth={2} />}
                </div>

                {/* Stage Title */}
                <span
                  className={`text-xs sm:text-sm font-semibold transition-colors truncate max-w-[100px] sm:max-w-none ${
                    isCurrent
                      ? 'text-[#0B3D2E] font-bold'
                      : isCompleted
                      ? 'text-[#202720]'
                      : 'text-[#77776E]'
                  }`}
                >
                  {stage.name}
                </span>

                {/* Status Subtitle */}
                <span
                  className={`text-[10px] sm:text-[11px] mt-0.5 ${
                    isCurrent
                      ? 'text-[#087F5B] font-semibold'
                      : isCompleted
                      ? 'text-[#77776E]'
                      : 'text-[#A09D95]'
                  }`}
                >
                  {stage.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
