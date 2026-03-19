'use client'

import { useState, useEffect } from 'react'
import { Input, Select, Button, Card } from '@/components/ui/FormElements'
import { Badge } from '@/components/ui/Badge'
import { DeploymentInfoType } from '@/lib/validations/project'
import { 
  Cloud, Globe, GitBranch, Play, Server, 
  CheckCircle2, XCircle, ExternalLink, Rocket
} from 'lucide-react'

interface DeploymentTabProps {
  deployment: DeploymentInfoType | null | undefined
  onChange: (deployment: DeploymentInfoType) => void
  onSave: () => void
  isLoading?: boolean
}

const PLATFORM_OPTIONS = [
  { value: '', label: 'Select platform...' },
  { value: 'vercel', label: 'Vercel' },
  { value: 'netlify', label: 'Netlify' },
  { value: 'aws', label: 'AWS' },
  { value: 'gcp', label: 'Google Cloud' },
  { value: 'azure', label: 'Azure' },
  { value: 'digitalocean', label: 'DigitalOcean' },
  { value: 'heroku', label: 'Heroku' },
  { value: 'railway', label: 'Railway' },
  { value: 'render', label: 'Render' },
  { value: 'fly', label: 'Fly.io' },
  { value: 'self-hosted', label: 'Self Hosted' },
  { value: 'other', label: 'Other' }
]

const ENVIRONMENT_OPTIONS = [
  { value: '', label: 'Select environment...' },
  { value: 'development', label: 'Development' },
  { value: 'staging', label: 'Staging' },
  { value: 'production', label: 'Production' }
]

const CI_CD_OPTIONS = [
  { value: '', label: 'Select CI/CD...' },
  { value: 'github-actions', label: 'GitHub Actions' },
  { value: 'gitlab-ci', label: 'GitLab CI' },
  { value: 'jenkins', label: 'Jenkins' },
  { value: 'circleci', label: 'CircleCI' },
  { value: 'travis', label: 'Travis CI' },
  { value: 'vercel', label: 'Vercel (Auto)' },
  { value: 'netlify', label: 'Netlify (Auto)' },
  { value: 'none', label: 'None / Manual' }
]

const PLATFORM_ICONS: Record<string, string> = {
  vercel: '▲',
  netlify: '◆',
  aws: '☁️',
  gcp: '🌐',
  azure: '☁️',
  digitalocean: '🌊',
  heroku: '🟣',
  railway: '🚂',
  render: '🎨',
  fly: '✈️'
}

export function DeploymentTab({ deployment, onChange, onSave, isLoading }: DeploymentTabProps) {
  const [formData, setFormData] = useState<DeploymentInfoType>({
    platform: deployment?.platform || '',
    domain: deployment?.domain || '',
    environment: deployment?.environment || '',
    ciCd: deployment?.ciCd || '',
    repository: deployment?.repository || '',
    branch: deployment?.branch || ''
  })

  useEffect(() => {
    if (deployment) {
      setFormData({
        platform: deployment.platform || '',
        domain: deployment.domain || '',
        environment: deployment.environment || '',
        ciCd: deployment.ciCd || '',
        repository: deployment.repository || '',
        branch: deployment.branch || ''
      })
    }
  }, [deployment])

  const handleChange = (field: keyof DeploymentInfoType, value: string) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    onChange(updated)
  }

  const isDeployed = formData.platform && formData.domain
  const hasCI = formData.ciCd && formData.ciCd !== 'none'

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDeployed ? 'bg-emerald-500/10' : 'bg-gray-500/10'
            }`}>
              {isDeployed ? (
                <CheckCircle2 className="text-emerald-400" size={20} />
              ) : (
                <XCircle className="text-gray-400" size={20} />
              )}
            </div>
            <div>
              <p className="text-xs text-gray-400">Deployment Status</p>
              <p className={`font-medium ${isDeployed ? 'text-emerald-400' : 'text-gray-400'}`}>
                {isDeployed ? 'Deployed' : 'Not Deployed'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              hasCI ? 'bg-blue-500/10' : 'bg-gray-500/10'
            }`}>
              <Play className={hasCI ? 'text-blue-400' : 'text-gray-400'} size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400">CI/CD Pipeline</p>
              <p className={`font-medium ${hasCI ? 'text-blue-400' : 'text-gray-400'}`}>
                {hasCI ? 'Configured' : 'Not Set'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              formData.environment === 'production' ? 'bg-emerald-500/10' :
              formData.environment === 'staging' ? 'bg-yellow-500/10' :
              formData.environment === 'development' ? 'bg-blue-500/10' : 'bg-gray-500/10'
            }`}>
              <Server className={
                formData.environment === 'production' ? 'text-emerald-400' :
                formData.environment === 'staging' ? 'text-yellow-400' :
                formData.environment === 'development' ? 'text-blue-400' : 'text-gray-400'
              } size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400">Environment</p>
              <p className="font-medium text-white capitalize">
                {formData.environment || 'Not Set'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Deployment Configuration */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Cloud size={20} />
          Deployment Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Platform"
            value={formData.platform || ''}
            onChange={(e) => handleChange('platform', e.target.value)}
            options={PLATFORM_OPTIONS}
          />

          <Select
            label="Environment"
            value={formData.environment || ''}
            onChange={(e) => handleChange('environment', e.target.value)}
            options={ENVIRONMENT_OPTIONS}
          />

          <div className="md:col-span-2">
            <Input
              label="Domain"
              value={formData.domain || ''}
              onChange={(e) => handleChange('domain', e.target.value)}
              placeholder="https://myproject.com"
            />
          </div>
        </div>
      </Card>

      {/* Repository Configuration */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <GitBranch size={20} />
          Repository & CI/CD
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Repository URL"
            value={formData.repository || ''}
            onChange={(e) => handleChange('repository', e.target.value)}
            placeholder="https://github.com/user/repo"
          />

          <Input
            label="Branch"
            value={formData.branch || ''}
            onChange={(e) => handleChange('branch', e.target.value)}
            placeholder="main"
          />

          <div className="md:col-span-2">
            <Select
              label="CI/CD Pipeline"
              value={formData.ciCd || ''}
              onChange={(e) => handleChange('ciCd', e.target.value)}
              options={CI_CD_OPTIONS}
            />
          </div>
        </div>
      </Card>

      {/* Live Preview */}
      {formData.domain && (
        <Card className="!bg-gradient-to-r !from-blue-600/10 !to-purple-600/10 !border-blue-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Rocket className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Live Site</h3>
                <p className="text-sm text-gray-400">{formData.domain}</p>
              </div>
            </div>
            <a
              href={formData.domain}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <ExternalLink size={16} />
              Visit Site
            </a>
          </div>
        </Card>
      )}

      {/* Platform Info */}
      {formData.platform && (
        <Card className="!p-4 !bg-zinc-900/30">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{PLATFORM_ICONS[formData.platform] || '☁️'}</span>
            <div>
              <p className="text-sm text-gray-400">Hosted on</p>
              <p className="font-medium text-white capitalize">
                {PLATFORM_OPTIONS.find(p => p.value === formData.platform)?.label || formData.platform}
              </p>
            </div>
            {formData.ciCd && formData.ciCd !== 'none' && (
              <>
                <div className="w-px h-8 bg-zinc-700 mx-2" />
                <div>
                  <p className="text-sm text-gray-400">CI/CD</p>
                  <p className="font-medium text-white">
                    {CI_CD_OPTIONS.find(c => c.value === formData.ciCd)?.label || formData.ciCd}
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={onSave} isLoading={isLoading}>
          Save Deployment Info
        </Button>
      </div>
    </div>
  )
}
