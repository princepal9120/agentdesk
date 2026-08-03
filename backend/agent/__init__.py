"""
LiveKit Voice Agent Module
TRS Reference: Section 4 - Voice Agent Requirements
PRD Reference: Section 3.1 - Voice Interaction Features

This module contains the LiveKit Voice Agent implementation
for handling inbound/outbound voice calls.
"""

from .config import AgentConfig

__all__ = ["AgentConfig", "VoiceDeskAgent"]


def __getattr__(name: str):
    """Load the LiveKit runtime lazily for config-only imports."""
    if name == "VoiceDeskAgent":
        from .agent import VoiceDeskAgent

        return VoiceDeskAgent
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
