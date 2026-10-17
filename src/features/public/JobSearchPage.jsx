import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  MapPin,
  Building,
  Clock,
  Filter,
  X,
  Briefcase,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';
import { Button, Input, Select, EmptyState, StatusBadge, SEO } from '@/components';
import { fetchJobs, saveJob, unsaveJob } from '@/features/public/api/jobs';
import { useAuth } from '@/auth/useAuth';
import { useToast } from '@/hooks/useToast';
import { useDebounce } from '@/hooks/useDebounce';
import { createBreadcrumbSchema } from '@/utils/schema';

const WORK_MODES = [
  { label: 'All', value: 'All' },
  { label: 'Remote', value: 'remote' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'On-Site', value: 'onsite' },
];
const EXPERIENCE_LEVELS = [
  { label: 'All', value: 'All' },
  { label: 'Entry', value: 'entry' },
  { label: 'Mid', value: 'mid' },
  { label: 'Senior', value: 'senior' },
  { label: 'Lead', value: 'lead' },
];
const EMPLOYMENT_TYPES = [
  { label: 'All', value: 'All' },
  { label: 'Full-time', value: 'full_time' },
  { label: 'Part-time', value: 'part_time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
];

const getFilterLabel = (options, value) =>
  options.find((option) => option.value === value)?.label || value;

const formatSalary = (min, max, currency = '₹') => {
  if (!min && !max) return null;
  const formatLakh = (val) =>
    val >= 100000 ? `${(val / 100000).toFixed(1).replace('.0', '')}L` : val;
  if (min && max) return `${currency}${formatLakh(min)} - ${currency}${formatLakh(max)} LPA`;
  return `${currency}${formatLakh(min || max)} LPA`;
};

export default function JobSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Local state for inputs
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');

  const debouncedSearch = useDebounce(search, 400);
  const debouncedLocation = useDebounce(location, 400);

  // Sync debounced search to URL
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const curSearch = prev.get('search') || '';
        const curLoc = prev.get('location') || '';
        if (debouncedSearch === curSearch && debouncedLocation === curLoc) return prev;

        const next = new URLSearchParams(prev);
        if (debouncedSearch) next.set('search', debouncedSearch);
        else next.delete('search');

        if (debouncedLocation) next.set('location', debouncedLocation);
        else next.delete('location');

        next.delete('page');
        return next;
      },
      { replace: true }
    );
  }, [debouncedSearch, debouncedLocation, setSearchParams]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const removeFilter = (key) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    newParams.delete('page');
    if (key === 'search') setSearch('');
    if (key === 'location') setLocation('');
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearch('');
    setLocation('');
    setSearchParams(new URLSearchParams());
  };

  const page = parseInt(searchParams.get('page') || '1', 10);
  const currentParams = Object.fromEntries(searchParams.entries());

  const { data, isLoading, isError } = useQuery({
    queryKey: ['jobs', currentParams],
    queryFn: () => fetchJobs(currentParams),
    keepPreviousData: true,
  });

  const jobs = data?.data || [];
  const totalCount = data?.meta?.total || 0;
  const totalPages = data?.meta?.last_page || 1;

  // Save / Bookmark mutation
  const toggleSaveMutation = useMutation({
    mutationFn: ({ jobId, isSaved }) => (isSaved ? unsaveJob(jobId) : saveJob(jobId)),
    onSuccess: (_, { isSaved }) => {
      toast.success(isSaved ? 'Job removed from saved list' : 'Job saved to your bookmarks!');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['candidate', 'savedJobs'] });
      queryClient.invalidateQueries({ queryKey: ['candidate', 'dashboard'] });
    },
    onError: () => toast.error('Failed to update bookmark status.'),
  });

  const activeFilters = [
    searchParams.get('search') && { key: 'search', label: `Keyword: "${searchParams.get('search')}"` },
    searchParams.get('location') && { key: 'location', label: `Location: "${searchParams.get('location')}"` },
    searchParams.get('workplace_type') && { key: 'workplace_type', label: `Work: ${getFilterLabel(WORK_MODES, searchParams.get('workplace_type'))}` },
    searchParams.get('experience_level') && { key: 'experience_level', label: `Exp: ${getFilterLabel(EXPERIENCE_LEVELS, searchParams.get('experience_level'))}` },
    searchParams.get('employment_type') && { key: 'employment_type', label: `Type: ${getFilterLabel(EMPLOYMENT_TYPES, searchParams.get('employment_type'))}` },
    searchParams.get('category') && { key: 'category', label: `Category: ${searchParams.get('category')}` },
  ].filter(Boolean);

  const FiltersContent = () => (
    <div className="space-y-5 text-xs">
      <div className="flex justify-between items-center pb-3 border-b border-[#294341]">
        <h3 className="font-bold text-[#F7F8F5] text-sm">Refine Search</h3>
        {activeFilters.length > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-[#D6A84F] hover:text-[#E5B866] transition-colors flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset all</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#B9D8C4] mb-1.5">Keywords & Skills</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#8FAF9A]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. React, Engineer, Lead..."
              className="w-full rounded-xl border border-[#294341] bg-[#07151A] py-2 pl-9 pr-3 text-xs text-[#F7F8F5] placeholder-[#91A6A0] focus:border-[#2F7D5B] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#B9D8C4] mb-1.5">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#8FAF9A]" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, state, or remote..."
              className="w-full rounded-xl border border-[#294341] bg-[#07151A] py-2 pl-9 pr-3 text-xs text-[#F7F8F5] placeholder-[#91A6A0] focus:border-[#2F7D5B] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Workplace Mode</label>
          <Select
            value={searchParams.get('workplace_type') || 'All'}
            onChange={(e) => handleFilterChange('workplace_type', e.target.value)}
            options={WORK_MODES}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Experience Level</label>
          <Select
            value={searchParams.get('experience_level') || 'All'}
            onChange={(e) => handleFilterChange('experience_level', e.target.value)}
            options={EXPERIENCE_LEVELS}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Employment Type</label>
          <Select
            value={searchParams.get('employment_type') || 'All'}
            onChange={(e) => handleFilterChange('employment_type', e.target.value)}
            options={EMPLOYMENT_TYPES}
          />
        </div>
      </div>
    </div>
  );

  const isFiltered = activeFilters.length > 0;
  const seoTitle = isFiltered
    ? `Jobs Search: ${search || location || 'Filtered Results'} | Vcreateventures`
    : 'Find Jobs in India – Browse Verified Tech & Corporate Openings | Vcreateventures';
  const seoDesc = isFiltered
    ? `Explore matching job vacancies matching ${search || ''} ${location ? `in ${location}` : ''} on Vcreateventures.`
    : 'Browse thousands of active and verified job vacancies across India. Filter by skills, location, workplace type, and experience level on Vcreateventures.';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonical="/jobs"
        robots={isFiltered ? 'noindex, follow' : 'index, follow'}
        schema={createBreadcrumbSchema([{ label: 'Jobs in India', to: '/jobs-in-india' }, { label: 'Find Jobs' }])}
      />

      {/* Title & Filter Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#F7F8F5]">Find Jobs</h1>
          <p className="mt-1 text-sm text-[#91A6A0]">
            Showing <strong className="text-[#B9D8C4]">{totalCount}</strong> active position
            {totalCount !== 1 ? 's' : ''} matching your criteria
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="lg:hidden self-start"
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          <Filter className="h-4 w-4 mr-1.5" />
          <span>Filters ({activeFilters.length})</span>
        </Button>
      </div>

      {/* Active Filter Badges Ribbon */}
      {activeFilters.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2 pt-1 pb-3">
          <span className="text-xs font-medium text-[#91A6A0]">Active filters:</span>
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#102A2B] border border-[#294341] px-3 py-1 text-xs font-bold text-[#B9D8C4]"
            >
              <span>{f.label}</span>
              <button
                type="button"
                onClick={() => removeFilter(f.key)}
                className="hover:text-white transition-colors"
                aria-label={`Remove filter ${f.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            onClick={resetFilters}
            className="text-xs font-bold text-[#D6A84F] hover:text-[#E5B866] transition-colors underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-[#0D2224] p-5 rounded-2xl border border-[#294341] shadow-xl sticky top-24">
            <FiltersContent />
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-[#2F3542]/50 backdrop-blur-xs"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            <div className="relative flex w-full max-w-xs flex-col bg-white p-6 shadow-2xl h-full ml-auto">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#CED6E0]/60">
                <h2 className="text-base font-bold text-[#2F3542]">Search Filters</h2>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="text-[#747D8C] hover:text-[#2F3542]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 pr-1">
                <FiltersContent />
              </div>
              <div className="mt-6 pt-3 border-t border-[#CED6E0]/60">
                <Button className="w-full" onClick={() => setIsMobileFiltersOpen(false)}>
                  Show {totalCount} Results
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Job List Area */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-[#CED6E0] rounded-2xl p-6 animate-pulse space-y-4"
                >
                  <div className="flex gap-4">
                    <div className="h-12 w-12 bg-slate-100 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-1/3 bg-slate-100 rounded" />
                      <div className="h-4 w-1/4 bg-slate-100 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-sm">
              <p className="text-sm font-semibold text-rose-700">Failed to load jobs.</p>
              <Button variant="secondary" size="sm" className="mt-4" onClick={resetFilters}>
                Reset Search
              </Button>
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              title="No jobs found"
              description="No open roles matched your search keywords or filter settings."
              icon={Search}
              action={
                <Button variant="secondary" onClick={resetFilters}>
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => {
                const companySlug =
                  job.company_slug || job.company_name?.toLowerCase().replace(/\s+/g, '-');

                return (
                  <div
                    key={job.id}
                    className="bg-[#0D2224] border border-[#294341] hover:border-[#8FAF9A] hover:bg-[#102A2B] hover:shadow-xl transition-all duration-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 group relative"
                  >
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      {job.company_logo ? (
                        <img
                          src={job.company_logo}
                          alt={job.company_name}
                          className="h-14 w-14 rounded-2xl object-cover border border-[#294341]"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-2xl bg-[#102A2B] border border-[#294341] flex items-center justify-center text-[#B9D8C4] font-extrabold text-xl">
                          {job.company_name?.charAt(0) || 'C'}
                        </div>
                      )}
                    </div>

                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                          <Link
                            to={`/jobs/${job.slug || job.id}`}
                            className="text-lg font-bold text-[#F7F8F5] group-hover:text-[#B9D8C4] transition-colors block line-clamp-1"
                          >
                            {job.title}
                          </Link>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#91A6A0]">
                            <Link
                              to={`/companies/${companySlug}`}
                              className="font-semibold text-[#F7F8F5] hover:text-[#B9D8C4] transition-colors flex items-center gap-1"
                            >
                              <Building className="h-3.5 w-3.5 text-[#8FAF9A]" />
                              <span>{job.company_name}</span>
                            </Link>
                            <span className="text-[#294341]">•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-[#8FAF9A]" />
                              <span>{job.location}</span>
                            </span>
                            {job.created_at && (
                              <>
                                <span className="text-[#294341]">•</span>
                                <span>
                                  {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Salary Pill & Bookmark */}
                        <div className="flex items-center gap-2 shrink-0">
                          {formatSalary(job.salary_min, job.salary_max, job.currency) && (
                            <div className="text-xs font-bold text-[#D6A84F] bg-[#102A2B] px-2.5 py-1 rounded-full border border-[#294341]">
                              {formatSalary(job.salary_min, job.salary_max, job.currency)}
                            </div>
                          )}

                          {isAuthenticated && (
                            <button
                              type="button"
                              onClick={() =>
                                toggleSaveMutation.mutate({
                                  jobId: job.id,
                                  isSaved: !!job.is_saved,
                                })
                              }
                              className="p-1.5 text-[#91A6A0] hover:text-[#D6A84F] hover:bg-[#102A2B] rounded-lg transition-colors"
                              title={job.is_saved ? 'Remove bookmark' : 'Bookmark job'}
                              aria-label="Bookmark job"
                            >
                              {job.is_saved ? (
                                <BookmarkCheck className="h-4 w-4 text-[#D6A84F] fill-[#D6A84F]" />
                              ) : (
                                <Bookmark className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Badges & Tags */}
                      <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-[#294341]">
                        <StatusBadge status={job.workplace_type} />
                        {job.experience_level && (
                          <span className="bg-[#102A2B] text-[#B9D8C4] border border-[#294341] px-2 py-0.5 rounded text-[10px] font-semibold capitalize">
                            {job.experience_level}
                          </span>
                        )}

                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 ml-auto">
                            {job.skills.slice(0, 3).map((skill, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#102A2B] text-[#91A6A0] border border-[#294341]"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 3 && (
                              <span className="text-[10px] text-[#91A6A0] self-center">
                                +{job.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-between items-center pt-4 border-t border-[#294341] text-xs">
              <span className="text-[#91A6A0]">
                Page <strong className="text-[#F7F8F5]">{page}</strong> of{' '}
                <strong className="text-[#F7F8F5]">{totalPages}</strong>
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => handleFilterChange('page', String(page - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => handleFilterChange('page', String(page + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
