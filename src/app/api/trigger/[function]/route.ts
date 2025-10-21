import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ function: string }> }
) {
  try {
    const { function: functionName } = await context.params

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const res = await fetch(
      `${supabaseUrl}/functions/v1/${functionName}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const contentType = res.headers.get('content-type')
    let data

    if (contentType?.includes('application/json')) {
      data = await res.json()
    } else {
      const text = await res.text()
      data = { message: text }
    }

    return NextResponse.json(
      { success: res.ok, data },
      { status: res.ok ? 200 : res.status }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}