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
    name: z.string().min(2, 'Naam daalo'),
    email: z.email('Sahi email daalo'),
    phone: z.string().regex(/^[6-9]\d{9}$/, '10 digit ka mobile number daalo'),
    password: z.string().min(8, 'Password kam se kam 8 characters ka ho'),
    password_confirmation: z.string(),
    consent: z.boolean().refine((v) => v, 'Aage badhne ke liye sahmati zaroori hai'),
  })
  .refine((v) => v.password === v.password_confirmation, {
    message: 'Dono password same hone chahiye',
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
      // consent backend ko bhi bhejte hain (DPDP: signup par sahmati ka record)
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
      title="Candidate sign up"
      subtitle="Account banao aur jobs ke liye apply karo"
      footer={
        <>
          Pehle se account hai?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {errors.root && (
          <div role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
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
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input type="checkbox" className="mt-1" {...register('consent')} />
            <span>Main apna data job applications ke liye use hone ki sahmati deta/deti hoon.</span>
          </label>
          {errors.consent && <p className="mt-1 text-sm text-red-600">{errors.consent.message}</p>}
        </div>
        <Button type="submit" loading={isSubmitting} className="w-full">
          Sign up
        </Button>
      </form>
    </AuthCard>
  )
}
