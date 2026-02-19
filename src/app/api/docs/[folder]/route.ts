import { NextResponse } from 'next/server'
import { getDocsByFolder } from '@/lib/docs'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ folder: string }> }
) {
  const { folder } = await params
  const docs = getDocsByFolder(folder)
  return NextResponse.json(docs)
}
