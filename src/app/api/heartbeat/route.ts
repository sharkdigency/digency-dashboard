import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkApiKey } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const authError = checkApiKey(request)
  if (authError) return authError

  const body = await request.json()
  const { agent, client } = body

  if (!agent) {
    return NextResponse.json({ error: 'agent is required' }, { status: 400 })
  }

  const log = await prisma.log.create({
    data: {
      agent,
      message: 'heartbeat',
      type: 'info',
      client: client ?? null,
    },
  })

  return NextResponse.json({ success: true, log }, { status: 201 })
}
