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
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="h-24 w-24 bg-gray-200 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to={isEditMode ? `/admin/partners/${id}` : '/admin/partners'}
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Partner' : 'Create Partner'}
        </h1>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-4 py-5 sm:p-6">
          
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Logo</label>
            <div className="mt-2 flex items-center space-x-6">
              <div className="h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200 border-dashed bg-gray-50 flex items-center justify-center relative">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-gray-400" />
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
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <Upload className="-ml-1 mr-2 h-4 w-4" />
                  <span>{logoPreview ? 'Change Logo' : 'Upload Logo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="sr-only"
                  />
                </label>
                <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 5MB.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            {/* Name */}
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className={clsx(
                    "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md",
                    errors.name && "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                  )}
                  placeholder="Acme Corp"
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Website */}
            <div className="sm:col-span-2">
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website URL
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="website"
                  {...register('website')}
                  className={clsx(
                    "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md",
                    errors.website && "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                  )}
                  placeholder="https://example.com"
                />
              </div>
              {errors.website && (
                <p className="mt-2 text-sm text-red-600">{errors.website.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  rows={4}
                  {...register('description')}
                  className={clsx(
                    "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md",
                    errors.description && "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                  )}
                  placeholder="Brief description of the company..."
                />
              </div>
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(isEditMode ? `/admin/partners/${id}` : '/admin/partners')}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
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
