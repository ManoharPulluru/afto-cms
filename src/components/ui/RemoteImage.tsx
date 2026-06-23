type RemoteImageProps = {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
}

/** Merchant-configured URLs can be any domain — native img avoids next/image host allowlist errors. */
export function RemoteImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
}: RemoteImageProps) {
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}
