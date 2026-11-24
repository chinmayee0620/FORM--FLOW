import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ExternalLink, 
  Plus, 
  Building2, 
  Clock, 
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useFormFlow } from '../contexts/FormFlowContext';

export const ApplicationsPage: React.FC = () => {
  const { applications, openApprovalModal, addApplicationFromPrompt } = useFormFlow();
  const navigate = useNavigate();
  const [newPortalUrl, setNewPortalUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddPortal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortalUrl.trim()) return;
    addApplicationFromPrompt(newPortalUrl, 'scholarship');
    setNewPortalUrl('');
    setIsAdding(false);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.provider.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || app.status === statusFilter;

    const matchesCategory = 
      categoryFilter === 'all' || app.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-5 sm:space-y-6 animate-fade-in bg-[#FAF6EF]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFC8]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#087F5B] uppercase tracking-wider mb-1">
            <span>✦</span>
            <span>Intelligent Workflow Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#202720]">
            My Applications & Workflows
          </h1>
          <p className="text-xs sm:text-sm text-[#77776E] mt-1">
            Real-time readiness tracking, automated document mapping, and human approval verification checkpoints.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0B3D2E] hover:bg-[#064E3B] text-white text-xs sm:text-sm font-semibold tracking-tight shadow-editorial transition-all"
        >
          <Plus size={16} />
          <span>Add Portal URL / PDF</span>
        </button>
      </div>

      {/* Add Portal Inline Box */}
      {isAdding && (
        <div className="p-5 bg-white border border-[#E8DFC8] rounded-3xl shadow-editorial animate-fade-in space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#0B3D2E] uppercase tracking-wider">
              Inspect New Application Portal with Form Analysis MCP
            </h4>
            <button 
              onClick={() => setIsAdding(false)}
              className="text-xs text-[#77776E] hover:text-[#202720]"
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleAddPortal} className="flex gap-2.5">
            <input
              type="text"
              value={newPortalUrl}
              onChange={(e) => setNewPortalUrl(e.target.value)}
              placeholder="e.g. National Overseas Scholarship or https://scholarships.gov.in/..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-[#FAF6EF] border border-[#E8DFC8] rounded-full focus:outline-hidden focus:border-[#087F5B] focus:ring-2 focus:ring-[#BDE9D4]/50"
              autoFocus
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#087F5B] hover:bg-[#064E3B] text-white text-xs sm:text-sm font-semibold transition-all shadow-2xs"
            >
              Inspect Requirements
            </button>
          </form>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77776E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applications, providers..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#E8DFC8] rounded-full focus:outline-hidden focus:border-[#087F5B] shadow-2xs placeholder-[#77776E]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'ready_for_review', 'drafting', 'submitted'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-[#0B3D2E] text-white shadow-2xs'
                  : 'bg-white text-[#77776E] border border-[#E8DFC8] hover:bg-[#FAF6EF]'
              }`}
            >
              {st === 'all' ? 'All Statuses' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Cards Grid */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center border border-[#E8DFC8] bg-white rounded-3xl text-xs text-[#77776E]">
            No applications found matching your criteria.
          </div>
        ) : (
          filteredApplications.map((app) => (
            <div
              key={app.id}
              className="border border-[#E8DFC8] bg-white rounded-3xl p-6 shadow-editorial hover:shadow-editorial-hover transition-all space-y-4 hover:border-[#D6CAB2]"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-bold font-sans text-[#202720]">
                      {app.title}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E9F8F2] text-[#064E3B] border border-[#BDE9D4]">
                      {app.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      app.isApproved 
                        ? 'bg-[#D1FAE5] text-[#064E3B]' 
                        : app.status === 'ready_for_review' 
                        ? 'bg-[#FEF3C7] text-[#92400E]' 
                        : 'bg-[#FAF6EF] text-[#77776E]'
                    }`}>
                      {app.isApproved ? 'Approved by User' : app.status === 'ready_for_review' ? 'Ready for Review' : app.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#77776E]">
                    <span className="flex items-center gap-1">
                      <Building2 size={13} className="text-[#087F5B]" />
                      <span>{app.provider}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock size={12} className="text-[#087F5B]" />
                      <span>Deadline: {app.deadline}</span>
                    </span>
                    <span>•</span>
                    <a
                      href={app.portalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#087F5B] hover:underline flex items-center gap-1 font-medium"
                    >
                      Official Portal <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

                {/* Progress Percentage Badge */}
                <div className="text-right shrink-0">
                  <div className="flex items-baseline gap-1 justify-end">
                    <span className="text-2xl font-extrabold text-[#202720] font-mono">
                      {app.readinessScore}%
                    </span>
                    <span className="text-xs text-[#77776E]">Readiness</span>
                  </div>
                  <span className="text-[11px] text-[#087F5B] font-semibold block">
                    {app.requirements.filter((r) => r.status === 'matched' || r.status === 'verified').length} of {app.requirements.length} requirements met
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#FAF6EF] h-2 rounded-full overflow-hidden border border-[#E8DFC8]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    app.readinessScore >= 80 ? 'bg-[#087F5B]' : 'bg-[#F59E0B]'
                  }`}
                  style={{ width: `${app.readinessScore}%` }}
                />
              </div>

              {/* Requirements Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {app.requirements.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6EF] border border-[#E8DFC8] text-xs text-[#202720]"
                  >
                    {req.status === 'verified' || req.status === 'matched' ? (
                      <CheckCircle2 size={13} className="text-[#087F5B]" />
                    ) : (
                      <AlertTriangle size={13} className="text-[#F59E0B]" />
                    )}
                    <span className="font-medium text-[11px]">{req.title}</span>
                    {req.sourceDocument && (
                      <span className="text-[10px] text-[#77776E] font-mono bg-white px-1.5 py-0.2 rounded-md">
                        {req.sourceDocument}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-[#E8DFC8] flex items-center justify-between text-xs">
                <span className="text-[#77776E] text-[11px]">
                  {app.isApproved ? 'Signed and ready for auto-fill' : 'Awaiting student approval checkpoint'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/applications/${app.id}`)}
                    className="px-4 py-2 rounded-full border border-[#E8DFC8] bg-white hover:bg-[#FAF6EF] text-[#202720] text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>Inspect Details</span>
                    <ArrowRight size={12} />
                  </button>

                  {!app.isApproved && app.status === 'ready_for_review' && (
                    <button
                      onClick={() => openApprovalModal(app)}
                      className="px-4 py-2 rounded-full bg-[#087F5B] hover:bg-[#064E3B] text-white text-xs font-semibold transition-all shadow-2xs"
                    >
                      Authorize Submission
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
