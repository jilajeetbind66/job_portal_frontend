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
          <Link to="/register" className="font-medium text-indigo-600 hover:underline">
            Sign up
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
        <div className="text-right text-sm">
          <Link to="/forgot-password" className="text-indigo-600 hover:underline">
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
