import { NextResponse } from 'next/server'
import { loadStore, saveStore } from '@/lib/store'
import { getSessionUser } from '@/lib/auth'
import type { StoreData } from '@/lib/types/store'

export async function GET() {
  try {
    const store = await loadStore()
    return NextResponse.json(store)
  } catch {
    return NextResponse.json({ error: 'Store not found' }, { status: 404 })
  }
}

export async function PATCH(request: Request) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = (await request.json()) as StoreData

    if (!data.store || !data.pages || !data.products || !data.categories) {
      return NextResponse.json({ error: 'Invalid store data' }, { status: 400 })
    }

    await saveStore(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save store:', error)
    return NextResponse.json({ error: 'Failed to save store' }, { status: 500 })
  }
}
