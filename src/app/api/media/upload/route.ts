import { NextResponse } from 'next/server'
import path from 'path'
import { getSessionUser } from '@/lib/auth'
import { getStoreSlug } from '@/lib/store-slug'
import { parseUploadFile, saveMediaToLocalDisk } from '@/lib/media-storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_IMAGE_BYTES = 12 * 1024 * 1024
const MAX_VIDEO_BYTES = 100 * 1024 * 1024

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
const ALLOWED_VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'])

function safeExt(filename: string, mime: string): string {
  const fromName = path.extname(filename).toLowerCase()
  if (fromName && fromName.length <= 6) return fromName

  if (mime === 'image/jpeg') return '.jpg'
  if (mime === 'image/png') return '.png'
  if (mime === 'image/webp') return '.webp'
  if (mime === 'image/gif') return '.gif'
  if (mime === 'video/mp4') return '.mp4'
  if (mime === 'video/webm') return '.webm'
  if (mime === 'video/quicktime') return '.mov'
  return mime.startsWith('video/') ? '.mp4' : '.jpg'
}

export async function POST(request: Request) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = parseUploadFile(formData.get('file'))

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const isImage = ALLOWED_IMAGE_TYPES.has(file.type) || file.type.startsWith('image/')
    const isVideo = ALLOWED_VIDEO_TYPES.has(file.type) || file.type.startsWith('video/')

    if (!isImage && !isVideo) {
      return NextResponse.json({ error: 'Unsupported file type. Use an image or video.' }, { status: 400 })
    }

    if (isImage && file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: 'Image must be 12 MB or smaller.' }, { status: 400 })
    }

    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      return NextResponse.json({ error: 'Video must be 100 MB or smaller.' }, { status: 400 })
    }

    const slug = getStoreSlug()
    const ext = safeExt(file.name, file.type)
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())
    const url = await saveMediaToLocalDisk(slug, filename, buffer)

    return NextResponse.json({ url, kind: isVideo ? 'video' : 'image' })
  } catch (error) {
    console.error('Media upload failed:', error)
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
