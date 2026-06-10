import { useCallback, useRef } from 'react';
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlowStore } from '../store/useFlowStore';
import { TriggerNode } from './nodes/TriggerNode';
import { HttpNode } from './nodes/HttpNode';
import { LogNode } from './nodes/LogNode';
import { CodeNode } from './nodes/CodeNode';
import { AnimatedEdge } from './AnimatedEdge';

const nodeTypes = {
  trigger: TriggerNode,
  http: HttpNode,
  log: LogNode,
  code: CodeNode,
};

const edgeTypes = {
  default: AnimatedEdge,
};

function FlowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, setSelectedNodeId } = useFlowStore();
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let label = 'New Node';
      if (type === 'trigger') label = 'Trigger';
      if (type === 'http') label = 'HTTP Request';
      if (type === 'log') label = 'Log';
      if (type === 'code') label = 'Code Sandbox';

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label, code: type === 'code' ? 'return input;' : undefined },
      };

      addNode(newNode);
    },
    [addNode, screenToFlowPosition]
  );

  return (
    <div className="flex-grow h-full bg-[#0f0f1a]" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: 'default' }}
        onSelectionChange={(params) => {
          if (params.nodes.length > 0) {
            setSelectedNodeId(params.nodes[0].id);
          } else {
            setSelectedNodeId(null);
          }
        }}
        fitView
      >
        <Background color="#334155" gap={16} />
        <Controls className="bg-gray-800 text-gray-200 border-gray-700" />
        <MiniMap 
          nodeColor={(node) => {
            if (node.type === 'trigger') return '#16a34a';
            if (node.type === 'http') return '#2563eb';
            if (node.type === 'log') return '#4b5563';
            if (node.type === 'code') return '#eab308';
            return '#eee';
          }}
          maskColor="rgba(15, 15, 26, 0.7)"
          className="bg-gray-900 border-gray-700"
        />
      </ReactFlow>
    </div>
  );
}

export default function FlowCanvasWrapper() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
