import React, { useEffect, useState } from 'react';
import { Play, RotateCcw, Calendar, Clock, CheckCircle, XCircle, SkipForward } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface Execution {
  id: number;
  workflow_id: string;
  workflow_name: string;
  status: 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  logs: Array<{
    nodeId: string;
    nodeType: string;
    timestamp: string;
    input: string;
    output: string;
    error: string | null;
  }>;
}

export const HistoryPage: React.FC = () => {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(null);

  useEffect(() => {
    fetchExecutions();
  }, [filter]);

  const fetchExecutions = async () => {
    const url = filter === 'all' 
      ? 'http://localhost:3001/api/executions?limit=50'
      : `http://localhost:3001/api/executions?limit=50&status=${filter}`;
    
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setExecutions(data);
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="status-completed" />;
      case 'failed': return <XCircle size={16} className="status-failed" />;
      case 'running': return <Clock size={16} className="status-running" />;
      default: return <SkipForward size={16} />;
    }
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <div className="flex items-center gap-4">
          <a href="/" className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 text-sm">← Back</a>
          <h2 className="text-xl font-bold">Execution History</h2>
        </div>
        <div className="filter-tabs">
          {['all', 'completed', 'failed', 'running'].map(f => (
            <button
              key={f}
              className={filter === f ? 'active' : ''}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="history-table">
        <div className="table-header">
          <span>Workflow</span>
          <span>Status</span>
          <span>Started</span>
          <span>Duration</span>
          <span>Actions</span>
        </div>
        
        {executions.map(exec => (
          <div key={exec.id} className="table-row">
            <span className="workflow-name">{exec.workflow_name || exec.workflow_id}</span>
            <span className="status-badge">
              {getStatusIcon(exec.status)}
              {exec.status}
            </span>
            <span className="timestamp">
              <Calendar size={12} />
              {new Date(exec.started_at).toLocaleString()}
            </span>
            <span className="duration">
              <Clock size={12} />
              {formatDuration(exec.duration_ms)}
            </span>
            <div className="actions">
              <button onClick={() => setSelectedExecution(exec)} title="View details">
                <Play size={14} />
              </button>
              <button title="Re-run workflow">
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedExecution && (
        <div className="execution-modal" onClick={() => setSelectedExecution(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Execution #{selectedExecution.id}</h3>
            <div className="timeline">
              {selectedExecution.logs?.map((log, i) => (
                <div key={i} className="timeline-item">
                  <div className={`timeline-dot ${log.error ? 'error' : ''}`} />
                  <div className="timeline-content">
                    <span className="node-type">{log.nodeType}</span>
                    <span className="node-id">{log.nodeId}</span>
                    <span className="timestamp">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    {log.error && <span className="error-msg">{log.error}</span>}
                  </div>
                </div>
              ))}
            </div>
            <button className="close-btn" onClick={() => setSelectedExecution(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
