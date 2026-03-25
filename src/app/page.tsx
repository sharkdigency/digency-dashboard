export const dynamic = 'force-dynamic'
export const revalidate = 0

import { prisma } from '@/lib/prisma'
import DashboardClient from '@/components/DashboardClient'

async function getData() {
  try {
  const [rawTasks, rawLogs] = await Promise.all([
    prisma.task.findMany({
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.log.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ])

  // Serialize dates for client components
  const tasks = rawTasks.map((t: typeof rawTasks[number]) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }))

  const logs = rawLogs.map((l: typeof rawLogs[number]) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
  }))

  return { tasks, logs }
  } catch {
    return { tasks: [], logs: [] }
  }
}

export default async function Home() {
  const { tasks, logs } = await getData()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    doneToday: tasks.filter(
      (t) => t.status === 'done' && new Date(t.updatedAt) >= today
    ).length,
    review: tasks.filter((t) => t.status === 'review').length,
  }

  const hermesTasks = tasks.filter((t) => t.agent.toLowerCase() === 'hermes')
  const apoloTasks = tasks.filter((t) => t.agent.toLowerCase() === 'apolo')
  const hermesLogs = logs.filter((l) => l.agent.toLowerCase() === 'hermes')
  const apoloLogs = logs.filter((l) => l.agent.toLowerCase() === 'apolo')

  return (
    <DashboardClient
      stats={stats}
      tasks={tasks}
      logs={logs}
      hermesTasks={hermesTasks}
      apoloTasks={apoloTasks}
      hermesLogs={hermesLogs}
      apoloLogs={apoloLogs}
    />
  )
}
