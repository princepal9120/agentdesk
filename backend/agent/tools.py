"""
Healthcare Voice Agent - Tool Executor
TRS Reference: Section 4.3 - Tool/Function Definitions for LLM

This module provides a callable interface for the LLM to execute
appointment management tools via function calling.
"""

import json
import httpx
from typing import Any, Callable, Dict, Optional
import logging

logger = logging.getLogger(__name__)


class AgentToolExecutor:
    """
    Executes tools on behalf of the voice agent.
    Makes HTTP calls to the backend API to perform actions.
    """
    
    def __init__(self, backend_url: str, auth_token: Optional[str] = None):
        self.backend_url = backend_url.rstrip("/")
        self.auth_token = auth_token
        self._client: Optional[httpx.AsyncClient] = None
    
    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client"""
        if self._client is None:
            headers = {"Content-Type": "application/json"}
            if self.auth_token:
                headers["Authorization"] = f"Bearer {self.auth_token}"
            self._client = httpx.AsyncClient(
                base_url=self.backend_url,
                headers=headers,
                timeout=30.0
            )
        return self._client
    
    async def close(self):
        """Close the HTTP client"""
        if self._client:
            await self._client.aclose()
            self._client = None
    
    async def check_availability(
        self,
        doctor_id: str,
        date_from: str,
        date_to: str,
        duration_minutes: int = 30
    ) -> Dict[str, Any]:
        """
        Check available appointment slots for a doctor.
        TRS 4.3: check_availability tool
        """
        try:
            client = await self._get_client()
            response = await client.get(
                f"/api/v1/doctors/{doctor_id}/availability",
                params={
                    "date_from": date_from,
                    "date_to": date_to,
                    "duration": duration_minutes
                }
            )
            response.raise_for_status()
            data = response.json()
            
            # Format slots for voice response
            slots = data.get("available_slots", [])[:5]  # Limit to 5 slots
            return {
                "success": True,
                "available_slots": slots,
                "message": f"Found {len(slots)} available time slots."
            }
        except Exception as e:
            logger.error(f"Error checking availability: {e}")
            return {"success": False, "error": str(e), "available_slots": []}
    
    async def book_appointment(
        self,
        patient_phone: str,
        doctor_id: str,
        start_time: str,
        reason_for_visit: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a new appointment.
        TRS 4.3: book_appointment tool
        """
        try:
            client = await self._get_client()
            
            # First, get patient by phone number
            patient_response = await client.get(
                f"/api/v1/patients/by-phone/{patient_phone}"
            )
            
            if patient_response.status_code == 404:
                return {
                    "success": False,
                    "error": "Patient not found. Please verify your phone number."
                }
            
            patient_data = patient_response.json()
            patient_id = patient_data.get("id")
            
            # Book the appointment
            response = await client.post(
                "/api/v1/appointments",
                json={
                    "patient_id": patient_id,
                    "doctor_id": doctor_id,
                    "start_time": start_time,
                    "reason": reason_for_visit,
                    "duration_minutes": 30
                }
            )
            response.raise_for_status()
            data = response.json()
            
            return {
                "success": True,
                "appointment_id": data.get("id"),
                "confirmation_code": data.get("confirmation_code"),
                "start_time": data.get("start_time"),
                "message": f"Appointment booked successfully! Your confirmation code is {data.get('confirmation_code')}."
            }
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 409:
                return {"success": False, "error": "This time slot is no longer available. Please choose another time."}
            logger.error(f"Error booking appointment: {e}")
            return {"success": False, "error": "Unable to book appointment. Please try again."}
        except Exception as e:
            logger.error(f"Error booking appointment: {e}")
            return {"success": False, "error": str(e)}
    
    async def reschedule_appointment(
        self,
        appointment_id: str,
        new_start_time: str
    ) -> Dict[str, Any]:
        """
        Reschedule an existing appointment.
        TRS 4.3: reschedule_appointment tool
        """
        try:
            client = await self._get_client()
            response = await client.put(
                f"/api/v1/appointments/{appointment_id}",
                json={"start_time": new_start_time}
            )
            response.raise_for_status()
            data = response.json()
            
            return {
                "success": True,
                "appointment_id": data.get("id"),
                "new_time": data.get("start_time"),
                "message": "Your appointment has been rescheduled successfully."
            }
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return {"success": False, "error": "Appointment not found. Please verify your appointment ID."}
            if e.response.status_code == 409:
                return {"success": False, "error": "The new time slot is not available. Please choose another time."}
            logger.error(f"Error rescheduling appointment: {e}")
            return {"success": False, "error": "Unable to reschedule appointment."}
        except Exception as e:
            logger.error(f"Error rescheduling appointment: {e}")
            return {"success": False, "error": str(e)}
    
    async def cancel_appointment(
        self,
        appointment_id: str,
        cancellation_reason: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Cancel an existing appointment.
        TRS 4.3: cancel_appointment tool
        """
        try:
            client = await self._get_client()
            response = await client.delete(
                f"/api/v1/appointments/{appointment_id}",
                params={"reason": cancellation_reason} if cancellation_reason else None
            )
            response.raise_for_status()
            
            return {
                "success": True,
                "message": "Your appointment has been cancelled successfully."
            }
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return {"success": False, "error": "Appointment not found."}
            logger.error(f"Error cancelling appointment: {e}")
            return {"success": False, "error": "Unable to cancel appointment."}
        except Exception as e:
            logger.error(f"Error cancelling appointment: {e}")
            return {"success": False, "error": str(e)}
    
    async def list_doctors(
        self,
        specialization: Optional[str] = None,
        clinic_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get list of doctors by specialization.
        TRS 4.3: list_doctors tool
        """
        try:
            client = await self._get_client()
            params = {}
            if specialization:
                params["specialization"] = specialization
            if clinic_id:
                params["clinic_id"] = clinic_id
            
            response = await client.get("/api/v1/doctors", params=params)
            response.raise_for_status()
            data = response.json()
            
            doctors = data.get("doctors", data) if isinstance(data, dict) else data
            doctors = doctors[:5]  # Limit to 5 doctors
            
            return {
                "success": True,
                "doctors": [
                    {
                        "id": d.get("id"),
                        "name": f"Dr. {d.get('first_name', '')} {d.get('last_name', '')}",
                        "specialty": d.get("specialization")
                    }
                    for d in doctors
                ],
                "message": f"Found {len(doctors)} doctors."
            }
        except Exception as e:
            logger.error(f"Error listing doctors: {e}")
            return {"success": False, "error": str(e), "doctors": []}
    
    async def get_patient_info(
        self,
        patient_phone: str
    ) -> Dict[str, Any]:
        """
        Retrieve patient information and upcoming appointments.
        TRS 4.3: get_patient_info tool
        """
        try:
            client = await self._get_client()
            response = await client.get(f"/api/v1/patients/by-phone/{patient_phone}")
            
            if response.status_code == 404:
                return {
                    "success": False,
                    "error": "No patient found with this phone number."
                }
            
            response.raise_for_status()
            patient = response.json()
            
            # Get patient's upcoming appointments
            apt_response = await client.get(
                "/api/v1/appointments",
                params={"patient_id": patient.get("id"), "status": "upcoming"}
            )
            appointments = apt_response.json() if apt_response.status_code == 200 else []
            
            return {
                "success": True,
                "patient_id": patient.get("id"),
                "name": patient.get("full_name"),
                "appointments": [
                    {
                        "id": a.get("id"),
                        "confirmation_code": a.get("confirmation_code"),
                        "doctor_name": f"Dr. {a.get('doctor', {}).get('last_name', 'Unknown')}",
                        "start_time": a.get("start_time"),
                        "status": a.get("status")
                    }
                    for a in (appointments[:3] if isinstance(appointments, list) else [])
                ]
            }
        except Exception as e:
            logger.error(f"Error getting patient info: {e}")
            return {"success": False, "error": str(e)}
    
    async def transfer_to_agent(
        self,
        reason: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Transfer call to human agent.
        TRS 4.3: transfer_to_agent tool
        """
        # In production, this would trigger a SIP transfer or queue join
        logger.info(f"Transfer requested. Reason: {reason}")
        return {
            "success": True,
            "queue_position": 1,
            "message": "I'm transferring you to a human agent now. Please hold for a moment."
        }
    
    def get_tool_definitions(self) -> list:
        """
        Get OpenAI-compatible tool definitions for function calling.
        TRS 4.3: Tool/Function Definitions
        """
        return [
            {
                "type": "function",
                "function": {
                    "name": "check_availability",
                    "description": "Check available appointment slots for a specific doctor on given dates. Use this when a patient asks about available times.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "doctor_id": {
                                "type": "string",
                                "description": "The unique ID of the doctor"
                            },
                            "date_from": {
                                "type": "string",
                                "description": "Start date in YYYY-MM-DD format"
                            },
                            "date_to": {
                                "type": "string",
                                "description": "End date in YYYY-MM-DD format"
                            },
                            "duration_minutes": {
                                "type": "integer",
                                "description": "Appointment duration in minutes",
                                "default": 30
                            }
                        },
                        "required": ["doctor_id", "date_from", "date_to"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "book_appointment",
                    "description": "Create a new appointment for a patient. Use this after confirming the patient's details and preferred time slot.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "patient_phone": {
                                "type": "string",
                                "description": "Patient's phone number for identification"
                            },
                            "doctor_id": {
                                "type": "string",
                                "description": "The unique ID of the doctor"
                            },
                            "start_time": {
                                "type": "string",
                                "description": "Appointment start time in ISO 8601 format"
                            },
                            "reason_for_visit": {
                                "type": "string",
                                "description": "Brief reason for the appointment"
                            }
                        },
                        "required": ["patient_phone", "doctor_id", "start_time"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "reschedule_appointment",
                    "description": "Reschedule an existing appointment to a new time. Use this when a patient wants to change their appointment time.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "appointment_id": {
                                "type": "string",
                                "description": "The unique ID or confirmation code of the appointment"
                            },
                            "new_start_time": {
                                "type": "string",
                                "description": "New appointment time in ISO 8601 format"
                            }
                        },
                        "required": ["appointment_id", "new_start_time"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "cancel_appointment",
                    "description": "Cancel an existing appointment. Always confirm with the patient before cancelling.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "appointment_id": {
                                "type": "string",
                                "description": "The unique ID or confirmation code of the appointment"
                            },
                            "cancellation_reason": {
                                "type": "string",
                                "description": "Reason for cancellation"
                            }
                        },
                        "required": ["appointment_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "list_doctors",
                    "description": "Get a list of available doctors, optionally filtered by specialty. Use this when a patient asks about doctors or specialists.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "specialization": {
                                "type": "string",
                                "description": "Medical specialty to filter by (e.g., 'cardiology', 'dermatology', 'general practice')"
                            },
                            "clinic_id": {
                                "type": "string",
                                "description": "Clinic ID to filter by location"
                            }
                        }
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_patient_info",
                    "description": "Retrieve patient information and their upcoming appointments by phone number. Use this to verify patient identity or find their appointments.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "patient_phone": {
                                "type": "string",
                                "description": "Patient's phone number"
                            }
                        },
                        "required": ["patient_phone"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "transfer_to_agent",
                    "description": "Transfer the call to a human agent. Use this when the patient specifically requests it, or when you cannot help with their request.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "reason": {
                                "type": "string",
                                "description": "Reason for the transfer"
                            }
                        }
                    }
                }
            }
        ]
    
    async def execute_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a tool by name with given arguments"""
        tool_map: Dict[str, Callable] = {
            "check_availability": self.check_availability,
            "book_appointment": self.book_appointment,
            "reschedule_appointment": self.reschedule_appointment,
            "cancel_appointment": self.cancel_appointment,
            "list_doctors": self.list_doctors,
            "get_patient_info": self.get_patient_info,
            "transfer_to_agent": self.transfer_to_agent,
        }
        
        if tool_name not in tool_map:
            return {"error": f"Unknown tool: {tool_name}"}
        
        try:
            result = await tool_map[tool_name](**arguments)
            return result
        except Exception as e:
            logger.error(f"Error executing tool {tool_name}: {e}")
            return {"error": str(e)}
