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
  const { messages, setActiveMessage } = useLuminaStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Generate nodes and edges from messages
  useEffect(() => {
    if (messages.length === 0) return;

    // Create a map for quick lookup
    const messageMap = new Map(messages.map(msg => [msg.id, msg]));
    
    // Create nodes with proper layout
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    // Calculate depth for each node
    const calculateDepth = (messageId: string): number => {
      let depth = 0;
      let current = messageMap.get(messageId);
      while (current?.parentId) {
        depth++;
        current = messageMap.get(current.parentId);
      }
      return depth;
    };
    
    // Get all nodes at each depth
    const depthMap = new Map<number, string[]>();
    messages.forEach(msg => {
      const depth = calculateDepth(msg.id);
      if (!depthMap.has(depth)) {
        depthMap.set(depth, []);
      }
      depthMap.get(depth)?.push(msg.id);
    });
    
    // Function to recursively create nodes and edges
    const createNode = (messageId: string, x: number, y: number, level: number) => {
      const message = messageMap.get(messageId);
      if (!message) return;
      
      // Calculate position based on depth
      const depth = calculateDepth(messageId);
      const siblings = depthMap.get(depth) || [];
      const index = siblings.indexOf(messageId);
      
      const nodeX = 150 + index * 160;
      const nodeY = depth * 90;
      
      let color = '#666';
      let borderColor = '#333';
      
      if (message.role === 'user') {
        color = '#3b82f6';
        borderColor = '#60a5fa';
      } else if (message.role === 'strategist') {
        color = '#f59e0b';
        borderColor = '#fbbf24';
      } else if (message.role === 'oracle') {
        color = '#8b5cf6';
        borderColor = '#a78bfa';
      } else if (message.role === 'alchemist') {
        color = '#ec4899';
        borderColor = '#f472b6';
      }
      // Add node
      const contentText = typeof message.content === "string" ? message.content : JSON.stringify(message.content);
      const displayText = contentText.substring(0, 30) + (contentText.length > 30 ? "..." : "");
      newNodes.push({
        id: messageId,
        position: { x: nodeX, y: nodeY },
        data: { 
          label: message.role === 'user' ? 'You' : message.role.charAt(0).toUpperCase() + message.role.slice(1),
          messageId: message.id,
          content: displayText
        },
        style: {
          background: `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.1)`,
          border: `1px solid ${borderColor}`,
          color: '#fff',
          borderRadius: '8px',
          padding: '10px',
          fontSize: '10px',
          width: 120,
          backdropFilter: 'blur(5px)'
        }
      });
      
      // Add edges to children
      if (message.childrenIds.length > 0) {
        message.childrenIds.forEach((childId, index) => {
          // Calculate x position for children (spread out horizontally)
          const childX = nodeX + (index - (message.childrenIds.length - 1) / 2) * 150;
          
          // Add edge
          newEdges.push({
            id: `edge-${messageId}-${childId}`,
            source: messageId,
            target: childId,
            animated: true,
            style: { stroke: borderColor, strokeWidth: 1 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: borderColor,
            },
          });
          
          // Recursively create child nodes
          createNode(childId, childX, nodeY, level + 1);
        });
      }
    };
    
    // Find root messages (no parent) and create nodes for them
    const rootMessages = messages.filter(msg => !msg.parentId);
    rootMessages.forEach((rootMsg, index) => {
      const rootX = 250 + (index - (rootMessages.length - 1) / 2) * 300;
      createNode(rootMsg.id, rootX, 0, 0);
    });
    
    setNodes(newNodes);
    setEdges(newEdges);
  }, [messages, setActiveMessage]);

  return (
    <div className="w-full h-full glass-panel overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => setActiveMessage(node.id)}
        fitView
        attributionPosition="bottom-right"
        className="bg-transparent"
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background color="#ffffff" gap={20} size={1} style={{ opacity: 0.05 }} />
        <Controls className="bg-black/50 border border-white/10 text-white fill-white" />
      </ReactFlow>
      <div className="absolute top-4 right-4 pointer-events-none">
        <h3 className="text-xs uppercase tracking-widest text-white/50 font-cinzel">DESTINY TREE</h3>
      </div>
    </div>
  );
};
