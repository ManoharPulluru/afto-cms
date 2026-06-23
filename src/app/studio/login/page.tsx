import { Suspense } from 'react'
import { LoginForm } from '@/components/studio/LoginForm'

export default function StudioLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-950 text-gray-400">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
