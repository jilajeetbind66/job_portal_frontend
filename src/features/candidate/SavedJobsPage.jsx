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
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F7F8F5]">
              Saved Jobs
            </h1>
            {!isLoading && (
              <span className="bg-[#102A2B] border border-[#D6A84F]/30 text-[#D6A84F] py-0.5 px-3 rounded-full text-xs font-bold">
                {savedJobs.length} Saved
              </span>
            )}
          </div>
          <p className="text-sm text-[#91A6A0] mt-1">
            Positions you bookmarked to review or apply to later.
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 rounded-xl bg-[#2F7D5B] px-4 py-2.5 text-xs font-semibold text-[#F7F8F5] hover:bg-[#25684a] shadow-lg shadow-[#2F7D5B]/20 transition-all self-start sm:self-auto"
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
              className="bg-[#0D2224] p-6 rounded-2xl border border-[#294341] animate-pulse h-48"
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2F7D5B] px-4 py-2 text-xs font-semibold text-[#F7F8F5] hover:bg-[#25684a]"
            >
              <Briefcase className="h-4 w-4" />
              <span>Browse Active Jobs</span>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-[#0D2224] rounded-2xl border border-[#294341] p-5 flex flex-col justify-between hover:border-[#2F7D5B] hover:bg-[#102A2B] transition-all group"
            >
              <div>
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div className="flex gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-[#102A2B] border border-[#294341] flex items-center justify-center overflow-hidden shrink-0">
                      {job.company_logo ? (
                        <img
                          src={job.company_logo}
                          alt={job.company_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-[#D6A84F]">
                          {job.company_name?.charAt(0) || 'C'}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/jobs/${job.slug || job.id}`}
                        className="text-sm font-bold text-[#F7F8F5] group-hover:text-[#D6A84F] transition-colors line-clamp-1 block"
                      >
                        {job.title}
                      </Link>
                      <span className="flex items-center gap-1 font-medium text-[#91A6A0] text-xs mt-0.5 truncate">
                        <Building size={13} className="text-[#91A6A0]" /> {job.company_name}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setJobToRemove(job.id)}
                    className="p-1.5 text-[#91A6A0] hover:text-rose-400 hover:bg-[#153536] rounded-lg transition-colors"
                    title="Remove from saved"
                    aria-label="Remove saved job"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                  {job.location && (
                    <span className="inline-flex items-center gap-1 bg-[#102A2B] border border-[#294341] text-[#91A6A0] px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                      <MapPin size={11} className="text-[#91A6A0]" /> {job.location}
                    </span>
                  )}
                  {job.workplace_type && (
                    <span className="inline-flex items-center bg-[#102A2B] border border-[#294341] text-[#B9D8C4] px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize">
                      {job.workplace_type.replace('_', ' ')}
                    </span>
                  )}
                  {job.experience_level && (
                    <span className="inline-flex items-center gap-1 bg-[#102A2B] border border-[#294341] text-[#91A6A0] px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize">
                      <Briefcase size={11} className="text-[#91A6A0]" /> {job.experience_level}
                    </span>
                  )}
                </div>

                {formatSalary(job.salary_min, job.salary_max, job.currency) && (
                  <p className="text-xs font-semibold text-[#E5B866] mb-3 flex items-center gap-1">
                    <Banknote size={13} className="text-[#D6A84F]" />
                    <span>{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
                  </p>
                )}

                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.skills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-[#102A2B] border border-[#294341] text-[#B9D8C4] px-2.5 py-0.5 rounded-md text-[10px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="text-[10px] text-[#91A6A0] self-center">
                        +{job.skills.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#294341]">
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
