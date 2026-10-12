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
        <Link to="/login" className="font-semibold text-[#D6A84F] hover:text-[#E5B866] underline">
          Login par wapas jao
        </Link>
      }
    >
      {sent ? (
        <p role="status" className="rounded-xl border border-[#2F7D5B]/40 bg-[#2F7D5B]/20 p-4 text-xs font-semibold text-[#B9D8C4] leading-relaxed">
          Agar ye email registered hai to reset link bhej diya gaya hai. Apna inbox check karo.
        </p>
      ) : (
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
          <Button type="submit" loading={isSubmitting} className="w-full">
            Send reset link
          </Button>
        </form>
      )}
    </AuthCard>
  )
}
