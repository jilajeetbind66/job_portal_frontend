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
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  website: z.string().url('Please enter a valid URL (e.g. https://example.com)').optional().or(z.literal('')),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional().or(z.literal('')),
});

export default function PartnerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: '',
      website: '',
      description: '',
    },
  });

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
        website: p.website || '',
        description: p.description || '',
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

  const createMutation = useMutation({
    mutationFn: (formData) => createPartner(formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'partners'] });
      navigate(`/admin/partners/${data?.data?.id || data?.id || ''}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => updatePartner(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'partners', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'partners'] });
      navigate(`/admin/partners/${id}`);
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.website) formData.append('website', data.website);
    if (data.description) formData.append('description', data.description);
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
                  accept="image/*"
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
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="sr-only"
                  />
                </label>
                <p className="mt-2 text-xs text-[#91A6A0]">PNG, JPG, SVG or WEBP up to 5MB.</p>
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
