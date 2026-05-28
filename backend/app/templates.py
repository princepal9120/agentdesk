"""
Template Loader — loads niche preset JSON files from backend/templates/.

Usage:
    from app.templates import get_template, list_templates

Templates provide:
- system_prompt (with {agent_name} and {business_name} placeholders)
- tools (list of function call definitions)
- dashboard_labels (UI label overrides per niche)
- sample_faq (pre-populated FAQ entries)
"""

import json
from pathlib import Path
from typing import Optional

_TEMPLATES_DIR = Path(__file__).parent.parent / "templates"


def list_templates() -> list[str]:
    """Return all available template keys."""
    return [f.stem for f in sorted(_TEMPLATES_DIR.glob("*.json"))]


def get_template(key: str) -> Optional[dict]:
    """
    Load a template by key (e.g. 'restaurant', 'dental').
    Returns None if template not found.
    """
    path = _TEMPLATES_DIR / f"{key}.json"
    if not path.exists():
        path = _TEMPLATES_DIR / "custom.json"
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def render_system_prompt(template_key: str, agent_name: str, business_name: str) -> str:
    """
    Load template and fill in {agent_name} and {business_name} placeholders.
    Falls back to a minimal generic prompt if template not found.
    """
    tmpl = get_template(template_key)
    if not tmpl:
        return (
            f"You are {agent_name}, the AI assistant for {business_name}. "
            "Help callers professionally and efficiently."
        )
    raw_prompt: str = tmpl.get("system_prompt", "")
    return raw_prompt.format(agent_name=agent_name, business_name=business_name)


def get_dashboard_labels(template_key: str) -> dict:
    """Return UI label overrides for a given template."""
    tmpl = get_template(template_key)
    if not tmpl:
        return {}
    return tmpl.get("dashboard_labels", {})


def get_starter_tools(template_key: str) -> list:
    """Return list of tool definitions for a template."""
    tmpl = get_template(template_key)
    if not tmpl:
        return []
    return tmpl.get("tools", [])


def get_sample_faq(template_key: str) -> list:
    """Return sample FAQ entries for a template."""
    tmpl = get_template(template_key)
    if not tmpl:
        return []
    return tmpl.get("sample_faq", [])
