import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { GitBranch } from 'lucide-react';
import { useFlowStore } from '../../store/useFlowStore';

export const FilterNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const updateNode = useFlowStore(state => state.updateNode);

  return (
    <div className={`node filter-node ${selected ? 'selected' : ''}`}>
      <div className="node-header">
        <GitBranch size={16} className="node-icon" />
        <span>Filter</span>
      </div>
      
      <div className="node-body">
        <div className="field">
          <label>Condition</label>
          <input
            type="text"
            value={data.condition || 'input.value > 50'}
            onChange={(e) => updateNode(id, { condition: e.target.value })}
            placeholder="input.value > 50"
          />
          <span className="hint">Use input.xxx to reference data</span>
        </div>
        
        {data._lastResult !== undefined && (
          <div className={`filter-result ${data._lastResult ? 'true' : 'false'}`}>
            Last: {data._lastResult ? 'TRUE' : 'FALSE'}
          </div>
        )}
      </div>
      
      {/* Handle de entrada */}
      <Handle type="target" position={Position.Top} className="handle" />
      
      {/* Handles de salida condicional */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="handle handle-true"
        style={{ left: '30%' }}
      />
      <label className="handle-label label-true">Yes</label>
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="handle handle-false"
        style={{ left: '70%' }}
      />
      <label className="handle-label label-false">No</label>
    </div>
  );
};
