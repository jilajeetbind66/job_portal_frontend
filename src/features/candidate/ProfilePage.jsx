import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  Trash2,
  Plus,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building,
  GraduationCap,
  Briefcase,
  User,
  ExternalLink,
  Download,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Award,
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { Button, Input, TagInput, FileUpload } from '@/components';
import { fetchProfile, updateProfile, uploadResume } from '@/features/public/api/jobs';

function calculateCompleteness(profile) {
  if (!profile) return 0;
  let score = 0;
  if (profile.name) score += 15;
  if (profile.headline) score += 15;
  if (profile.phone && profile.location) score += 15;
  if (profile.bio) score += 15;
  if (profile.skills && profile.skills.length >= 3) score += 15;
  if (profile.experience && profile.experience.length >= 1) score += 15;
  if (profile.education && profile.education.length >= 1) score += 10;
  if (profile.resume_url) score += 15;
  return Math.min(100, score);
}

export default function ProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['candidate', 'profile'],
    queryFn: fetchProfile,
  });

  const completeness = useMemo(() => {
    return calculateCompleteness(profile);
  }, [profile]);

  const progressColor =
    completeness < 40 ? 'bg-red-500' : completeness < 80 ? 'bg-amber-500' : 'bg-emerald-500';

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-full" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-slate-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Your Profile</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your credentials, professional experience, skills, and resume for recruiters.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
            {profile?.name ? profile.name[0].toUpperCase() : 'C'}
          </div>
        </div>
      </div>

      {/* Completeness Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-800">Profile Completeness</h2>
          </div>
          <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {completeness}% Complete
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${completeness}%` }}
          />
        </div>
        {completeness < 100 && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">Quick tip to reach 100%:</span>
            {!profile?.resume_url && <span className="text-indigo-600">• Upload your resume</span>}
            {(!profile?.skills || profile.skills.length < 3) && (
              <span className="text-indigo-600">• Add at least 3 skills</span>
            )}
            {(!profile?.experience || profile.experience.length === 0) && (
              <span className="text-indigo-600">• Add past work experience</span>
            )}
            {(!profile?.education || profile.education.length === 0) && (
              <span className="text-indigo-600">• Add education details</span>
            )}
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-6">
        <PersonalInfoSection profile={profile} />
        <ResumeSection profile={profile} />
        <SkillsSection initialSkills={profile?.skills || []} />
        <ExperienceSection initialExperience={profile?.experience || []} />
        <EducationSection initialEducation={profile?.education || []} />
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
      toast.success('Personal info updated successfully!');
    },
    onError: () => toast.error('Failed to update personal info'),
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <User className="h-5 w-5 text-indigo-600" />
        <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
      </div>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          <Input
            label="Professional Headline"
            placeholder="e.g. Senior Full Stack Engineer | React & Node"
            {...register('headline')}
          />
          <Input
            label="Phone Number"
            placeholder="+91 98765 43210"
            {...register('phone')}
          />
          <Input
            label="Current Location"
            placeholder="Bangalore, India"
            {...register('location')}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            About Me / Summary
          </label>
          <textarea
            rows={3}
            placeholder="Brief overview of your experience, key skills, and what kind of roles you are targeting..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            {...register('bio')}
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" loading={mutation.isPending}>
            Save Personal Info
          </Button>
        </div>
      </form>
    </div>
  );
}

function ResumeSection({ profile }) {
  const [progress, setProgress] = useState(0);
  const [parsedData, setParsedData] = useState(null);
  const toast = useToast();
  const queryClient = useQueryClient();

  const resumeUrl = profile?.resume_url;

  const mutation = useMutation({
    mutationFn: (file) =>
      uploadResume(file, (p) =>
        setProgress(Math.round((p.loaded * 100) / (p.total || 1)))
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'profile'] });
      toast.success('Resume uploaded successfully!');
      setProgress(0);
      if (data?.parsed_data) {
        setParsedData(data.parsed_data);
      }
    },
    onError: () => {
      toast.error('Failed to upload resume. Please try again.');
      setProgress(0);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'profile'] });
      toast.success('Extracted profile details applied!');
      setParsedData(null);
    },
  });

  const handleApplyParsed = () => {
    if (!parsedData) return;
    const existingSkills = profile?.skills || [];
    const newSkills = Array.from(new Set([...existingSkills, ...(parsedData.suggested_skills || [])]));
    updateMutation.mutate({
      skills: newSkills,
      headline: profile?.headline || parsedData.suggested_headline,
    });
  };

  const handleUpload = (files) => {
    if (files && files[0]) {
      mutation.mutate(files[0]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Resume & CV</h2>
        </div>
        <span className="text-xs text-slate-500">PDF, DOC, DOCX up to 5MB</span>
      </div>

      {resumeUrl && (
        <div className="mb-4 p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {profile?.resume_name || 'Uploaded_Resume.pdf'}
              </p>
              <p className="text-[11px] text-indigo-600 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Ready for job applications</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 shadow-2xs transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>View Resume</span>
            </a>
          </div>
        </div>
      )}

      {/* Smart Resume Parser Suggestion Box */}
      {parsedData && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 transition-all">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700 shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-900">
                  Smart Resume Parser Found Details
                </h4>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {parsedData.confidence_score}% match
                </span>
              </div>
              <p className="mt-1 text-xs text-emerald-800">
                Suggested skills: <strong>{parsedData.suggested_skills?.join(', ')}</strong>
              </p>
              {parsedData.suggested_headline && (
                <p className="mt-0.5 text-xs text-emerald-800">
                  Suggested headline: <em>"{parsedData.suggested_headline}"</em>
                </p>
              )}
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleApplyParsed}
                  loading={updateMutation.isPending}
                >
                  Apply Suggested Skills to Profile
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setParsedData(null)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
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
          <div className="w-full space-y-1">
            <div className="flex justify-between text-xs font-medium text-slate-700">
              <span>Uploading & parsing resume...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
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
      toast.success('Skills updated successfully!');
    },
    onError: () => toast.error('Failed to update skills'),
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Key Skills & Competencies</h2>
        </div>
        <span className="text-xs text-slate-500">{skills.length} skills added</span>
      </div>

      <div className="space-y-4">
        <TagInput
          tags={skills}
          setTags={setSkills}
          placeholder="Type skill (e.g. React, Node.js, AWS) and press Enter..."
        />
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
      toast.success('Experience saved successfully!');
    },
    onError: () => toast.error('Failed to update experience'),
  });

  const addEntry = () => {
    setExperience([
      ...experience,
      { company: '', title: '', from: '', to: '', current: false, description: '' },
    ]);
  };

  const removeEntry = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const updateEntry = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    if (field === 'current' && value === true) {
      updated[index]['to'] = '';
    }
    setExperience(updated);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Work Experience</h2>
        </div>
        <Button variant="secondary" size="sm" onClick={addEntry}>
          <Plus size={15} className="mr-1" /> Add Experience
        </Button>
      </div>

      <div className="space-y-6">
        {experience.map((exp, index) => (
          <div
            key={index}
            className="p-5 border border-slate-200 rounded-xl relative bg-slate-50/60 shadow-2xs space-y-4"
          >
            <button
              onClick={() => removeEntry(index)}
              className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition-colors"
              type="button"
              aria-label="Remove experience entry"
            >
              <Trash2 size={16} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <Input
                label="Job Title"
                placeholder="Senior Frontend Developer"
                value={exp.title || ''}
                onChange={(e) => updateEntry(index, 'title', e.target.value)}
              />
              <Input
                label="Company Name"
                placeholder="Acme Technologies"
                value={exp.company || ''}
                onChange={(e) => updateEntry(index, 'company', e.target.value)}
              />
              <Input
                type="month"
                label="Start Date"
                value={exp.from || ''}
                onChange={(e) => updateEntry(index, 'from', e.target.value)}
              />
              <div>
                <Input
                  type="month"
                  label="End Date"
                  value={exp.to || ''}
                  onChange={(e) => updateEntry(index, 'to', e.target.value)}
                  disabled={exp.current}
                />
                <label className="flex items-center mt-2 text-xs font-medium text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exp.current || false}
                    onChange={(e) => updateEntry(index, 'current', e.target.checked)}
                    className="mr-2 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  I currently work here
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Key Responsibilities & Achievements
              </label>
              <textarea
                rows={3}
                placeholder="Led development of key features, optimized application performance..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                value={exp.description || ''}
                onChange={(e) => updateEntry(index, 'description', e.target.value)}
              />
            </div>
          </div>
        ))}

        {experience.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-6">
            No work experience added yet. Click &quot;Add Experience&quot; to showcase your employment background.
          </p>
        )}

        <div className="flex justify-end pt-2">
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
      toast.success('Education saved successfully!');
    },
    onError: () => toast.error('Failed to update education'),
  });

  const addEntry = () => {
    setEducation([
      ...education,
      { school: '', degree: '', field: '', fromYear: '', toYear: '' },
    ]);
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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Education & Qualifications</h2>
        </div>
        <Button variant="secondary" size="sm" onClick={addEntry}>
          <Plus size={15} className="mr-1" /> Add Education
        </Button>
      </div>

      <div className="space-y-6">
        {education.map((edu, index) => (
          <div
            key={index}
            className="p-5 border border-slate-200 rounded-xl relative bg-slate-50/60 shadow-2xs space-y-4"
          >
            <button
              onClick={() => removeEntry(index)}
              className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition-colors"
              type="button"
              aria-label="Remove education entry"
            >
              <Trash2 size={16} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <Input
                label="Institution / University"
                placeholder="IIT Bombay, Delhi University"
                value={edu.school || ''}
                onChange={(e) => updateEntry(index, 'school', e.target.value)}
              />
              <Input
                label="Degree / Certificate"
                placeholder="B.Tech, B.Sc, Master's"
                value={edu.degree || ''}
                onChange={(e) => updateEntry(index, 'degree', e.target.value)}
              />
              <Input
                label="Field of Study"
                placeholder="Computer Science, Electronics"
                value={edu.field || ''}
                onChange={(e) => updateEntry(index, 'field', e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="From Year"
                  type="number"
                  placeholder="2018"
                  value={edu.fromYear || ''}
                  onChange={(e) => updateEntry(index, 'fromYear', e.target.value)}
                />
                <Input
                  label="To Year"
                  type="number"
                  placeholder="2022"
                  value={edu.toYear || ''}
                  onChange={(e) => updateEntry(index, 'toYear', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        {education.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-6">
            No education entries added yet. Click &quot;Add Education&quot; to add your academic background.
          </p>
        )}

        <div className="flex justify-end pt-2">
          <Button onClick={() => mutation.mutate(education)} loading={mutation.isPending}>
            Save Education
          </Button>
        </div>
      </div>
    </div>
  );
}
