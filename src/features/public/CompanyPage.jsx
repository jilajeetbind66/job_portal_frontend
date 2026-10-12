import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Building,
  MapPin,
  ExternalLink,
  Users,
  Calendar,
  ChevronRight,
  Briefcase,
  ArrowRight,
  Globe,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { StatusBadge, EmptyState, Button, Breadcrumbs, SEO } from '@/components';
import { fetchCompanyBySlug } from '@/features/public/api/jobs';
import { createOrganizationSchema, createBreadcrumbSchema } from '@/utils/schema';
import { formatMetaDescription } from '@/utils/seo';

const formatSalary = (min, max, currency = '₹') => {
  if (!min && !max) return null;
  const formatLakh = (val) =>
    val >= 100000 ? `${(val / 100000).toFixed(1).replace('.0', '')}L` : val;
  if (min && max) return `${currency}${formatLakh(min)} - ${currency}${formatLakh(max)} LPA`;
  return `${currency}${formatLakh(min || max)} LPA`;
};

export default function CompanyPage() {
  const { slug } = useParams();

  const { data: company, isLoading, isError, error } = useQuery({
    queryKey: ['company', slug],
    queryFn: () => fetchCompanyBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
        <div className="h-5 w-40 bg-slate-200 rounded" />
        <div className="bg-white rounded-3xl p-8 border border-slate-200 h-64 flex gap-6">
          <div className="h-28 w-28 bg-slate-100 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-7 w-1/3 bg-slate-100 rounded" />
            <div className="h-4 w-1/2 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <SEO title="Company Not Found" description="The requested company showcase could not be found or has been unlisted." robots="noindex, nofollow" />
        <Building className="mx-auto h-12 w-12 text-slate-300" />
        <h2 className="mt-4 text-2xl font-bold text-slate-900">Company Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The company showcase profile you are looking for does not exist or may have been unlisted.
        </p>
        <Link
          to="/jobs"
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm"
        >
          <Briefcase className="h-4 w-4" />
          <span>Browse Active Jobs</span>
        </Link>
      </div>
    );
  }

  const openJobs = company.jobs || [];
  const breadcrumbs = [
    { label: 'Jobs in India', to: '/jobs-in-india' },
    { label: 'Companies', to: '/jobs' },
    { label: company.name },
  ];

  const seoTitle = `${company.name} Careers & Job Openings | Vcreateventures`;
  const seoDesc = `Explore verified career openings and jobs at ${company.name}. ${formatMetaDescription(company.description || `Find hiring opportunities at ${company.name} on Vcreateventures.`)}`;
  const schemas = [
    createOrganizationSchema(company),
    createBreadcrumbSchema(breadcrumbs),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonical={`/company/${company.slug || slug}`}
        schema={schemas}
      />

      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      {/* Hero Showcase Banner */}
      <div className="bg-[#0D2224] rounded-3xl p-6 sm:p-10 mb-8 border border-[#294341] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2F7D5B]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
          <div className="flex-shrink-0">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover border border-slate-200 shadow-2xs bg-white"
              />
            ) : (
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-extrabold text-4xl shadow-2xs">
                {company.name?.charAt(0) || 'C'}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {company.name}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                <ShieldCheck className="h-3 w-3" />
                Verified Partner
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
              {company.industry && (
                <span className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">
                  <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                  {company.industry}
                </span>
              )}
              {company.founded_year && (
                <span className="flex items-center gap-1 font-medium text-slate-500">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Founded {company.founded_year}
                </span>
              )}
              {company.size && (
                <span className="flex items-center gap-1 font-medium text-slate-500">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  {company.size}
                </span>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Visit Website</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: About & Overview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              About {company.name}
            </h2>
            <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-normal">
              {company.description ||
                'This employer has not added an extended bio description yet.'}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50/70 to-purple-50/50 rounded-2xl p-6 border border-indigo-100 shadow-2xs">
            <div className="flex items-center gap-2 mb-2 text-indigo-700">
              <Sparkles className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Hiring Insights</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Applications submitted directly on this portal are reviewed directly by verified recruiters from{' '}
              <strong>{company.name}</strong>.
            </p>
          </div>
        </div>

        {/* Right Column: Open Positions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Current Open Positions</h2>
              <p className="text-xs text-slate-500">Explore roles currently recruiting candidates</p>
            </div>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100">
              {openJobs.length} {openJobs.length === 1 ? 'Job' : 'Jobs'}
            </span>
          </div>

          {openJobs.length === 0 ? (
            <EmptyState
              title="No open positions currently"
              description={`${company.name} does not have any live job listings right now. Check back soon!`}
              icon={Briefcase}
              action={
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm"
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Explore Other Jobs</span>
                </Link>
              }
            />
          ) : (
            <div className="space-y-3.5">
              {openJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all rounded-2xl p-5 flex flex-col justify-between group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <Link
                        to={`/jobs/${job.slug || job.id}`}
                        className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors block"
                      >
                        {job.title}
                      </Link>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {job.location}
                        </span>
                        {job.created_at && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span>
                              Posted{' '}
                              {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {formatSalary(job.salary_min, job.salary_max, job.currency) && (
                      <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                        {formatSalary(job.salary_min, job.salary_max, job.currency)}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={job.workplace_type} />
                      {job.experience_level && (
                        <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-semibold capitalize">
                          {job.experience_level}
                        </span>
                      )}
                      {job.employment_type && (
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium capitalize">
                          {job.employment_type.replace('_', ' ')}
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/jobs/${job.slug || job.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
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
