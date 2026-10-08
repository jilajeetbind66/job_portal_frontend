const FALLBACK = 'Kuch galat ho gaya. Dobara try karo.'

export function getErrorMessage(error, fallback = FALLBACK) {
  return error?.response?.data?.message ?? fallback
}

// Laravel 422 ke field errors ko React Hook Form ke setError me daalta hai.
// true lautata hai agar field errors mile.
export function applyServerErrors(error, setError) {
  const errors = error?.response?.data?.errors
  if (error?.response?.status !== 422 || !errors) return false
  Object.entries(errors).forEach(([field, messages]) => {
    setError(field, { message: messages[0] })
  })
  return true
}
