'use client'

import { useCallback, useRef, useState } from 'react'
import { StudioIcon } from '@/components/studio/builder/ui/StudioIcon'

export type MediaKind = 'image' | 'video'

type MediaUploadFieldProps = {
  mediaKind: MediaKind
  value: string
  onChange: (url: string) => void
}

const ACCEPT: Record<MediaKind, string> = {
  image: 'image/jpeg,image/png,image/webp,image/gif,image/avif',
  video: 'video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov',
}

export function MediaUploadField({ mediaKind, value, onChange }: MediaUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = useCallback(
    async (file: File) => {
      setError(null)
      const isVideo = file.type.startsWith('video/')
      const isImage = file.type.startsWith('image/')

      if (mediaKind === 'image' && !isImage) {
        setError('Please choose an image file (JPG, PNG, WebP, GIF).')
        return
      }
      if (mediaKind === 'video' && !isVideo) {
        setError('Please choose a video file (MP4, WebM, MOV).')
        return
      }

      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/media/upload', { method: 'POST', body: formData })
        const data = (await res.json()) as { url?: string; error?: string }
        if (!res.ok || !data.url) {
          throw new Error(data.error ?? 'Upload failed')
        }
        onChange(data.url)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setUploading(false)
      }
    },
    [mediaKind, onChange],
  )

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) void uploadFile(file)
  }

  const label = mediaKind === 'video' ? 'video' : 'image'
  const inputClass =
    'w-full rounded-lg border border-zinc-700/80 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition focus:border-teal-500/50 focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20'

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setDragging(false)
        }}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-all ${
          dragging
            ? 'border-teal-400/70 bg-teal-500/10'
            : 'border-zinc-700/80 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-900/60'
        } ${uploading ? 'pointer-events-none opacity-70' : 'cursor-pointer'}`}
      >
        {value ? (
          <div className="relative aspect-[16/10] w-full bg-zinc-950">
            {mediaKind === 'video' ? (
              <video src={value} className="h-full w-full object-cover" muted playsInline controls={false} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="Uploaded media preview" className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity hover:opacity-100">
              <StudioIcon icon="solar:upload-minimalistic-bold" width={28} height={28} className="text-white" />
              <span className="text-sm font-medium text-white">Drop or click to replace</span>
            </div>
          </div>
        ) : (
          <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 px-6 py-8 text-center">
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                dragging ? 'bg-teal-500/20 text-teal-300' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              <StudioIcon
                icon={mediaKind === 'video' ? 'solar:videocamera-record-bold-duotone' : 'solar:gallery-add-bold-duotone'}
                width={28}
                height={28}
              />
            </span>
            <div>
              <p className="text-sm font-medium text-zinc-200">
                {uploading ? 'Uploading…' : `Drag & drop ${label} here`}
              </p>
              <p className="mt-1 text-xs text-zinc-500">or click to browse from your device</p>
            </div>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/70">
            <StudioIcon icon="solar:refresh-linear" width={24} height={24} className="animate-spin text-teal-400" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT[mediaKind]}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void uploadFile(file)
          e.target.value = ''
        }}
      />

      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-500">
          <StudioIcon icon="solar:link-round-linear" width={12} height={12} />
          Or paste {label} URL
        </label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
          placeholder={`https://…/${label}`}
        />
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-400">
          <StudioIcon icon="solar:danger-circle-linear" width={14} height={14} />
          {error}
        </p>
      )}
    </div>
  )
}
