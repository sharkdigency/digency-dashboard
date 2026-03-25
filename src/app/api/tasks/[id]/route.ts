export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkApiKey } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkApiKey(request)
  if (authError) return authError

  const { id } = await params
  const body = await request.json()
  const { status, title, description, client, priority } = body

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(client !== undefined && { client }),
        ...(priority !== undefined && { priority }),
      },
    })
    return NextResponse.json(task)
  } catch {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkApiKey(request)
  if (authError) return authError

  const { id } = await params

  try {
    await prisma.task.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }
}
