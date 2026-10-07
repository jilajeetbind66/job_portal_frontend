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
    password: z.string().min(8, 'Password kam se kam 8 characters ka ho'),
    password_confirmation: z.string(),
  })
  .refine((v) => v.password === v.password_confirmation, {
    message: 'Dono password same hone chahiye',
    path: ['password_confirmation'],
  })

// Email me link aata hai: /reset-password?token=...&email=...
// Partner users ka "set password" link bhi yahi page use karta hai.
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
      <AuthCard title="Link sahi nahi hai">
        <p className="text-sm text-gray-600">
          Ye reset link adhura ya purana hai.{' '}
          <Link to="/forgot-password" className="text-indigo-600 hover:underline">
            Naya link mangao
          </Link>
        </p>
      </AuthCard>
    )
  }

  const onSubmit = async (values) => {
    try {
      await resetPasswordRequest({ token, email, ...values })
      toast.success('Password set ho gaya. Ab login karo.')
      navigate('/login', { replace: true })
    } catch (error) {
      if (!applyServerErrors(error, setError)) {
        setError('root', { message: getErrorMessage(error) })
      }
    }
  }

  return (
    <AuthCard title="Naya password set karo" subtitle={email}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {(errors.root || errors.email) && (
          <div role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {errors.root?.message ?? errors.email?.message}
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
