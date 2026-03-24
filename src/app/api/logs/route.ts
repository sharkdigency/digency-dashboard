import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkApiKey } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const authError = checkApiKey(request)
  if (authError) return authError

  const logs = await prisma.log.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(logs)
}

export async function POST(request: NextRequest) {
  const authError = checkApiKey(request)
  if (authError) return authError

  const body = await request.json()
  const { agent, message, type, client } = body

  if (!agent || !message) {
    return NextResponse.json(
      { error: 'agent and message are required' },
      { status: 400 }
    )
  }

  const log = await prisma.log.create({
    data: {
      agent,
      message,
      type: type ?? 'info',
      client: client ?? null,
    },
  })

  return NextResponse.json(log, { status: 201 })
}
