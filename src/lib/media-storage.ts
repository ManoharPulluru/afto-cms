import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

const UPLOADS_ROOT = path.join(process.cwd(), 'public', 'uploads')

/** Local disk storage — replace with Azure Blob when backend/DB is connected. */
export async function saveMediaToLocalDisk(
  storeSlug: string,
  filename: string,
  buffer: Buffer,
): Promise<string> {
  const uploadDir = path.join(UPLOADS_ROOT, storeSlug)
  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, filename), buffer)
  return `/uploads/${storeSlug}/${filename}`
}

export type ParsedUploadFile = {
  name: string
  type: string
  size: number
  arrayBuffer(): Promise<ArrayBuffer>
}

/** Node FormData entries are file-like but `File` global may be missing. */
export function parseUploadFile(value: unknown): ParsedUploadFile | null {
  if (typeof value !== 'object' || value === null) return null
  const candidate = value as Partial<ParsedUploadFile>
  if (
    typeof candidate.name !== 'string' ||
    typeof candidate.size !== 'number' ||
    typeof candidate.arrayBuffer !== 'function'
  ) {
    return null
  }
  return {
    name: candidate.name,
    type: typeof candidate.type === 'string' ? candidate.type : 'application/octet-stream',
    size: candidate.size,
    arrayBuffer: () => candidate.arrayBuffer!.call(value),
  }
}
