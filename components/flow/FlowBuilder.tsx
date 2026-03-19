'use client'

import { useCallback, useRef, useState } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  BackgroundVariant,
  NodeTypes,
  Panel
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { motion } from 'framer-motion'
import { Plus, Save, Trash2, Database, Globe, Server, Cpu, Box, Zap } from 'lucide-react'
import { FlowNodeDataType, FlowEdgeDataType, FlowNodeTypeType } from '@/lib/validations/project'
import { generateId } from '@/lib/utils/project-helpers'

// Custom node component
function CustomNode({ data, selected }: { data: { label: string; nodeType: FlowNodeTypeType }; selected: boolean }) {
  const nodeStyles: Record<FlowNodeTypeType, { icon: React.ReactNode; color: string; borderColor: string }> = {
    api: { icon: <Globe size={16} />, color: 'bg-blue-500/20', borderColor: 'border-blue-500' },
    ui: { icon: <Box size={16} />, color: 'bg-purple-500/20', borderColor: 'border-purple-500' },
    database: { icon: <Database size={16} />, color: 'bg-emerald-500/20', borderColor: 'border-emerald-500' },
    logic: { icon: <Cpu size={16} />, color: 'bg-yellow-500/20', borderColor: 'border-yellow-500' },
    service: { icon: <Server size={16} />, color: 'bg-orange-500/20', borderColor: 'border-orange-500' },
    external: { icon: <Zap size={16} />, color: 'bg-pink-500/20', borderColor: 'border-pink-500' }
  }

  const style = nodeStyles[data.nodeType] || nodeStyles.logic

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${style.color} ${selected ? style.borderColor : 'border-zinc-600'} 
        backdrop-blur-sm transition-all duration-200 min-w-[120px]`}
    >
      <div className="flex items-center gap-2">
        <span className={`${selected ? 'text-white' : 'text-gray-300'}`}>{style.icon}</span>
        <span className="text-sm font-medium text-white">{data.label}</span>
      </div>
      <div className="text-xs text-gray-400 mt-1 capitalize">{data.nodeType}</div>
    </div>
  )
}

const nodeTypes: NodeTypes = {
  custom: CustomNode
}

interface FlowBuilderProps {
  nodes: FlowNodeDataType[]
  edges: FlowEdgeDataType[]
  onChange: (nodes: FlowNodeDataType[], edges: FlowEdgeDataType[]) => void
  readOnly?: boolean
}

export function FlowBuilder({ nodes: initialNodes, edges: initialEdges, onChange, readOnly = false }: FlowBuilderProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [selectedNodeType, setSelectedNodeType] = useState<FlowNodeTypeType>('logic')
  const [newNodeLabel, setNewNodeLabel] = useState('')

  // Convert data format to React Flow format
  const convertToReactFlowNodes = (nodes: FlowNodeDataType[]): Node[] => {
    return nodes.map(node => ({
      id: node.id,
      type: 'custom',
      position: { x: node.positionX, y: node.positionY },
      data: { label: node.label, nodeType: node.type }
    }))
  }

  const convertToReactFlowEdges = (edges: FlowEdgeDataType[]): Edge[] => {
    return edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: edge.animated,
      style: { stroke: '#6b7280' },
      labelStyle: { fill: '#9ca3af', fontSize: 12 }
    }))
  }

  const [nodes, setNodes, onNodesChange] = useNodesState(convertToReactFlowNodes(initialNodes))
  const [edges, setEdges, onEdgesChange] = useEdgesState(convertToReactFlowEdges(initialEdges))

  // Convert back to data format for saving
  const convertToDataFormat = useCallback(() => {
    const dataNodes: FlowNodeDataType[] = nodes.map(node => ({
      id: node.id,
      label: (node.data as { label: string; nodeType: FlowNodeTypeType }).label,
      type: (node.data as { label: string; nodeType: FlowNodeTypeType }).nodeType,
      positionX: node.position.x,
      positionY: node.position.y,
      data: undefined
    }))

    const dataEdges: FlowEdgeDataType[] = edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label as string | undefined,
      animated: edge.animated
    }))

    return { nodes: dataNodes, edges: dataEdges }
  }, [nodes, edges])

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({
        ...params,
        id: generateId(),
        style: { stroke: '#6b7280' },
        animated: true
      }, eds))
    },
    [setEdges]
  )

  const addNode = useCallback(() => {
    if (!newNodeLabel.trim()) return

    const newNode: Node = {
      id: generateId(),
      type: 'custom',
      position: { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 },
      data: { label: newNodeLabel, nodeType: selectedNodeType }
    }

    setNodes((nds) => [...nds, newNode])
    setNewNodeLabel('')
  }, [newNodeLabel, selectedNodeType, setNodes])

  const deleteSelectedNodes = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected))
    setEdges((eds) => eds.filter((edge) => {
      const selectedNodeIds = nodes.filter(n => n.selected).map(n => n.id)
      return !selectedNodeIds.includes(edge.source) && !selectedNodeIds.includes(edge.target)
    }))
  }, [nodes, setNodes, setEdges])

  const handleSave = useCallback(() => {
    const { nodes: dataNodes, edges: dataEdges } = convertToDataFormat()
    onChange(dataNodes, dataEdges)
  }, [convertToDataFormat, onChange])

  const nodeTypeOptions: { value: FlowNodeTypeType; label: string; icon: React.ReactNode }[] = [
    { value: 'api', label: 'API', icon: <Globe size={14} /> },
    { value: 'ui', label: 'UI', icon: <Box size={14} /> },
    { value: 'database', label: 'Database', icon: <Database size={14} /> },
    { value: 'logic', label: 'Logic', icon: <Cpu size={14} /> },
    { value: 'service', label: 'Service', icon: <Server size={14} /> },
    { value: 'external', label: 'External', icon: <Zap size={14} /> }
  ]

  return (
    <div className="w-full h-[600px] bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        nodeTypes={nodeTypes}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        fitView
        className="bg-zinc-950"
      >
        <Controls className="!bg-zinc-900 !border-zinc-700 !rounded-lg [&>button]:!bg-zinc-800 [&>button]:!border-zinc-700 [&>button]:!text-white [&>button:hover]:!bg-zinc-700" />
        <MiniMap 
          className="!bg-zinc-900 !border-zinc-700 !rounded-lg"
          nodeColor="#3b82f6"
          maskColor="rgba(0, 0, 0, 0.8)"
        />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#27272a" />

        {!readOnly && (
          <Panel position="top-left" className="flex flex-col gap-3 p-4 bg-zinc-900/90 backdrop-blur-sm rounded-lg border border-zinc-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newNodeLabel}
                onChange={(e) => setNewNodeLabel(e.target.value)}
                placeholder="Node label..."
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 w-40"
                onKeyDown={(e) => e.key === 'Enter' && addNode()}
              />
              <select
                value={selectedNodeType}
                onChange={(e) => setSelectedNodeType(e.target.value as FlowNodeTypeType)}
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {nodeTypeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={addNode}
                disabled={!newNodeLabel.trim()}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
              >
                <Plus size={14} />
                Add Node
              </button>
              <button
                onClick={deleteSelectedNodes}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm rounded-lg transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </Panel>
        )}

        {!readOnly && (
          <Panel position="top-right" className="p-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-colors"
            >
              <Save size={16} />
              Save Flow
            </motion.button>
          </Panel>
        )}
      </ReactFlow>
    </div>
  )
}
