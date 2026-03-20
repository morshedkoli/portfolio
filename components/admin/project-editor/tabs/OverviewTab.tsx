'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input, Textarea, Select, Button, Card } from '@/components/ui/FormElements'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { ProgressBar, CircularProgress } from '@/components/ui/Progress'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { getLifecycleStatusInfo, getFeatureStats, getTaskStats, formatDate } from '@/lib/utils/project-helpers'
import { ProjectLifecycleStatusType } from '@/lib/validations/project'
import { 
  Image as ImageIcon, 
  Calendar, 
  ExternalLink, 
  Github, 
  Clock, 
  Target, 
  CheckCircle2,
  ListTodo,
  TrendingUp,
  Smartphone,
  Link as LinkIcon
} from 'lucide-react'

interface OverviewTabProps {
  project: any
  onUpdate: (data: any) => void
  isLoading?: boolean
}

export function OverviewTab({ project, onUpdate, isLoading }: OverviewTabProps) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    description: project?.description || '',
    longDescription: project?.longDescription || '',
    projectType: project?.projectType || 'webapp',
    lifecycleStatus: project?.lifecycleStatus || 'idea',
    publishStatus: project?.publishStatus || 'draft',
    coverImage: project?.coverImage || '',
    logoUrl: project?.logoUrl || '',
    githubUrl: project?.githubUrl || '',
    demoUrl: project?.demoUrl || '',
    clientProjectUrl: project?.clientProjectUrl || '',
    adminProjectUrl: project?.adminProjectUrl || '',
    clientLiveUrl: project?.clientLiveUrl || '',
    adminLiveUrl: project?.adminLiveUrl || '',
    androidDownloadUrl: project?.androidDownloadUrl || '',
    githubUrlEnabled: project?.githubUrlEnabled ?? true,
    demoUrlEnabled: project?.demoUrlEnabled ?? true,
    clientProjectUrlEnabled: project?.clientProjectUrlEnabled ?? false,
    adminProjectUrlEnabled: project?.adminProjectUrlEnabled ?? false,
    clientLiveUrlEnabled: project?.clientLiveUrlEnabled ?? false,
    adminLiveUrlEnabled: project?.adminLiveUrlEnabled ?? false,
    androidDownloadUrlEnabled: project?.androidDownloadUrlEnabled ?? false,
    featured: project?.featured || false,
    order: project?.order || 0
  })

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(formData)
  }

  const lifecycleOptions = [
    { value: 'idea', label: '💡 Idea' },
    { value: 'planning', label: '📋 Planning' },
    { value: 'design', label: '🎨 Design' },
    { value: 'development', label: '💻 Development' },
    { value: 'testing', label: '🧪 Testing' },
    { value: 'deployment', label: '🚀 Deployment' },
    { value: 'live', label: '✅ Live' }
  ]

  const publishOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' }
  ]

  const projectTypeOptions = [
    { value: 'webapp', label: 'Web Application' },
    { value: 'android', label: 'Android App' },
    { value: 'desktop', label: 'Desktop App' },
    { value: 'api', label: 'API / Backend' }
  ]

  const statusInfo = getLifecycleStatusInfo(formData.lifecycleStatus as ProjectLifecycleStatusType)
  const featureStats = project?.features ? getFeatureStats(project.features) : { total: 0, planned: 0, inProgress: 0, completed: 0 }
  const taskStats = project?.modules ? getTaskStats(project.modules) : { total: 0, backlog: 0, todo: 0, inProgress: 0, review: 0, completed: 0 }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {project?.id && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="!p-4">
            <div className="flex items-center gap-3">
              <CircularProgress value={project.overallProgress || 0} size={50} />
              <div>
                <p className="text-xs text-gray-400">Progress</p>
                <p className="text-lg font-semibold text-white">{project.overallProgress || 0}%</p>
              </div>
            </div>
          </Card>

          <Card className="!p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Target className="text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Features</p>
                <p className="text-lg font-semibold text-white">{featureStats.completed}/{featureStats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="!p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <ListTodo className="text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Tasks</p>
                <p className="text-lg font-semibold text-white">{taskStats.completed}/{taskStats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="!p-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg ${statusInfo.bgColor} flex items-center justify-center`}>
                <TrendingUp className={statusInfo.color} size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Stage</p>
                <p className={`text-lg font-semibold ${statusInfo.color}`}>{statusInfo.label}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Project Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="My Awesome Project"
              required
            />
            <Input
              label="Slug (URL)"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              placeholder="my-awesome-project"
              required
            />
          </div>

          <div className="mt-4">
            <Textarea
              label="Short Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of the project..."
              rows={2}
              required
            />
          </div>

          <div className="mt-4">
            <Textarea
              label="Long Description (Markdown supported)"
              value={formData.longDescription}
              onChange={(e) => handleChange('longDescription', e.target.value)}
              placeholder="Detailed project description with features, goals, etc..."
              rows={6}
            />
          </div>
        </Card>

        {/* Status & Type */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Status & Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Project Type"
              value={formData.projectType}
              onChange={(e) => handleChange('projectType', e.target.value)}
              options={projectTypeOptions}
            />
            <Select
              label="Lifecycle Stage"
              value={formData.lifecycleStatus}
              onChange={(e) => handleChange('lifecycleStatus', e.target.value)}
              options={lifecycleOptions}
            />
            <Select
              label="Publish Status"
              value={formData.publishStatus}
              onChange={(e) => handleChange('publishStatus', e.target.value)}
              options={publishOptions}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              label="Display Order"
              type="number"
              value={formData.order}
              onChange={(e) => handleChange('order', parseInt(e.target.value) || 0)}
            />
            <div className="flex items-center gap-3 pt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-300">Featured Project</span>
              </label>
            </div>
          </div>
        </Card>

        {/* Media */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              label="Cover Image"
              value={formData.coverImage}
              onChange={(url) => handleChange('coverImage', url)}
              previewSize="large"
            />
            <ImageUpload
              label="Logo"
              value={formData.logoUrl}
              onChange={(url) => handleChange('logoUrl', url)}
              previewSize="medium"
            />
          </div>
        </Card>

        {/* Links */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Project Links</h3>
          <div className="space-y-4">
            {/* Legacy Links - GitHub and Demo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.githubUrlEnabled}
                    onChange={(e) => handleChange('githubUrlEnabled', e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-300">GitHub Repository</label>
                </div>
                <Input
                  value={formData.githubUrl}
                  onChange={(e) => handleChange('githubUrl', e.target.value)}
                  placeholder="https://github.com/..."
                  disabled={!formData.githubUrlEnabled}
                />
              </div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.demoUrlEnabled}
                    onChange={(e) => handleChange('demoUrlEnabled', e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-300">Live Demo URL</label>
                </div>
                <Input
                  value={formData.demoUrl}
                  onChange={(e) => handleChange('demoUrl', e.target.value)}
                  placeholder="https://..."
                  disabled={!formData.demoUrlEnabled}
                />
              </div>
            </div>

            {/* Client & Admin Project Links */}
            <div className="border-t border-white/10 pt-4 mt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Project Access Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={formData.clientProjectUrlEnabled}
                      onChange={(e) => handleChange('clientProjectUrlEnabled', e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-300">Client Project Link</label>
                  </div>
                  <Input
                    value={formData.clientProjectUrl}
                    onChange={(e) => handleChange('clientProjectUrl', e.target.value)}
                    placeholder="https://client-project-url..."
                    disabled={!formData.clientProjectUrlEnabled}
                  />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={formData.adminProjectUrlEnabled}
                      onChange={(e) => handleChange('adminProjectUrlEnabled', e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-300">Admin Project Link</label>
                  </div>
                  <Input
                    value={formData.adminProjectUrl}
                    onChange={(e) => handleChange('adminProjectUrl', e.target.value)}
                    placeholder="https://admin-project-url..."
                    disabled={!formData.adminProjectUrlEnabled}
                  />
                </div>
              </div>
            </div>

            {/* Live Links */}
            <div className="border-t border-white/10 pt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Live Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={formData.clientLiveUrlEnabled}
                      onChange={(e) => handleChange('clientLiveUrlEnabled', e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-300">Client Live Link</label>
                  </div>
                  <Input
                    value={formData.clientLiveUrl}
                    onChange={(e) => handleChange('clientLiveUrl', e.target.value)}
                    placeholder="https://client-live-url..."
                    disabled={!formData.clientLiveUrlEnabled}
                  />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={formData.adminLiveUrlEnabled}
                      onChange={(e) => handleChange('adminLiveUrlEnabled', e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-300">Admin Live Link</label>
                  </div>
                  <Input
                    value={formData.adminLiveUrl}
                    onChange={(e) => handleChange('adminLiveUrl', e.target.value)}
                    placeholder="https://admin-live-url..."
                    disabled={!formData.adminLiveUrlEnabled}
                  />
                </div>
              </div>
            </div>

            {/* Android Download */}
            <div className="border-t border-white/10 pt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Mobile App</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={formData.androidDownloadUrlEnabled}
                      onChange={(e) => handleChange('androidDownloadUrlEnabled', e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-300">Android App Download Link</label>
                  </div>
                  <Input
                    value={formData.androidDownloadUrl}
                    onChange={(e) => handleChange('androidDownloadUrl', e.target.value)}
                    placeholder="https://play.google.com/..."
                    disabled={!formData.androidDownloadUrlEnabled}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Timestamps */}
        {project?.id && (
          <Card className="!bg-white/5">
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>Created: {formatDate(project.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>Updated: {formatDate(project.updatedAt)}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
