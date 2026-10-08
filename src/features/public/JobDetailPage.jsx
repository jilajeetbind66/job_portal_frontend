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
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button, Modal } from '@/components';
import { useAuth } from '@/auth/useAuth';
import { useToast } from '@/hooks/useToast';
import { fetchJobBySlug, applyToJob, saveJob, unsaveJob } from '@/features/public/api/jobs';

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

  const applyMutation = useMutation({
    mutationFn: (data) => applyToJob(job.id, data),
    onSuccess: () => {
      toast.success('Successfully applied for the job!');
      setIsApplyModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['job', slug] });
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
        <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
        <p className="mt-2 text-gray-600">The job you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-6" onClick={() => navigate('/jobs')}>
          Back to Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/jobs"
        className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to all jobs
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content (2/3) */}
        <div className="flex-1 lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{job.title}</h1>
            <p className="mt-2 text-xl text-indigo-600 font-medium">
              <Link to={`/companies/${job.company_slug || job.company_name?.toLowerCase().replace(/\s+/g, '-')}`} className="hover:underline">
                {job.company_name}
              </Link>
            </p>
          </div>

          <div className="flex flex-wrap gap-4 py-4 border-y border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 capitalize">
              <Briefcase className="h-5 w-5 text-gray-400" />
              <span>{job.workplace_type}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 capitalize">
              <Clock className="h-5 w-5 text-gray-400" />
              <span>{job.employment_type}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 capitalize">
              <GraduationCap className="h-5 w-5 text-gray-400" />
              <span>{job.experience_level}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <Banknote className="h-5 w-5 text-gray-400" />
              <span>{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{job.description}</div>
          </div>

          {job.requirements && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{job.requirements}</div>
            </div>
          )}

          {job.skills && job.skills.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
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
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                {job.company_logo ? (
                  <img
                    src={job.company_logo}
                    alt={job.company_name}
                    className="h-16 w-16 rounded-lg object-cover border border-gray-100"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
                    {job.company_name?.charAt(0) || 'C'}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{job.company_name}</h3>
                  <Link
                    to={`/companies/${job.company_slug || job.company_name?.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    View profile
                  </Link>
                </div>
              </div>

              {job.created_at && (
                <div className="pt-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between">
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

      {/* Apply Modal */}
      {isApplyModalOpen && (
        <Modal
          open={isApplyModalOpen}
          onClose={() => !applyMutation.isPending && setIsApplyModalOpen(false)}
          title="Apply for Job"
        >
          <form onSubmit={handleApplySubmit} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600">Applying as</p>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
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
