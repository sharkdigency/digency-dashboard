'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AgentPanel from './AgentPanel'
import LogItem from './LogItem'

interface Task {
  id: string
  agent: string
  title: string
  description?: string | null
  status: string
  client?: string | null
  priority: string
  createdAt: string
  updatedAt: string
}

interface Log {
  id: string
  agent: string
  message: string
  type: string
  client?: string | null
  createdAt: string
}

interface Stats {
  total: number
  inProgress: number
  doneToday: number
  review: number
}

interface Props {
  stats: Stats
  tasks: Task[]
  logs: Log[]
  hermesTasks: Task[]
  apoloTasks: Task[]
  hermesLogs: Log[]
  apoloLogs: Log[]
}

const statusColors: Record<string, string> = {
  pending: 'bg-gray-700 text-gray-300',
  in_progress: 'bg-blue-900 text-blue-300',
  done: 'bg-green-900 text-green-300',
  review: 'bg-purple-900 text-purple-300',
}

export default function DashboardClient({
  stats,
  tasks,
  logs,
  hermesTasks,
  apoloTasks,
  hermesLogs,
  apoloLogs,
}: Props) {
  const router = useRouter()
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [filterAgent, setFilterAgent] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterClient, setFilterClient] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
      setLastUpdated(new Date())
    }, 30000)
    return () => clearInterval(interval)
  }, [router])

  const minutesAgo = Math.floor(
    (Date.now() - lastUpdated.getTime()) / 60000
  )

  const filteredTasks = tasks.filter((t) => {
    if (filterAgent && t.agent.toLowerCase() !== filterAgent.toLowerCase()) return false
    if (filterStatus && t.status !== filterStatus) return false
    if (filterClient && !t.client?.toLowerCase().includes(filterClient.toLowerCase())) return false
    return true
  })

  const clients = Array.from(new Set(tasks.map((t) => t.client).filter(Boolean))) as string[]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a', color: '#e5e5e5' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚡☀️</span>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Digency Control Center
              </h1>
              <p className="text-xs text-gray-500">
                Monitorización de agentes IA
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">
              Actualizado{' '}
              {minutesAgo === 0 ? 'ahora mismo' : `hace ${minutesAgo}m`}
            </p>
            <p className="text-xs text-gray-600">Auto-refresh 30s</p>
          </div>
        </header>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Tareas totales" value={stats.total} color="#888" />
          <StatCard label="En progreso" value={stats.inProgress} color="#3b82f6" />
          <StatCard label="Completadas hoy" value={stats.doneToday} color="#22c55e" />
          <StatCard label="Pendientes revisión" value={stats.review} color="#a855f7" />
        </div>

        {/* Agents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <AgentPanel
            name="Hermes"
            emoji="⚡"
            accentColor="#ff6200"
            tasks={hermesTasks}
            logs={hermesLogs}
          />
          <AgentPanel
            name="Apolo"
            emoji="☀️"
            accentColor="#f59e0b"
            tasks={apoloTasks}
            logs={apoloLogs}
          />
        </div>

        {/* Recent activity */}
        <div
          className="rounded-xl border p-4 mb-8"
          style={{ backgroundColor: '#111', borderColor: '#222' }}
        >
          <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
            Actividad reciente
          </h2>
          {logs.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">Sin actividad reciente</p>
          ) : (
            logs.slice(0, 20).map((log) => <LogItem key={log.id} log={log} />)
          )}
        </div>

        {/* All tasks table */}
        <div
          className="rounded-xl border p-4"
          style={{ backgroundColor: '#111', borderColor: '#222' }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Todas las tareas ({filteredTasks.length})
            </h2>
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={filterAgent}
                onChange={(e) => setFilterAgent(e.target.value)}
                className="text-xs bg-gray-900 border border-gray-700 rounded px-2 py-1 text-gray-300"
              >
                <option value="">Todos los agentes</option>
                <option value="hermes">Hermes</option>
                <option value="apolo">Apolo</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs bg-gray-900 border border-gray-700 rounded px-2 py-1 text-gray-300"
              >
                <option value="">Todos los estados</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
                <option value="review">Review</option>
              </select>
              {clients.length > 0 && (
                <select
                  value={filterClient}
                  onChange={(e) => setFilterClient(e.target.value)}
                  className="text-xs bg-gray-900 border border-gray-700 rounded px-2 py-1 text-gray-300"
                >
                  <option value="">Todos los clientes</option>
                  {clients.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">Sin tareas</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-800">
                    <th className="text-left pb-2 pr-3">Agente</th>
                    <th className="text-left pb-2 pr-3">Título</th>
                    <th className="text-left pb-2 pr-3">Estado</th>
                    <th className="text-left pb-2 pr-3">Prioridad</th>
                    <th className="text-left pb-2 pr-3">Cliente</th>
                    <th className="text-left pb-2">Actualizado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-b border-gray-800 hover:bg-gray-900 transition-colors"
                    >
                      <td className="py-2 pr-3">
                        <span
                          className="font-semibold"
                          style={{
                            color:
                              task.agent.toLowerCase() === 'hermes'
                                ? '#ff6200'
                                : '#f59e0b',
                          }}
                        >
                          {task.agent}
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-gray-200 max-w-[200px] truncate">
                        {task.title}
                      </td>
                      <td className="py-2 pr-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${statusColors[task.status] ?? 'bg-gray-700 text-gray-300'}`}
                        >
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-gray-400">{task.priority}</td>
                      <td className="py-2 pr-3 text-gray-500">{task.client ?? '-'}</td>
                      <td className="py-2 text-gray-500">
                        {new Date(task.updatedAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ backgroundColor: '#111', borderColor: '#222' }}
    >
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  )
}
