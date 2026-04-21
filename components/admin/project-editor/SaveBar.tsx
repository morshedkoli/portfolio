'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/FormElements'
import { Save, CheckCircle2, AlertCircle, ArrowLeft, FileDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SaveBarProps {
  title: string
  slug?: string
  isSaving: boolean
  hasUnsavedChanges: boolean
  lastSaved?: Date | null
  onSave: () => void
  extraActions?: React.ReactNode
}

export function SaveBar({
  title,
  slug,
  isSaving,
  hasUnsavedChanges,
  lastSaved,
  onSave,
  extraActions,
}: SaveBarProps) {
  const router = useRouter()

  const formatLastSaved = (date: Date) => {
    const diff = Date.now() - date.getTime()
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/60 shadow-lg shadow-black/30">
      <div className="px-4 h-14 flex items-center gap-3 max-w-full">
        {/* Back */}
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors shrink-0 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>

        <div className="w-px h-4 bg-zinc-800 shrink-0" />

        {/* Project name + slug */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm font-semibold text-white truncate">
            {title || 'Untitled Project'}
          </span>
          {slug && (
            <span className="text-xs text-zinc-600 hidden md:inline shrink-0">
              /{slug}
            </span>
          )}
        </div>

        {/* Save status */}
        <AnimatePresence mode="wait">
          {isSaving ? (
            <motion.div
              key="saving"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 shrink-0"
            >
              <div className="w-3 h-3 border-2 border-blue-500/60 border-t-blue-400 rounded-full animate-spin" />
              Saving…
            </motion.div>
          ) : hasUnsavedChanges ? (
            <motion.div
              key="unsaved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden sm:flex items-center gap-1.5 text-xs text-amber-400/80 shrink-0"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Unsaved changes
            </motion.div>
          ) : lastSaved ? (
            <motion.div
              key="saved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-500/70 shrink-0"
            >
              <CheckCircle2 size={12} />
              Saved {formatLastSaved(lastSaved)}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Extra actions slot */}
        {extraActions && (
          <div className="flex items-center gap-2 shrink-0">{extraActions}</div>
        )}

        {/* Save button */}
        <Button
          size="sm"
          onClick={onSave}
          isLoading={isSaving}
          disabled={isSaving}
          leftIcon={<Save size={14} />}
          className="shrink-0 !px-4"
        >
          Save
        </Button>
      </div>
    </div>
  )
}
