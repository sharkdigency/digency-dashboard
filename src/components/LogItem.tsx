'use client'

interface Log {
  id: string
  agent: string
  message: string
  type: string
  client?: string | null
  createdAt: string
}

const typeIcons: Record<string, string> = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  error: '✕',
}

const typeColors: Record<string, string> = {
  info: 'text-blue-400',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
}

const agentColors: Record<string, string> = {
  hermes: '#ff6200',
  apolo: '#f59e0b',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'ahora'
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

export default function LogItem({ log }: { log: Log }) {
  const icon = typeIcons[log.type] ?? 'ℹ'
  const colorClass = typeColors[log.type] ?? 'text-blue-400'
  const agentColor = agentColors[log.agent.toLowerCase()] ?? '#888'

  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-800 last:border-0">
      <span className={`text-sm font-bold mt-0.5 ${colorClass}`}>{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: agentColor }}>
            {log.agent.toUpperCase()}
          </span>
          {log.client && (
            <span className="text-xs text-gray-500">#{log.client}</span>
          )}
        </div>
        <p className="text-xs text-gray-300 mt-0.5 break-words">{log.message}</p>
      </div>
      <span className="text-xs text-gray-500 shrink-0">{timeAgo(log.createdAt)}</span>
    </div>
  )
}
