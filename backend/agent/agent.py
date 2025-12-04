"""
Healthcare Voice Agent - Main Agent Implementation
TRS Reference: Section 4 - Voice Agent Requirements
PRD Reference: Section 3.1 - Voice Interaction Features

This is the main LiveKit Voice Agent that handles:
- Inbound voice calls
- Speech-to-Text transcription
- LLM-powered conversation
- Function calling for appointment management
- Text-to-Speech responses
"""

import asyncio
import json
import logging
from typing import Optional, Annotated

from livekit import rtc
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    WorkerOptions,
    cli,
    llm,
    Agent,
    AgentSession,
    RoomInputOptions,
    RoomOutputOptions,
    function_tool,
    RunContext,
)
from livekit.plugins import deepgram, openai, cartesia, silero

from .config import AgentConfig
from .tools import AgentToolExecutor

logger = logging.getLogger(__name__)


class VoiceAgent:
    """
    Healthcare Voice Agent using LiveKit Agents SDK v1.x.
    
    TRS Reference: Section 4.1 - Conversation Flow
    Handles the complete voice interaction pipeline:
    1. Call connects → Greeting
    2. Patient speaks → STT
    3. Transcription → LLM
    4. LLM decides → Tool call or response
    5. Response → TTS
    6. Audio → Patient
    """
    
    def __init__(self, config: Optional[AgentConfig] = None):
        self.config = config or AgentConfig.from_env()
        self.tool_executor = AgentToolExecutor(self.config.backend_url)
    
    def _create_tools(self):
        """Create function tools for the agent"""
        
        @function_tool()
        async def check_availability(
            doctor_id: Annotated[str, "The unique ID of the doctor"],
            date_from: Annotated[str, "Start date in YYYY-MM-DD format"],
            date_to: Annotated[str, "End date in YYYY-MM-DD format"],
            duration_minutes: Annotated[int, "Appointment duration in minutes"] = 30
        ) -> str:
            """Check available appointment slots for a specific doctor on given dates."""
            result = await self.tool_executor.check_availability(
                doctor_id, date_from, date_to, duration_minutes
            )
            return json.dumps(result)
        
        @function_tool()
        async def book_appointment(
            patient_phone: Annotated[str, "Patient's phone number for identification"],
            doctor_id: Annotated[str, "The unique ID of the doctor"],
            start_time: Annotated[str, "Appointment start time in ISO 8601 format"],
            reason_for_visit: Annotated[str, "Brief reason for the appointment"] = ""
        ) -> str:
            """Create a new appointment for a patient."""
            result = await self.tool_executor.book_appointment(
                patient_phone, doctor_id, start_time, reason_for_visit or None
            )
            return json.dumps(result)
        
        @function_tool()
        async def reschedule_appointment(
            appointment_id: Annotated[str, "The unique ID or confirmation code of the appointment"],
            new_start_time: Annotated[str, "New appointment time in ISO 8601 format"]
        ) -> str:
            """Reschedule an existing appointment to a new time."""
            result = await self.tool_executor.reschedule_appointment(
                appointment_id, new_start_time
            )
            return json.dumps(result)
        
        @function_tool()
        async def cancel_appointment(
            appointment_id: Annotated[str, "The unique ID or confirmation code of the appointment"],
            cancellation_reason: Annotated[str, "Reason for cancellation"] = ""
        ) -> str:
            """Cancel an existing appointment."""
            result = await self.tool_executor.cancel_appointment(
                appointment_id, cancellation_reason or None
            )
            return json.dumps(result)
        
        @function_tool()
        async def list_doctors(
            specialization: Annotated[str, "Medical specialty to filter by"] = "",
            clinic_id: Annotated[str, "Clinic ID to filter by location"] = ""
        ) -> str:
            """Get a list of available doctors, optionally filtered by specialty."""
            result = await self.tool_executor.list_doctors(
                specialization or None, clinic_id or None
            )
            return json.dumps(result)
        
        @function_tool()
        async def get_patient_info(
            patient_phone: Annotated[str, "Patient's phone number"]
        ) -> str:
            """Retrieve patient information and their upcoming appointments by phone number."""
            result = await self.tool_executor.get_patient_info(patient_phone)
            return json.dumps(result)
        
        @function_tool()
        async def transfer_to_agent(
            reason: Annotated[str, "Reason for the transfer"] = ""
        ) -> str:
            """Transfer the call to a human agent when the patient requests it or when you cannot help."""
            result = await self.tool_executor.transfer_to_agent(reason or None)
            return json.dumps(result)
        
        return [
            check_availability,
            book_appointment,
            reschedule_appointment,
            cancel_appointment,
            list_doctors,
            get_patient_info,
            transfer_to_agent,
        ]
    
    async def create_agent(self) -> Agent:
        """
        Create an Agent with all configured plugins.
        """
        # Initialize plugins
        stt_plugin = deepgram.STT(
            model=self.config.stt.model,
            language=self.config.stt.language,
        )
        
        tts_plugin = cartesia.TTS(
            model=self.config.tts.model,
            voice=self.config.tts.voice,
        )
        
        vad_plugin = silero.VAD.load(
            min_speech_duration=self.config.vad.min_speech_duration,
            min_silence_duration=self.config.vad.min_silence_duration,
        )
        
        # Create the LLM with function calling
        llm_plugin = openai.LLM(
            model=self.config.llm.model,
            temperature=self.config.llm.temperature,
        )
        
        # Create tools
        tools = self._create_tools()
        
        # Create chat context with system prompt
        chat_ctx = llm.ChatContext()
        chat_ctx.add_message(role="system", content=self.config.system_prompt)
        
        # Create the agent
        agent = Agent(
            instructions=self.config.system_prompt,
            stt=stt_plugin,
            llm=llm_plugin,
            tts=tts_plugin,
            vad=vad_plugin,
            tools=tools,
            allow_interruptions=self.config.conversation.allow_interruptions,
        )
        
        return agent
    
    async def entrypoint(self, ctx: JobContext):
        """
        Main entry point for the voice agent.
        Called when a new call/room is connected.
        """
        logger.info(f"Voice agent starting for room: {ctx.room.name}")
        
        # Wait for connection
        await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
        
        # Wait for first participant
        participant = await ctx.wait_for_participant()
        logger.info(f"Participant connected: {participant.identity}")
        
        # Create the agent
        agent = await self.create_agent()
        
        # Start the agent session
        session = AgentSession(
            agent=agent,
            room=ctx.room,
            participant=participant,
        )
        
        # Set up event handlers
        @session.on("agent_state_changed")
        def on_state_changed(event):
            logger.info(f"Agent state changed: {event.state}")
        
        @session.on("user_input_transcribed")
        def on_user_speech(event):
            logger.info(f"User said: {event.transcript}")
        
        @session.on("speech_created")
        def on_agent_speech(event):
            logger.info(f"Agent speaking: {event.content[:100]}...")
        
        # Start the session
        await session.start()
        
        # Send initial greeting
        await session.generate_reply(
            instructions=f"Greet the caller warmly: {self.config.conversation.initial_greeting}"
        )
        
        logger.info("Voice agent ready and greeting sent")
        
        # Keep the agent running until the room closes
        await session.wait_for_close()
    
    async def shutdown(self):
        """Clean up resources"""
        await self.tool_executor.close()


def create_worker_options() -> WorkerOptions:
    """
    Create worker options for the LiveKit agent.
    """
    config = AgentConfig.from_env()
    agent = VoiceAgent(config)
    
    return WorkerOptions(
        entrypoint_fnc=agent.entrypoint,
        api_key=config.livekit_api_key,
        api_secret=config.livekit_api_secret,
        ws_url=config.livekit_url,
    )


# Entry point for running the agent
if __name__ == "__main__":
    cli.run_app(create_worker_options())
