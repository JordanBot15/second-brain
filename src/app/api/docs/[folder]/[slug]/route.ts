import { NextResponse } from 'next/server'
import { getDocContent } from '@/lib/docs'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ folder: string; slug: string }> }
) {
  const { folder, slug } = await params
  const doc = await getDocContent(folder, slug)
  
  if (!doc) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  
  return NextResponse.json(doc)
}
