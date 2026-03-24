'use client'

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

const statusColors: Record<string, string> = {
  pending: 'bg-gray-700 text-gray-300',
  in_progress: 'bg-blue-900 text-blue-300',
  done: 'bg-green-900 text-green-300',
  review: 'bg-purple-900 text-purple-300',
}

const priorityColors: Record<string, string> = {
  low: 'text-gray-400',
  normal: 'text-gray-300',
  high: 'text-yellow-400',
  urgent: 'text-red-400',
}

const priorityIcons: Record<string, string> = {
  low: '↓',
  normal: '→',
  high: '↑',
  urgent: '⚠',
}

interface TaskCardProps {
  task: Task
  accentColor: string
}

export default function TaskCard({ task, accentColor }: TaskCardProps) {
  const statusLabel = task.status.replace('_', ' ')

  return (
    <div
      className="rounded-lg border p-3 mb-2"
      style={{ backgroundColor: '#1a1a1a', borderColor: `${accentColor}33` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{task.title}</p>
          {task.description && (
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${statusColors[task.status] ?? 'bg-gray-700 text-gray-300'}`}
        >
          {statusLabel}
        </span>
      </div>
      <div className="flex items-center gap-3 mt-2">
        {task.client && (
          <span className="text-xs text-gray-500">#{task.client}</span>
        )}
        <span className={`text-xs ${priorityColors[task.priority] ?? 'text-gray-300'}`}>
          {priorityIcons[task.priority]} {task.priority}
        </span>
      </div>
    </div>
  )
}
