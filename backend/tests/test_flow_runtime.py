import pytest

from agent.flow_runtime import flow_instructions, normalize_flow


def test_normalize_flow_uses_first_node_as_default_start():
    flow = normalize_flow([{"id": "greet", "type": "message", "text": "Hello"}])
    assert flow["start_node_id"] == "greet"
    assert flow["nodes"][0]["id"] == "greet"


def test_normalize_flow_rejects_duplicate_ids():
    with pytest.raises(ValueError, match="unique"):
        normalize_flow([{"id": "a"}, {"id": "a"}])


def test_flow_instructions_preserves_owner_nodes():
    instructions = flow_instructions({
        "start_node_id": "ask",
        "nodes": [{"id": "ask", "type": "question", "text": "Are you coming?"}],
    })
    assert "Are you coming?" in instructions
    assert "start_node_id" in instructions
