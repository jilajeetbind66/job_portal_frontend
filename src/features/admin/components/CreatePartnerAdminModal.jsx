import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, X, ShieldCheck } from 'lucide-react';
import { createPartnerAdmin } from '../api/partners';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

export default function CreatePartnerAdminModal({ open, onClose, partnerId, onSuccess }) {
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '' }
  });

  const mutation = useMutation({
    mutationFn: (data) => createPartnerAdmin(partnerId, data),
    onError: (error) => {
      Object.entries(error.response?.data?.errors ?? {}).forEach(([field, messages]) => {
        const message = Array.isArray(messages) ? messages[0] : messages;
        setError(field, { type: 'server', message });
      });
    },
    onSuccess: () => {
      reset();
      onSuccess?.();
      onClose();
    },
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Reset form when modal is closed
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  if (!open) return null;

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const serverValidationMessages = Object.values(mutation.error?.response?.data?.errors ?? {})
    .flatMap((messages) => (Array.isArray(messages) ? messages : [messages]));
  const responseData = mutation.error?.response?.data;
  const rawResponseBody = responseData && !responseData.message && serverValidationMessages.length === 0
    ? (typeof responseData === 'string' ? responseData : JSON.stringify(responseData))
    : null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07151A]/85 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-[#0D2224] border border-[#294341] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#294341] bg-[#102A2B]/40 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2F7D5B]/20 border border-[#2F7D5B]/30 text-[#B9D8C4]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[#F7F8F5]">Create Partner Admin</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-[#91A6A0] hover:text-[#F7F8F5] p-1.5 rounded-lg hover:bg-[#102A2B] transition-colors"
            disabled={mutation.isPending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-[#8FAF9A] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className="block w-full rounded-xl border border-[#294341] bg-[#102A2B] px-3 py-2 text-sm text-[#F7F8F5] placeholder-[#91A6A0]/50 shadow-inner focus:border-[#2F7D5B] focus:outline-none focus:ring-1 focus:ring-[#2F7D5B]"
                placeholder="Partner Administrator Name"
                disabled={mutation.isPending}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#8FAF9A] uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="block w-full rounded-xl border border-[#294341] bg-[#102A2B] px-3 py-2 text-sm text-[#F7F8F5] placeholder-[#91A6A0]/50 shadow-inner focus:border-[#2F7D5B] focus:outline-none focus:ring-1 focus:ring-[#2F7D5B]"
                placeholder="admin@partner.com"
                disabled={mutation.isPending}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
              )}
            </div>
            
            {mutation.isError && (
              <div role="alert" className="p-3 bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs rounded-xl">
                <p className="font-semibold">{mutation.error?.response?.status ? `HTTP ${mutation.error.response.status}` : 'No HTTP response'}</p>
                {responseData?.message && <p>{responseData.message}</p>}
                {serverValidationMessages.map((message) => <p key={message}>{message}</p>)}
                {rawResponseBody && <pre className="mt-2 whitespace-pre-wrap break-words">{rawResponseBody}</pre>}
                {!responseData?.message && serverValidationMessages.length === 0 && !rawResponseBody && (
                  <p>{mutation.error?.message || 'Failed to create partner admin. Please verify data and try again.'}</p>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#294341]">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="px-4 py-2 text-xs font-semibold text-[#8FAF9A] bg-[#102A2B] border border-[#294341] rounded-xl hover:bg-[#153536] hover:text-[#F7F8F5] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#2F7D5B] hover:bg-[#246347] border border-[#2F7D5B]/50 rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Admin
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
