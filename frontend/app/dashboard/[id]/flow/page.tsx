"use client";

import React, { useState, useRef, useCallback, useEffect, use } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

import { Sidebar } from "./Sidebar";
import { MessageNode, ActionNode, ConditionNode } from "./Nodes";
import { api, type AgentConfig } from "@/lib/api";

const nodeTypes = {
  message: MessageNode,
  action: ActionNode,
  condition: ConditionNode,
};

const initialNodes: Node[] = [
  {
    id: "start",
    type: "input",
    data: { label: "Call Starts" },
    position: { x: 250, y: 50 },
    className: "bg-gray-900 text-white border-none rounded-full px-4 py-2 font-medium shadow-md w-32 text-center",
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

function FlowEditor({ businessId }: { businessId: string }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<AgentConfig | null>(null);

  // Load existing flow from DB
  useEffect(() => {
    api.businesses.getConfig(businessId)
      .then((cfg) => {
        setConfig(cfg);
        if (cfg.flow_data) {
          const { nodes: savedNodes, edges: savedEdges } = cfg.flow_data as any;
          if (savedNodes && savedNodes.length > 0) {
            setNodes(savedNodes || []);
            setEdges(savedEdges || []);
          }
        }
      })
      .catch((err) => console.error("Failed to load config", err))
      .finally(() => setLoading(false));
  }, [businessId, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let data = {};
      if (type === "message") data = { text: "Hello! How can I help you today?" };
      if (type === "action") data = { toolName: "book_appointment" };
      if (type === "condition") data = { condition: "is_new_customer == true" };

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onSave = async () => {
    if (reactFlowInstance) {
      setSaving(true);
      const flow = reactFlowInstance.toObject();
      try {
        await api.businesses.updateConfig(businessId, {
          flow_data: flow,
        });
        // Could show a success toast here
      } catch (err) {
        console.error("Failed to save flow", err);
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return <div className="p-10 text-gray-500">Loading flow editor...</div>;
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-gray-200 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/${businessId}`} className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">Conversation Flow Editor</h1>
            <p className="text-xs text-gray-500">Design agent behavior visually</p>
          </div>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="btn-primary inline-flex items-center gap-2 py-1.5 px-3 text-sm"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Flow"}
        </button>
      </header>

      {/* Editor Body */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
          >
            <Background color="#ccc" gap={16} />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default function FlowEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return (
    <ReactFlowProvider>
      <FlowEditor businessId={id} />
    </ReactFlowProvider>
  );
}
