import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Mail } from 'lucide-react';
import { useFlowStore } from '../../store/useFlowStore';

export const EmailNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const updateNode = useFlowStore(state => state.updateNode);

  return (
    <div className={`node email-node ${selected ? 'selected' : ''}`}>
      <div className="node-header">
        <Mail size={16} className="node-icon" />
        <span>Email</span>
      </div>
      
      <div className="node-body">
        <div className="field">
          <label>To</label>
          <input
            type="email"
            value={data.to || ''}
            onChange={(e) => updateNode(id, { to: e.target.value })}
            placeholder="user@example.com"
          />
        </div>
        
        <div className="field">
          <label>Subject</label>
          <input
            type="text"
            value={data.subject || ''}
            onChange={(e) => updateNode(id, { subject: e.target.value })}
            placeholder="Hello!"
          />
        </div>
        
        <div className="field">
          <label>Body</label>
          <textarea
            value={data.body || ''}
            onChange={(e) => updateNode(id, { body: e.target.value })}
            placeholder="Email content..."
            rows={3}
          />
        </div>
        
        <div className="field">
          <label>SendGrid API Key (optional)</label>
          <input
            type="password"
            value={data.apiKey || ''}
            onChange={(e) => updateNode(id, { apiKey: e.target.value })}
            placeholder="SG.xxx..."
          />
          <span className="hint">Leave empty to simulate</span>
        </div>
      </div>
      
      <Handle type="target" position={Position.Top} className="handle" />
      <Handle type="source" position={Position.Bottom} className="handle" />
    </div>
  );
};
