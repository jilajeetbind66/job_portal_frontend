import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Trash2, Plus, FileText } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { Button, Input, TagInput, FileUpload } from '@/components';
import { fetchProfile, updateProfile, uploadResume } from '@/features/public/api/jobs';

export default function ProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['candidate', 'profile'],
    queryFn: fetchProfile,
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  const completeness = profile?.profile_completion || 0;
  const progressColor =
    completeness < 40 ? 'bg-red-500' : completeness < 80 ? 'bg-amber-500' : 'bg-green-500';

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal information, experience, and resume.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-medium text-gray-700">Profile Completeness</h2>
          <span className="text-sm font-bold text-gray-900">{completeness}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${completeness}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
        <PersonalInfoSection profile={profile} />
        <SkillsSection initialSkills={profile?.skills || []} />
        <ExperienceSection initialExperience={profile?.experience || []} />
        <EducationSection initialEducation={profile?.education || []} />
        <ResumeSection resumeUrl={profile?.resume_url} />
      </div>
    </div>
  );
}

function PersonalInfoSection({ profile }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: profile?.name || '',
      headline: profile?.headline || '',
      phone: profile?.phone || '',
      location: profile?.location || '',
      bio: profile?.bio || '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        headline: profile.headline || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
      });
    }
  }, [profile, reset]);

  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'profile'] });
      toast.success('Personal info updated!');
    },
    onError: () => toast.error('Failed to update personal info'),
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" {...register('name', { required: 'Name is required' })} error={errors.name?.message} />
          <Input label="Headline" placeholder="e.g. Senior React Developer" {...register('headline')} />
          <Input label="Phone" {...register('phone')} />
          <Input label="Location" placeholder="City, Country" {...register('location')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About</label>
          <textarea
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[100px] p-2 border"
            {...register('bio')}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" loading={mutation.isPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

function SkillsSection({ initialSkills }) {
  const [skills, setSkills] = useState(initialSkills);

  useEffect(() => {
    setSkills(initialSkills);
  }, [initialSkills]);

  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => updateProfile({ skills: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'profile'] });
      toast.success('Skills updated!');
    },
    onError: () => toast.error('Failed to update skills'),
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
      <div className="space-y-4">
        <TagInput tags={skills} setTags={setSkills} placeholder="Type a skill and press enter..." />
        <div className="flex justify-end">
          <Button onClick={() => mutation.mutate(skills)} loading={mutation.isPending}>
            Save Skills
          </Button>
        </div>
      </div>
    </div>
  );
}

function ExperienceSection({ initialExperience }) {
  const [experience, setExperience] = useState(initialExperience);

  useEffect(() => {
    setExperience(initialExperience);
  }, [initialExperience]);

  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => updateProfile({ experience: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'profile'] });
      toast.success('Experience updated!');
    },
    onError: () => toast.error('Failed to update experience'),
  });

  const addEntry = () => {
    setExperience([...experience, { company: '', title: '', from: '', to: '', current: false, description: '' }]);
  };

  const removeEntry = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const updateEntry = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Experience</h2>
        <Button variant="secondary" size="sm" onClick={addEntry}>
          <Plus size={16} className="mr-1" /> Add Experience
        </Button>
      </div>

      <div className="space-y-6">
        {experience.map((exp, index) => (
          <div key={index} className="p-4 border rounded-md relative bg-gray-50">
            <button
              onClick={() => removeEntry(index)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
              type="button"
            >
              <Trash2 size={18} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <Input label="Job Title" value={exp.title || ''} onChange={(e) => updateEntry(index, 'title', e.target.value)} />
              <Input label="Company" value={exp.company || ''} onChange={(e) => updateEntry(index, 'company', e.target.value)} />
              <Input type="month" label="From Date" value={exp.from || ''} onChange={(e) => updateEntry(index, 'from', e.target.value)} />
              <div>
                <Input
                  type="month"
                  label="To Date"
                  value={exp.to || ''}
                  onChange={(e) => updateEntry(index, 'to', e.target.value)}
                  disabled={exp.current}
                />
                <label className="flex items-center mt-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={exp.current || false}
                    onChange={(e) => updateEntry(index, 'current', e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  I currently work here
                </label>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[80px] p-2 border text-sm"
                value={exp.description || ''}
                onChange={(e) => updateEntry(index, 'description', e.target.value)}
              />
            </div>
          </div>
        ))}
        {experience.length === 0 && <p className="text-gray-500 text-center py-4">No experience added yet.</p>}

        <div className="flex justify-end">
          <Button onClick={() => mutation.mutate(experience)} loading={mutation.isPending}>
            Save Experience
          </Button>
        </div>
      </div>
    </div>
  );
}

function EducationSection({ initialEducation }) {
  const [education, setEducation] = useState(initialEducation);

  useEffect(() => {
    setEducation(initialEducation);
  }, [initialEducation]);

  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => updateProfile({ education: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'profile'] });
      toast.success('Education updated!');
    },
    onError: () => toast.error('Failed to update education'),
  });

  const addEntry = () => {
    setEducation([...education, { school: '', degree: '', field: '', fromYear: '', toYear: '' }]);
  };

  const removeEntry = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEntry = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Education</h2>
        <Button variant="secondary" size="sm" onClick={addEntry}>
          <Plus size={16} className="mr-1" /> Add Education
        </Button>
      </div>

      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className="p-4 border rounded-md relative bg-gray-50">
            <button
              onClick={() => removeEntry(index)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
              type="button"
            >
              <Trash2 size={18} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <Input label="School / University" value={edu.school || ''} onChange={(e) => updateEntry(index, 'school', e.target.value)} />
              <Input label="Degree" value={edu.degree || ''} onChange={(e) => updateEntry(index, 'degree', e.target.value)} />
              <Input label="Field of Study" value={edu.field || ''} onChange={(e) => updateEntry(index, 'field', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <Input label="From Year" type="number" placeholder="YYYY" value={edu.fromYear || ''} onChange={(e) => updateEntry(index, 'fromYear', e.target.value)} />
                <Input label="To Year" type="number" placeholder="YYYY" value={edu.toYear || ''} onChange={(e) => updateEntry(index, 'toYear', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
        {education.length === 0 && <p className="text-gray-500 text-center py-4">No education added yet.</p>}

        <div className="flex justify-end">
          <Button onClick={() => mutation.mutate(education)} loading={mutation.isPending}>
            Save Education
          </Button>
        </div>
      </div>
    </div>
  );
}

function ResumeSection({ resumeUrl }) {
  const [progress, setProgress] = useState(0);
  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (file) => uploadResume(file, (p) => setProgress(Math.round((p.loaded * 100) / (p.total || 1)))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'profile'] });
      toast.success('Resume uploaded successfully!');
      setProgress(0);
    },
    onError: () => {
      toast.error('Failed to upload resume');
      setProgress(0);
    },
  });

  const handleUpload = (files) => {
    if (files && files[0]) {
      mutation.mutate(files[0]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Resume</h2>

      {resumeUrl && (
        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-md flex items-center justify-between">
          <div className="flex items-center text-indigo-700">
            <FileText className="mr-2" />
            <span className="font-medium truncate max-w-xs">Uploaded Resume</span>
          </div>
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:underline font-medium"
          >
            View / Download
          </a>
        </div>
      )}

      <div className="space-y-4">
        <FileUpload
          accept=".pdf,.doc,.docx"
          maxSizeMB={5}
          onFileSelect={handleUpload}
          disabled={mutation.isPending}
        />

        {mutation.isPending && (
          <div className="w-full">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">Uploading...</span>
              <span className="text-xs font-medium text-gray-700">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
