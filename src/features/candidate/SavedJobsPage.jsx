import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Building, Briefcase, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { Button, EmptyState, ConfirmDialog } from '@/components';
import { fetchSavedJobs, unsaveJob } from '@/features/public/api/jobs';

const formatSalary = (min, max, currency = '₹') => {
  if (!min && !max) return null;
  const formatLakh = (val) => (val >= 100000 ? `${(val / 100000).toFixed(1).replace('.0', '')}L` : val);
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
      toast.error('Failed to remove saved job');
    },
    onSuccess: () => {
      toast.success('Job removed from saved list');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'savedJobs'] });
    },
  });

  const handleRemove = (jobId) => {
    removeMutation.mutate(jobId);
    setJobToRemove(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
        {!isLoading && (
          <span className="bg-indigo-100 text-indigo-700 py-1 px-2.5 rounded-full text-sm font-semibold">
            {savedJobs.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse h-48"></div>
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <EmptyState
          title="No saved jobs"
          description="Jobs you save will appear here. Start browsing to find your next opportunity!"
          action={
            <Link to="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          }
          icon={Bookmark}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
                      {job.company_logo ? (
                        <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold text-gray-400">{job.company_name?.charAt(0) || 'C'}</span>
                      )}
                    </div>
                    <div>
                      <Link
                        to={`/jobs/${job.slug}`}
                        className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1"
                      >
                        {job.title}
                      </Link>
                      <span className="flex items-center gap-1 font-medium text-gray-700 text-sm mt-1">
                        <Building size={14} /> {job.company_name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.location && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-xs font-medium">
                      <MapPin size={12} /> {job.location}
                    </span>
                  )}
                  {job.workplace_type && (
                    <span className="inline-flex items-center bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-xs font-medium capitalize">
                      {job.workplace_type}
                    </span>
                  )}
                  {job.experience_level && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-xs font-medium capitalize">
                      <Briefcase size={12} /> {job.experience_level}
                    </span>
                  )}
                </div>

                {formatSalary(job.salary_min, job.salary_max, job.currency) && (
                  <p className="text-sm font-medium text-gray-900 mb-4">
                    {formatSalary(job.salary_min, job.salary_max, job.currency)}
                  </p>
                )}

                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {job.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="bg-gray-50 text-gray-500 px-2 py-0.5 rounded text-xs font-medium">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                <Link to={`/jobs/${job.slug}`} className="flex-1">
                  <Button variant="primary" className="w-full justify-center">
                    View Job
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  onClick={() => setJobToRemove(job.id)}
                  className="text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 px-3"
                  aria-label="Remove saved job"
                >
                  <Trash2 size={18} />
                </Button>
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
        message="Are you sure you want to remove this job from your saved list?"
        confirmText="Remove"
        danger
      />
    </div>
  );
}
