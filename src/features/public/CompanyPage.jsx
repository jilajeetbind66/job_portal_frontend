import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building, MapPin, ExternalLink, Users, Calendar, ChevronRight, Briefcase } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { StatusBadge, EmptyState } from '@/components';
import { fetchCompanyBySlug } from '@/features/public/api/jobs';

const formatSalary = (min, max, currency = '₹') => {
  if (!min && !max) return 'Not disclosed';
  const formatLakh = (val) => val >= 100000 ? `${(val / 100000).toFixed(1).replace('.0', '')}L` : val;
  if (min && max) return `${currency}${formatLakh(min)} - ${currency}${formatLakh(max)}`;
  return `${currency}${formatLakh(min || max)}`;
};

export default function CompanyPage() {
  const { slug } = useParams();

  const { data: company, isLoading, isError } = useQuery({
    queryKey: ['company', slug],
    queryFn: () => fetchCompanyBySlug(slug)
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="bg-white rounded-2xl p-8 mb-12 border border-gray-100 shadow-sm flex gap-8">
          <div className="h-24 w-24 bg-gray-200 rounded-2xl"></div>
          <div className="flex-1 space-y-4">
            <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
            <div className="flex gap-4">
              <div className="h-5 w-24 bg-gray-200 rounded"></div>
              <div className="h-5 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Company not found</h2>
        <p className="mt-2 text-gray-600">The company profile you're looking for doesn't exist.</p>
        <Link to="/jobs" className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="hover:text-gray-900">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-1" />
              <Link to="/companies" className="hover:text-gray-900">Companies</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="text-gray-900 font-medium">{company.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Hero Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 mb-12 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
          <div className="flex-shrink-0">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl object-cover border border-gray-200 shadow-sm bg-white" />
            ) : (
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-4xl sm:text-5xl shadow-sm">
                {company.name.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{company.name}</h1>
            
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600">
              {company.industry && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-gray-800">
                  <Briefcase className="h-4 w-4" /> {company.industry}
                </div>
              )}
              {company.founded_year && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-400" /> Founded {company.founded_year}
                </div>
              )}
              {company.size && (
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-gray-400" /> {company.size} employees
                </div>
              )}
              {company.website && (
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 transition-colors ml-auto sm:ml-0"
                >
                  <ExternalLink className="h-4 w-4" /> Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: About */}
        <div className="lg:col-span-1 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">About {company.name}</h2>
            <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed">
              {company.description || "No description provided."}
            </div>
          </div>
        </div>

        {/* Right Column: Open Positions */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Open Positions</h2>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-100">
              {company.jobs?.length || 0} Jobs
            </span>
          </div>

          {!company.jobs || company.jobs.length === 0 ? (
            <EmptyState 
              title="No open positions" 
              description={`${company.name} currently doesn't have any open jobs published.`}
              icon={Briefcase}
            />
          ) : (
            <div className="space-y-4">
              {company.jobs.map((job) => (
                <div key={job.id} className="bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all rounded-xl p-5 flex flex-col sm:flex-row gap-4 group">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <Link to={`/jobs/${job.slug}`} className="text-lg font-semibold text-gray-900 hover:text-indigo-600 focus:outline-none">
                          {job.title}
                        </Link>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                          <span className="text-gray-300">•</span>
                          <span>Posted {formatDistanceToNow(new Date(job.created_at))} ago</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-sm font-medium text-gray-900 bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-200 w-fit">
                        {formatSalary(job.salary_min, job.salary_max, job.currency)}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <StatusBadge status={job.workplace_type} />
                      <StatusBadge status={job.experience_level} className="bg-blue-50 text-blue-700 border-blue-200" />
                      <StatusBadge status={job.employment_type} className="bg-purple-50 text-purple-700 border-purple-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
