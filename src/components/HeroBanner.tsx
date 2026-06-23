import Image from 'next/image'
import Link from 'next/link'
import type { HeroBannerBlock } from '@/lib/types/store'
import { getImageUrl } from '@/lib/utils'

type HeroBannerProps = {
  block: HeroBannerBlock
}

export function HeroBanner({ block }: HeroBannerProps) {
  const imageUrl = getImageUrl(block.backgroundImage)

  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[420px] md:min-h-[520px]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={block.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-tenant-primary" />
        )}
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 md:min-h-[520px] lg:px-8">
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white md:text-6xl">
            {block.title}
          </h1>
          {block.subtitle && (
            <p className="mt-4 max-w-xl text-lg text-white/90 md:text-xl">{block.subtitle}</p>
          )}
          {block.buttonText && block.buttonLink && (
            <Link
              href={block.buttonLink}
              className="mt-8 inline-flex w-fit rounded-lg bg-tenant-primary px-6 py-3 text-base font-semibold text-white transition hover:opacity-90"
            >
              {block.buttonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
