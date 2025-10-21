import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const feedStatus = searchParams.get('feed_status')
    const storyStatus = searchParams.get('story_status')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('generated_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status) query = query.eq('status', status)
    if (feedStatus) query = query.eq('feed_status', feedStatus)
    if (storyStatus) query = query.eq('story_status', storyStatus)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}