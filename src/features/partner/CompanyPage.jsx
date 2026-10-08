import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Upload,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Plus,
  X,
  ExternalLink,
} from 'lucide-react'
import { clsx } from 'clsx'
import { ROLES } from '@/constants'
import { useAuth } from '@/auth/useAuth'
import {
  fetchCompanyProfile,
  updateCompanyProfile,
  uploadCompanyLogo,
} from './api/company'

const companySchema = z.object({
  name: z.string().min(2, 'Company legal name is required'),
  display_name: z.string().min(2, 'Display name is required'),
  tagline: z.string().optional(),
  industry: z.string().min(2, 'Industry is required'),
  company_size: z.string().min(1, 'Please select company size'),
  website: z.string().url('Please enter a valid website URL'),
  email: z.string().email('Please enter a valid contact email').optional().or(z.literal('')),
  phone: z.string().optional(),
  location: z.string().min(2, 'Headquarters location is required'),
  address: z.string().optional(),
  description: z.string().min(20, 'Please enter a description of at least 20 characters'),
  founded_year: z.coerce.number().min(1800).max(new Date().getFullYear()).optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
})

export default function CompanyPage() {
  const { role: currentUserRole, can } = useAuth()
  const queryClient = useQueryClient()

  // Only partner_admin can modify company details
  const isPartnerAdmin = currentUserRole === ROLES.PARTNER_ADMIN

  const [logoPreview, setLogoPreview] = useState(null)
  const [logoFile, setLogoFile] = useState(null)
  const [benefitsList, setBenefitsList] = useState([])
  const [newBenefitInput, setNewBenefitInput] = useState('')
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false)

  const { data: response, isLoading, isError, error } = useQuery({
    queryKey: ['partner', 'company'],
    queryFn: fetchCompanyProfile,
  })

  const company = response?.data

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      display_name: '',
      tagline: '',
      industry: 'Software & Technology',
      company_size: '51-200',
      website: '',
      email: '',
      phone: '',
      location: '',
      address: '',
      description: '',
      founded_year: 2020,
      linkedin: '',
      twitter: '',
    },
  })

  useEffect(() => {
    if (company) {
      reset({
        name: company.name || '',
        display_name: company.display_name || '',
        tagline: company.tagline || '',
        industry: company.industry || 'Software & Technology',
        company_size: company.company_size || '51-200',
        website: company.website || '',
        email: company.email || '',
        phone: company.phone || '',
        location: company.location || '',
        address: company.address || '',
        description: company.description || '',
        founded_year: company.founded_year || 2020,
        linkedin: company.linkedin || '',
        twitter: company.twitter || '',
      })
      setLogoPreview(company.logo_url || null)
      setBenefitsList(Array.isArray(company.benefits) ? company.benefits : [])
    }
  }, [company, reset])

  // Save profile mutation
  const saveMutation = useMutation({
    mutationFn: async (formData) => {
      // If a new logo file was selected, upload it first
      if (logoFile) {
        await uploadCompanyLogo(logoFile)
      }
      return updateCompanyProfile({
        ...formData,
        benefits: benefitsList,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner', 'company'] })
      setSaveSuccessMsg(true)
      setTimeout(() => setSaveSuccessMsg(false), 4000)
    },
  })

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleAddBenefit = () => {
    if (newBenefitInput.trim() && !benefitsList.includes(newBenefitInput.trim())) {
      setBenefitsList([...benefitsList, newBenefitInput.trim()])
      setNewBenefitInput('')
    }
  }

  const handleRemoveBenefit = (index) => {
    setBenefitsList(benefitsList.filter((_, i) => i !== index))
  }

  const onSubmit = (data) => {
    saveMutation.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-xl" />
        <div className="h-44 rounded-2xl bg-white border border-slate-200 p-6" />
        <div className="h-72 rounded-2xl bg-white border border-slate-200 p-6" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
        <AlertCircle className="mx-auto h-8 w-8 text-rose-600 mb-2" />
        <h3 className="font-bold text-sm">Failed to load company profile</h3>
        <p className="text-xs mt-1">{error?.message}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Company Profile & Branding
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Customize how your organization appears on public job postings, candidate search, and partner listings.
          </p>
        </div>

        {company?.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Globe className="h-3.5 w-3.5 text-indigo-600" />
            Visit Website
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>
        )}
      </div>

      {/* Role permission alert */}
      {!isPartnerAdmin && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            You have read-only access. Only users with <strong>Partner Admin</strong> role can edit company profile details and branding assets.
          </span>
        </div>
      )}

      {/* Success Banner */}
      {saveSuccessMsg && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">Company profile has been successfully saved!</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* SECTION 1: Brand & Logo */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-900">
            <Building2 className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-semibold">1. Brand Identity & Logo</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Logo Preview Avatar */}
            <div className="relative group">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 shadow-inner">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Company Logo Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="h-10 w-10 text-slate-400" />
                )}
              </div>
            </div>

            {/* Logo Upload Control */}
            <div className="space-y-1.5 flex-1">
              <h3 className="text-sm font-bold text-slate-900">Company Logo</h3>
              <p className="text-xs text-slate-500">
                Recommended dimensions: 400x400px. PNG, JPG or SVG up to 2MB.
              </p>
              {isPartnerAdmin && (
                <div className="pt-1">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                    <Upload className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Upload New Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 pt-2">
            {/* Legal Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Legal Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={!isPartnerAdmin}
                {...register('name')}
                placeholder="TechCorp Solutions Private Limited"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brand / Display Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={!isPartnerAdmin}
                {...register('display_name')}
                placeholder="TechCorp"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              {errors.display_name && <p className="mt-1 text-xs text-rose-600">{errors.display_name.message}</p>}
            </div>

            {/* Tagline */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Tagline / One-liner
              </label>
              <input
                type="text"
                disabled={!isPartnerAdmin}
                {...register('tagline')}
                placeholder="e.g. Innovating the future of enterprise cloud computing"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: General Info & Industry */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-900">
            <Globe className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-semibold">2. Industry & Organization Details</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {/* Industry */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Industry Domain <span className="text-rose-500">*</span>
              </label>
              <select
                disabled={!isPartnerAdmin}
                {...register('industry')}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 bg-white disabled:bg-slate-50 disabled:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Software & Technology">Software & Technology</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                <option value="Telecommunications">Telecommunications</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Education & EdTech">Education & EdTech</option>
              </select>
            </div>

            {/* Company Size */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Size (Employees) <span className="text-rose-500">*</span>
              </label>
              <select
                disabled={!isPartnerAdmin}
                {...register('company_size')}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 bg-white disabled:bg-slate-50 disabled:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="1-10">1-10 employees (Startup)</option>
                <option value="11-50">11-50 employees (Early Growth)</option>
                <option value="51-200">51-200 employees (Mid Size)</option>
                <option value="201-500">201-500 employees (Scale-up)</option>
                <option value="500+">500+ employees (Enterprise)</option>
              </select>
            </div>

            {/* Founded Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Founded Year
              </label>
              <input
                type="number"
                disabled={!isPartnerAdmin}
                {...register('founded_year')}
                placeholder="2018"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Website URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Website URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                disabled={!isPartnerAdmin}
                {...register('website')}
                placeholder="https://company.com"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              {errors.website && <p className="mt-1 text-xs text-rose-600">{errors.website.message}</p>}
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Careers / Contact Email
              </label>
              <input
                type="email"
                disabled={!isPartnerAdmin}
                {...register('email')}
                placeholder="careers@company.com"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                disabled={!isPartnerAdmin}
                {...register('phone')}
                placeholder="+91 80 1234 5678"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Locations & Description */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-900">
            <MapPin className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-semibold">3. Headquarters Location & About</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Headquarters City / State <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={!isPartnerAdmin}
                {...register('location')}
                placeholder="Bangalore, Karnataka, India"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              {errors.location && <p className="mt-1 text-xs text-rose-600">{errors.location.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Physical Office Address
              </label>
              <input
                type="text"
                disabled={!isPartnerAdmin}
                {...register('address')}
                placeholder="Floor 4, Cyber Towers, Electronic City"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                About the Organization <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={5}
                disabled={!isPartnerAdmin}
                {...register('description')}
                placeholder="Provide a compelling overview of your company mission, culture, technologies, and achievements..."
                className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description.message}</p>}
            </div>
          </div>
        </div>

        {/* SECTION 4: Benefits & Perks */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-900">
            <CheckCircle2 className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-semibold">4. Key Benefits & Work Perks</h2>
          </div>

          <p className="text-xs text-slate-500">
            Highlight employee perks that make your workplace attractive to candidate applicants.
          </p>

          {/* Benefits Tags List */}
          <div className="flex flex-wrap gap-2 pt-1">
            {benefitsList.map((benefit, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100"
              >
                <span>{benefit}</span>
                {isPartnerAdmin && (
                  <button
                    type="button"
                    onClick={() => handleRemoveBenefit(idx)}
                    className="hover:text-indigo-900 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))}
          </div>

          {/* Add Benefit Input */}
          {isPartnerAdmin && (
            <div className="flex items-center gap-2 pt-2 max-w-md">
              <input
                type="text"
                value={newBenefitInput}
                onChange={(e) => setNewBenefitInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddBenefit()
                  }
                }}
                placeholder="e.g. Remote Work Stipend, Health Insurance..."
                className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="button"
                onClick={handleAddBenefit}
                className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
          )}
        </div>

        {/* Submit Bar */}
        {isPartnerAdmin && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-50"
            >
              {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Profile Changes
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

