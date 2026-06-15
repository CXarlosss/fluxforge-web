import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { PropertiesPanel } from './components/PropertiesPanel';
import FlowCanvasWrapper from './components/FlowCanvas';
import { LogsDrawer } from './components/LogsDrawer';
import { useEffect, useState } from 'react';
import { useFlowStore } from './store/useFlowStore';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { HistoryPage } from './pages/HistoryPage';

// Simple Toast Component
function Toast({ message, type }: { message: string, type: 'success' | 'error' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 text-white ${
        type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
      }`}
    >
      {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
      <span className="font-medium">{message}</span>
    </motion.div>
  );
}

function App() {
  const { setWsConnected, setNodeStatus, setIsExecuting } = useFlowStore();
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/api/workflow/ws';
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setWsConnected(true);
        console.log('WS Connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const store = useFlowStore.getState();
          
          if (data.type === 'node_start') {
            setNodeStatus(data.nodeId, { state: 'running' });
            store.addLog({ timestamp: data.timestamp, nodeId: data.nodeId, type: data.type, payload: data.payload });
          } else if (data.type === 'node_complete') {
            setNodeStatus(data.nodeId, { state: 'completed', output: data.output });
            store.addLog({ timestamp: data.timestamp, nodeId: data.nodeId, type: data.type, payload: data.output });
            
            const outgoingEdges = store.edges.filter(e => e.source === data.nodeId);
            outgoingEdges.forEach(edge => {
              store.setRunningEdge(edge.id, 'flowing', data.output);
              setTimeout(() => {
                useFlowStore.getState().setRunningEdge(edge.id, 'complete', data.output);
              }, 800);
            });
          } else if (data.type === 'flow_error') {
            setNodeStatus(data.nodeId, { state: 'error', error: data.error });
            setIsExecuting(false);
            store.addLog({ timestamp: data.timestamp, nodeId: data.nodeId || 'SYSTEM', type: data.type, payload: data.error });
            setToast({ message: `Error: ${data.error}`, type: 'error' });
            setTimeout(() => setToast(null), 3000);
          } else if (data.type === 'flow_complete') {
            setIsExecuting(false);
            setToast({ message: 'Workflow completado', type: 'success' });
            setTimeout(() => setToast(null), 3000);
          }
        } catch (e) {
          console.error('Failed to parse WS message', e);
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
        reconnectTimeout = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (ws) ws.close();
    };
  }, [setWsConnected, setNodeStatus, setIsExecuting]);

  // Simple routing
  const path = window.location.pathname;

  if (path === '/history') {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#0f0f1a] text-gray-100">
        <Toolbar />
        <div className="flex-1 overflow-auto">
          <HistoryPage />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0f0f1a] text-gray-100">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 relative">
          <FlowCanvasWrapper />
        </main>
        <PropertiesPanel />
      </div>
      <LogsDrawer />
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
