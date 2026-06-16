import { Play, Loader2, Download, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlowStore } from '../store/useFlowStore';
import { useAuthStore } from '../store/useAuthStore';
import { useState } from 'react';

export function Toolbar() {
  const { nodes, edges, isExecuting, setIsExecuting, clearNodeStatuses, setLastError } = useFlowStore();
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const handleExecute = async () => {
    if (isExecuting) return;
    clearNodeStatuses();
    setIsExecuting(true);
    setLastError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = useAuthStore.getState().token;
      const response = await fetch(`${apiUrl}/api/workflow/execute`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ nodes, edges })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Execution failed');
      }
      setIsExecuting(false);
    } catch (err: any) {
      setLastError(err.message);
      setIsExecuting(false);
    }
  };

  const handleExport = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = useAuthStore.getState().token;
      const response = await fetch(`${apiUrl}/api/workflow/export/n8n`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fluxforge-export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setToast({ message: 'Exported to n8n successfully!', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }

    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="relative z-10">
      <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shadow-md">
        <div className="font-bold text-xl bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
          Fluxforge
        </div>
        <div className="flex items-center gap-3">
          <motion.button 
            onClick={handleExecute}
            disabled={isExecuting}
            whileHover={{ scale: isExecuting ? 1 : 1.05 }}
            whileTap={{ scale: isExecuting ? 1 : 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors shadow-lg ${
              isExecuting 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
            }`}
          >
            {isExecuting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            {isExecuting ? 'Ejecutando...' : 'Ejecutar'}
          </motion.button>

          <motion.button
            onClick={handleExport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-md font-medium transition-colors"
          >
            <Download size={16} />
            Export to n8n
          </motion.button>
          
          <a
            href="/history"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-md font-medium transition-colors"
          >
            History
          </a>
        </div>
      </header>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-20 left-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl border ${
              toast.type === 'error'
                ? 'bg-red-950/90 border-red-500/50 text-red-200'
                : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
            } backdrop-blur-sm`}
          >
            {toast.type === 'error' && <AlertCircle size={18} className="text-red-400" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
