import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useState } from 'react';
import { useFlowStore } from '../../store/useFlowStore';
import { Globe, Loader2, Check, X } from 'lucide-react';

export function HttpNode({ id, data }: NodeProps) {
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
    <div className="relative">
      {status?.state === 'running' && (
        <div className="absolute -top-3 -right-3 bg-yellow-500 rounded-full p-1 shadow-lg z-10 animate-bounce">
          <Loader2 size={12} className="text-white animate-spin" />
        </div>
      )}
      {status?.state === 'completed' && (
        <div className="absolute -top-3 -right-3 bg-green-500 rounded-full p-1 shadow-lg z-10">
          <Check size={12} className="text-white" />
        </div>
      )}
      {status?.state === 'error' && (
        <div className="absolute -top-3 -right-3 bg-red-500 rounded-full p-1 shadow-lg z-10">
          <X size={12} className="text-white" />
        </div>
      )}
      <div 
        className={`w-28 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg border flex flex-col items-center justify-center shadow-lg text-white font-bold text-xs cursor-pointer hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-shadow ${
          status?.state === 'running' ? 'border-yellow-400 border-4 animate-pulse' : 
          status?.state === 'error' ? 'border-red-500 border-4' : 'border-blue-400'
        }`}
        onDoubleClick={() => setIsEditing(true)}
      >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-[#0f0f1a] border-2 border-blue-400 hover:scale-125 transition-transform" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[#0f0f1a] border-2 border-blue-400 hover:scale-125 transition-transform" />
      <Globe size={18} className="mb-1 text-blue-200" />
      {isEditing ? (
        <input 
          autoFocus
          className="w-20 text-center text-white bg-blue-900/50 rounded px-1 outline-none border border-blue-400"
          defaultValue={data.label}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span className="text-center px-2 break-words leading-tight text-blue-50">{data.label}</span>
      )}
      </div>
    </div>
  );
}
