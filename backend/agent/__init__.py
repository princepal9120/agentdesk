"""
LiveKit Voice Agent Module
TRS Reference: Section 4 - Voice Agent Requirements
PRD Reference: Section 3.1 - Voice Interaction Features

This module contains the LiveKit Voice Agent implementation
for handling inbound/outbound voice calls.
"""

from .agent import VoiceAgent
from .config import AgentConfig

__all__ = ["VoiceAgent", "AgentConfig"]
