import React, { useState } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  Bookmark, 
  Info, 
  Search,
  Building2,
  Clock,
  GraduationCap,
  Briefcase,
  Globe,
  Award,
  BookOpen
} from 'lucide-react';
import { useFormFlow } from '../contexts/FormFlowContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const OpportunitiesPage: React.FC = () => {
  const { opportunities, updateOpportunityStatus } = useFormFlow();
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryTabs = [
    { id: 'all', label: 'All Opportunities', icon: Sparkles },
    { id: 'scholarship', label: 'Scholarships', icon: Award },
    { id: 'internship', label: 'Internships', icon: GraduationCap },
    { id: 'government_scheme', label: 'Govt Schemes', icon: Globe },
    { id: 'admission', label: 'College Admissions', icon: BookOpen },
    { id: 'job', label: 'Graduate Jobs', icon: Briefcase },
    { id: 'saved', label: 'Saved', icon: Bookmark },
  ];

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.eligibilitySummary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      filter === 'all' 
        ? true 
        : filter === 'saved' 
        ? opp.status === 'saved' 
        : opp.category === filter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Sparkles size={22} className="text-purple-600" />
            <span>Opportunities & Recommendations</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Personalized discovery across scholarships, internships, government schemes, admissions, and jobs matched against your verified Google Drive credentials.
          </p>
        </div>

        <Badge variant="purple" size="md">
          {opportunities.length} Verified Opportunities Active
        </Badge>
      </div>

      {/* Mandatory Recommendation Boundary Notice */}
      <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-purple-900">
        <Info size={18} className="shrink-0 text-purple-700 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold block">Recommendation Boundary Notice</span>
          <p className="text-purple-800 leading-relaxed">
            All opportunities are surfaced as <strong>potential matches</strong> based on your verified credentials and stated criteria. A recommendation is an algorithmic suitability match, <strong>not a guarantee of eligibility or selection</strong>. FormFlow links directly to official sources for final verification.
          </p>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by grant name, company, university..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400 shadow-2xs"
            />
          </div>

          <div className="text-xs text-zinc-400">
            Showing {filteredOpportunities.length} opportunities
          </div>
        </div>

        {/* Category Filter Pills (Scholarships, Internships, Government Schemes, Admissions, Jobs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
                  filter === tab.id
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOpportunities.length === 0 ? (
          <div className="col-span-2 p-12 text-center border border-zinc-200 bg-white rounded-2xl text-xs text-zinc-500">
            No opportunities found in this category.
          </div>
        ) : (
          filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="border border-zinc-200 bg-white rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4 hover:border-zinc-300"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="purple" size="sm">
                      {opp.matchScore}% Potential Match
                    </Badge>
                    <span className="text-[10px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded capitalize">
                      {opp.category.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                    <Clock size={12} />
                    <span>Due: {opp.deadline}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 leading-snug">
                    {opp.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                    <Building2 size={13} className="text-zinc-400" />
                    <span>{opp.provider}</span>
                    {opp.location && (
                      <>
                        <span>•</span>
                        <span>{opp.location}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Award / Value Pill */}
                <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Benefit / Compensation:</span>
                  <span className="font-bold text-emerald-700 font-mono">{opp.awardAmount}</span>
                </div>

                {/* Why It Is Recommended (Mandatory from prompt) */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
                    Why FormFlow Recommended This:
                  </span>
                  <ul className="text-xs text-zinc-600 space-y-1 pl-1">
                    {opp.matchReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs text-zinc-500 italic bg-zinc-50/50 p-2.5 rounded-xl border border-zinc-100">
                  {opp.eligibilitySummary}
                </p>
              </div>

              {/* Official source link & Save button (Mandatory from prompt) */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <a
                  href={opp.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-600 hover:underline flex items-center gap-1 font-semibold text-xs"
                >
                  Official Source Link <ExternalLink size={12} />
                </a>

                <div className="flex items-center gap-2">
                  <Button
                    variant={opp.status === 'saved' ? 'primary' : 'outline'}
                    size="sm"
                    leftIcon={<Bookmark size={13} />}
                    onClick={() => updateOpportunityStatus(opp.id, opp.status === 'saved' ? 'recommended' : 'saved')}
                  >
                    {opp.status === 'saved' ? 'Saved' : 'Save Opportunity'}
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
