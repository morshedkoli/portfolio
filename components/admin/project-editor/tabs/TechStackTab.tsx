'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input, Select, Button, Card, EmptyState } from '@/components/ui/FormElements'
import { Badge } from '@/components/ui/Badge'
import { TechStackItemType, TechCategoryType } from '@/lib/validations/project'
import { generateId, getTechCategoryColor } from '@/lib/utils/project-helpers'
import { Plus, Trash2, Cpu, Database, Globe, Server, Sparkles, Package, X } from 'lucide-react'

interface TechStackTabProps {
  techStack: TechStackItemType[]
  onChange: (techStack: TechStackItemType[]) => void
  onSave: () => void
  isLoading?: boolean
}

const CATEGORY_CONFIG: Record<TechCategoryType, { icon: React.ReactNode; label: string }> = {
  frontend: { icon: <Globe size={16} />, label: 'Frontend' },
  backend: { icon: <Server size={16} />, label: 'Backend' },
  database: { icon: <Database size={16} />, label: 'Database' },
  devops: { icon: <Package size={16} />, label: 'DevOps' },
  ai: { icon: <Sparkles size={16} />, label: 'AI / ML' },
  other: { icon: <Cpu size={16} />, label: 'Other' }
}

// Popular tech suggestions
const TECH_SUGGESTIONS: Record<TechCategoryType, string[]> = {
  frontend: ['React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'TypeScript', 'Tailwind CSS', 'Sass'],
  backend: ['Node.js', 'Express', 'NestJS', 'Django', 'FastAPI', 'Spring Boot', 'Go', 'Rust'],
  database: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'Supabase', 'Prisma', 'SQLite'],
  devops: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Vercel', 'GitHub Actions', 'Jenkins'],
  ai: ['TensorFlow', 'PyTorch', 'OpenAI', 'Langchain', 'Hugging Face', 'scikit-learn', 'Pandas', 'NumPy'],
  other: ['GraphQL', 'REST API', 'WebSocket', 'gRPC', 'OAuth', 'JWT', 'Stripe', 'Socket.io']
}

export function TechStackTab({ techStack, onChange, onSave, isLoading }: TechStackTabProps) {
  const [newTech, setNewTech] = useState({
    name: '',
    category: 'frontend' as TechCategoryType,
    icon: ''
  })
  const [selectedCategory, setSelectedCategory] = useState<TechCategoryType | 'all'>('all')

  const categoryOptions = Object.entries(CATEGORY_CONFIG).map(([value, config]) => ({
    value,
    label: config.label
  }))

  const addTech = (name?: string, category?: TechCategoryType) => {
    const techName = name || newTech.name
    const techCategory = category || newTech.category

    if (!techName.trim()) return

    // Check for duplicates
    if (techStack.some(t => t.name.toLowerCase() === techName.toLowerCase())) {
      return
    }

    const tech: TechStackItemType = {
      name: techName,
      category: techCategory,
      icon: newTech.icon || undefined
    }

    onChange([...techStack, tech])
    setNewTech({ name: '', category: 'frontend', icon: '' })
  }

  const removeTech = (name: string) => {
    onChange(techStack.filter(t => t.name !== name))
  }

  const filteredTechStack = selectedCategory === 'all'
    ? techStack
    : techStack.filter(t => t.category === selectedCategory)

  const groupedTechStack = Object.keys(CATEGORY_CONFIG).reduce((acc, category) => {
    acc[category as TechCategoryType] = techStack.filter(t => t.category === category)
    return acc
  }, {} as Record<TechCategoryType, TechStackItemType[]>)

  const getSuggestions = () => {
    const category = newTech.category
    const existing = techStack.map(t => t.name.toLowerCase())
    return TECH_SUGGESTIONS[category].filter(s => !existing.includes(s.toLowerCase()))
  }

  return (
    <div className="space-y-6">
      {/* Add New Tech */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Add Technology</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Technology name..."
              value={newTech.name}
              onChange={(e) => setNewTech(prev => ({ ...prev, name: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && addTech()}
            />
          </div>
          <Select
            value={newTech.category}
            onChange={(e) => setNewTech(prev => ({ ...prev, category: e.target.value as TechCategoryType }))}
            options={categoryOptions}
          />
          <Button onClick={() => addTech()} leftIcon={<Plus size={16} />} disabled={!newTech.name.trim()}>
            Add Tech
          </Button>
        </div>

        {/* Quick Add Suggestions */}
        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-2">Quick add:</p>
          <div className="flex flex-wrap gap-2">
            {getSuggestions().slice(0, 8).map((tech) => (
              <button
                key={tech}
                onClick={() => addTech(tech, newTech.category)}
                className="px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
              >
                + {tech}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-zinc-800 text-gray-400 hover:text-white'
          }`}
        >
          All ({techStack.length})
        </button>
        {Object.entries(CATEGORY_CONFIG).map(([category, config]) => {
          const count = groupedTechStack[category as TechCategoryType]?.length || 0
          if (count === 0) return null
          
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as TechCategoryType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-zinc-800 text-gray-400 hover:text-white'
              }`}
            >
              {config.icon}
              {config.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Tech Stack Grid */}
      {techStack.length === 0 ? (
        <EmptyState
          icon={<Cpu size={32} />}
          title="No technologies added"
          description="Add the technologies used in this project"
        />
      ) : selectedCategory === 'all' ? (
        // Grouped view
        <div className="space-y-6">
          {Object.entries(groupedTechStack).map(([category, techs]) => {
            if (techs.length === 0) return null
            const config = CATEGORY_CONFIG[category as TechCategoryType]
            const colors = getTechCategoryColor(category)

            return (
              <Card key={category}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-8 h-8 rounded-lg ${colors.bgColor} flex items-center justify-center ${colors.color}`}>
                    {config.icon}
                  </div>
                  <h3 className="font-semibold text-white">{config.label}</h3>
                  <Badge variant="default">{techs.length}</Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {techs.map((tech) => (
                      <motion.div
                        key={tech.name}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className={`group flex items-center gap-2 px-3 py-2 ${colors.bgColor} ${colors.color} 
                          rounded-lg border ${colors.borderColor} hover:bg-opacity-20 transition-colors`}
                      >
                        {tech.icon ? (
                          <span className="text-sm">{tech.icon}</span>
                        ) : (
                          config.icon
                        )}
                        <span className="font-medium">{tech.name}</span>
                        <button
                          onClick={() => removeTech(tech.name)}
                          className="opacity-0 group-hover:opacity-100 ml-1 p-1 hover:bg-white/10 rounded transition-all"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        // Filtered view
        <Card>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {filteredTechStack.map((tech) => {
                const colors = getTechCategoryColor(tech.category)
                return (
                  <motion.div
                    key={tech.name}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className={`group flex items-center gap-2 px-3 py-2 ${colors.bgColor} ${colors.color} 
                      rounded-lg border ${colors.borderColor} hover:bg-opacity-20 transition-colors`}
                  >
                    {CATEGORY_CONFIG[tech.category].icon}
                    <span className="font-medium">{tech.name}</span>
                    <button
                      onClick={() => removeTech(tech.name)}
                      className="opacity-0 group-hover:opacity-100 ml-1 p-1 hover:bg-white/10 rounded transition-all"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </Card>
      )}

      {/* Save Button */}
      {techStack.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={onSave} isLoading={isLoading}>
            Save Tech Stack
          </Button>
        </div>
      )}
    </div>
  )
}
