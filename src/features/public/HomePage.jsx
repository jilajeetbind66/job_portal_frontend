import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  MapPin,
  Briefcase,
  BarChart,
  PenTool,
  MonitorSmartphone,
  Target,
  Users,
  Zap,
  CheckCircle,
  Building,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button, Input } from '@/components';
import { fetchJobs } from './api/jobs';

function CodeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );
}

const CATEGORIES = [
  { name: 'Engineering', icon: CodeIcon, count: '1,200+' },
  { name: 'Marketing', icon: Target, count: '850+' },
  { name: 'Finance', icon: BarChart, count: '430+' },
  { name: 'Design', icon: PenTool, count: '620+' },
  { name: 'Sales', icon: Zap, count: '1,500+' },
  { name: 'HR', icon: Users, count: '320+' },
  { name: 'Operations', icon: Briefcase, count: '780+' },
  { name: 'IT & Data', icon: MonitorSmartphone, count: '940+' },
];

const POPULAR_SEARCHES = ['React', 'Python', 'Remote', 'UI/UX', 'DevOps', 'Bangalore'];

const formatSalary = (min, max, currency = '₹') => {
  if (!min && !max) return null;
  const formatLakh = (val) =>
    val >= 100000 ? `${(val / 100000).toFixed(1).replace('.0', '')}L` : val;
  if (min && max) return `${currency}${formatLakh(min)} - ${currency}${formatLakh(max)} LPA`;
  return `${currency}${formatLakh(min || max)} LPA`;
};

export default function HomePage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const { data: featuredData } = useQuery({
    queryKey: ['public', 'featured-jobs'],
    queryFn: () => fetchJobs({ perPage: 4 }),
  });

  const featuredJobs = featuredData?.data || [];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('search', keyword.trim());
    if (location.trim()) params.append('location', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const handleQuickTagClick = (tag) => {
    navigate(`/jobs?search=${encodeURIComponent(tag)}`);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/jobs?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 py-24 px-4 sm:px-6 lg:px-8 text-center text-white overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-200 backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Over 10,000+ verified tech roles across top employers</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Find Your Dream Job
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            Discover opportunities that match your skills, passion, and career aspirations with fast responses from verified companies.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="mt-8 bg-white p-2 rounded-2xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto shadow-2xl border border-white/20"
          >
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Job title, skills, or company name..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-11 w-full border-0 focus:ring-0 text-slate-900 text-sm h-12 rounded-xl focus:outline-none"
              />
            </div>

            <div className="hidden md:block w-px bg-slate-200 my-2" />

            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="City, state, or 'Remote'"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-11 w-full border-0 focus:ring-0 text-slate-900 text-sm h-12 rounded-xl focus:outline-none"
              />
            </div>

            <Button type="submit" size="lg" className="h-12 px-8 text-sm font-semibold rounded-xl w-full md:w-auto shadow-md">
              Search Jobs
            </Button>
          </form>

          {/* Popular Tag Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-indigo-200">
            <span className="font-semibold text-white">Popular:</span>
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickTagClick(tag)}
                className="rounded-full bg-white/10 hover:bg-white/20 px-3 py-1 transition-colors text-white font-medium"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-extrabold text-indigo-600">10,000+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Live Positions
              </p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-indigo-600">500+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Verified Partners
              </p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-indigo-600">50,000+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Registered Candidates
              </p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-indigo-600">92%</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Interview Response Rate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      {featuredJobs.length > 0 && (
        <section className="py-16 bg-slate-50/70 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Featured Job Openings
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Recently approved positions from trusted hiring partners.
                </p>
              </div>

              <Link
                to="/jobs"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <span>Browse All Openings</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                          {job.company_logo ? (
                            <img
                              src={job.company_logo}
                              alt={job.company_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-base font-bold text-indigo-600">
                              {job.company_name?.charAt(0) || 'C'}
                            </span>
                          )}
                        </div>
                        <div>
                          <Link
                            to={`/jobs/${job.slug || job.id}`}
                            className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors block line-clamp-1"
                          >
                            {job.title}
                          </Link>
                          <Link
                            to={`/companies/${job.company_slug || job.company_name?.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                          >
                            {job.company_name}
                          </Link>
                        </div>
                      </div>

                      <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                        {job.workplace_type || 'Hybrid'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      {formatSalary(job.salary_min, job.salary_max, job.currency) && (
                        <span className="font-semibold text-slate-900">
                          · {formatSalary(job.salary_min, job.salary_max, job.currency)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {job.skills?.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/jobs/${job.slug || job.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      <span>View</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Browse by Category */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Browse by Industry & Function
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Explore job openings curated by professional domain.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all text-left flex flex-col justify-between group"
                >
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{cat.count} openings</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-slate-50/50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Why Job Seekers & Partners Choose Us
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Built for seamless recruitment across modern teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">100% Moderated Job Postings</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Every job submission is verified by platform administrators to ensure accurate salary benchmarks and genuine vacancies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Real-Time Application Tracking</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Stay informed with our visual hiring pipeline. Never wonder about your application status again.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">AI-Assisted Resume Matching</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Upload your resume once and automatically receive intelligent role recommendations tailored to your skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Card */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Advance Your Career?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-indigo-100 max-w-xl mx-auto">
              Join thousands of candidates getting discovered by high-growth companies. Create your profile today in less than 2 minutes.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/register"
                className="rounded-xl bg-white px-5 py-3 text-xs font-bold text-indigo-900 hover:bg-indigo-50 shadow-sm transition-all"
              >
                Sign Up as Candidate
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-indigo-400/50 bg-indigo-800/50 px-5 py-3 text-xs font-bold text-white hover:bg-indigo-700/50 transition-all"
              >
                Employer Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
