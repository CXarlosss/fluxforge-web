import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Clock } from 'lucide-react';
import { useFlowStore } from '../../store/useFlowStore';

export const DelayNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const updateNode = useFlowStore(state => state.updateNode);

  return (
    <div className={`node delay-node ${selected ? 'selected' : ''}`}>
      <div className="node-header">
        <Clock size={16} className="node-icon" />
        <span>Delay</span>
      </div>
      
      <div className="node-body">
        <div className="field-row">
          <div className="field">
            <label>Duration</label>
            <input
              type="number"
              min={1}
              value={data.duration || 1}
              onChange={(e) => updateNode(id, { duration: Number(e.target.value) })}
            />
          </div>
          
          <div className="field">
            <label>Unit</label>
            <select
              value={data.unit || 'seconds'}
              onChange={(e) => updateNode(id, { unit: e.target.value })}
            >
              <option value="seconds">Seconds</option>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
            </select>
          </div>
        </div>
        
        {data._remainingSeconds !== undefined && (
          <div className="delay-status">
            <div className="delay-spinner" />
            <span>Waiting... {data._remainingSeconds}s</span>
          </div>
        )}
      </div>
      
      <Handle type="target" position={Position.Top} className="handle" />
      <Handle type="source" position={Position.Bottom} className="handle" />
    </div>
  );
};
