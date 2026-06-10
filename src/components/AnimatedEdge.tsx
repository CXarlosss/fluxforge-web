import { useState } from 'react';
import { BaseEdge, getBezierPath, EdgeLabelRenderer, type EdgeProps } from 'reactflow';
import { useFlowStore } from '../store/useFlowStore';

export function AnimatedEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, markerEnd } = props;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const runningEdges = useFlowStore((s) => s.runningEdges);
  const edgeState = runningEdges[id];
  const isFlowing = edgeState?.status === 'flowing';
  const isComplete = edgeState?.status === 'complete';

  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: isFlowing ? 3 : 2,
          stroke: isFlowing ? '#10b981' : isComplete ? '#3b82f6' : '#94a3b8',
          animation: isFlowing ? 'dashdraw 1s linear infinite' : 'none',
          strokeDasharray: isFlowing ? '10' : 'none',
        }}
        interactionWidth={20}
      />
      <path
        d={edgePath}
        fill="none"
        strokeOpacity={0}
        strokeWidth={20}
        className="react-flow__edge-interaction"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      
      {isHovered && isComplete && edgeState?.payload && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
              zIndex: 10,
            }}
            className="nodrag nopan bg-slate-800 text-slate-200 p-2 rounded shadow-lg border border-slate-700 text-xs overflow-auto max-w-xs max-h-40"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <pre className="whitespace-pre-wrap">{JSON.stringify(edgeState.payload, null, 2)}</pre>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
