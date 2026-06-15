import { create } from 'zustand';
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from 'reactflow';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

export type NodeStatus = {
  state: 'idle' | 'running' | 'completed' | 'error';
  output?: any;
  error?: string;
};

export type LogEntry = {
  timestamp: string;
  nodeId: string;
  type: string;
  payload: any;
};

export type EdgeStatus = 'idle' | 'flowing' | 'complete';
export type RunningEdge = {
  status: EdgeStatus;
  payload?: any;
};

export type FlowState = {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  nodeStatuses: Map<string, NodeStatus>;
  wsConnected: boolean;
  isExecuting: boolean;
  lastError: string | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, newData: Record<string, any>) => void;
  updateNodeLabel: (nodeId: string, label: string) => void;
  updateNodeCode: (nodeId: string, code: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setNodeStatus: (nodeId: string, status: NodeStatus) => void;
  clearNodeStatuses: () => void;
  setWsConnected: (connected: boolean) => void;
  setIsExecuting: (executing: boolean) => void;
  setLastError: (error: string | null) => void;
  runningEdges: Record<string, RunningEdge>;
  logs: LogEntry[];
  setRunningEdge: (edgeId: string, status: EdgeStatus, payload?: any) => void;
  addLog: (log: LogEntry) => void;
  clearLogs: () => void;
};

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  nodeStatuses: new Map(),
  wsConnected: false,
  isExecuting: false,
  lastError: null,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge({ ...connection, animated: true, className: 'flow-edge-animated' }, get().edges),
    });
  },
  addNode: (node: Node) => {
    set({ nodes: [...get().nodes, node] });
  },
  removeNode: (nodeId: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });
  },
  updateNode: (nodeId: string, newData: Record<string, any>) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      }),
    });
  },
  updateNodeLabel: (nodeId: string, label: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, label } };
        }
        return node;
      }),
    });
  },
  updateNodeCode: (nodeId: string, code: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, code } };
        }
        return node;
      }),
    });
  },
  setSelectedNodeId: (id: string | null) => {
    if (get().selectedNodeId !== id) {
      set({ selectedNodeId: id });
    }
  },
  setNodeStatus: (nodeId: string, status: NodeStatus) => {
    const newStatuses = new Map(get().nodeStatuses);
    newStatuses.set(nodeId, status);
    set({ nodeStatuses: newStatuses });
  },
  clearNodeStatuses: () => {
    set({ nodeStatuses: new Map(), lastError: null });
  },
  setWsConnected: (connected: boolean) => {
    set({ wsConnected: connected });
  },
  setIsExecuting: (executing: boolean) => {
    set({ isExecuting: executing });
  },
  setLastError: (error: string | null) => {
    set({ lastError: error });
  },
  runningEdges: {},
  logs: [],
  setRunningEdge: (edgeId: string, status: EdgeStatus, payload?: any) => {
    set((state) => ({
      runningEdges: {
        ...state.runningEdges,
        [edgeId]: { status, payload },
      },
    }));
  },
  addLog: (log: LogEntry) => {
    set((state) => ({
      logs: [...state.logs, log],
    }));
  },
  clearLogs: () => {
    set({ logs: [], runningEdges: {} });
  },
}));
