import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Building, Clock, Filter, X, Briefcase } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';
import { Button, Input, Select, EmptyState, StatusBadge } from '@/components';
import { fetchJobs } from '@/features/public/api/jobs';

const WORK_MODES = ['All', 'Remote', 'Hybrid', 'On-Site'];
const EXPERIENCE_LEVELS = ['All', 'Entry', 'Mid', 'Senior', 'Lead'];
const EMPLOYMENT_TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];

const formatSalary = (min, max, currency = '₹') => {
  if (!min && !max) return 'Not disclosed';
  const formatLakh = (val) => val >= 100000 ? `${(val / 100000).toFixed(1).replace('.0', '')}L` : val;
  if (min && max) return `${currency}${formatLakh(min)} - ${currency}${formatLakh(max)}`;
  return `${currency}${formatLakh(min || max)}`;
};

export default function JobSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Local state for debounced inputs
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      let changed = false;
      
      if (search !== (searchParams.get('search') || '')) {
        if (search) newParams.set('search', search); else newParams.delete('search');
        changed = true;
      }
      
      if (location !== (searchParams.get('location') || '')) {
        if (location) newParams.set('location', location); else newParams.delete('location');
        changed = true;
      }
      
      if (changed) {
        newParams.delete('page');
        setSearchParams(newParams);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search, location, searchParams, setSearchParams]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page'); // reset pagination on filter change
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
    keepPreviousData: true
  });

  const jobs = data?.data || [];
  const totalCount = data?.meta?.total || 0;
  const totalPages = data?.meta?.last_page || 1;

  const FiltersContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button onClick={resetFilters} className="text-sm text-indigo-600 hover:text-indigo-800">
          Reset all
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Job title, skills..."
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, state, remote..."
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
          <Select
            value={searchParams.get('work_mode') || 'All'}
            onChange={(e) => handleFilterChange('work_mode', e.target.value)}
            options={WORK_MODES.map(m => ({ label: m, value: m }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
          <Select
            value={searchParams.get('experience_level') || 'All'}
            onChange={(e) => handleFilterChange('experience_level', e.target.value)}
            options={EXPERIENCE_LEVELS.map(m => ({ label: m, value: m }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
          <Select
            value={searchParams.get('employment_type') || 'All'}
            onChange={(e) => handleFilterChange('employment_type', e.target.value)}
            options={EMPLOYMENT_TYPES.map(m => ({ label: m, value: m }))}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Jobs</h1>
          <p className="mt-2 text-gray-600">Showing {totalCount} result{totalCount !== 1 ? 's' : ''}</p>
        </div>
        <Button
          variant="secondary"
          className="lg:hidden"
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          <Filter className="h-4 w-4 mr-2" /> Filters
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white p-5 rounded-xl border border-gray-200 sticky top-24">
            <FiltersContent />
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileFiltersOpen(false)} />
            <div className="relative flex w-full max-w-xs flex-col bg-white p-6 shadow-xl h-full ml-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                <FiltersContent />
              </div>
              <div className="mt-6">
                <Button className="w-full" onClick={() => setIsMobileFiltersOpen(false)}>Apply Filters</Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Job List Area */}
        <div className="flex-1">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-5 w-1/3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                    <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
              Failed to load jobs. Please try again later.
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              title="No jobs found"
              description="Try adjusting your filters or search terms."
              icon={Search}
              action={<Button variant="secondary" onClick={resetFilters}>Clear Filters</Button>}
            />
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 group">
                  <div className="flex-shrink-0">
                    {job.company_logo ? (
                      <img src={job.company_logo} alt={job.company_name} className="h-14 w-14 rounded-lg object-cover border border-gray-100" />
                    ) : (
                      <div className="h-14 w-14 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                        {job.company_name?.charAt(0) || 'C'}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <Link to={`/jobs/${job.slug}`} className="text-xl font-semibold text-gray-900 hover:text-indigo-600 focus:outline-none">
                          {job.title}
                        </Link>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1 font-medium"><Building className="h-4 w-4" /> {job.company_name}</span>
                          <span className="hidden sm:inline text-gray-300">•</span>
                          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-sm font-medium text-gray-900 bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-200 w-fit">
                        {formatSalary(job.salary_min, job.salary_max, job.currency)}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <StatusBadge status={job.workplace_type} />
                      <StatusBadge status={job.experience_level} className="bg-blue-50 text-blue-700 border-blue-200" />
                      
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 ml-auto">
                          {job.skills.slice(0, 3).map((skill, i) => (
                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-500">
                              +{job.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="secondary"
                disabled={page <= 1}
                onClick={() => handleFilterChange('page', String(page - 1))}
              >
                Previous
              </Button>
              <div className="flex items-center px-4 text-sm font-medium text-gray-700">
                Page {page} of {totalPages}
              </div>
              <Button
                variant="secondary"
                disabled={page >= totalPages}
                onClick={() => handleFilterChange('page', String(page + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
