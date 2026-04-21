'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input, Textarea, Button, Card, EmptyState } from '@/components/ui/FormElements'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { DatabaseCollectionType } from '@/lib/validations/project'
import { generateId } from '@/lib/utils/project-helpers'
import { Plus, Trash2, Edit2, Database, Table, Copy, Check } from 'lucide-react'
import { AIGenerateButton } from '@/components/AIGenerateButton'

interface DatabaseTabProps {
  databaseDesign: DatabaseCollectionType[]
  onChange: (databaseDesign: DatabaseCollectionType[]) => void
  onSave: () => void
  isLoading?: boolean
}

export function DatabaseTab({ databaseDesign, onChange, onSave, isLoading }: DatabaseTabProps) {
  const [showModal, setShowModal] = useState(false)
  const [editingCollection, setEditingCollection] = useState<DatabaseCollectionType | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [formData, setFormData] = useState<Partial<DatabaseCollectionType>>({
    collection: '',
    fields: '',
    description: ''
  })

  const openModal = (collection?: DatabaseCollectionType) => {
    if (collection) {
      setEditingCollection(collection)
      setFormData(collection)
    } else {
      setEditingCollection(null)
      setFormData({
        collection: '',
        fields: '{\n  "_id": "ObjectId",\n  "createdAt": "DateTime",\n  "updatedAt": "DateTime"\n}',
        description: ''
      })
    }
    setShowModal(true)
  }

  const saveCollection = () => {
    if (!formData.collection?.trim() || !formData.fields?.trim()) return

    const collection: DatabaseCollectionType = {
      id: editingCollection?.id || generateId(),
      collection: formData.collection!,
      fields: formData.fields!,
      description: formData.description
    }

    if (editingCollection) {
      onChange(databaseDesign.map(c => c.id === collection.id ? collection : c))
    } else {
      onChange([...databaseDesign, collection])
    }

    setShowModal(false)
    setEditingCollection(null)
  }

  const deleteCollection = (id: string) => {
    onChange(databaseDesign.filter(c => c.id !== id))
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const parseFields = (fieldsJson: string): Record<string, string> => {
    try {
      return JSON.parse(fieldsJson)
    } catch {
      return {}
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">Database Design</h3>
          <p className="text-sm text-gray-400">Document your database collections and their schemas</p>
        </div>
        <Button onClick={() => openModal()} leftIcon={<Plus size={16} />}>
          Add Collection
        </Button>
      </div>

      {/* Collections Grid */}
      {databaseDesign.length === 0 ? (
        <EmptyState
          icon={<Database size={32} />}
          title="No collections documented"
          description="Add database collections to document your data structure"
          action={
            <Button onClick={() => openModal()} leftIcon={<Plus size={16} />} variant="secondary">
              Add First Collection
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {databaseDesign.map((collection) => {
              const fields = parseFields(collection.fields)
              const fieldCount = Object.keys(fields).length

              return (
                <motion.div
                  key={collection.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="group h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Table className="text-purple-400" size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{collection.collection}</h4>
                          <Badge variant="default">{fieldCount} fields</Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyToClipboard(collection.fields, collection.id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                        >
                          {copiedId === collection.id ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                        </button>
                        <button
                          onClick={() => openModal(collection)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteCollection(collection.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {collection.description && (
                      <p className="text-sm text-gray-400 mb-4">{collection.description}</p>
                    )}

                    <div className="bg-zinc-950 rounded-lg p-3 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left border-b border-zinc-800">
                            <th className="pb-2 text-gray-500 font-medium">Field</th>
                            <th className="pb-2 text-gray-500 font-medium">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(fields).slice(0, 6).map(([field, type]) => (
                            <tr key={field} className="border-b border-zinc-900">
                              <td className="py-2 font-mono text-blue-400">{field}</td>
                              <td className="py-2 font-mono text-gray-400">{type}</td>
                            </tr>
                          ))}
                          {fieldCount > 6 && (
                            <tr>
                              <td colSpan={2} className="py-2 text-gray-500 text-center">
                                +{fieldCount - 6} more fields
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCollection ? 'Edit Collection' : 'Add Collection'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Collection Name"
            value={formData.collection || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, collection: e.target.value }))}
            placeholder="users"
            required
          />

          <Textarea
            label={
              <div className="flex items-center justify-between w-full">
                <span>Description (AI Optimized)</span>
                <AIGenerateButton 
                  onGenerate={(text) => setFormData(prev => ({ ...prev, description: text }))}
                  promptContext={{ field: "Collection Description", contextData: { collection: formData.collection } }}
                  className="!p-1 scale-75 origin-right"
                />
              </div>
            }
            value={formData.description || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
            placeholder="What data does this collection store?"
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-300">
                Fields (JSON format)
              </label>
              <AIGenerateButton 
                onGenerate={(text) => setFormData(prev => ({ ...prev, fields: text }))}
                promptContext={{ field: "Database Fields Schema", contextData: { collection: formData.collection } }}
                className="!p-1 scale-75 origin-right"
              />
            </div>
            <Textarea
              value={formData.fields || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, fields: e.target.value }))}
              rows={10}
              placeholder={'{\n  "_id": "ObjectId",\n  "name": "String",\n  "email": "String",\n  "createdAt": "DateTime"\n}'}
              className="font-mono text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              Define field names and their types in JSON format
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={saveCollection} 
              disabled={!formData.collection?.trim() || !formData.fields?.trim()}
            >
              {editingCollection ? 'Update' : 'Add'} Collection
            </Button>
          </div>
        </div>
      </Modal>

      {/* Save Button */}
      {databaseDesign.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={onSave} isLoading={isLoading}>
            Save Database Design
          </Button>
        </div>
      )}
    </div>
  )
}
