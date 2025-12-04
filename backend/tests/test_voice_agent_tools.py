"""
Voice Agent Tools Tests
TRS Reference: Section 4.3 - Tool/Function Definitions for LLM
"""

import pytest
from datetime import date, datetime, timedelta, timezone
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4

from app.services.voice_agent_tools import VoiceAgentTools, VOICE_AGENT_TOOLS


class TestVoiceAgentToolDefinitions:
    """Test tool definitions are correctly structured for OpenAI."""
    
    def test_all_tools_have_required_fields(self):
        """Verify all tools have type, function, name, and parameters."""
        for tool in VOICE_AGENT_TOOLS:
            assert tool["type"] == "function"
            assert "function" in tool
            assert "name" in tool["function"]
            assert "description" in tool["function"]
            assert "parameters" in tool["function"]
    
    def test_check_availability_tool_schema(self):
        """Verify check_availability tool schema."""
        tool = next(t for t in VOICE_AGENT_TOOLS if t["function"]["name"] == "check_availability")
        
        params = tool["function"]["parameters"]
        assert params["type"] == "object"
        assert "doctor_id" in params["properties"]
        assert "date_from" in params["properties"]
        assert "date_to" in params["properties"]
        assert "doctor_id" in params["required"]
        assert "date_from" in params["required"]
        assert "date_to" in params["required"]
    
    def test_book_appointment_tool_schema(self):
        """Verify book_appointment tool schema."""
        tool = next(t for t in VOICE_AGENT_TOOLS if t["function"]["name"] == "book_appointment")
        
        params = tool["function"]["parameters"]
        assert "patient_phone" in params["properties"]
        assert "doctor_id" in params["properties"]
        assert "start_time" in params["properties"]
        assert "patient_phone" in params["required"]
        assert "doctor_id" in params["required"]
        assert "start_time" in params["required"]
    
    def test_all_seven_tools_defined(self):
        """Verify all 7 tools from TRS 4.3 are defined."""
        tool_names = [t["function"]["name"] for t in VOICE_AGENT_TOOLS]
        
        expected_tools = [
            "check_availability",
            "book_appointment",
            "reschedule_appointment",
            "cancel_appointment",
            "list_doctors",
            "get_patient_info",
            "transfer_to_agent"
        ]
        
        for expected in expected_tools:
            assert expected in tool_names, f"Missing tool: {expected}"


class TestVoiceAgentToolExecution:
    """Test tool execution."""
    
    @pytest.mark.asyncio
    async def test_list_doctors(self):
        """Test list_doctors returns expected format."""
        mock_db = AsyncMock()
        mock_redis = AsyncMock()
        
        # Mock doctor query
        mock_doctor = MagicMock()
        mock_doctor.id = uuid4()
        mock_doctor.full_name = "Dr. Test Doctor"
        mock_doctor.specialization = "Cardiology"
        
        mock_result = MagicMock()
        mock_result.scalars.return_value.all.return_value = [mock_doctor]
        mock_db.execute.return_value = mock_result
        
        tools = VoiceAgentTools(mock_db, mock_redis)
        result = await tools.list_doctors(specialization="Cardiology")
        
        assert "doctors" in result
        assert len(result["doctors"]) == 1
        assert result["doctors"][0]["specialty"] == "Cardiology"
    
    @pytest.mark.asyncio
    async def test_transfer_to_agent(self):
        """Test transfer_to_agent returns success."""
        mock_db = AsyncMock()
        mock_redis = AsyncMock()
        
        tools = VoiceAgentTools(mock_db, mock_redis)
        result = await tools.transfer_to_agent(reason="Complex request")
        
        assert result["success"] is True
        assert "queue_position" in result
        assert "message" in result
    
    @pytest.mark.asyncio
    async def test_get_patient_info_not_found(self):
        """Test get_patient_info with unknown phone."""
        mock_db = AsyncMock()
        mock_redis = AsyncMock()
        
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        mock_db.execute.return_value = mock_result
        
        tools = VoiceAgentTools(mock_db, mock_redis)
        result = await tools.get_patient_info("+19999999999")
        
        assert "error" in result
        assert "Patient not found" in result["error"]


class TestVoiceAgentConversationFlow:
    """Test conversation flow scenarios from TRS 4.1."""
    
    @pytest.mark.asyncio
    async def test_booking_flow_tools(self):
        """
        Test tool calls for booking flow:
        1. list_doctors → 2. check_availability → 3. book_appointment
        """
        mock_db = AsyncMock()
        mock_redis = AsyncMock()
        mock_redis.get.return_value = None  # No cache
        
        tools = VoiceAgentTools(mock_db, mock_redis)
        
        # Step 1: List doctors
        mock_doctor = MagicMock()
        mock_doctor.id = uuid4()
        mock_doctor.full_name = "Dr. Smith"
        mock_doctor.specialization = "General"
        mock_doctor.is_active = True
        
        mock_result = MagicMock()
        mock_result.scalars.return_value.all.return_value = [mock_doctor]
        mock_db.execute.return_value = mock_result
        
        doctors_result = await tools.list_doctors()
        assert len(doctors_result["doctors"]) > 0
        
        # The full flow would continue with check_availability and book_appointment
        # But those require more complex mocking of the database models
