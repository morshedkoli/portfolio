'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input, Textarea, Select, Button, Card, EmptyState } from '@/components/ui/FormElements'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { ApiEndpointType } from '@/lib/validations/project'
import { generateId } from '@/lib/utils/project-helpers'
import { Plus, Trash2, Edit2, Code, Copy, Check, ChevronDown, ChevronRight } from 'lucide-react'

interface ApiStructureTabProps {
  apiStructure: ApiEndpointType[]
  onChange: (apiStructure: ApiEndpointType[]) => void
  onSave: () => void
  isLoading?: boolean
}

const METHOD_CONFIG: Record<string, { color: string; bgColor: string }> = {
  GET: { color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  POST: { color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  PUT: { color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
  PATCH: { color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
  DELETE: { color: 'text-red-400', bgColor: 'bg-red-500/10' }
}

export function ApiStructureTab({ apiStructure, onChange, onSave, isLoading }: ApiStructureTabProps) {
  const [showModal, setShowModal] = useState(false)
  const [editingEndpoint, setEditingEndpoint] = useState<ApiEndpointType | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [formData, setFormData] = useState<Partial<ApiEndpointType>>({
    endpoint: '',
    method: 'GET',
    description: '',
    requestBody: '',
    responseBody: ''
  })

  const methodOptions = Object.keys(METHOD_CONFIG).map(m => ({ value: m, label: m }))

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }

  const openModal = (endpoint?: ApiEndpointType) => {
    if (endpoint) {
      setEditingEndpoint(endpoint)
      setFormData(endpoint)
    } else {
      setEditingEndpoint(null)
      setFormData({
        endpoint: '',
        method: 'GET',
        description: '',
        requestBody: '',
        responseBody: ''
      })
    }
    setShowModal(true)
  }

  const saveEndpoint = () => {
    if (!formData.endpoint?.trim()) return

    const endpoint: ApiEndpointType = {
      id: editingEndpoint?.id || generateId(),
      endpoint: formData.endpoint!,
      method: formData.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      description: formData.description,
      requestBody: formData.requestBody,
      responseBody: formData.responseBody
    }

    if (editingEndpoint) {
      onChange(apiStructure.map(e => e.id === endpoint.id ? endpoint : e))
    } else {
      onChange([...apiStructure, endpoint])
    }

    setShowModal(false)
    setEditingEndpoint(null)
  }

  const deleteEndpoint = (id: string) => {
    onChange(apiStructure.filter(e => e.id !== id))
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Group endpoints by base path
  const groupedEndpoints = apiStructure.reduce((acc, endpoint) => {
    const basePath = endpoint.endpoint.split('/').slice(0, 3).join('/') || '/api'
    if (!acc[basePath]) acc[basePath] = []
    acc[basePath].push(endpoint)
    return acc
  }, {} as Record<string, ApiEndpointType[]>)

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">API Endpoints</h3>
          <p className="text-sm text-gray-400">Document the API structure of your project</p>
        </div>
        <Button onClick={() => openModal()} leftIcon={<Plus size={16} />}>
          Add Endpoint
        </Button>
      </div>

      {/* Endpoints List */}
      {apiStructure.length === 0 ? (
        <EmptyState
          icon={<Code size={32} />}
          title="No endpoints documented"
          description="Add API endpoints to document your project's API structure"
          action={
            <Button onClick={() => openModal()} leftIcon={<Plus size={16} />} variant="secondary">
              Add First Endpoint
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedEndpoints).map(([basePath, endpoints]) => (
            <Card key={basePath} className="!p-0 overflow-hidden">
              <div className="p-4 bg-zinc-900/50 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Code size={16} className="text-gray-400" />
                  <span className="font-mono text-sm text-gray-300">{basePath}</span>
                  <Badge variant="default">{endpoints.length} endpoints</Badge>
                </div>
              </div>

              <div className="divide-y divide-zinc-800">
                {endpoints.map((endpoint) => {
                  const methodConfig = METHOD_CONFIG[endpoint.method]
                  const isExpanded = expandedIds.has(endpoint.id)

                  return (
                    <div key={endpoint.id} className="hover:bg-zinc-800/30 transition-colors">
                      <div
                        className="flex items-center gap-3 p-4 cursor-pointer"
                        onClick={() => toggleExpand(endpoint.id)}
                      >
                        <button className="text-gray-400">
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>

                        <span className={`px-2 py-1 rounded text-xs font-bold ${methodConfig.bgColor} ${methodConfig.color}`}>
                          {endpoint.method}
                        </span>

                        <code className="font-mono text-sm text-white flex-1">{endpoint.endpoint}</code>

                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => copyToClipboard(endpoint.endpoint, endpoint.id)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                          >
                            {copiedId === endpoint.id ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                          </button>
                          <button
                            onClick={() => openModal(endpoint)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteEndpoint(endpoint.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-zinc-800 bg-zinc-900/30"
                          >
                            <div className="p-4 space-y-4">
                              {endpoint.description && (
                                <div>
                                  <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Description</h4>
                                  <p className="text-sm text-gray-300">{endpoint.description}</p>
                                </div>
                              )}

                              {endpoint.requestBody && (
                                <div>
                                  <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Request Body</h4>
                                  <pre className="p-3 bg-zinc-950 rounded-lg text-sm text-gray-300 overflow-x-auto font-mono">
                                    {endpoint.requestBody}
                                  </pre>
                                </div>
                              )}

                              {endpoint.responseBody && (
                                <div>
                                  <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Response</h4>
                                  <pre className="p-3 bg-zinc-950 rounded-lg text-sm text-gray-300 overflow-x-auto font-mono">
                                    {endpoint.responseBody}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingEndpoint ? 'Edit Endpoint' : 'Add Endpoint'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <Select
                label="Method"
                value={formData.method || 'GET'}
                onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' }))}
                options={methodOptions}
              />
            </div>
            <div className="col-span-3">
              <Input
                label="Endpoint"
                value={formData.endpoint || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, endpoint: e.target.value }))}
                placeholder="/api/users/:id"
                required
              />
            </div>
          </div>

          <Textarea
            label="Description"
            value={formData.description || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
            placeholder="What does this endpoint do?"
          />

          <Textarea
            label="Request Body (JSON)"
            value={formData.requestBody || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, requestBody: e.target.value }))}
            rows={4}
            placeholder={'{\n  "field": "value"\n}'}
            className="font-mono text-sm"
          />

          <Textarea
            label="Response Body (JSON)"
            value={formData.responseBody || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, responseBody: e.target.value }))}
            rows={4}
            placeholder={'{\n  "success": true,\n  "data": {}\n}'}
            className="font-mono text-sm"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={saveEndpoint} disabled={!formData.endpoint?.trim()}>
              {editingEndpoint ? 'Update' : 'Add'} Endpoint
            </Button>
          </div>
        </div>
      </Modal>

      {/* Save Button */}
      {apiStructure.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={onSave} isLoading={isLoading}>
            Save API Structure
          </Button>
        </div>
      )}
    </div>
  )
}
