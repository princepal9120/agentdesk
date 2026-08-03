"""Helpers for turning owner-authored call flows into agent instructions."""

from __future__ import annotations

import json
from typing import Any


def normalize_flow(nodes: list[dict[str, Any]], start_node_id: str | None = None) -> dict[str, Any]:
    """Return a small, predictable flow document for the voice agent."""
    if not nodes:
        raise ValueError("A call flow needs at least one node")
    ids = [str(node.get("id", "")).strip() for node in nodes]
    if any(not node_id for node_id in ids) or len(set(ids)) != len(ids):
        raise ValueError("Flow node ids must be present and unique")
    start = start_node_id or ids[0]
    if start not in ids:
        raise ValueError("start_node_id must reference a flow node")
    return {"start_node_id": start, "nodes": nodes[:50]}


def flow_instructions(flow: dict[str, Any] | None) -> str:
    """Compile a flow into explicit instructions while keeping branching data intact."""
    if not flow or not flow.get("nodes"):
        return "No custom flow is configured. Be concise, polite, and ask the owner to follow up when unsure."
    compact = json.dumps(
        {"start_node_id": flow.get("start_node_id"), "nodes": flow.get("nodes", [])},
        ensure_ascii=False,
    )
    return (
        "Execute the owner's call flow below. Start at start_node_id and follow each node's next "
        "or branch targets. Ask one question at a time. Use the customer's natural-language answer "
        "to choose a branch, but never invent a branch or business action. If the customer asks for "
        "a human, stop and set the outcome to handoff_requested. Always finish with a short goodbye.\n\n"
        f"FLOW_JSON:\n{compact}"
    )
