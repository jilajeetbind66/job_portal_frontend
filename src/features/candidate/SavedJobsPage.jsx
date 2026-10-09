import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  MapPin,
  Building,
  Briefcase,
  Trash2,
  ExternalLink,
  Banknote,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { Button, EmptyState, ConfirmDialog } from '@/components';
import { fetchSavedJobs, unsaveJob } from '@/features/public/api/jobs';

const formatSalary = (min, max, currency = '₹') => {
  if (!min && !max) return null;
  const formatLakh = (val) =>
    val >= 100000 ? `${(val / 100000).toFixed(1).replace('.0', '')}L` : val;
  if (min && max) return `${currency}${formatLakh(min)} - ${currency}${formatLakh(max)} LPA`;
  return `${currency}${formatLakh(min || max)} LPA`;
};

export default function SavedJobsPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [jobToRemove, setJobToRemove] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['candidate', 'savedJobs'],
    queryFn: fetchSavedJobs,
  });

  const savedJobs = data?.data || [];

  const removeMutation = useMutation({
    mutationFn: unsaveJob,
    onMutate: async (jobId) => {
      await queryClient.cancelQueries({ queryKey: ['candidate', 'savedJobs'] });
      const previousJobs = queryClient.getQueryData(['candidate', 'savedJobs']);
      if (previousJobs?.data) {
        queryClient.setQueryData(['candidate', 'savedJobs'], {
          ...previousJobs,
          data: previousJobs.data.filter((job) => job.id !== jobId),
        });
      }
      return { previousJobs };
    },
    onError: (err, jobId, context) => {
      queryClient.setQueryData(['candidate', 'savedJobs'], context.previousJobs);
      toast.error('Failed to remove saved job.');
    },
    onSuccess: () => {
      toast.success('Job removed from your saved list.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'savedJobs'] });
      queryClient.invalidateQueries({ queryKey: ['candidate', 'dashboard'] });
    },
  });

  const handleRemove = (jobId) => {
    removeMutation.mutate(jobId);
    setJobToRemove(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Saved Jobs
            </h1>
            {!isLoading && (
              <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 py-0.5 px-2.5 rounded-full text-xs font-bold">
                {savedJobs.length} Saved
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Positions you bookmarked to review or apply to later.
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Briefcase className="h-4 w-4" />
          <span>Explore More Jobs</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-pulse h-48"
            />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <EmptyState
          title="No saved jobs yet"
          description="You haven't bookmarked any jobs yet. When you browse jobs, click the bookmark icon to save roles here."
          action={
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm"
            >
              <Briefcase className="h-4 w-4" />
              <span>Browse Active Jobs</span>
            </Link>
          }
          icon={Bookmark}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl shadow-2xs border border-slate-200 p-5 flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div className="flex gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                      {job.company_logo ? (
                        <img
                          src={job.company_logo}
                          alt={job.company_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-indigo-600">
                          {job.company_name?.charAt(0) || 'C'}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/jobs/${job.slug || job.id}`}
                        className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 block"
                      >
                        {job.title}
                      </Link>
                      <span className="flex items-center gap-1 font-medium text-slate-500 text-xs mt-0.5 truncate">
                        <Building size={13} className="text-slate-400" /> {job.company_name}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setJobToRemove(job.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove from saved"
                    aria-label="Remove saved job"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                  {job.location && (
                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                      <MapPin size={11} className="text-slate-400" /> {job.location}
                    </span>
                  )}
                  {job.workplace_type && (
                    <span className="inline-flex items-center bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize">
                      {job.workplace_type.replace('_', ' ')}
                    </span>
                  )}
                  {job.experience_level && (
                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize">
                      <Briefcase size={11} className="text-slate-400" /> {job.experience_level}
                    </span>
                  )}
                </div>

                {formatSalary(job.salary_min, job.salary_max, job.currency) && (
                  <p className="text-xs font-semibold text-slate-800 mb-3 flex items-center gap-1">
                    <Banknote size={13} className="text-slate-400" />
                    <span>{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
                  </p>
                )}

                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.skills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{job.skills.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <Link to={`/jobs/${job.slug || job.id}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full justify-center text-xs">
                    <span>View Role & Apply</span>
                    <ArrowRight size={13} className="ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!jobToRemove}
        onCancel={() => setJobToRemove(null)}
        onConfirm={() => handleRemove(jobToRemove)}
        title="Remove Saved Job"
        message="Are you sure you want to remove this job posting from your saved bookmarks?"
        confirmText="Yes, Remove"
        danger
      />
    </div>
  );
}
