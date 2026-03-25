export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkApiKey } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const authError = checkApiKey(request)
  if (authError) return authError

  const tasks = await prisma.task.findMany({
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(tasks)
}

export async function POST(request: NextRequest) {
  const authError = checkApiKey(request)
  if (authError) return authError

  const body = await request.json()
  const { agent, title, description, status, client, priority } = body

  if (!agent || !title) {
    return NextResponse.json(
      { error: 'agent and title are required' },
      { status: 400 }
    )
  }

  const task = await prisma.task.create({
    data: {
      agent,
      title,
      description: description ?? null,
      status: status ?? 'pending',
      client: client ?? null,
      priority: priority ?? 'normal',
    },
  })

  return NextResponse.json(task, { status: 201 })
}
