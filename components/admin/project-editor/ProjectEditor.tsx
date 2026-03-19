'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Tabs, TabPanel } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/FormElements'
import { OverviewTab } from './tabs/OverviewTab'
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
  createProject
} from '@/lib/actions/project-actions'
import {
  FeatureItemType,
  ModuleItemType,
  TechStackItemType,
  FlowNodeDataType,
  FlowEdgeDataType,
  ApiEndpointType,
  DatabaseCollectionType,
  DeploymentInfoType
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
  ArrowLeft,
  Save
} from 'lucide-react'

interface ProjectEditorProps {
  project?: any
  isNew?: boolean
}

export function ProjectEditor({ project, isNew = false }: ProjectEditorProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)

  // Local state for all sections
  const [features, setFeatures] = useState<FeatureItemType[]>(project?.features || [])
  const [modules, setModules] = useState<ModuleItemType[]>(project?.modules || [])
  const [techStack, setTechStack] = useState<TechStackItemType[]>(project?.techStack || [])
  const [flowNodes, setFlowNodes] = useState<FlowNodeDataType[]>(project?.flowDiagram?.nodes || [])
  const [flowEdges, setFlowEdges] = useState<FlowEdgeDataType[]>(project?.flowDiagram?.edges || [])
  const [apiStructure, setApiStructure] = useState<ApiEndpointType[]>(project?.apiStructure || [])
  const [databaseDesign, setDatabaseDesign] = useState<DatabaseCollectionType[]>(project?.databaseDesign || [])
  const [deployment, setDeployment] = useState<DeploymentInfoType | null>(project?.deployment || null)

  // Update local state when project changes
  useEffect(() => {
    if (project) {
      setFeatures(project.features || [])
      setModules(project.modules || [])
      setTechStack(project.techStack || [])
      setFlowNodes(project.flowDiagram?.nodes || [])
      setFlowEdges(project.flowDiagram?.edges || [])
      setApiStructure(project.apiStructure || [])
      setDatabaseDesign(project.databaseDesign || [])
      setDeployment(project.deployment || null)
    }
  }, [project])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { id: 'features', label: 'Features', icon: <Target size={16} />, badge: features.length },
    { id: 'modules', label: 'Modules & Tasks', icon: <FolderKanban size={16} />, badge: modules.length },
    { id: 'techstack', label: 'Tech Stack', icon: <Cpu size={16} />, badge: techStack.length },
    { id: 'flow', label: 'Flow Builder', icon: <Workflow size={16} /> },
    { id: 'api', label: 'API Structure', icon: <Code size={16} />, badge: apiStructure.length },
    { id: 'database', label: 'Database', icon: <Database size={16} />, badge: databaseDesign.length },
    { id: 'deployment', label: 'Deployment', icon: <Rocket size={16} /> }
  ]

  // Handle overview save (create or update)
  const handleOverviewSave = async (data: any) => {
    setIsLoading(true)
    try {
      if (isNew) {
        // Create new project
        const result = await createProject({
          ...data,
          features,
          modules,
          techStack,
          flowDiagram: { nodes: flowNodes, edges: flowEdges },
          apiStructure,
          databaseDesign,
          deployment: deployment || undefined
        })

        if (result.success) {
          toast.success('Project created successfully!')
          router.push('/admin/dashboard')
        } else {
          toast.error(result.error || 'Failed to create project')
        }
      } else {
        // Update existing project
        const result = await updateProject({
          id: project.id,
          ...data
        })

        if (result.success) {
          toast.success('Project updated successfully!')
        } else {
          toast.error(result.error || 'Failed to update project')
        }
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Save features
  const handleFeaturesSave = async () => {
    if (!project?.id) return
    setIsLoading(true)
    try {
      const result = await updateProjectFeatures({
        projectId: project.id,
        features
      })
      if (result.success) {
        toast.success('Features saved!')
      } else {
        toast.error(result.error || 'Failed to save features')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Save modules
  const handleModulesSave = async () => {
    if (!project?.id) return
    setIsLoading(true)
    try {
      const result = await updateProjectModules({
        projectId: project.id,
        modules
      })
      if (result.success) {
        toast.success('Modules saved!')
      } else {
        toast.error(result.error || 'Failed to save modules')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Save tech stack
  const handleTechStackSave = async () => {
    if (!project?.id) return
    setIsLoading(true)
    try {
      const result = await updateProjectTechStack({
        projectId: project.id,
        techStack
      })
      if (result.success) {
        toast.success('Tech stack saved!')
      } else {
        toast.error(result.error || 'Failed to save tech stack')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Save flow diagram
  const handleFlowChange = useCallback((nodes: FlowNodeDataType[], edges: FlowEdgeDataType[]) => {
    setFlowNodes(nodes)
    setFlowEdges(edges)
  }, [])

  const handleFlowSave = async () => {
    if (!project?.id) return
    setIsLoading(true)
    try {
      const result = await updateProjectFlow({
        projectId: project.id,
        flowDiagram: { nodes: flowNodes, edges: flowEdges }
      })
      if (result.success) {
        toast.success('Flow diagram saved!')
      } else {
        toast.error(result.error || 'Failed to save flow diagram')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Save API structure
  const handleApiSave = async () => {
    if (!project?.id) return
    setIsLoading(true)
    try {
      const result = await updateProjectApiStructure({
        projectId: project.id,
        apiStructure
      })
      if (result.success) {
        toast.success('API structure saved!')
      } else {
        toast.error(result.error || 'Failed to save API structure')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Save database design
  const handleDatabaseSave = async () => {
    if (!project?.id) return
    setIsLoading(true)
    try {
      const result = await updateProjectDatabaseDesign({
        projectId: project.id,
        databaseDesign
      })
      if (result.success) {
        toast.success('Database design saved!')
      } else {
        toast.error(result.error || 'Failed to save database design')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Save deployment info
  const handleDeploymentSave = async () => {
    if (!project?.id || !deployment) return
    setIsLoading(true)
    try {
      const result = await updateProjectDeployment({
        projectId: project.id,
        deployment
      })
      if (result.success) {
        toast.success('Deployment info saved!')
      } else {
        toast.error(result.error || 'Failed to save deployment info')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/admin/dashboard')}
                leftIcon={<ArrowLeft size={16} />}
              >
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {isNew ? 'Create New Project' : `Edit: ${project?.title || 'Project'}`}
                </h1>
                {project?.slug && (
                  <p className="text-sm text-gray-400">/{project.slug}</p>
                )}
              </div>
            </div>

            {!isNew && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">
                  Progress: {project?.overallProgress || 0}%
                </span>
                <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project?.overallProgress || 0}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <Tabs
          tabs={isNew ? tabs.slice(0, 1) : tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-6"
        />

        {/* Tab Panels */}
        <TabPanel value="overview" activeValue={activeTab}>
          <OverviewTab
            project={project}
            onUpdate={handleOverviewSave}
            isLoading={isLoading}
          />
        </TabPanel>

        {!isNew && (
          <>
            <TabPanel value="features" activeValue={activeTab}>
              <FeaturesTab
                features={features}
                onChange={setFeatures}
                onSave={handleFeaturesSave}
                isLoading={isLoading}
              />
            </TabPanel>

            <TabPanel value="modules" activeValue={activeTab}>
              <ModulesTab
                modules={modules}
                onChange={setModules}
                onSave={handleModulesSave}
                isLoading={isLoading}
              />
            </TabPanel>

            <TabPanel value="techstack" activeValue={activeTab}>
              <TechStackTab
                techStack={techStack}
                onChange={setTechStack}
                onSave={handleTechStackSave}
                isLoading={isLoading}
              />
            </TabPanel>

            <TabPanel value="flow" activeValue={activeTab}>
              <FlowTab
                nodes={flowNodes}
                edges={flowEdges}
                onChange={handleFlowChange}
                onSave={handleFlowSave}
                isLoading={isLoading}
              />
            </TabPanel>

            <TabPanel value="api" activeValue={activeTab}>
              <ApiStructureTab
                apiStructure={apiStructure}
                onChange={setApiStructure}
                onSave={handleApiSave}
                isLoading={isLoading}
              />
            </TabPanel>

            <TabPanel value="database" activeValue={activeTab}>
              <DatabaseTab
                databaseDesign={databaseDesign}
                onChange={setDatabaseDesign}
                onSave={handleDatabaseSave}
                isLoading={isLoading}
              />
            </TabPanel>

            <TabPanel value="deployment" activeValue={activeTab}>
              <DeploymentTab
                deployment={deployment}
                onChange={setDeployment}
                onSave={handleDeploymentSave}
                isLoading={isLoading}
              />
            </TabPanel>
          </>
        )}
      </div>
    </div>
  )
}
