'use client'

import React, { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'

interface AIGenerateButtonProps {
  onGenerate: (generatedText: string) => void
  promptContext: {
    field: string
    contextData: Record<string, any>
  }
  className?: string
}

export function AIGenerateButton({ onGenerate, promptContext, className = '' }: AIGenerateButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptContext),
      })
      if (!response.ok) {
        throw new Error('Failed to generate content')
      }
      const data = await response.json()
      if (data.text) {
        onGenerate(data.text)
      }
    } catch (error) {
      console.error('AI Generation error:', error)
      alert("Failed to generate content. Ensure your API keys are configured.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title="Auto-generate via AI"
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Sparkles size={14} />
      )}
      <span>Generate AI</span>
    </button>
  )
}
