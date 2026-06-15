import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Database } from 'lucide-react';
import { useFlowStore } from '../../store/useFlowStore';

export const DatabaseNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const updateNode = useFlowStore(state => state.updateNode);

  return (
    <div className={`node database-node ${selected ? 'selected' : ''}`}>
      <div className="node-header">
        <Database size={16} className="node-icon" />
        <span>Database</span>
      </div>
      
      <div className="node-body">
        <div className="field">
          <label>Connection</label>
          <input
            type="text"
            value={data.connectionString || 'sqlite:./fluxforge.db'}
            onChange={(e) => updateNode(id, { connectionString: e.target.value })}
            placeholder="sqlite:./db.sqlite"
          />
        </div>
        
        <div className="field">
          <label>Operation</label>
          <select
            value={data.operation || 'SELECT'}
            onChange={(e) => updateNode(id, { operation: e.target.value })}
          >
            <option value="SELECT">SELECT</option>
            <option value="INSERT">INSERT</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        
        <div className="field">
          <label>Query</label>
          <textarea
            value={data.query || ''}
            onChange={(e) => updateNode(id, { query: e.target.value })}
            placeholder="SELECT * FROM users"
            rows={3}
          />
        </div>
      </div>
      
      <Handle type="target" position={Position.Top} className="handle" />
      <Handle type="source" position={Position.Bottom} className="handle" />
    </div>
  );
};
