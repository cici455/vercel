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
import { Target, MoonStar, FlaskConical } from 'lucide-react';

import { useLuminaStore } from '@/store/luminaStore';

export const FateTree = () => {
  const { messages, setActiveMessage } = useLuminaStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Generate nodes and edges from messages
  useEffect(() => {
    if (messages.length === 0) return;

    // Create a map for quick lookup
    const messageMap = new Map(messages.map(msg => [msg.id, msg]));
    
    // Filter out user messages, only keep assistant messages
    const assistantMessages = messages.filter(msg => msg.role !== 'user');
    
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
    assistantMessages.forEach(msg => {
      const depth = calculateDepth(msg.id);
      if (!depthMap.has(depth)) {
        depthMap.set(depth, []);
      }
      depthMap.get(depth)?.push(msg.id);
    });
    
    // Function to find the nearest assistant parent
    const findAssistantParent = (messageId: string): string | null => {
      let current = messageMap.get(messageId);
      while (current?.parentId) {
        const parent = messageMap.get(current.parentId);
        if (parent?.role !== 'user') {
          return parent.id;
        }
        current = parent;
      }
      return null;
    };
    
    // Create nodes
    assistantMessages.forEach(msg => {
      const depth = calculateDepth(msg.id);
      const siblings = depthMap.get(depth) || [];
      const siblingIndex = siblings.indexOf(msg.id);
      
      // Calculate position using depth-based layout
      const x = 100 + siblingIndex * 140;
      const y = depth * 120;
      
      // Determine icon and colors based on role
      let IconComponent: React.ElementType = Target;
      let color = '#f59e0b';
      let borderColor = '#fbbf24';
      
      if (msg.role === 'strategist') {
        IconComponent = Target;
        color = '#f59e0b';
        borderColor = '#fbbf24';
      } else if (msg.role === 'oracle') {
        IconComponent = MoonStar;
        color = '#8b5cf6';
        borderColor = '#a78bfa';
      } else if (msg.role === 'alchemist') {
        IconComponent = FlaskConical;
        color = '#ec4899';
        borderColor = '#f472b6';
      }
      
      // Create node with only icon + glow, no text
      newNodes.push({
        id: msg.id,
        position: { x, y },
        data: { 
          messageId: msg.id,
          role: msg.role
        },
        style: {
          background: `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.1)`,
          border: `1px solid ${borderColor}`,
          borderRadius: '50%',
          width: 60,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 20px ${borderColor}40`,
          backdropFilter: 'blur(5px)'
        },
        // Custom node component will be handled in the ReactFlow render
        type: 'default'
      });
    });
    
    // Create edges - skip user nodes
    assistantMessages.forEach(msg => {
      const assistantParentId = findAssistantParent(msg.id);
      if (assistantParentId) {
        // Determine edge color based on child role
        let edgeColor = '#f59e0b';
        if (msg.role === 'strategist') {
          edgeColor = '#f59e0b';
        } else if (msg.role === 'oracle') {
          edgeColor = '#8b5cf6';
        } else if (msg.role === 'alchemist') {
          edgeColor = '#ec4899';
        }
        
        newEdges.push({
          id: `edge-${assistantParentId}-${msg.id}`,
          source: assistantParentId,
          target: msg.id,
          animated: true,
          style: { stroke: edgeColor, strokeWidth: 1.5 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edgeColor,
            width: 10,
            height: 10
          },
        });
      }
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
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={true}
        zoomOnScroll={true}
        // Custom node renderer
        nodeTypes={{
          default: ({ data, style }) => {
            let IconComponent: React.ElementType = Target;
            
            if (data.role === 'strategist') {
              IconComponent = Target;
            } else if (data.role === 'oracle') {
              IconComponent = MoonStar;
            } else if (data.role === 'alchemist') {
              IconComponent = FlaskConical;
            }
            
            return (
              <div style={style}>
                <IconComponent size={24} className="text-white" />
              </div>
            );
          }
        }}
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
