"""
Voice Agent Configuration
TRS Reference: Section 4.2 - Voice Agent Parameters

Configuration for the LiveKit Voice Agent including STT, LLM, TTS, and VAD settings.
"""

from dataclasses import dataclass, field
from typing import Optional
import os


@dataclass
class STTConfig:
    """Speech-to-Text configuration (Deepgram)"""
    provider: str = "deepgram"
    model: str = "nova-2"
    language: str = "en"
    punctuate: bool = True
    smart_format: bool = True


@dataclass
class LLMConfig:
    """LLM configuration (OpenAI GPT-4)"""
    provider: str = "openai"
    model: str = "gpt-4o-mini"
    temperature: float = 0.3  # Lower = more consistent responses
    max_tokens: int = 500


@dataclass
class TTSConfig:
    """Text-to-Speech configuration (Cartesia)"""
    provider: str = "cartesia"
    model: str = "sonic-english"
    voice: str = "248be419-c632-4f23-adf1-5324ed7dbf1d"  # Professional female voice
    speed: float = 1.0


@dataclass
class VADConfig:
    """Voice Activity Detection configuration (Silero)"""
    provider: str = "silero"
    threshold: float = 0.5
    min_speech_duration: float = 0.25  # seconds
    min_silence_duration: float = 0.5  # seconds


@dataclass
class ConversationConfig:
    """Conversation flow configuration"""
    max_turns: int = 30
    turn_timeout: float = 10.0  # seconds of silence = user left
    preemptive_generation: bool = True
    allow_interruptions: bool = True
    initial_greeting: str = "Hello! Thank you for calling. I'm your virtual healthcare assistant. How can I help you today?"


@dataclass
class SIPConfig:
    """Twilio SIP configuration for PSTN calls"""
    enabled: bool = False
    twilio_account_sid: str = field(default_factory=lambda: os.getenv("TWILIO_ACCOUNT_SID", ""))
    twilio_auth_token: str = field(default_factory=lambda: os.getenv("TWILIO_AUTH_TOKEN", ""))
    twilio_phone_number: str = field(default_factory=lambda: os.getenv("TWILIO_PHONE_NUMBER", ""))
    sip_domain: str = field(default_factory=lambda: os.getenv("LIVEKIT_SIP_DOMAIN", ""))
    # SIP trunk settings
    trunk_username: str = field(default_factory=lambda: os.getenv("SIP_TRUNK_USERNAME", ""))
    trunk_password: str = field(default_factory=lambda: os.getenv("SIP_TRUNK_PASSWORD", ""))


@dataclass
class AgentConfig:
    """
    Complete Voice Agent Configuration
    TRS Reference: Section 4.2
    """
    # Service configurations
    stt: STTConfig = field(default_factory=STTConfig)
    llm: LLMConfig = field(default_factory=LLMConfig)
    tts: TTSConfig = field(default_factory=TTSConfig)
    vad: VADConfig = field(default_factory=VADConfig)
    conversation: ConversationConfig = field(default_factory=ConversationConfig)
    sip: SIPConfig = field(default_factory=SIPConfig)
    
    # LiveKit connection
    livekit_url: str = field(default_factory=lambda: os.getenv("LIVEKIT_URL", "ws://localhost:7880"))
    livekit_api_key: str = field(default_factory=lambda: os.getenv("LIVEKIT_API_KEY", "devkey"))
    livekit_api_secret: str = field(default_factory=lambda: os.getenv("LIVEKIT_API_SECRET", "secret"))
    
    # Backend API connection
    backend_url: str = field(default_factory=lambda: os.getenv("BACKEND_URL", "http://localhost:8000"))
    
    # System prompt for the AI agent
    system_prompt: str = """You are a friendly and professional healthcare receptionist AI assistant for a medical clinic.

Your primary responsibilities are:
1. Help patients book new appointments
2. Help patients reschedule existing appointments
3. Help patients cancel appointments
4. Provide information about doctors and their availability
5. Answer general questions about the clinic

Guidelines:
- Be warm, empathetic, and professional at all times
- Always confirm details before making any changes
- Never share other patients' information
- If you're unsure about something, offer to transfer to a human agent
- Keep responses concise (aim for under 30 seconds of speech)
- When offering appointment slots, provide 2-3 options, not long lists
- Always confirm the patient's phone number for verification
- After booking, always read back the confirmation code

Available actions:
- Check doctor availability for a date range
- Book a new appointment
- Reschedule an existing appointment  
- Cancel an appointment
- List available doctors by specialty
- Get patient information by phone number
- Transfer to a human agent if needed

Remember: You are speaking on the phone, so be conversational and natural. Avoid using technical jargon."""

    @classmethod
    def from_env(cls) -> "AgentConfig":
        """Create configuration from environment variables"""
        return cls(
            stt=STTConfig(
                model=os.getenv("DEEPGRAM_MODEL", "nova-2"),
                language=os.getenv("AGENT_LANGUAGE", "en"),
            ),
            llm=LLMConfig(
                model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
                temperature=float(os.getenv("LLM_TEMPERATURE", "0.3")),
            ),
            tts=TTSConfig(
                voice=os.getenv("CARTESIA_VOICE_ID", "248be419-c632-4f23-adf1-5324ed7dbf1d"),
            ),
            sip=SIPConfig(
                enabled=os.getenv("SIP_ENABLED", "false").lower() == "true",
            ),
        )

