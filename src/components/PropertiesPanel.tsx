import { useFlowStore } from '../store/useFlowStore';
import { Trash2 } from 'lucide-react';
import Editor from '@monaco-editor/react';

export function PropertiesPanel() {
  const { nodes, selectedNodeId, updateNodeLabel, updateNodeCode, removeNode, nodeStatuses } = useFlowStore();
  
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const status = selectedNodeId ? nodeStatuses.get(selectedNodeId) : null;

  return (
    <aside className="w-72 bg-gray-900 border-l border-gray-800 p-4 shadow-xl z-10 flex flex-col">
      <h2 className="text-lg font-bold text-gray-100 mb-4">Propiedades</h2>
      
      {selectedNode ? (
        <div className="flex flex-col gap-5 flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              ID del Nodo
            </label>
            <div className="text-xs text-gray-400 bg-gray-800 p-2 rounded border border-gray-700 break-all font-mono">
              {selectedNode.id}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Posición
            </label>
            <div className="text-xs text-gray-400 bg-gray-800 p-2 rounded border border-gray-700 font-mono">
              X: {Math.round(selectedNode.position.x)}, Y: {Math.round(selectedNode.position.y)}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Tipo
            </label>
            <div className="text-sm font-semibold capitalize text-blue-400">
              {selectedNode.type}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Etiqueta (Label)
            </label>
            <input 
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              value={selectedNode.data.label}
              onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
            />
          </div>

          {selectedNode.type === 'code' && (
            <div className="flex-1 flex flex-col min-h-[200px]">
              <label className="block text-sm font-medium text-gray-400 mb-1 flex justify-between items-center">
                <span>Code (JS/TS)</span>
                <span className="text-xs text-yellow-400">Available: input</span>
              </label>
              <div className="flex-1 border border-gray-700 rounded-md overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage="typescript"
                  theme="vs-dark"
                  value={selectedNode.data.code as string}
                  onChange={(val) => updateNodeCode(selectedNode.id, val || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 12,
                    lineNumbers: 'off',
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                  }}
                />
              </div>
            </div>
          )}

          {status && (
            <div className="flex flex-col gap-2 mt-4 border-t border-gray-800 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Estado
                </label>
                <div className={`text-sm font-bold capitalize ${
                  status.state === 'running' ? 'text-yellow-400' :
                  status.state === 'completed' ? 'text-green-400' :
                  status.state === 'error' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {status.state}
                </div>
              </div>
              
              {status.error && (
                <div>
                  <label className="block text-sm font-medium text-red-400 mb-1">
                    Error
                  </label>
                  <div className="text-xs bg-red-900/20 text-red-300 p-2 rounded border border-red-900/50 break-all font-mono">
                    {status.error}
                  </div>
                </div>
              )}
              
              {status.output && (
                <div className="flex-1 min-h-[100px] overflow-y-auto">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Output
                  </label>
                  <pre className="text-xs bg-gray-950 text-gray-300 p-2 rounded border border-gray-800 overflow-x-auto font-mono">
                    {JSON.stringify(status.output, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          <div className="mt-auto pt-4">
            <button 
              className="w-full flex items-center justify-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 px-4 py-2 rounded-md font-medium transition-colors"
              onClick={() => removeNode(selectedNode.id)}
            >
              <Trash2 size={16} />
              Eliminar Nodo
            </button>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500 text-center mt-10">
          Selecciona un nodo para ver sus propiedades
        </div>
      )}
    </aside>
  );
}
