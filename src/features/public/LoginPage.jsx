import { Link, Navigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input } from '@/components'
import { ROLE_HOME } from '@/constants'
import { useAuth } from '@/auth/useAuth'
import { applyServerErrors, getErrorMessage } from '@/api/errors'
import AuthCard from './AuthCard'

const schema = z.object({
  email: z.email('Sahi email daalo'),
  password: z.string().min(1, 'Password daalo'),
})

export default function LoginPage() {
  const { login, isAuthenticated, role } = useAuth()
  const location = useLocation()
  const from = location.state?.from?.pathname
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  // Login hote hi (ya pehle se logged in ho to) role ke portal par bhejo
  if (isAuthenticated) return <Navigate to={from ?? ROLE_HOME[role] ?? '/'} replace />

  const onSubmit = async (values) => {
    try {
      await login(values)
    } catch (error) {
      if (!applyServerErrors(error, setError)) {
        setError('root', { message: getErrorMessage(error) })
      }
    }
  }

  return (
    <AuthCard
      title="Login"
      subtitle="Apne account me sign in karo"
      footer={
        <>
          Naya account?{' '}
          <Link to="/register" className="font-semibold text-[#D6A84F] hover:text-[#E5B866] underline">
            Sign up
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
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="text-right text-xs">
          <Link to="/forgot-password" className="text-[#8FAF9A] hover:text-[#F7F8F5] transition-colors">
            Password bhool gaye?
          </Link>
        </div>
        <Button type="submit" loading={isSubmitting} className="w-full">
          Login
        </Button>
      </form>
    </AuthCard>
  )
}
