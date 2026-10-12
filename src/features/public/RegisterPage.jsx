import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input } from '@/components'
import { useAuth } from '@/auth/useAuth'
import { applyServerErrors, getErrorMessage } from '@/api/errors'
import AuthCard from './AuthCard'

const schema = z
  .object({
    name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string(),
    consent: z.boolean().refine((v) => v, 'Consent is required to proceed'),
  })
  .refine((v) => v.password === v.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  })

export default function RegisterPage() {
  const { register: signUp } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { consent: false } })

  const onSubmit = async ({ consent, ...payload }) => {
    try {
      await signUp({ ...payload, consent })
      navigate('/verify-email', { replace: true })
    } catch (error) {
      if (!applyServerErrors(error, setError)) {
        setError('root', { message: getErrorMessage(error) })
      }
    }
  }

  return (
    <AuthCard
      title="Candidate Sign Up"
      subtitle="Create your account and apply for jobs across India"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#D6A84F] hover:text-[#E5B866] underline">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {errors.root && (
          <div role="alert" className="rounded-xl bg-rose-950/40 border border-rose-800/40 p-3 text-xs text-rose-300">
            {errors.root.message}
          </div>
        )}
        <Input
          label="Full name"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Mobile number"
          type="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />
        <div>
          <label className="flex items-start gap-2.5 text-xs text-[#8FAF9A] cursor-pointer">
            <input type="checkbox" className="mt-0.5 rounded border-[#294341] bg-[#102A2B] text-[#2F7D5B] focus:ring-[#2F7D5B]" {...register('consent')} />
            <span>I agree to the processing of my personal data for job applications under the Terms of Service and Privacy Policy.</span>
          </label>
          {errors.consent && <p className="mt-1 text-xs text-rose-400">{errors.consent.message}</p>}
        </div>
        <Button type="submit" loading={isSubmitting} className="w-full">
          Sign up
        </Button>
      </form>
    </AuthCard>
  )
}
