import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input } from '@/components'
import { forgotPasswordRequest } from '@/api/auth'
import { applyServerErrors, getErrorMessage } from '@/api/errors'
import AuthCard from './AuthCard'

const schema = z.object({ email: z.email('Sahi email daalo') })

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async ({ email }) => {
    try {
      await forgotPasswordRequest(email)
      setSent(true)
    } catch (error) {
      if (!applyServerErrors(error, setError)) {
        setError('root', { message: getErrorMessage(error) })
      }
    }
  }

  return (
    <AuthCard
      title="Forgot password"
      subtitle="Email daalo, hum reset link bhejenge"
      footer={
        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
          Login par wapas jao
        </Link>
      }
    >
      {sent ? (
        <p role="status" className="rounded-md bg-green-50 p-3 text-sm text-green-800">
          Agar ye email registered hai to reset link bhej diya gaya hai. Apna inbox check karo.
        </p>
      ) : (
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
          <Button type="submit" loading={isSubmitting} className="w-full">
            Send reset link
          </Button>
        </form>
      )}
    </AuthCard>
  )
}
