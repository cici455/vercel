'use client';

import React, { useCallback, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Node, 
  Edge,
  useNodesState,
  useEdgesState,
  NodeTypes,
  EdgeTypes
} from 'reactflow';

import { useLuminaStore } from '@/store/luminaStore';
import FateNode from './FateNode';
import GlowEdge from './GlowEdge';

const nodeTypes: NodeTypes = { fate: FateNode };
const edgeTypes: EdgeTypes = { glow: GlowEdge };

export const FateTree = () => {
  const { messages, setActiveMessage } = useLuminaStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Generate nodes and edges from messages
  useEffect(() => {
    if (messages.length === 0) return;

    // Create a map for quick lookup
    const byId = new Map(messages.map(msg => [msg.id, msg]));
    
    // Filter out user messages, only keep assistant messages
    const visible = messages.filter(
      (m) =>
        m.role === "strategist" || 
        m.role === "oracle" || 
        m.role === "alchemist" || 
        m.role === "council"
    );
    
    // Check if role is visible
    const isVisibleRole = (role: any) => 
      role === "strategist" || 
      role === "oracle" || 
      role === "alchemist" || 
      role === "council";
    
    // Function to find the nearest visible parent
    function findVisibleParentId(id: string): string | null {
      let cur = byId.get(id);
      while (cur?.parentId) {
        const p = byId.get(cur.parentId);
        if (!p) return null;
        if (isVisibleRole(p.role)) return p.id;
        cur = p;
      }
      return null;
    }
    
    // Function to calculate depth of a node
    function depthOf(id: string) {
      let d = 0;
      let cur = byId.get(id);
      while (cur?.parentId) {
        const p = byId.get(cur.parentId);
        if (!p) break;
        if (isVisibleRole(p.role)) d += 1;
        cur = p;
      }
      return d;
    }
    
    // Create nodes with minimal data
    const newNodes: Node[] = visible.map((m) => ({
      id: m.id,
      type: "fate",
      position: { x: 0, y: 0 }, // Will be updated with layout
      data: { role: m.role },
    }));
    
    // Group nodes by depth
    const groups = new Map<number, string[]>();
    for (const n of newNodes) {
      const d = depthOf(n.id);
      const arr = groups.get(d) ?? [];
      arr.push(n.id);
      groups.set(d, arr);
    }
    
    // Position nodes in tree layout
    const positioned = newNodes.map((n) => {
      const d = depthOf(n.id);
      const ids = groups.get(d)!;
      const i = ids.indexOf(n.id);
      const x = (i - (ids.length - 1) / 2) * 160; // Center nodes horizontally
      const y = d * 130; // Space nodes vertically
      return { ...n, position: { x, y } };
    });
    
    // Create edges connecting to visible parents
    const newEdges: Edge[] = [];
    for (const m of visible) {
      const p = findVisibleParentId(m.id);
      if (p) {
        newEdges.push({
          id: `edge-${p}-${m.id}`,
          source: p,
          target: m.id,
          type: "glow",
        });
      }
    }
    
    setNodes(positioned);
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
        edgeTypes={edgeTypes}
      >
        <Background color="#ffffff" gap={20} size={1} style={{ opacity: 0.05 }} />
      </ReactFlow>
      <div className="absolute top-4 right-4 pointer-events-none">
        <h3 className="text-xs uppercase tracking-widest text-white/50 font-cinzel">DESTINY TREE</h3>
      </div>
    </div>
  );
};
