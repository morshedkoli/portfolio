'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Input, Textarea, Button } from '@/components/ui/FormElements'
import { AIGenerateButton } from '@/components/AIGenerateButton'
import { createProject } from '@/lib/actions/project-actions'
import type { CreateProjectInput } from '@/lib/validations/project'
import { toast } from 'sonner'
import {
  ArrowLeft, ArrowRight, Sparkles,
  Globe, Smartphone, Laptop, Server, Check
} from 'lucide-react'

const PROJECT_TYPES = [
  { value: 'webapp', label: 'Web App', icon: Globe, desc: 'Browser-based application' },
  { value: 'android', label: 'Android', icon: Smartphone, desc: 'Mobile application' },
  { value: 'desktop', label: 'Desktop', icon: Laptop, desc: 'Native desktop app' },
  { value: 'api', label: 'API / Backend', icon: Server, desc: 'Backend service or API' },
]

export function ProjectWizard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    projectType: 'webapp',
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      if (field === 'title' && !prev.slug) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      }
      return updated
    })
  }

  const handleSlugChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      slug: value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'),
    }))
  }

  const handleCreate = async () => {
    if (!formData.title.trim()) { toast.error('Project title is required'); return }
    if (!formData.slug.trim()) { toast.error('URL slug is required'); return }
    if (!formData.description.trim()) { toast.error('Short description is required'); return }

    setIsLoading(true)
    try {
      const result = await createProject({
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        projectType: formData.projectType,
        lifecycleStatus: 'idea',
        publishStatus: 'draft',
        featured: false,
        order: 0,
        gallery: [],
        technologies: [],
        techStack: [],
        features: [],
        modules: [],
        roadmap: [],
        apiStructure: [],
        databaseDesign: [],
        githubUrlEnabled: true,
        demoUrlEnabled: true,
        clientProjectUrlEnabled: false,
        adminProjectUrlEnabled: false,
        clientLiveUrlEnabled: false,
        adminLiveUrlEnabled: false,
        androidDownloadUrlEnabled: false,
      } as CreateProjectInput)

      if (result.success && result.data) {
        toast.success('Project created! Now fill in the details.')
        const project = result.data as any
        router.push(`/admin/projects/${project.id}?created=1`)
      } else {
        toast.error(result.error || 'Failed to create project')
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const isValid =
    formData.title.trim().length > 0 &&
    formData.slug.trim().length > 0 &&
    formData.description.trim().length > 0

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Minimal Header */}
      <div className="border-b border-zinc-900 px-6 py-3.5 flex items-center gap-3">
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Dashboard
        </button>
        <div className="w-px h-4 bg-zinc-800" />
        <span className="text-sm text-zinc-400">New Project</span>
      </div>

      {/* Centered Wizard Content */}
      <div className="flex-1 flex items-start justify-center pt-16 px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[520px]"
        >
          {/* Hero Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 mb-4">
              <Sparkles className="text-blue-400" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">New project</h1>
            <p className="text-zinc-500 text-sm">
              Start with the essentials — you can fill everything else after.
            </p>
          </div>

          <div className="space-y-6">
            {/* Project Type Grid */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                Project type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PROJECT_TYPES.map((type) => {
                  const Icon = type.icon
                  const isSelected = formData.projectType === type.value
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleChange('projectType', type.value)}
                      className={`
                        relative flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all
                        ${isSelected
                          ? 'border-blue-500/50 bg-blue-600/10 text-blue-300'
                          : 'border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 hover:bg-zinc-800/40'
                        }
                      `}
                    >
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center">
                          <Check size={8} strokeWidth={3} className="text-white" />
                        </span>
                      )}
                      <Icon
                        size={20}
                        className={isSelected ? 'text-blue-400' : 'text-zinc-600'}
                      />
                      <span className="text-xs font-medium leading-tight">{type.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Title */}
            <Input
              label={
                <div className="flex items-center justify-between w-full">
                  <span>
                    Project title{' '}
                    <span className="text-red-500">*</span>
                  </span>
                  <AIGenerateButton
                    onGenerate={(text) => handleChange('title', text)}
                    promptContext={{
                      field: 'Project Title',
                      contextData: { description: formData.description },
                    }}
                    className="!p-1 scale-75 origin-right"
                  />
                </div>
              }
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="My Awesome Project"
              autoFocus
            />

            {/* Slug */}
            <Input
              label={
                <span>
                  URL slug <span className="text-red-500">*</span>
                </span>
              }
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="my-awesome-project"
              helperText={
                formData.slug
                  ? `morshed.dev/projects/${formData.slug}`
                  : undefined
              }
            />

            {/* Description */}
            <Textarea
              label={
                <div className="flex items-center justify-between w-full">
                  <span>
                    Short description{' '}
                    <span className="text-red-500">*</span>
                  </span>
                  <AIGenerateButton
                    onGenerate={(text) => handleChange('description', text)}
                    promptContext={{
                      field: 'Short Description',
                      contextData: { title: formData.title },
                    }}
                    className="!p-1 scale-75 origin-right"
                  />
                </div>
              }
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="A brief description of what this project does…"
              rows={3}
            />

            {/* Create Button */}
            <Button
              onClick={handleCreate}
              isLoading={isLoading}
              disabled={!isValid || isLoading}
              className="w-full !py-3 text-base"
              rightIcon={isLoading ? undefined : <ArrowRight size={16} />}
            >
              {isLoading ? 'Creating…' : 'Create project & continue'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
