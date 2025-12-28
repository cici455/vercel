'use client';

import React, { useCallback, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Node, 
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useLuminaStore } from '@/store/luminaStore';

const initialNodes: Node[] = [
  { 
    id: 'root', 
    position: { x: 250, y: 0 }, 
    data: { label: 'Fate Origin' },
    style: { 
      background: 'rgba(5, 5, 5, 0.8)', 
      border: '1px solid rgba(212, 175, 55, 0.5)', 
      color: '#ededed',
      borderRadius: '8px',
      padding: '10px',
      boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)'
    }
  },
];

export const FateTree = () => {
  const { messages } = useLuminaStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Auto-generate nodes from messages
  useEffect(() => {
    if (messages.length === 0) return;
    
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === 'user') return; // Only agents create nodes for now

    const newNodeId = `node-${lastMsg.id}`;
    const parentNodeId = nodes.length > 0 ? nodes[nodes.length - 1].id : 'root';
    
    // Simple vertical layout logic
    const level = nodes.length;
    const xOffset = (Math.random() - 0.5) * 200;
    const newY = level * 100;
    const newX = 250 + xOffset;

    const newNode: Node = {
      id: newNodeId,
      position: { x: newX, y: newY },
      data: { label: lastMsg.role.toUpperCase() },
      style: {
        background: lastMsg.content.includes('[RE-FRAMED]') 
          ? 'rgba(212, 175, 55, 0.2)' 
          : 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${
          lastMsg.content.includes('[RE-FRAMED]') ? '#D4AF37' :
          lastMsg.role === 'strategist' ? '#fbbf24' : 
          lastMsg.role === 'oracle' ? '#e2e8f0' : '#10b981'
        }`,
        color: '#fff',
        fontSize: '10px',
        width: 100,
        borderRadius: '4px',
        backdropFilter: 'blur(5px)',
        boxShadow: lastMsg.content.includes('[RE-FRAMED]') 
          ? '0 0 20px rgba(212, 175, 55, 0.4)' 
          : 'none'
      },
    };

    const newEdge: Edge = {
      id: `edge-${parentNodeId}-${newNodeId}`,
      source: parentNodeId,
      target: newNodeId,
      animated: true,
      style: { 
        stroke: lastMsg.content.includes('[RE-FRAMED]') 
          ? '#D4AF37' 
          : 'rgba(255, 255, 255, 0.2)',
        strokeWidth: lastMsg.content.includes('[RE-FRAMED]') ? 2 : 1
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: lastMsg.content.includes('[RE-FRAMED]') 
          ? '#D4AF37' 
          : 'rgba(255, 255, 255, 0.2)',
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
  }, [messages]);

  return (
    <div className="w-full h-full glass-panel overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-right"
        className="bg-transparent"
      >
        <Background color="#ffffff" gap={20} size={1} style={{ opacity: 0.1 }} />
        <Controls className="bg-white/10 border border-white/20 text-white fill-white" />
      </ReactFlow>
      <div className="absolute top-4 right-4 pointer-events-none">
        <h3 className="text-xs uppercase tracking-widest text-starlight/50 font-cinzel">Probability Tree</h3>
      </div>
    </div>
  );
};
