import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input } from '@/components'
import { resetPasswordRequest } from '@/api/auth'
import { applyServerErrors, getErrorMessage } from '@/api/errors'
import { useToast } from '@/hooks/useToast'
import AuthCard from './AuthCard'

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string(),
  })
  .refine((v) => v.password === v.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  })

// Reset link delivered via email: /reset-password?token=...&email=...
export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const email = params.get('email')
  const navigate = useNavigate()
  const toast = useToast()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  if (!token || !email) {
    return (
      <AuthCard title="Invalid or Expired Link">
        <p className="text-xs text-[#91A6A0] leading-relaxed">
          This password reset link is invalid or has expired.{' '}
          <Link to="/forgot-password" className="font-semibold text-[#D6A84F] hover:text-[#E5B866] underline">
            Request a new link
          </Link>
        </p>
      </AuthCard>
    )
  }

  const onSubmit = async (values) => {
    try {
      await resetPasswordRequest({ token, email, ...values })
      toast.success('Password successfully reset. You can now login.')
      navigate('/login', { replace: true })
    } catch (error) {
      if (!applyServerErrors(error, setError)) {
        setError('root', { message: getErrorMessage(error) })
      }
    }
  }

  return (
    <AuthCard
      title="Set New Password"
      subtitle={`Choose a new password for ${email}`}
      footer={
        <Link to="/login" className="font-semibold text-[#D6A84F] hover:text-[#E5B866] underline">
          Back to Login
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {errors.root && (
          <div role="alert" className="rounded-xl bg-rose-950/40 border border-rose-800/40 p-3 text-xs text-rose-300">
            {errors.root.message}
          </div>
        )}
        <Input
          label="New password"
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
        <Button type="submit" loading={isSubmitting} className="w-full">
          Set password
        </Button>
      </form>
    </AuthCard>
  )
}
