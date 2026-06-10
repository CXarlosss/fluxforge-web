import { Handle, Position } from 'reactflow';
import { TerminalSquare } from 'lucide-react';

export function CodeNode({ data }: { data: any }) {
  return (
    <div className="bg-yellow-900/80 border-2 border-yellow-500 rounded-lg shadow-xl w-48 text-yellow-100">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-yellow-500" />
      <div className="p-3">
        <div className="flex items-center gap-2 font-bold mb-2 text-yellow-400">
          <TerminalSquare className="w-5 h-5" />
          {data.label || 'Code Sandbox'}
        </div>
        <div className="text-xs text-yellow-200/70 truncate">
          JS/TS Code
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-yellow-500" />
    </div>
  );
}
