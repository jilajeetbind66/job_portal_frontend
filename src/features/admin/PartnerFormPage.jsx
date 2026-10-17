import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { fetchPartner, createPartner, updatePartner } from './api/partners';
import clsx from 'clsx';

const partnerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255, 'Name cannot exceed 255 characters'),
  slug: z
    .string()
    .min(2, 'Partner URL slug must be at least 2 characters')
    .max(255, 'Partner URL slug cannot exceed 255 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Use only letters, numbers, dashes, and underscores'),
  industry: z.string().max(255, 'Industry cannot exceed 255 characters').optional().or(z.literal('')),
  website: z.string().url('Please enter a valid URL (e.g. https://example.com)').optional().or(z.literal('')),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional().or(z.literal('')),
  max_active_jobs: z.coerce.number().int('Enter a whole number').min(1, 'Limit must be at least 1'),
});

export default function PartnerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: '',
      slug: '',
      industry: '',
      website: '',
      description: '',
      max_active_jobs: 50,
    },
  });
  const partnerName = watch('name');

  useEffect(() => {
    if (!isEditMode && !slugManuallyEdited) {
      const slug = partnerName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setValue('slug', slug);
    }
  }, [isEditMode, partnerName, setValue, slugManuallyEdited]);

  const { data: partner, isLoading: isFetching } = useQuery({
    queryKey: ['admin', 'partners', id],
    queryFn: () => fetchPartner(id),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (isEditMode && partner) {
      const p = partner?.data || partner;
      reset({
        name: p.name || '',
        slug: p.slug || '',
        industry: p.industry || '',
        website: p.website || '',
        description: p.about || p.description || '',
        max_active_jobs: Number(p.max_active_jobs ?? 50),
      });
      if (p.logo || p.logoUrl) {
        setLogoPreview(p.logo || p.logoUrl);
      }
    }
  }, [isEditMode, partner, reset]);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleServerErrors = (error) => {
    Object.entries(error.response?.data?.errors ?? {}).forEach(([field, messages]) => {
      const formField = field === 'about' ? 'description' : field;
      const message = Array.isArray(messages) ? messages[0] : messages;
      setError(formField, { type: 'server', message });
    });
  };

  const createMutation = useMutation({
    mutationFn: (formData) => createPartner(formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'partners'] });
      navigate(`/admin/partners/${data?.data?.id || data?.id || ''}`);
    },
    onError: handleServerErrors,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => updatePartner(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'partners', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'partners'] });
      navigate(`/admin/partners/${id}`);
    },
    onError: handleServerErrors,
  });

  const mutationError = createMutation.error || updateMutation.error;
  const responseData = mutationError?.response?.data;
  const serverValidationMessages = Object.values(responseData?.errors ?? {})
    .flatMap((messages) => (Array.isArray(messages) ? messages : [messages]));
  const rawResponseBody = responseData && !responseData.message && serverValidationMessages.length === 0
    ? (typeof responseData === 'string' ? responseData : JSON.stringify(responseData))
    : null;

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slug', data.slug);
    formData.append('max_active_jobs', String(data.max_active_jobs));
    if (data.industry) formData.append('industry', data.industry);
    if (data.website) formData.append('website', data.website);
    if (data.description) formData.append('about', data.description);
    if (logoFile) formData.append('logo', logoFile);

    if (isEditMode) {
      updateMutation.mutate({ id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isEditMode && isFetching) {
    return (
      <div className="space-y-6 max-w-3xl animate-pulse">
        <div className="h-8 w-48 bg-[#102A2B] rounded"></div>
        <div className="bg-[#0D2224] border border-[#294341] rounded-2xl p-6 space-y-6">
          <div className="h-24 w-24 bg-[#102A2B] rounded-2xl"></div>
          <div className="space-y-4">
            <div className="h-10 bg-[#102A2B] rounded"></div>
            <div className="h-10 bg-[#102A2B] rounded"></div>
            <div className="h-24 bg-[#102A2B] rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Link
          to={isEditMode ? `/admin/partners/${id}` : '/admin/partners'}
          className="text-[#8FAF9A] hover:text-[#F7F8F5] transition-colors p-1.5 rounded-xl bg-[#102A2B] border border-[#294341]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F7F8F5]">
            {isEditMode ? 'Edit Partner' : 'Create Partner'}
          </h1>
          <p className="mt-0.5 text-xs text-[#91A6A0]">
            {isEditMode ? 'Update company credentials and branding assets' : 'Onboard a new hiring partner organization'}
          </p>
        </div>
      </div>

      <div className="bg-[#0D2224] border border-[#294341] shadow-xl rounded-2xl overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 sm:p-8">
          {(createMutation.isError || updateMutation.isError) && (
            <div role="alert" className="rounded-xl border border-rose-800/50 bg-rose-950/40 p-3 text-sm text-rose-300">
              <p className="font-semibold">{mutationError?.response?.status ? `HTTP ${mutationError.response.status}` : 'No HTTP response'}</p>
              {responseData?.message && <p>{responseData.message}</p>}
              {serverValidationMessages.map((message) => <p key={message}>{message}</p>)}
              {rawResponseBody && <pre className="mt-2 whitespace-pre-wrap break-words">{rawResponseBody}</pre>}
              {!responseData?.message && serverValidationMessages.length === 0 && !rawResponseBody && (
                <p>{mutationError?.message || 'Unable to save this partner. Please check the details and try again.'}</p>
              )}
            </div>
          )}
          
          {/* Logo Upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8FAF9A] mb-2">
              Company Logo
            </label>
            <div className="flex items-center space-x-6">
              <div className="h-20 w-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-dashed border-[#294341] bg-[#102A2B] flex items-center justify-center relative group">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-[#8FAF9A]" />
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleLogoChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Upload logo"
                />
              </div>
              <div>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-[#294341] shadow-sm text-xs font-semibold rounded-xl text-[#8FAF9A] bg-[#102A2B] hover:bg-[#153536] hover:text-[#F7F8F5] transition-colors">
                  <Upload className="-ml-1 mr-2 h-4 w-4 text-[#8FAF9A]" />
                  <span>{logoPreview ? 'Change Logo' : 'Upload Logo'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleLogoChange}
                    className="sr-only"
                  />
                </label>
                <p className="mt-2 text-xs text-[#91A6A0]">JPG, PNG or WEBP up to 2MB.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            {/* Name */}
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-[#8FAF9A] mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className={clsx(
                  "shadow-inner block w-full text-xs rounded-xl border border-[#294341] bg-[#102A2B] px-3.5 py-2.5 text-[#F7F8F5] placeholder-[#91A6A0]/50 focus:border-[#2F7D5B] focus:outline-none focus:ring-1 focus:ring-[#2F7D5B]",
                  errors.name && "border-rose-500 focus:border-rose-500 focus:ring-rose-500"
                )}
                placeholder="e.g. Infosys, Wipro, Zomato"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-rose-400">{errors.name.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="slug" className="block text-xs font-semibold uppercase tracking-wider text-[#8FAF9A] mb-2">
                Partner URL Slug *
              </label>
              <input
                type="text"
                id="slug"
                {...register('slug', { onChange: () => setSlugManuallyEdited(true) })}
                className={clsx(
                  'shadow-inner block w-full text-xs rounded-xl border border-[#294341] bg-[#102A2B] px-3.5 py-2.5 text-[#F7F8F5] placeholder-[#91A6A0]/50 focus:border-[#2F7D5B] focus:outline-none focus:ring-1 focus:ring-[#2F7D5B]',
                  errors.slug && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                )}
                placeholder="company-name"
              />
              {errors.slug && <p className="mt-1.5 text-xs text-rose-400">{errors.slug.message}</p>}
            </div>

            <div>
              <label htmlFor="industry" className="block text-xs font-semibold uppercase tracking-wider text-[#8FAF9A] mb-2">
                Industry
              </label>
              <input
                type="text"
                id="industry"
                {...register('industry')}
                className="shadow-inner block w-full text-xs rounded-xl border border-[#294341] bg-[#102A2B] px-3.5 py-2.5 text-[#F7F8F5] placeholder-[#91A6A0]/50 focus:border-[#2F7D5B] focus:outline-none focus:ring-1 focus:ring-[#2F7D5B]"
                placeholder="e.g. Information Technology"
              />
              {errors.industry && <p className="mt-1.5 text-xs text-rose-400">{errors.industry.message}</p>}
            </div>

            <div>
              <label htmlFor="max_active_jobs" className="block text-xs font-semibold uppercase tracking-wider text-[#8FAF9A] mb-2">
                Active Job Limit *
              </label>
              <input
                type="number"
                id="max_active_jobs"
                min="1"
                {...register('max_active_jobs', { valueAsNumber: true })}
                className={clsx(
                  'shadow-inner block w-full text-xs rounded-xl border border-[#294341] bg-[#102A2B] px-3.5 py-2.5 text-[#F7F8F5] focus:border-[#2F7D5B] focus:outline-none focus:ring-1 focus:ring-[#2F7D5B]',
                  errors.max_active_jobs && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                )}
              />
              {errors.max_active_jobs && <p className="mt-1.5 text-xs text-rose-400">{errors.max_active_jobs.message}</p>}
            </div>

            {/* Website */}
            <div className="sm:col-span-2">
              <label htmlFor="website" className="block text-xs font-semibold uppercase tracking-wider text-[#8FAF9A] mb-2">
                Website URL
              </label>
              <input
                type="text"
                id="website"
                {...register('website')}
                className={clsx(
                  "shadow-inner block w-full text-xs rounded-xl border border-[#294341] bg-[#102A2B] px-3.5 py-2.5 text-[#F7F8F5] placeholder-[#91A6A0]/50 focus:border-[#2F7D5B] focus:outline-none focus:ring-1 focus:ring-[#2F7D5B]",
                  errors.website && "border-rose-500 focus:border-rose-500 focus:ring-rose-500"
                )}
                placeholder="https://company.com"
              />
              {errors.website && (
                <p className="mt-1.5 text-xs text-rose-400">{errors.website.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-[#8FAF9A] mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                {...register('description')}
                className={clsx(
                  "shadow-inner block w-full text-xs rounded-xl border border-[#294341] bg-[#102A2B] px-3.5 py-2.5 text-[#F7F8F5] placeholder-[#91A6A0]/50 focus:border-[#2F7D5B] focus:outline-none focus:ring-1 focus:ring-[#2F7D5B]",
                  errors.description && "border-rose-500 focus:border-rose-500 focus:ring-rose-500"
                )}
                placeholder="Brief description of the partner organization, industry, and workforce culture..."
              />
              {errors.description && (
                <p className="mt-1.5 text-xs text-rose-400">{errors.description.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#294341]">
            <button
              type="button"
              onClick={() => navigate(isEditMode ? `/admin/partners/${id}` : '/admin/partners')}
              className="px-4 py-2 border border-[#294341] shadow-sm text-xs font-semibold rounded-xl text-[#8FAF9A] bg-[#102A2B] hover:bg-[#153536] hover:text-[#F7F8F5] transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center items-center px-4 py-2 border border-[#2F7D5B]/50 shadow-md text-xs font-semibold rounded-xl text-white bg-[#2F7D5B] hover:bg-[#246347] transition-all disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
              {isEditMode ? 'Save Changes' : 'Create Partner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
