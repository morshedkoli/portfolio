'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input, Textarea, Select, Button, Card, EmptyState } from '@/components/ui/FormElements'
import { StatusBadge, Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { ModuleItemType, TaskItemType, TaskStatusType, TaskPriorityType, FeatureStatusType } from '@/lib/validations/project'
import { generateId, getTaskStats, calculateModuleProgress, getPriorityColor, formatDate } from '@/lib/utils/project-helpers'
import { 
  Plus, Trash2, GripVertical, Edit2, Check, X, 
  FolderKanban, CheckCircle2, Clock, AlertCircle,
  ChevronDown, ChevronRight, Calendar, User
} from 'lucide-react'
import { AIGenerateButton } from '@/components/AIGenerateButton'

interface ModulesTabProps {
  modules: ModuleItemType[]
  onChange: (modules: ModuleItemType[]) => void
  onSave: () => void
  isLoading?: boolean
}

const TASK_COLUMNS: { id: TaskStatusType; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'border-gray-500' },
  { id: 'todo', label: 'To Do', color: 'border-blue-500' },
  { id: 'in_progress', label: 'In Progress', color: 'border-yellow-500' },
  { id: 'review', label: 'Review', color: 'border-purple-500' },
  { id: 'completed', label: 'Completed', color: 'border-emerald-500' }
]

export function ModulesTab({ modules, onChange, onSave, isLoading }: ModulesTabProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<TaskItemType | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')

  const [newModule, setNewModule] = useState({
    name: '',
    description: ''
  })

  const [newTask, setNewTask] = useState<Partial<TaskItemType>>({
    title: '',
    description: '',
    status: 'backlog',
    priority: 'medium',
    assignedTo: ''
  })

  const taskStats = useMemo(() => getTaskStats(modules), [modules])

  const toggleModule = (id: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedModules(newExpanded)
  }

  const addModule = () => {
    if (!newModule.name.trim()) return

    const moduleItem: ModuleItemType = {
      id: generateId(),
      name: newModule.name,
      description: newModule.description,
      status: 'planned',
      tasks: [],
      order: modules.length
    }

    onChange([...modules, moduleItem])
    setNewModule({ name: '', description: '' })
    setExpandedModules(prev => new Set(prev).add(moduleItem.id))
  }

  const updateModule = (id: string, updates: Partial<ModuleItemType>) => {
    onChange(modules.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  const deleteModule = (id: string) => {
    onChange(modules.filter(m => m.id !== id))
  }

  const openTaskModal = (moduleId: string, task?: TaskItemType) => {
    setActiveModuleId(moduleId)
    if (task) {
      setEditingTask(task)
      setNewTask(task)
    } else {
      setEditingTask(null)
      setNewTask({
        title: '',
        description: '',
        status: 'backlog',
        priority: 'medium',
        assignedTo: ''
      })
    }
    setShowTaskModal(true)
  }

  const saveTask = () => {
    if (!newTask.title?.trim() || !activeModuleId) return

    const task: TaskItemType = {
      id: editingTask?.id || generateId(),
      title: newTask.title!,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      status: newTask.status as TaskStatusType,
      priority: newTask.priority as TaskPriorityType,
      startDate: newTask.startDate,
      endDate: newTask.endDate,
      order: editingTask?.order ?? modules.find(m => m.id === activeModuleId)?.tasks.length ?? 0
    }

    onChange(modules.map(m => {
      if (m.id !== activeModuleId) return m
      
      if (editingTask) {
        return { ...m, tasks: m.tasks.map(t => t.id === task.id ? task : t) }
      } else {
        return { ...m, tasks: [...m.tasks, task] }
      }
    }))

    setShowTaskModal(false)
    setEditingTask(null)
    setNewTask({ title: '', description: '', status: 'backlog', priority: 'medium', assignedTo: '' })
  }

  const updateTaskStatus = (moduleId: string, taskId: string, status: TaskStatusType) => {
    onChange(modules.map(m => {
      if (m.id !== moduleId) return m
      return {
        ...m,
        tasks: m.tasks.map(t => t.id === taskId ? { ...t, status } : t)
      }
    }))
  }

  const deleteTask = (moduleId: string, taskId: string) => {
    onChange(modules.map(m => {
      if (m.id !== moduleId) return m
      return { ...m, tasks: m.tasks.filter(t => t.id !== taskId) }
    }))
  }

  const statusOptions = [
    { value: 'planned', label: 'Planned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ]

  const taskStatusOptions = TASK_COLUMNS.map(c => ({ value: c.id, label: c.label }))

  const priorityOptions = [
    { value: 'low', label: '🟢 Low' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'high', label: '🟠 High' },
    { value: 'urgent', label: '🔴 Urgent' }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="!p-3">
          <div className="flex items-center gap-2">
            <FolderKanban className="text-blue-400" size={18} />
            <span className="text-sm text-gray-400">Total Tasks</span>
          </div>
          <p className="text-xl font-bold text-white mt-1">{taskStats.total}</p>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-2">
            <Clock className="text-yellow-400" size={18} />
            <span className="text-sm text-gray-400">In Progress</span>
          </div>
          <p className="text-xl font-bold text-white mt-1">{taskStats.inProgress}</p>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-purple-400" size={18} />
            <span className="text-sm text-gray-400">In Review</span>
          </div>
          <p className="text-xl font-bold text-white mt-1">{taskStats.review}</p>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-400" size={18} />
            <span className="text-sm text-gray-400">Completed</span>
          </div>
          <p className="text-xl font-bold text-white mt-1">{taskStats.completed}</p>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-2">
            <FolderKanban className="text-gray-400" size={18} />
            <span className="text-sm text-gray-400">Modules</span>
          </div>
          <p className="text-xl font-bold text-white mt-1">{modules.length}</p>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300 hover:text-white'
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setViewMode('kanban')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300 hover:text-white'
          }`}
        >
          Kanban Board
        </button>
      </div>

      {/* Add Module */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Add New Module</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              label={
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Module Name</span>
                  <AIGenerateButton 
                    onGenerate={(text) => setNewModule(prev => ({ ...prev, name: text }))}
                    promptContext={{ field: "Module Name", contextData: { currentName: newModule.name } }}
                    className="!p-1 scale-75 origin-right"
                  />
                </div>
              }
              placeholder="Module name..."
              value={newModule.name}
              onChange={(e) => setNewModule(prev => ({ ...prev, name: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && addModule()}
            />
          </div>
          <Button onClick={addModule} leftIcon={<Plus size={16} />} disabled={!newModule.name.trim()}>
            Add Module
          </Button>
        </div>
        <div className="mt-3">
          <Textarea
            label={
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Module Description (SEO/AI Optimized)</span>
                <AIGenerateButton 
                  onGenerate={(text) => setNewModule(prev => ({ ...prev, description: text }))}
                  promptContext={{ field: "Module Description", contextData: { moduleName: newModule.name } }}
                  className="!p-1 scale-75 origin-right"
                />
              </div>
            }
            placeholder="Module description (optional)..."
            value={newModule.description}
            onChange={(e) => setNewModule(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
          />
        </div>
      </Card>

      {/* Modules List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {modules.length === 0 ? (
            <EmptyState
              icon={<FolderKanban size={32} />}
              title="No modules yet"
              description="Break your project into modules and track tasks"
            />
          ) : (
            modules.map((module) => (
              <Card key={module.id} className="!p-0 overflow-hidden">
                {/* Module Header */}
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/10/50 transition-colors"
                  onClick={() => toggleModule(module.id)}
                >
                  <button className="text-gray-400">
                    {expandedModules.has(module.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-white">{module.name}</h4>
                      <StatusBadge status={module.status} />
                      <Badge variant="info">{module.tasks.length} tasks</Badge>
                    </div>
                    {module.description && (
                      <p className="text-sm text-gray-400 mt-1 truncate">{module.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <div className="text-sm text-gray-400">
                      {calculateModuleProgress(module)}%
                    </div>
                    <Select
                      value={module.status}
                      onChange={(e) => updateModule(module.id, { status: e.target.value as FeatureStatusType })}
                      options={statusOptions}
                      className="!w-32 !py-1"
                    />
                    <button
                      onClick={() => openTaskModal(module.id)}
                      className="p-2 text-gray-300 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                    <button
                      onClick={() => deleteModule(module.id)}
                      className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Module Tasks */}
                <AnimatePresence>
                  {expandedModules.has(module.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-white/10"
                    >
                      {module.tasks.length === 0 ? (
                        <div className="p-6 text-center text-gray-400">
                          No tasks yet. Click + to add tasks.
                        </div>
                      ) : (
                        <div className="divide-y divide-white/10">
                          {module.tasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-3 p-4 hover:bg-white/10/30">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-white">{task.title}</span>
                                  <StatusBadge status={task.status} />
                                  <Badge variant={
                                    task.priority === 'urgent' ? 'error' :
                                    task.priority === 'high' ? 'warning' :
                                    task.priority === 'medium' ? 'info' : 'default'
                                  }>
                                    {task.priority}
                                  </Badge>
                                </div>
                                {task.description && (
                                  <p className="text-sm text-gray-400 mt-1 truncate">{task.description}</p>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {task.assignedTo && (
                                  <span className="text-xs text-gray-300 flex items-center gap-1">
                                    <User size={12} />
                                    {task.assignedTo}
                                  </span>
                                )}
                                <Select
                                  value={task.status}
                                  onChange={(e) => updateTaskStatus(module.id, task.id, e.target.value as TaskStatusType)}
                                  options={taskStatusOptions}
                                  className="!w-32 !py-1 !text-xs"
                                />
                                <button
                                  onClick={() => openTaskModal(module.id, task)}
                                  className="p-1.5 text-gray-300 hover:text-white hover:bg-white/20 rounded transition-colors"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => deleteTask(module.id, task.id)}
                                  className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && modules.length > 0 && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {TASK_COLUMNS.map((column) => {
              const columnTasks = modules.flatMap(m =>
                m.tasks.filter(t => t.status === column.id).map(t => ({ ...t, moduleId: m.id, moduleName: m.name }))
              )

              return (
                <div key={column.id} className="w-72 flex-shrink-0">
                  <div className={`p-3 rounded-t-lg bg-white/5 border-b-2 ${column.color}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{column.label}</span>
                      <Badge variant="default">{columnTasks.length}</Badge>
                    </div>
                  </div>

                  <div className="bg-white/5/50 rounded-b-lg p-2 min-h-[300px] space-y-2">
                    {columnTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        className="p-3 bg-white/10 rounded-lg border border-white/20 hover:border-white/30 cursor-pointer"
                        onClick={() => openTaskModal(task.moduleId, task)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium text-white">{task.title}</h4>
                          <Badge variant={
                            task.priority === 'urgent' ? 'error' :
                            task.priority === 'high' ? 'warning' :
                            task.priority === 'medium' ? 'info' : 'default'
                          } size="sm">
                            {task.priority}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                          <span className="text-xs text-gray-400">{task.moduleName}</span>
                          {task.assignedTo && (
                            <span className="text-xs text-gray-300">{task.assignedTo}</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Task Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false)
          setEditingTask(null)
        }}
        title={editingTask ? 'Edit Task' : 'Add Task'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label={
              <div className="flex items-center justify-between w-full">
                <span>Task Title</span>
                <AIGenerateButton 
                  onGenerate={(text) => setNewTask(prev => ({ ...prev, title: text }))}
                  promptContext={{ field: "Task Title", contextData: { currentTitle: newTask.title } }}
                  className="!p-1 scale-75 origin-right"
                />
              </div>
            }
            value={newTask.title || ''}
            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            placeholder="What needs to be done?"
            required
          />

          <Textarea
            label={
              <div className="flex items-center justify-between w-full">
                <span>Description (AI Optimized)</span>
                <AIGenerateButton 
                  onGenerate={(text) => setNewTask(prev => ({ ...prev, description: text }))}
                  promptContext={{ field: "Task Description", contextData: { taskTitle: newTask.title } }}
                  className="!p-1 scale-75 origin-right"
                />
              </div>
            }
            value={newTask.description || ''}
            onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            placeholder="Add more details..."
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              value={newTask.status || 'backlog'}
              onChange={(e) => setNewTask(prev => ({ ...prev, status: e.target.value as TaskStatusType }))}
              options={taskStatusOptions}
            />
            <Select
              label="Priority"
              value={newTask.priority || 'medium'}
              onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as TaskPriorityType }))}
              options={priorityOptions}
            />
          </div>

          <Input
            label="Assigned To"
            value={newTask.assignedTo || ''}
            onChange={(e) => setNewTask(prev => ({ ...prev, assignedTo: e.target.value }))}
            placeholder="Team member name..."
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={newTask.startDate ? new Date(newTask.startDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setNewTask(prev => ({ ...prev, startDate: e.target.value || undefined }))}
            />
            <Input
              label="End Date"
              type="date"
              value={newTask.endDate ? new Date(newTask.endDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setNewTask(prev => ({ ...prev, endDate: e.target.value || undefined }))}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="ghost" onClick={() => setShowTaskModal(false)}>
              Cancel
            </Button>
            <Button onClick={saveTask} disabled={!newTask.title?.trim()}>
              {editingTask ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Save Button */}
      {modules.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={onSave} isLoading={isLoading}>
            Save Modules
          </Button>
        </div>
      )}
    </div>
  )
}
