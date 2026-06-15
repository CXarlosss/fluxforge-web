import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Webhook } from 'lucide-react';
import { useFlowStore } from '../../store/useFlowStore';

export const WebhookNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const updateNode = useFlowStore(state => state.updateNode);

  return (
    <div className={`node webhook-node ${selected ? 'selected' : ''}`}>
      <div className="node-header">
        <Webhook size={16} className="node-icon" />
        <span>Webhook</span>
      </div>
      
      <div className="node-body">
        <div className="field">
          <label>Path</label>
          <input
            type="text"
            value={data.path || `/webhook/${id.slice(0, 8)}`}
            onChange={(e) => updateNode(id, { path: e.target.value })}
            placeholder="/webhook/invoice-paid"
          />
        </div>
        
        <div className="webhook-url">
          <span>POST {data.path || '...'}</span>
        </div>
        
        {data._active && (
          <div className="webhook-status active">
            <span className="pulse-dot" />
            Listening
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="handle" />
    </div>
  );
};
