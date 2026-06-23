'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { OffersCarouselBlock } from '@/lib/types/store'
import { getImageUrl } from '@/lib/utils'

type OffersCarouselProps = {
  block: OffersCarouselBlock
}

export function OffersCarousel({ block }: OffersCarouselProps) {
  const slides = block.slides || []
  const [activeIndex, setActiveIndex] = useState(0)

  if (slides.length === 0) {
    return null
  }

  const currentSlide = slides[activeIndex]
  const slideImage = getImageUrl(currentSlide.image)

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">{block.title}</h2>
        <div className="relative overflow-hidden rounded-2xl bg-tenant-primary shadow-lg">
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-[240px] md:min-h-[320px]">
              {slideImage ? (
                <Image
                  src={slideImage}
                  alt={currentSlide.headline}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-tenant-primary/80" />
              )}
            </div>
            <div className="flex flex-col justify-center p-8 text-white">
              <h3 className="text-2xl font-bold md:text-3xl">{currentSlide.headline}</h3>
              {currentSlide.description && (
                <p className="mt-3 text-lg text-white/90">{currentSlide.description}</p>
              )}
              {currentSlide.link && (
                <Link
                  href={currentSlide.link}
                  className="mt-6 inline-flex w-fit rounded-lg bg-white px-6 py-3 text-sm font-semibold text-tenant-primary transition hover:bg-white/90"
                >
                  Shop Now
                </Link>
              )}
            </div>
          </div>
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    index === activeIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
