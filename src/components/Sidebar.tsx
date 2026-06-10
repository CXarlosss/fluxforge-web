import { motion } from 'framer-motion';
import { Zap, Globe, Terminal } from 'lucide-react';

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col gap-4 shadow-xl z-10">
      <h2 className="text-lg font-bold text-gray-100">Nodos</h2>
      <div className="text-sm text-gray-400 mb-2">Arrastra los nodos al canvas</div>
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="p-3 border border-green-500/50 bg-green-900/20 text-green-400 rounded-lg cursor-grab flex items-center gap-3 font-medium shadow-sm transition-colors hover:bg-green-900/40"
        onDragStart={(event) => onDragStart(event as unknown as React.DragEvent, 'trigger')}
        draggable
      >
        <Zap size={18} />
        Trigger
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="p-3 border border-blue-500/50 bg-blue-900/20 text-blue-400 rounded-lg cursor-grab flex items-center gap-3 font-medium shadow-sm transition-colors hover:bg-blue-900/40"
        onDragStart={(event) => onDragStart(event as unknown as React.DragEvent, 'http')}
        draggable
      >
        <Globe size={18} />
        HTTP Request
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="p-3 border border-gray-500/50 bg-gray-800/50 text-gray-300 rounded-lg cursor-grab flex items-center gap-3 font-medium shadow-sm transition-colors hover:bg-gray-700/50"
        onDragStart={(event) => onDragStart(event as unknown as React.DragEvent, 'log')}
        draggable
      >
        <Terminal size={18} />
        Log
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="p-3 border border-yellow-500/50 bg-yellow-900/20 text-yellow-400 rounded-lg cursor-grab flex items-center gap-3 font-medium shadow-sm transition-colors hover:bg-yellow-900/40"
        onDragStart={(event) => onDragStart(event as unknown as React.DragEvent, 'code')}
        draggable
      >
        <Terminal size={18} />
        Code Sandbox
      </motion.div>
    </aside>
  );
}
