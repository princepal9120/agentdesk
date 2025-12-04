#!/usr/bin/env python3
"""
Healthcare Voice Agent Worker - Entry Point
TRS Reference: Section 4 - Voice Agent Requirements

This script runs the LiveKit Voice Agent worker that handles
inbound voice calls for appointment management.

Usage:
    # Development mode
    python run_agent.py dev
    
    # Production mode
    python run_agent.py start
    
    # With custom settings
    LIVEKIT_URL=wss://your-livekit-server \
    OPENAI_API_KEY=sk-xxx \
    DEEPGRAM_API_KEY=xxx \
    CARTESIA_API_KEY=xxx \
    python run_agent.py start
"""

import os
import sys
import logging

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from livekit.agents import cli

from agent.agent import create_worker_options
from agent.config import AgentConfig


def setup_logging():
    """Configure logging for the agent"""
    logging.basicConfig(
        level=os.getenv("LOG_LEVEL", "INFO"),
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[logging.StreamHandler()]
    )


def validate_environment():
    """Validate required environment variables"""
    required_vars = [
        "OPENAI_API_KEY",
        "DEEPGRAM_API_KEY", 
        "CARTESIA_API_KEY",
    ]
    
    optional_vars = [
        ("LIVEKIT_URL", "ws://localhost:7880"),
        ("LIVEKIT_API_KEY", "devkey"),
        ("LIVEKIT_API_SECRET", "secret"),
        ("BACKEND_URL", "http://localhost:8000"),
    ]
    
    missing = []
    for var in required_vars:
        if not os.getenv(var):
            missing.append(var)
    
    if missing:
        print("\n⚠️  Warning: Missing required environment variables:")
        for var in missing:
            print(f"   - {var}")
        print("\nThe agent may not function correctly without these.")
        print("Set them in your environment or in a .env file.\n")
    
    # Set defaults for optional vars
    for var, default in optional_vars:
        if not os.getenv(var):
            os.environ[var] = default
            print(f"ℹ️  Using default for {var}: {default}")


def print_banner():
    """Print startup banner"""
    config = AgentConfig.from_env()
    
    print("""
╔══════════════════════════════════════════════════════════════════╗
║           Healthcare Voice Agent - LiveKit Worker                 ║
║                                                                   ║
║  TRS Reference: Section 4 - Voice Agent Requirements             ║
╚══════════════════════════════════════════════════════════════════╝
    """)
    print(f"  LiveKit Server:  {config.livekit_url}")
    print(f"  Backend API:     {config.backend_url}")
    print(f"  STT Provider:    {config.stt.provider} ({config.stt.model})")
    print(f"  LLM Provider:    {config.llm.provider} ({config.llm.model})")
    print(f"  TTS Provider:    {config.tts.provider}")
    print()


def main():
    """Main entry point"""
    setup_logging()
    validate_environment()
    print_banner()
    
    # Run the LiveKit agent CLI
    cli.run_app(create_worker_options())


if __name__ == "__main__":
    main()
