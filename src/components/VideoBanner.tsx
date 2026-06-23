import type { VideoBannerBlock } from '@/lib/types/store'

type VideoBannerProps = {
  block: VideoBannerBlock
}

function getEmbedUrl(url: string): string {
  if (url.includes('youtube.com/watch')) {
    const videoId = new URL(url).searchParams.get('v')
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }
  return url
}

export function VideoBanner({ block }: VideoBannerProps) {
  const embedUrl = getEmbedUrl(block.videoUrl)
  const isEmbed = embedUrl.includes('youtube.com/embed') || embedUrl.includes('player.vimeo.com')

  return (
    <section className="bg-gray-900 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-3xl font-bold text-white md:text-4xl">{block.title}</h2>
        <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl">
          {isEmbed ? (
            <iframe
              src={embedUrl}
              title={block.title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video src={embedUrl} controls className="h-full w-full object-cover" />
          )}
        </div>
      </div>
    </section>
  )
}
