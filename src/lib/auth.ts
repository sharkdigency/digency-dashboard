import { NextRequest, NextResponse } from 'next/server'

export function checkApiKey(request: NextRequest): NextResponse | null {
  const apiKey = request.headers.get('x-api-key')
  if (apiKey !== process.env.DASHBOARD_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
