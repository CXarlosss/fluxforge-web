import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useState } from 'react';
import { useFlowStore } from '../../store/useFlowStore';
import { Terminal, Loader2, Check, X } from 'lucide-react';

export function LogNode({ id, data }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateNodeLabel = useFlowStore((state) => state.updateNodeLabel);
  const status = useFlowStore((state) => state.nodeStatuses.get(id));
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(false);
    updateNodeLabel(id, e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      updateNodeLabel(id, e.currentTarget.value);
    }
  };

  return (
    <div className="relative w-24 h-24 flex items-center justify-center cursor-pointer group" onDoubleClick={() => setIsEditing(true)}>
      {status?.state === 'running' && (
        <div className="absolute -top-3 -right-3 bg-yellow-500 rounded-full p-1 shadow-lg z-30 animate-bounce">
          <Loader2 size={12} className="text-white animate-spin" />
        </div>
      )}
      {status?.state === 'completed' && (
        <div className="absolute -top-3 -right-3 bg-green-500 rounded-full p-1 shadow-lg z-30">
          <Check size={12} className="text-white" />
        </div>
      )}
      {status?.state === 'error' && (
        <div className="absolute -top-3 -right-3 bg-red-500 rounded-full p-1 shadow-lg z-30">
          <X size={12} className="text-white" />
        </div>
      )}
      <div className={`absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800 rotate-45 rounded shadow-lg group-hover:shadow-[0_0_15px_rgba(156,163,175,0.5)] transition-shadow border ${
        status?.state === 'running' ? 'border-yellow-400 border-4 animate-pulse' : 
        status?.state === 'error' ? 'border-red-500 border-4' : 'border-gray-400'
      }`}></div>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-[#0f0f1a] border-2 border-gray-400 -top-2 hover:scale-125 transition-transform z-20" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[#0f0f1a] border-2 border-gray-400 -bottom-2 hover:scale-125 transition-transform z-20" />
      <div className="z-10 flex flex-col items-center justify-center w-full h-full">
        <Terminal size={18} className="mb-1 text-gray-200" />
        {isEditing ? (
          <input 
            autoFocus
            className="w-16 text-center text-white bg-gray-900/50 rounded px-1 outline-none border border-gray-400"
            defaultValue={data.label}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span className="text-center px-2 text-gray-50 font-bold text-xs break-words leading-tight">{data.label}</span>
        )}
      </div>
    </div>
  );
}
