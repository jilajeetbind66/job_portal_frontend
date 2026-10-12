import { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  GraduationCap,
  Banknote,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button, Modal, Breadcrumbs, SEO } from '@/components';
import { useAuth } from '@/auth/useAuth';
import { useToast } from '@/hooks/useToast';
import { fetchJobBySlug, applyToJob, saveJob, unsaveJob, fetchProfile } from '@/features/public/api/jobs';
import { createJobPostingSchema, createBreadcrumbSchema } from '@/utils/schema';
import { formatMetaDescription, getCanonicalUrl } from '@/utils/seo';

const formatSalary = (min, max, currency = '₹') => {
  if (!min && !max) return 'Not disclosed';
  const formatLakh = (val) => (val >= 100000 ? `${(val / 100000).toFixed(1).replace('.0', '')}L` : val);
  if (min && max) return `${currency}${formatLakh(min)} - ${currency}${formatLakh(max)} per year`;
  return `${currency}${formatLakh(min || max)} per year`;
};

export default function JobDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ['job', slug],
    queryFn: () => fetchJobBySlug(slug),
  });

  const { data: profile } = useQuery({
    queryKey: ['candidate', 'profile'],
    queryFn: fetchProfile,
    enabled: !!isAuthenticated,
  });

  const applyMutation = useMutation({
    mutationFn: (data) => applyToJob(job.id, data),
    onSuccess: () => {
      toast.success('Successfully applied for the job!');
      setIsApplyModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['job', slug] });
      queryClient.invalidateQueries({ queryKey: ['candidate', 'applications'] });
      queryClient.invalidateQueries({ queryKey: ['candidate', 'dashboard'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to apply. Please try again.');
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => (job.is_saved ? unsaveJob(job.id) : saveJob(job.id)),
    onSuccess: () => {
      toast.success(job.is_saved ? 'Job removed from saved list' : 'Job saved successfully');
      queryClient.invalidateQueries({ queryKey: ['job', slug] });
    },
    onError: () => {
      toast.error('Failed to save job.');
    },
  });

  const handleApplySubmit = (e) => {
    e.preventDefault();
    applyMutation.mutate({ coverLetter });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 w-32 bg-gray-200 rounded mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-12 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <SEO title="Job Not Found" description="The requested job vacancy could not be found or has expired." robots="noindex, nofollow" />
        <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
        <p className="mt-2 text-gray-600">The job you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-6" onClick={() => navigate('/jobs')}>
          Back to Jobs
        </Button>
      </div>
    );
  }

  // Derive Location & Breadcrumb hierarchy
  const locParts = (job.location || '').split(',').map((s) => s.trim());
  const cityName = locParts[0] || 'India';
  const regionName = locParts[1] || '';
  const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
  const regionSlug = regionName.toLowerCase().replace(/\s+/g, '-');
  const companySlug = job.company_slug || job.partner?.slug || job.company_name?.toLowerCase().replace(/\s+/g, '-');

  const breadcrumbs = [
    { label: 'Jobs in India', to: '/jobs-in-india' },
    ...(regionName ? [{ label: regionName, to: `/jobs-in-${regionSlug}` }] : []),
    { label: cityName, to: `/jobs-in-${citySlug}` },
    { label: job.title },
  ];

  const seoTitle = `${job.title} – ${cityName} | Vcreateventures`;
  const seoDesc = `Apply for ${job.title} at ${job.company_name} in ${job.location}. ${formatMetaDescription(job.description || job.requirements, 140)}`;
  const schemas = [
    createJobPostingSchema(job),
    createBreadcrumbSchema(breadcrumbs),
  ].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonical={`/jobs/${job.slug}`}
        schema={schemas}
      />

      <Breadcrumbs items={breadcrumbs} className="mb-4" />

      <Link
        to="/jobs"
        className="inline-flex items-center text-sm font-medium text-[#91A6A0] hover:text-[#B9D8C4] mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to all jobs
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content (2/3) */}
        <div className="flex-1 lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F7F8F5] tracking-tight">{job.title}</h1>
            <p className="mt-2 text-xl text-[#B9D8C4] font-medium">
              <Link to={`/company/${companySlug}`} className="hover:underline">
                {job.company_name}
              </Link>
            </p>
          </div>

          <div className="flex flex-wrap gap-4 py-4 border-y border-[#294341]">
            <div className="flex items-center gap-2 text-[#91A6A0]">
              <MapPin className="h-5 w-5 text-[#8FAF9A]" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-[#91A6A0] capitalize">
              <Briefcase className="h-5 w-5 text-[#8FAF9A]" />
              <span>{job.workplace_type}</span>
            </div>
            <div className="flex items-center gap-2 text-[#91A6A0] capitalize">
              <Clock className="h-5 w-5 text-[#8FAF9A]" />
              <span>{job.employment_type}</span>
            </div>
            <div className="flex items-center gap-2 text-[#91A6A0] capitalize">
              <GraduationCap className="h-5 w-5 text-[#8FAF9A]" />
              <span>{job.experience_level}</span>
            </div>
            <div className="flex items-center gap-2 text-[#D6A84F] font-bold">
              <Banknote className="h-5 w-5 text-[#D6A84F]" />
              <span>{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#F7F8F5] mb-4">Job Description</h2>
            <div className="prose max-w-none text-[#91A6A0] whitespace-pre-wrap leading-relaxed">{job.description}</div>
          </div>

          {job.requirements && (
            <div>
              <h2 className="text-xl font-bold text-[#F7F8F5] mb-4">Requirements</h2>
              <div className="prose max-w-none text-[#91A6A0] whitespace-pre-wrap leading-relaxed">{job.requirements}</div>
            </div>
          )}

          {job.skills && job.skills.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-[#F7F8F5] mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#102A2B] text-[#B9D8C4] border border-[#294341]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar (1/3) */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Company Card */}
            <div className="bg-[#0D2224] border border-[#294341] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                {job.company_logo ? (
                  <img
                    src={job.company_logo}
                    alt={job.company_name}
                    className="h-16 w-16 rounded-xl object-cover border border-[#294341]"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-xl bg-[#102A2B] border border-[#294341] flex items-center justify-center text-[#B9D8C4] font-bold text-2xl">
                    {job.company_name?.charAt(0) || 'C'}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-[#F7F8F5]">{job.company_name}</h3>
                  <Link
                    to={`/companies/${job.company_slug || job.company_name?.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-[#B9D8C4] hover:underline"
                  >
                    View profile
                  </Link>
                </div>
              </div>

              {job.created_at && (
                <div className="pt-4 border-t border-[#294341] text-xs text-[#91A6A0] flex justify-between">
                  <span>Posted {formatDistanceToNow(new Date(job.created_at))} ago</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  {job.has_applied ? (
                    <div className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-green-700 bg-green-50">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Applied
                    </div>
                  ) : (
                    <Button size="lg" className="w-full" onClick={() => setIsApplyModalOpen(true)}>
                      Apply Now
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={() => saveMutation.mutate()}
                    loading={saveMutation.isPending}
                  >
                    {job.is_saved ? (
                      <>
                        <BookmarkCheck className="mr-2 h-5 w-5 text-indigo-600 fill-indigo-100" /> Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="mr-2 h-5 w-5" /> Save Job
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button size="lg" className="w-full" onClick={() => navigate('/login', { state: { from: location } })}>
                  Login to Apply
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Internal SEO Linking & Related Exploration */}
      <div className="mt-12 pt-8 border-t border-slate-200 bg-white/70 rounded-2xl p-6 border border-[#CED6E0]">
        <h3 className="text-base font-bold text-[#2F3542] mb-3">
          Explore Related Career Opportunities
        </h3>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <Link
            to={`/jobs?location=${encodeURIComponent(cityName)}`}
            className="px-3 py-1.5 bg-[#E0ECE1] hover:bg-[#BFEDC1] rounded-xl text-[#2F3542] transition-colors"
          >
            All Jobs in {cityName}
          </Link>
          <Link
            to={`/jobs-in-${citySlug}`}
            className="px-3 py-1.5 bg-[#E0ECE1] hover:bg-[#BFEDC1] rounded-xl text-[#2F3542] transition-colors"
          >
            {cityName} Employment Hub
          </Link>
          <Link
            to={`/company/${companySlug}`}
            className="px-3 py-1.5 bg-[#E0ECE1] hover:bg-[#BFEDC1] rounded-xl text-[#2F3542] transition-colors"
          >
            More Jobs at {job.company_name}
          </Link>
          <Link
            to="/jobs-in-india"
            className="px-3 py-1.5 bg-[#E0ECE1] hover:bg-[#BFEDC1] rounded-xl text-[#2F3542] transition-colors"
          >
            Jobs in India Directory
          </Link>
          <Link
            to="/jobs-in-prayagraj"
            className="px-3 py-1.5 bg-[#BFEDC1]/60 hover:bg-[#BFEDC1] rounded-xl text-[#2F3542] transition-colors"
          >
            Jobs in Prayagraj ⭐
          </Link>
          <Link
            to="/fresher-jobs"
            className="px-3 py-1.5 bg-[#E0ECE1] hover:bg-[#BFEDC1] rounded-xl text-[#2F3542] transition-colors"
          >
            Fresher Jobs in India
          </Link>
        </div>
      </div>

      {/* Apply Modal */}
      {isApplyModalOpen && (
        <Modal
          open={isApplyModalOpen}
          onClose={() => !applyMutation.isPending && setIsApplyModalOpen(false)}
          title="Apply for Job"
        >
          <form onSubmit={handleApplySubmit} className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Applying as
                  </p>
                  <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                  Candidate
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 mb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Attached Resume: {profile?.resume_name || 'Profile_Resume.pdf'}
                  </span>
                </div>
                {profile?.resume_url ? (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Ready
                  </span>
                ) : (
                  <Link
                    to="/candidate/profile"
                    className="text-[10px] font-bold text-indigo-600 hover:underline"
                  >
                    Upload Resume →
                  </Link>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                Cover Letter / Why should we hire you? (Optional)
              </label>
              <textarea
                id="coverLetter"
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Briefly explain why you're a great fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsApplyModalOpen(false)}
                disabled={applyMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" loading={applyMutation.isPending}>
                Submit Application
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
