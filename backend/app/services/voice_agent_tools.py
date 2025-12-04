"""
Voice Agent Tools
TRS Reference: Section 4.3 - Tool/Function Definitions for LLM
PRD Reference: FR-1 - Voice Agent Core

Function calling tools available to the AI voice agent.
"""

from datetime import date, datetime, timezone
from typing import Optional, List, Dict, Any
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.appointment import Appointment, AppointmentStatus
from app.models.user import User
from app.services.availability_service import AvailabilityEngine
from app.services.appointment_service import AppointmentService
from app.core.security import generate_confirmation_code
import redis.asyncio as redis


class VoiceAgentTools:
    """
    Tools available to the LLM for function calling.
    TRS Reference: Section 4.3
    """
    
    def __init__(self, db: AsyncSession, redis_client: redis.Redis):
        self.db = db
        self.redis = redis_client
    
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
        
        Args:
            doctor_id: Doctor UUID string
            date_from: Start date (YYYY-MM-DD)
            date_to: End date (YYYY-MM-DD)
            duration_minutes: Slot duration (default 30)
        
        Returns:
            Dict with available_slots list
        """
        try:
            engine = AvailabilityEngine(self.db, self.redis)
            slots = await engine.get_available_slots(
                doctor_id=UUID(doctor_id),
                date_from=datetime.strptime(date_from, "%Y-%m-%d").date(),
                date_to=datetime.strptime(date_to, "%Y-%m-%d").date(),
                duration_minutes=duration_minutes
            )
            
            return {
                "available_slots": [
                    {
                        "start_time": slot.start_time.isoformat(),
                        "end_time": slot.end_time.isoformat()
                    }
                    for slot in slots[:10]  # Limit to 10 slots
                ]
            }
        except Exception as e:
            return {"error": str(e), "available_slots": []}
    
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
        
        Args:
            patient_phone: Patient's phone number
            doctor_id: Doctor UUID string
            start_time: ISO 8601 timestamp
            reason_for_visit: Optional reason
        
        Returns:
            Dict with appointment_id, confirmation_code, start_time
        """
        try:
            # Find patient by phone
            result = await self.db.execute(
                select(Patient).join(User).where(User.phone_number == patient_phone)
            )
            patient = result.scalar_one_or_none()
            
            if not patient:
                return {"error": "Patient not found", "success": False}
            
            # Get doctor
            doctor = await self.db.get(Doctor, UUID(doctor_id))
            if not doctor or not doctor.is_active:
                return {"error": "Doctor not available", "success": False}
            
            # Create appointment
            from app.schemas.appointment import AppointmentCreate
            
            apt_time = datetime.fromisoformat(start_time.replace("Z", "+00:00"))
            
            service = AppointmentService(self.db)
            appointment, _ = await service.create_appointment(
                AppointmentCreate(
                    doctor_id=UUID(doctor_id),
                    patient_id=patient.id,
                    start_time=apt_time,
                    duration_minutes=doctor.appointment_duration_minutes,
                    reason=reason_for_visit
                )
            )
            
            return {
                "success": True,
                "appointment_id": str(appointment.id),
                "confirmation_code": appointment.confirmation_code,
                "start_time": appointment.start_time.isoformat()
            }
        except Exception as e:
            return {"error": str(e), "success": False}
    
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
            appointment = await self.db.get(Appointment, UUID(appointment_id))
            if not appointment:
                return {"error": "Appointment not found", "success": False}
            
            old_time = appointment.start_time
            
            from app.schemas.appointment import AppointmentUpdate
            service = AppointmentService(self.db)
            
            new_time = datetime.fromisoformat(new_start_time.replace("Z", "+00:00"))
            
            updated = await service.update_appointment(
                UUID(appointment_id),
                AppointmentUpdate(start_time=new_time)
            )
            
            if not updated:
                return {"error": "Failed to reschedule", "success": False}
            
            return {
                "success": True,
                "appointment_id": str(updated.id),
                "old_time": old_time.isoformat(),
                "new_time": updated.start_time.isoformat()
            }
        except Exception as e:
            return {"error": str(e), "success": False}
    
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
            service = AppointmentService(self.db)
            appointment = await service.cancel_appointment(
                UUID(appointment_id),
                reason=cancellation_reason,
                initiator="patient"
            )
            
            if not appointment:
                return {"success": False, "message": "Appointment not found or cannot be cancelled"}
            
            return {"success": True, "message": "Appointment cancelled successfully"}
        except Exception as e:
            return {"success": False, "message": str(e)}
    
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
            query = select(Doctor).where(Doctor.is_active == True)
            
            if specialization:
                query = query.where(Doctor.specialization.ilike(f"%{specialization}%"))
            if clinic_id:
                query = query.where(Doctor.clinic_id == UUID(clinic_id))
            
            query = query.limit(10)
            result = await self.db.execute(query)
            doctors = result.scalars().all()
            
            return {
                "doctors": [
                    {
                        "id": str(d.id),
                        "name": d.full_name,
                        "specialty": d.specialization
                    }
                    for d in doctors
                ]
            }
        except Exception as e:
            return {"error": str(e), "doctors": []}
    
    async def get_patient_info(
        self,
        patient_phone: str
    ) -> Dict[str, Any]:
        """
        Retrieve patient information (limited fields).
        TRS 4.3: get_patient_info tool
        """
        try:
            result = await self.db.execute(
                select(Patient).join(User).where(User.phone_number == patient_phone)
            )
            patient = result.scalar_one_or_none()
            
            if not patient:
                return {"error": "Patient not found"}
            
            # Get upcoming appointments
            appointments = await self.db.execute(
                select(Appointment)
                .where(
                    Appointment.patient_id == patient.id,
                    Appointment.status.in_([
                        AppointmentStatus.SCHEDULED.value,
                        AppointmentStatus.CONFIRMED.value
                    ]),
                    Appointment.start_time >= datetime.now(timezone.utc)
                )
                .order_by(Appointment.start_time)
                .limit(5)
            )
            upcoming = appointments.scalars().all()
            
            return {
                "patient_id": str(patient.id),
                "name": patient.user.full_name,
                "appointments": [
                    {
                        "id": str(a.id),
                        "confirmation_code": a.confirmation_code,
                        "start_time": a.start_time.isoformat(),
                        "status": a.status
                    }
                    for a in upcoming
                ]
            }
        except Exception as e:
            return {"error": str(e)}
    
    async def transfer_to_agent(
        self,
        reason: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Transfer call to human agent.
        TRS 4.3: transfer_to_agent tool
        """
        # In production, this would trigger actual call transfer
        return {
            "success": True,
            "queue_position": 1,
            "message": "Transferring to a human agent. Please hold."
        }


# Tool definitions for OpenAI function calling
VOICE_AGENT_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "check_availability",
            "description": "Check available appointment slots for a doctor",
            "parameters": {
                "type": "object",
                "properties": {
                    "doctor_id": {
                        "type": "string",
                        "description": "Doctor UUID"
                    },
                    "date_from": {
                        "type": "string",
                        "description": "Start date (YYYY-MM-DD)"
                    },
                    "date_to": {
                        "type": "string",
                        "description": "End date (YYYY-MM-DD)"
                    },
                    "duration_minutes": {
                        "type": "integer",
                        "description": "Slot duration in minutes",
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
            "description": "Create a new appointment",
            "parameters": {
                "type": "object",
                "properties": {
                    "patient_phone": {
                        "type": "string",
                        "description": "Patient phone number"
                    },
                    "doctor_id": {
                        "type": "string",
                        "description": "Doctor UUID"
                    },
                    "start_time": {
                        "type": "string",
                        "description": "ISO 8601 timestamp"
                    },
                    "reason_for_visit": {
                        "type": "string",
                        "description": "Reason for the visit"
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
            "description": "Reschedule an existing appointment",
            "parameters": {
                "type": "object",
                "properties": {
                    "appointment_id": {
                        "type": "string",
                        "description": "Appointment UUID"
                    },
                    "new_start_time": {
                        "type": "string",
                        "description": "New ISO 8601 timestamp"
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
            "description": "Cancel an existing appointment",
            "parameters": {
                "type": "object",
                "properties": {
                    "appointment_id": {
                        "type": "string",
                        "description": "Appointment UUID"
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
            "description": "Get list of doctors by specialization",
            "parameters": {
                "type": "object",
                "properties": {
                    "specialization": {
                        "type": "string",
                        "description": "Medical specialty to filter by"
                    },
                    "clinic_id": {
                        "type": "string",
                        "description": "Clinic UUID to filter by"
                    }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_patient_info",
            "description": "Retrieve patient information and appointments",
            "parameters": {
                "type": "object",
                "properties": {
                    "patient_phone": {
                        "type": "string",
                        "description": "Patient phone number"
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
            "description": "Transfer call to human agent",
            "parameters": {
                "type": "object",
                "properties": {
                    "reason": {
                        "type": "string",
                        "description": "Reason for transfer"
                    }
                }
            }
        }
    }
]
