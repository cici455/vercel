"use client";

import React, { useEffect } from "react";
import ReactFlow, {
  Background,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  type NodeTypes,
  type EdgeTypes
} from "reactflow";

import { useLuminaStore } from "@/store/luminaStore";
import GlowEdge from "./GlowEdge";
import FateNode from "./FateNode";
import TreeBackground from "./TreeBackground";

type FateRole = "strategist" | "oracle" | "alchemist" | "council";

const nodeTypes: NodeTypes = { fate: FateNode };
const edgeTypes: EdgeTypes = { glow: GlowEdge };

export const FateTree = () => {
  const { messages, activeMessageId, setActiveMessage, setBranchFromMessageId } = useLuminaStore();

  // Helper function to determine node type based on message content
  const getNodeType = (msg: any) => {
    if (msg.role === "user" && ["A.", "B.", "C."].some(l => msg.content.startsWith(l))) return "branch";
    if (msg.role === "user") return "custom";
    return "main";
  };

  // 注意：泛型写 Node / Edge，不要写 Node[] / Edge[]
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    if (!messages || messages.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const byId = new Map(messages.map((m) => [m.id, m]));

    const isVisibleRole = (role: any): role is FateRole =>
      role === "strategist" || role === "oracle" || role === "alchemist" || role === "council";

    // 只显示回答者节点，不显示 user
    const visibleMsgs = messages.filter((m) => isVisibleRole(m.role));

    function findVisibleParentId(id: string): string | null {
      let cur = byId.get(id);
      while (cur?.parentId) {
        const p = byId.get(cur.parentId);
        if (!p) return null;
        if (isVisibleRole(p.role)) return p.id;
        cur = p; // 跳过 user，继续往上找
      }
      return null;
    }

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

    // nodes：只用 role 画图标
    const newNodes: Node[] = visibleMsgs.map((m) => ({
      id: m.id,
      type: "fate",
      position: { x: 0, y: 0 },
      data: { role: m.role, type: getNodeType(m) },
      selected: m.id === activeMessageId
    }));

    // 树状布局：按 depth 分层
    const groups = new Map<number, string[]>();
    for (const n of newNodes) {
      const d = depthOf(n.id);
      const arr = groups.get(d) ?? [];
      arr.push(n.id);
      groups.set(d, arr);
    }

    const positioned = newNodes.map((n) => {
      const d = depthOf(n.id);
      const ids = groups.get(d)!;
      const i = ids.indexOf(n.id);
      
      // Simple horizontal spread for branching
      // Spacing based on number of nodes at this depth
      const spacing = 160;
      const offset = (i - (ids.length - 1) / 2) * spacing;
      
      const x = 200 + offset;
      const y = 800 - d * 180; // Increased vertical spacing
      return { ...n, position: { x, y } };
    });

    // edges：连接最近的可见祖先（AI->AI），用 glow
    const newEdges: Edge[] = [];
    for (const m of visibleMsgs) {
      const p = findVisibleParentId(m.id);
      if (p) {
        newEdges.push({
          id: `edge-${p}-${m.id}`,
          source: p,
          target: m.id,
          type: "glow"
        });
      }
    }

    setNodes(positioned);
    setEdges(newEdges);
    console.log("[FateTree] nodes", positioned.length, "edges", newEdges.length);
  }, [messages, setNodes, setEdges]);

  return (
    <div className="w-full h-full overflow-hidden relative">
      <TreeBackground />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => {
          const byId = new Map(messages.map(m => [m.id, m]));
          const msg = byId.get(node.id);
          setActiveMessage(node.id);
          setBranchFromMessageId(node.id); // 下一条消息从这里分叉
          // 触发滚动到对应消息
          const el = document.getElementById(`message-${node.id}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
        zoomOnScroll
        fitView
        className="bg-transparent"
      >
        <Background color="#ffffff" gap={22} size={1} style={{ opacity: 0.05 }} />
      </ReactFlow>
    </div>
  );
};
