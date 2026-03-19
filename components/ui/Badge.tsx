'use client'

import { motion } from 'framer-motion'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = ''
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    error: 'bg-red-500/10 text-red-400 border-red-500/30',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm'
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  )
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const statusConfig: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    idea: { label: 'Idea', variant: 'default' },
    planning: { label: 'Planning', variant: 'purple' },
    design: { label: 'Design', variant: 'info' },
    development: { label: 'Development', variant: 'warning' },
    testing: { label: 'Testing', variant: 'warning' },
    deployment: { label: 'Deployment', variant: 'info' },
    live: { label: 'Live', variant: 'success' },
    draft: { label: 'Draft', variant: 'default' },
    published: { label: 'Published', variant: 'success' },
    archived: { label: 'Archived', variant: 'error' },
    planned: { label: 'Planned', variant: 'default' },
    in_progress: { label: 'In Progress', variant: 'warning' },
    completed: { label: 'Completed', variant: 'success' },
    backlog: { label: 'Backlog', variant: 'default' },
    todo: { label: 'To Do', variant: 'info' },
    review: { label: 'Review', variant: 'purple' }
  }

  const config = statusConfig[status] || { label: status, variant: 'default' as const }

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}
