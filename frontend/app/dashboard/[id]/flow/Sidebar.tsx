import React, { DragEvent } from "react";
import { ChatTeardropText, Gear, GitBranch, ArrowsOut } from "@phosphor-icons/react";

export function Sidebar() {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-64 border-r border-zinc-200 bg-zinc-50/50 p-6 h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-900 uppercase">Flow Elements</h2>
        <p className="mt-1 text-xs text-zinc-500">Drag nodes onto the canvas.</p>
      </div>

      <div className="flex flex-col gap-3">
        <div
          className="flex cursor-grab items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm hover:border-zinc-300 hover:bg-zinc-50 active:cursor-grabbing transition-all"
          onDragStart={(event) => onDragStart(event, "message")}
          draggable
        >
          <div className="rounded-xl bg-zinc-100 p-2 text-zinc-600">
            <ChatTeardropText weight="fill" className="h-4 w-4" />
          </div>
          <div className="text-sm font-semibold text-zinc-700">Message Node</div>
          <ArrowsOut weight="bold" className="ml-auto h-4 w-4 text-zinc-400" />
        </div>

        <div
          className="flex cursor-grab items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm hover:border-zinc-300 hover:bg-zinc-50 active:cursor-grabbing transition-all"
          onDragStart={(event) => onDragStart(event, "action")}
          draggable
        >
          <div className="rounded-xl bg-zinc-100 p-2 text-zinc-600">
            <Gear weight="fill" className="h-4 w-4" />
          </div>
          <div className="text-sm font-semibold text-zinc-700">Action Node</div>
          <ArrowsOut weight="bold" className="ml-auto h-4 w-4 text-zinc-400" />
        </div>

        <div
          className="flex cursor-grab items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm hover:border-zinc-300 hover:bg-zinc-50 active:cursor-grabbing transition-all"
          onDragStart={(event) => onDragStart(event, "condition")}
          draggable
        >
          <div className="rounded-xl bg-zinc-100 p-2 text-zinc-600">
            <GitBranch weight="fill" className="h-4 w-4" />
          </div>
          <div className="text-sm font-semibold text-zinc-700">Condition Node</div>
          <ArrowsOut weight="bold" className="ml-auto h-4 w-4 text-zinc-400" />
        </div>
      </div>
      
      <div className="mt-auto border-t border-zinc-200 pt-6">
        <div className="text-xs text-zinc-400 font-medium">
          Tip: Select a node and press <kbd className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 text-zinc-600 shadow-sm ml-1">Backspace</kbd> to delete it.
        </div>
      </div>
    </aside>
  );
}
