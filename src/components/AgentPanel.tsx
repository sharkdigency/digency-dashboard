'use client'

import TaskCard from './TaskCard'

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

interface AgentPanelProps {
  name: string
  emoji: string
  accentColor: string
  tasks: Task[]
  logs: Log[]
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'hace un momento'
  if (minutes < 60) return `hace ${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours}h`
  return `hace ${Math.floor(hours / 24)}d`
}

export default function AgentPanel({
  name,
  emoji,
  accentColor,
  tasks,
  logs,
}: AgentPanelProps) {
  const activeTasks = tasks.filter(
    (t) => t.status === 'pending' || t.status === 'in_progress'
  )

  // Last heartbeat = last log with message 'heartbeat'
  const lastHeartbeat = logs.find((l) => l.message === 'heartbeat')
  const isOnline = lastHeartbeat
    ? Date.now() - new Date(lastHeartbeat.createdAt).getTime() < 5 * 60 * 1000
    : false

  return (
    <div
      className="rounded-xl border p-4"
      style={{ backgroundColor: '#111', borderColor: `${accentColor}44` }}
    >
      {/* Agent header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <div>
            <h2 className="text-lg font-bold" style={{ color: accentColor }}>
              {name}
            </h2>
            <p className="text-xs text-gray-400">
              {activeTasks.length} tarea{activeTasks.length !== 1 ? 's' : ''} activa
              {activeTasks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-600'}`}
            style={isOnline ? { boxShadow: '0 0 6px #4ade80' } : {}}
          />
          <span className="text-xs text-gray-400">
            {lastHeartbeat ? timeAgo(lastHeartbeat.createdAt) : 'sin actividad'}
          </span>
        </div>
      </div>

      {/* Active tasks */}
      <div>
        {activeTasks.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-4">
            Sin tareas activas
          </p>
        ) : (
          activeTasks.slice(0, 5).map((task) => (
            <TaskCard key={task.id} task={task} accentColor={accentColor} />
          ))
        )}
        {activeTasks.length > 5 && (
          <p className="text-xs text-gray-500 text-center mt-2">
            +{activeTasks.length - 5} más
          </p>
        )}
      </div>
    </div>
  )
}
