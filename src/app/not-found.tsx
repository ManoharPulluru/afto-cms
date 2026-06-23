import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-xl text-gray-600">Page not found</p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-gray-900 px-6 py-3 text-white transition hover:bg-gray-800"
      >
        Back to Home
      </Link>
    </main>
  )
}
