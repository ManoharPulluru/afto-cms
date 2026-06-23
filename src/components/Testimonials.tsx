import Image from 'next/image'
import type { TestimonialsBlock } from '@/lib/types/store'
import { getImageUrl } from '@/lib/utils'

type TestimonialsProps = {
  block: TestimonialsBlock
}

export function Testimonials({ block }: TestimonialsProps) {
  const items = block.items || []

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">{block.title}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const avatarUrl = getImageUrl(item.avatar)
            return (
              <blockquote
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <p className="text-gray-700">&ldquo;{item.quote}&rdquo;</p>
                <footer className="mt-4 flex items-center gap-3">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={item.author}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tenant-primary text-sm font-bold text-white">
                      {item.author.charAt(0)}
                    </div>
                  )}
                  <div>
                    <cite className="not-italic font-semibold text-gray-900">{item.author}</cite>
                    {item.role && <p className="text-sm text-gray-500">{item.role}</p>}
                  </div>
                </footer>
              </blockquote>
            )
          })}
        </div>
      </div>
    </section>
  )
}
