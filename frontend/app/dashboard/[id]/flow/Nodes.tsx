import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { ChatTeardropText, Gear, GitBranch } from "@phosphor-icons/react";

// --- Message Node ---
export const MessageNode = memo(({ data, isConnectable }: any) => {
  return (
    <div className="w-64 rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="!h-3 !w-3 !bg-zinc-400 !border-2 !border-white" />
      <div className="flex items-center gap-3 mb-3">
        <div className="rounded-xl bg-zinc-100 p-2 text-zinc-600">
          <ChatTeardropText weight="fill" className="h-4 w-4" />
        </div>
        <div className="font-semibold text-zinc-900 text-sm">Message</div>
      </div>
      <div className="text-xs text-zinc-500 leading-relaxed line-clamp-3">
        {data.text || "Enter message text..."}
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="!h-3 !w-3 !bg-zinc-900 !border-2 !border-white" />
    </div>
  );
});

// --- Action Node ---
export const ActionNode = memo(({ data, isConnectable }: any) => {
  return (
    <div className="w-64 rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="!h-3 !w-3 !bg-zinc-400 !border-2 !border-white" />
      <div className="flex items-center gap-3 mb-3">
        <div className="rounded-xl bg-zinc-100 p-2 text-zinc-600">
          <Gear weight="fill" className="h-4 w-4" />
        </div>
        <div className="font-semibold text-zinc-900 text-sm">Action</div>
      </div>
      <div className="text-xs text-zinc-500">
        Tool: <span className="font-mono text-zinc-800 bg-zinc-100 px-1.5 py-0.5 rounded-md">{data.toolName || "select_tool"}</span>
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="!h-3 !w-3 !bg-zinc-900 !border-2 !border-white" />
    </div>
  );
});

// --- Condition Node ---
export const ConditionNode = memo(({ data, isConnectable }: any) => {
  return (
    <div className="w-64 rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="!h-3 !w-3 !bg-zinc-400 !border-2 !border-white" />
      <div className="flex items-center gap-3 mb-3">
        <div className="rounded-xl bg-zinc-100 p-2 text-zinc-600">
          <GitBranch weight="fill" className="h-4 w-4" />
        </div>
        <div className="font-semibold text-zinc-900 text-sm">Condition</div>
      </div>
      <div className="text-xs text-zinc-500 font-medium">
        If: {data.condition || "condition expression"}
      </div>
      {/* Multiple source handles for true/false or distinct paths */}
      <Handle type="source" position={Position.Bottom} id="true" style={{ left: '30%' }} isConnectable={isConnectable} className="!h-3 !w-3 !bg-emerald-500 !border-2 !border-white" />
      <div className="absolute bottom-[-24px] left-[20%] text-[10px] text-emerald-600 font-bold uppercase tracking-wider">True</div>
      
      <Handle type="source" position={Position.Bottom} id="false" style={{ left: '70%' }} isConnectable={isConnectable} className="!h-3 !w-3 !bg-rose-500 !border-2 !border-white" />
      <div className="absolute bottom-[-24px] left-[60%] text-[10px] text-rose-600 font-bold uppercase tracking-wider">False</div>
    </div>
  );
});
