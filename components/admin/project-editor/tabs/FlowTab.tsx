'use client'

import { FlowBuilder } from '@/components/flow/FlowBuilder'
import { Card, Button } from '@/components/ui/FormElements'
import { FlowNodeDataType, FlowEdgeDataType } from '@/lib/validations/project'
import { Workflow, Info } from 'lucide-react'

interface FlowTabProps {
  nodes: FlowNodeDataType[]
  edges: FlowEdgeDataType[]
  onChange: (nodes: FlowNodeDataType[], edges: FlowEdgeDataType[]) => void
  onSave: () => void
  isLoading?: boolean
}

export function FlowTab({ nodes, edges, onChange, onSave, isLoading }: FlowTabProps) {
  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card className="!p-4 !bg-blue-500/5 !border-blue-500/20">
        <div className="flex items-start gap-3">
          <Info className="text-blue-400 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-white mb-1">Flow Diagram Builder</h3>
            <p className="text-sm text-gray-400">
              Create a visual representation of your project architecture. Add nodes for different components 
              (API, UI, Database, etc.) and connect them to show data flow and relationships.
            </p>
            <ul className="text-sm text-gray-500 mt-2 space-y-1">
              <li>• Click and drag to pan the canvas</li>
              <li>• Scroll to zoom in/out</li>
              <li>• Drag nodes to reposition them</li>
              <li>• Click and drag from node edge to create connections</li>
              <li>• Select nodes and click Delete to remove them</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Flow Builder */}
      <div className="relative">
        <FlowBuilder
          nodes={nodes}
          edges={edges}
          onChange={onChange}
          readOnly={false}
        />
      </div>

      {/* Note about saving */}
      <Card className="!p-4 !bg-zinc-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Workflow size={16} />
            <span>
              {nodes.length} nodes, {edges.length} connections
            </span>
          </div>
          <Button onClick={onSave} isLoading={isLoading} size="sm">
            Save Flow
          </Button>
        </div>
      </Card>
    </div>
  )
}
