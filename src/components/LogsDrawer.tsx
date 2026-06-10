import React from 'react';
import { useFlowStore } from '../store/useFlowStore';
import { Terminal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LogsDrawer() {
  const logs = useFlowStore((s) => s.logs);
  const isExecuting = useFlowStore((s) => s.isExecuting);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (isExecuting) {
      setIsOpen(true);
    }
  }, [isExecuting]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 h-64 bg-slate-900 border-t border-slate-700 shadow-2xl flex flex-col z-50 text-slate-300"
        >
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
            <div className="flex items-center gap-2 font-semibold">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Execution Logs
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-700 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {logs.length === 0 ? (
              <div className="text-slate-500 italic text-sm">No logs yet.</div>
            ) : (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/50 text-slate-400">
                    <th className="py-2 font-medium w-32">Timestamp</th>
                    <th className="py-2 font-medium w-48">Node ID</th>
                    <th className="py-2 font-medium w-32">Type</th>
                    <th className="py-2 font-medium">Payload / Output</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="py-2 pr-4 text-xs text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-2 pr-4 font-mono text-xs text-sky-400">
                        {log.nodeId}
                      </td>
                      <td className="py-2 pr-4">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          log.type === 'node_start' ? 'bg-slate-700 text-slate-300' :
                          log.type === 'node_complete' ? 'bg-emerald-900/50 text-emerald-400' :
                          log.type === 'flow_error' ? 'bg-red-900/50 text-red-400' :
                          'bg-slate-700'
                        }`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="py-2">
                        <div className="text-xs font-mono bg-slate-950 p-1 rounded max-h-12 overflow-hidden truncate" title={JSON.stringify(log.payload)}>
                          {JSON.stringify(log.payload)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
