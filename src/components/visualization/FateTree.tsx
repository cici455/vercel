'use client';

import React, { useCallback, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Node, 
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
  NodeProps,
  NodeTypes
} from 'reactflow';
import { Target, MoonStar, FlaskConical } from 'lucide-react';

import { useLuminaStore } from '@/store/luminaStore';

type FateNodeData = {
  role: "strategist" | "oracle" | "alchemist";
};

function FateNode({ data, selected }: NodeProps<FateNodeData>) {
  const Icon =
    data.role === "strategist" ? Target :
    data.role === "oracle" ? MoonStar :
    FlaskConical;

  const glow =
    data.role === "strategist" ? "shadow-[0_0_18px_rgba(245,158,11,0.25)] border-amber-400/30 text-amber-300" :
    data.role === "oracle" ? "shadow-[0_0_18px_rgba(59,130,246,0.22)] border-blue-300/30 text-blue-200" :
    "shadow-[0_0_18px_rgba(236,72,153,0.22)] border-fuchsia-300/30 text-fuchsia-200";

  return (
    <div
      className={[
        "rounded-2xl px-4 py-3 bg-black/55 backdrop-blur-md border",
        glow,
        selected ? "ring-2 ring-white/30" : ""
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <Icon size={18} />
      </div>
    </div>
  );
}

const nodeTypes: NodeTypes = { fate: FateNode };

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
        if (parent && parent.role !== 'user') {
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
      
      // Create node with fate type and minimal data
      newNodes.push({
        id: msg.id,
        type: 'fate',
        position: { x, y },
        data: { 
          role: msg.role
        }
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
        nodeTypes={nodeTypes}
      >
        <Background color="#ffffff" gap={20} size={1} style={{ opacity: 0.05 }} />
      </ReactFlow>
      <div className="absolute top-4 right-4 pointer-events-none">
        <h3 className="text-xs uppercase tracking-widest text-white/50 font-cinzel">DESTINY TREE</h3>
      </div>
    </div>
  );
};
