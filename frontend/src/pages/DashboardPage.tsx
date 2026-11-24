import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, X } from 'lucide-react';
import { 
  HeroIllustration,
  ApplicationJourneyCard,
  DocumentsRow,
  UpcomingDeadlinesCard,
  RecentActivityCard,
  FormFlowAssistantCard
} from '../components/dashboard';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileAssistantOpen, setIsMobileAssistantOpen] = useState(false);

  return (
    <div className="w-full min-h-full px-3.5 sm:px-8 py-3.5 sm:py-5 pb-20 sm:pb-12 bg-[#FAF6EF] text-[#202720] animate-fade-in relative">
      <div className="max-w-[1520px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Main Center Column (Left 8 cols on laptop/desktop) */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-5 sm:space-y-6">
          {/* Hero Section */}
          <div className="relative rounded-3xl p-5 sm:p-8 bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EF] to-[#EAF6F0]/50 border border-[#E8DFC8] shadow-editorial flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 overflow-hidden">
            {/* Left Content */}
            <div className="w-full md:max-w-md space-y-2.5 sm:space-y-3 z-10 text-left">
              {/* Tag / Greeting */}
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#77776E]">
                <span className="text-[#087F5B]">✦</span>
                <span>Welcome back,</span>
              </div>

              {/* Editorial Title */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif tracking-tight text-[#202720] leading-[1.18]">
                Your applications,<br />
                <span className="italic font-serif text-[#087F5B] font-normal">
                  Simplified.
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-xs sm:text-sm text-[#77776E] leading-relaxed pt-0.5">
                Let <strong className="text-[#064E3B] font-semibold">FormFlow</strong> handle the paperwork, while you focus on what matters.
              </p>

              {/* Emerald CTA Button */}
              <div className="pt-2">
                <button
                  onClick={() => navigate('/applications')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0B3D2E] hover:bg-[#064E3B] text-white text-xs sm:text-sm font-semibold tracking-tight shadow-editorial transition-all duration-200 hover:-translate-y-0.5 hover:shadow-editorial-hover active:scale-[0.98] group"
                >
                  <span>Start a new application</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="w-full md:w-auto flex justify-center shrink-0">
              <HeroIllustration />
            </div>
          </div>

          {/* Your Application Journey */}
          <ApplicationJourneyCard />

          {/* Documents + Upcoming Deadlines Split */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
            <div className="md:col-span-7">
              <DocumentsRow />
            </div>
            <div className="md:col-span-5">
              <UpcomingDeadlinesCard />
            </div>
          </div>

          {/* Recent Activity */}
          <RecentActivityCard />
        </div>

        {/* Right Assistant Column (Docked on laptop/desktop, inline or sheet on mobile) */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-4 lg:sticky lg:top-20">
          <FormFlowAssistantCard />
        </div>
      </div>

      {/* Mobile Floating Action Button for Assistant (< lg:) */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsMobileAssistantOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#0B3D2E] text-white shadow-modal border border-[#BDE9D4]/40 active:scale-95 transition-transform"
          aria-label="Open FormFlow Assistant"
        >
          <Sparkles size={18} className="text-[#BDE9D4] animate-pulse" />
          <span className="text-xs font-bold tracking-tight">AI Assistant</span>
        </button>
      </div>

      {/* Mobile Slide-Up Bottom Sheet for Assistant (< lg:) */}
      {isMobileAssistantOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setIsMobileAssistantOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          {/* Bottom Sheet Modal Container */}
          <div className="relative bg-white rounded-t-3xl max-h-[85vh] h-[80vh] flex flex-col shadow-2xl z-10 animate-fade-in">
            {/* Handle Bar & Close */}
            <div className="p-3 pb-0 flex items-center justify-between border-b border-[#E8DFC8]/60 shrink-0">
              <div className="w-10 h-1 bg-[#CBD5E1] rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
              <div className="flex items-center gap-2 pt-1">
                <Sparkles size={16} className="text-[#0B3D2E]" />
                <span className="text-xs font-bold text-[#202720]">FormFlow Assistant</span>
              </div>
              <button
                onClick={() => setIsMobileAssistantOpen(false)}
                className="p-1 rounded-full text-[#77776E] hover:bg-[#FAF6EF]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Assistant content */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <FormFlowAssistantCard />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
