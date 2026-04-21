'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { TabPanel } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/FormElements'
import { SaveBar } from './SaveBar'
import { EditorSidebar, SidebarItem } from './EditorSidebar'
import { OverviewTab, OverviewTabHandle } from './tabs/OverviewTab'
import { FeaturesTab } from './tabs/FeaturesTab'
import { ModulesTab } from './tabs/ModulesTab'
import { TechStackTab } from './tabs/TechStackTab'
import { FlowTab } from './tabs/FlowTab'
import { ApiStructureTab } from './tabs/ApiStructureTab'
import { DatabaseTab } from './tabs/DatabaseTab'
import { DeploymentTab } from './tabs/DeploymentTab'
import {
  updateProject,
  updateProjectFeatures,
  updateProjectModules,
  updateProjectFlow,
  updateProjectTechStack,
  updateProjectApiStructure,
  updateProjectDatabaseDesign,
  updateProjectDeployment,
} from '@/lib/actions/project-actions'
import {
  FeatureItemType,
  ModuleItemType,
  TechStackItemType,
  FlowNodeDataType,
  FlowEdgeDataType,
  ApiEndpointType,
  DatabaseCollectionType,
  DeploymentInfoType,
} from '@/lib/validations/project'
import {
  LayoutDashboard,
  Target,
  FolderKanban,
  Cpu,
  Workflow,
  Code,
  Database,
  Rocket,
  FileDown,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

interface ProjectEditorProps {
  project: any
  isNew?: boolean
}

/** Track dirty (unsaved) state per section */
type DirtyMap = Record<string, boolean>

export function ProjectEditor({ project }: ProjectEditorProps) {
  const searchParams = useSearchParams()
  const justCreated = searchParams.get('created') === '1'

  const [activeSection, setActiveSection] = useState('overview')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [dirty, setDirty] = useState<DirtyMap>({})
  const [showCreatedBanner, setShowCreatedBanner] = useState(justCreated)

  const overviewRef = useRef<OverviewTabHandle>(null)

  // Section data state
  const [features, setFeatures] = useState<FeatureItemType[]>(project?.features || [])
  const [modules, setModules] = useState<ModuleItemType[]>(project?.modules || [])
  const [techStack, setTechStack] = useState<TechStackItemType[]>(project?.techStack || [])
  const [flowNodes, setFlowNodes] = useState<FlowNodeDataType[]>(project?.flowDiagram?.nodes || [])
  const [flowEdges, setFlowEdges] = useState<FlowEdgeDataType[]>(project?.flowDiagram?.edges || [])
  const [apiStructure, setApiStructure] = useState<ApiEndpointType[]>(project?.apiStructure || [])
  const [databaseDesign, setDatabaseDesign] = useState<DatabaseCollectionType[]>(project?.databaseDesign || [])
  const [deployment, setDeployment] = useState<DeploymentInfoType | null>(project?.deployment || null)

  // Helpers
  const markDirty = (section: string) =>
    setDirty(prev => ({ ...prev, [section]: true }))
  const markClean = (section: string) =>
    setDirty(prev => ({ ...prev, [section]: false }))
  const hasAnyDirty = Object.values(dirty).some(Boolean)

  // Auto-dismiss created banner
  useEffect(() => {
    if (showCreatedBanner) {
      const t = setTimeout(() => setShowCreatedBanner(false), 6000)
      return () => clearTimeout(t)
    }
  }, [showCreatedBanner])

  // ── Save handlers ──────────────────────────────────────────────────────────

  const saveOverview = async () => {
    overviewRef.current?.submit()
  }

  const handleOverviewSave = async (data: any) => {
    setIsSaving(true)
    try {
      const result = await updateProject({ id: project.id, ...data })
      if (result.success) {
        setLastSaved(new Date())
        markClean('overview')
        toast.success('Overview saved')
      } else {
        toast.error(result.error || 'Failed to save overview')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const saveFeatures = async () => {
    setIsSaving(true)
    try {
      const result = await updateProjectFeatures({ projectId: project.id, features })
      if (result.success) { setLastSaved(new Date()); markClean('features'); toast.success('Features saved') }
      else toast.error(result.error || 'Failed to save features')
    } catch { toast.error('An error occurred') }
    finally { setIsSaving(false) }
  }

  const saveModules = async () => {
    setIsSaving(true)
    try {
      const result = await updateProjectModules({ projectId: project.id, modules })
      if (result.success) { setLastSaved(new Date()); markClean('modules'); toast.success('Modules saved') }
      else toast.error(result.error || 'Failed to save modules')
    } catch { toast.error('An error occurred') }
    finally { setIsSaving(false) }
  }

  const saveTechStack = async () => {
    setIsSaving(true)
    try {
      const result = await updateProjectTechStack({ projectId: project.id, techStack })
      if (result.success) { setLastSaved(new Date()); markClean('techstack'); toast.success('Tech stack saved') }
      else toast.error(result.error || 'Failed to save tech stack')
    } catch { toast.error('An error occurred') }
    finally { setIsSaving(false) }
  }

  const handleFlowChange = useCallback((nodes: FlowNodeDataType[], edges: FlowEdgeDataType[]) => {
    setFlowNodes(nodes)
    setFlowEdges(edges)
    markDirty('flow')
  }, [])

  const saveFlow = async () => {
    setIsSaving(true)
    try {
      const result = await updateProjectFlow({ projectId: project.id, flowDiagram: { nodes: flowNodes, edges: flowEdges } })
      if (result.success) { setLastSaved(new Date()); markClean('flow'); toast.success('Flow diagram saved') }
      else toast.error(result.error || 'Failed to save flow diagram')
    } catch { toast.error('An error occurred') }
    finally { setIsSaving(false) }
  }

  const saveApi = async () => {
    setIsSaving(true)
    try {
      const result = await updateProjectApiStructure({ projectId: project.id, apiStructure })
      if (result.success) { setLastSaved(new Date()); markClean('api'); toast.success('API structure saved') }
      else toast.error(result.error || 'Failed to save API structure')
    } catch { toast.error('An error occurred') }
    finally { setIsSaving(false) }
  }

  const saveDatabase = async () => {
    setIsSaving(true)
    try {
      const result = await updateProjectDatabaseDesign({ projectId: project.id, databaseDesign })
      if (result.success) { setLastSaved(new Date()); markClean('database'); toast.success('Database design saved') }
      else toast.error(result.error || 'Failed to save database design')
    } catch { toast.error('An error occurred') }
    finally { setIsSaving(false) }
  }

  const saveDeployment = async () => {
    if (!deployment) return
    setIsSaving(true)
    try {
      const result = await updateProjectDeployment({ projectId: project.id, deployment })
      if (result.success) { setLastSaved(new Date()); markClean('deployment'); toast.success('Deployment saved') }
      else toast.error(result.error || 'Failed to save deployment')
    } catch { toast.error('An error occurred') }
    finally { setIsSaving(false) }
  }

  // Dispatch save for the current active section
  const handleSave = () => {
    switch (activeSection) {
      case 'overview':   return saveOverview()
      case 'features':   return saveFeatures()
      case 'modules':    return saveModules()
      case 'techstack':  return saveTechStack()
      case 'flow':       return saveFlow()
      case 'api':        return saveApi()
      case 'database':   return saveDatabase()
      case 'deployment': return saveDeployment()
    }
  }

  const handleDownloadMarkdown = async () => {
    try {
      const response = await fetch(`/api/projects/${project.id}/markdown`)
      if (!response.ok) throw new Error()
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${project.slug || 'project'}-ai-context.md`
      document.body.appendChild(a); a.click()
      window.URL.revokeObjectURL(url); document.body.removeChild(a)
      toast.success('AI context markdown downloaded!')
    } catch { toast.error('Failed to download markdown') }
  }

  // ── Sidebar items ──────────────────────────────────────────────────────────

  const sidebarItems: SidebarItem[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} />, hasChanges: dirty.overview },
    { id: 'features', label: 'Features', icon: <Target size={16} />, badge: features.length, hasChanges: dirty.features },
    { id: 'modules', label: 'Modules & Tasks', icon: <FolderKanban size={16} />, badge: modules.length, hasChanges: dirty.modules },
    { id: 'techstack', label: 'Tech Stack', icon: <Cpu size={16} />, badge: techStack.length, hasChanges: dirty.techstack },
    { id: 'flow', label: 'Flow Builder', icon: <Workflow size={16} />, hasChanges: dirty.flow },
    { id: 'api', label: 'API Structure', icon: <Code size={16} />, badge: apiStructure.length, hasChanges: dirty.api },
    { id: 'database', label: 'Database', icon: <Database size={16} />, badge: databaseDesign.length, hasChanges: dirty.database },
    { id: 'deployment', label: 'Deployment', icon: <Rocket size={16} />, hasChanges: dirty.deployment },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Sticky SaveBar */}
      <SaveBar
        title={project?.title || 'Project'}
        slug={project?.slug}
        isSaving={isSaving}
        hasUnsavedChanges={hasAnyDirty}
        lastSaved={lastSaved}
        onSave={handleSave}
        extraActions={
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadMarkdown}
            leftIcon={<FileDown size={14} />}
            className="text-zinc-500 hover:text-zinc-200 hidden sm:flex"
            title="Download AI context markdown"
          >
            AI Context
          </Button>
        }
      />

      {/* "Just created" success banner */}
      <AnimatePresence>
        {showCreatedBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-3">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <p className="text-sm text-emerald-300">
                <strong>Project created!</strong>{' '}
                Now fill in the details below — every section has its own save button in the top bar.
              </p>
              <button
                onClick={() => setShowCreatedBanner(false)}
                className="ml-auto text-emerald-500 hover:text-emerald-300 text-xs"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout: sidebar + content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar – desktop only */}
        <div className="hidden lg:block border-r border-zinc-800/60 px-3 shrink-0">
          <EditorSidebar
            items={sidebarItems}
            activeId={activeSection}
            onChange={setActiveSection}
          />
        </div>

        {/* Mobile tab strip – stacks above content on small screens */}
        <div className="lg:hidden w-full bg-zinc-950/95 backdrop-blur border-b border-zinc-800/60 overflow-x-auto shrink-0">
          <div className="flex gap-1 p-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                  activeSection === item.id
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20'
                    : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                {item.icon}
                {item.label}
                {item.hasChanges && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
              >
                {activeSection === 'overview' && (
                  <OverviewTab
                    ref={overviewRef}
                    project={project}
                    onUpdate={handleOverviewSave}
                    onAnyChange={() => markDirty('overview')}
                    isLoading={isSaving}
                  />
                )}

                {activeSection === 'features' && (
                  <FeaturesTab
                    features={features}
                    onChange={(f) => { setFeatures(f); markDirty('features') }}
                    onSave={saveFeatures}
                    isLoading={isSaving}
                  />
                )}

                {activeSection === 'modules' && (
                  <ModulesTab
                    modules={modules}
                    onChange={(m) => { setModules(m); markDirty('modules') }}
                    onSave={saveModules}
                    isLoading={isSaving}
                  />
                )}

                {activeSection === 'techstack' && (
                  <TechStackTab
                    techStack={techStack}
                    onChange={(t) => { setTechStack(t); markDirty('techstack') }}
                    onSave={saveTechStack}
                    isLoading={isSaving}
                  />
                )}

                {activeSection === 'flow' && (
                  <FlowTab
                    nodes={flowNodes}
                    edges={flowEdges}
                    onChange={handleFlowChange}
                    onSave={saveFlow}
                    isLoading={isSaving}
                  />
                )}

                {activeSection === 'api' && (
                  <ApiStructureTab
                    apiStructure={apiStructure}
                    onChange={(a) => { setApiStructure(a); markDirty('api') }}
                    onSave={saveApi}
                    isLoading={isSaving}
                  />
                )}

                {activeSection === 'database' && (
                  <DatabaseTab
                    databaseDesign={databaseDesign}
                    onChange={(d) => { setDatabaseDesign(d); markDirty('database') }}
                    onSave={saveDatabase}
                    isLoading={isSaving}
                  />
                )}

                {activeSection === 'deployment' && (
                  <DeploymentTab
                    deployment={deployment}
                    onChange={(d) => { setDeployment(d); markDirty('deployment') }}
                    onSave={saveDeployment}
                    isLoading={isSaving}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
