"""
Patient Service
TRS Reference: Section 2.3.1 - Patients Table
PRD Reference: FR-3 - Patient Data Management
"""

from typing import Optional, List
from uuid import UUID
from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.patient import Patient
from app.models.user import User, UserRole
from app.core.security import encrypt_phi, decrypt_phi
from app.services.audit_service import log_phi_access


class PatientService:
    """Service for patient management with PHI encryption."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_patient(
        self,
        user_id: UUID,
        date_of_birth: date,
        medical_history: Optional[str] = None,
        allergies: Optional[str] = None,
        emergency_contact: Optional[str] = None,
        created_by: Optional[UUID] = None
    ) -> Patient:
        """Create a new patient with encrypted PHI."""
        patient = Patient(
            user_id=user_id,
            date_of_birth=date_of_birth,
            medical_history=encrypt_phi(medical_history) if medical_history else None,
            allergies=encrypt_phi(allergies) if allergies else None,
            emergency_contact=encrypt_phi(emergency_contact) if emergency_contact else None,
            encrypted_fields={"medical_history": True, "allergies": True, "emergency_contact": True},
            created_by=created_by
        )
        
        self.db.add(patient)
        await self.db.flush()
        
        await log_phi_access(
            self.db, created_by, "create", "patient",
            patient.id, new_values={"user_id": str(user_id)}
        )
        
        return patient
    
    async def get_patient(
        self,
        patient_id: UUID,
        accessed_by: Optional[UUID] = None,
        decrypt: bool = False
    ) -> Optional[Patient]:
        """Get patient by ID with optional PHI decryption."""
        patient = await self.db.get(Patient, patient_id)
        
        if patient and accessed_by:
            await log_phi_access(
                self.db, accessed_by, "read", "patient", patient_id
            )
        
        if patient and decrypt:
            patient = await self._decrypt_patient_phi(patient)
        
        return patient
    
    async def get_patient_by_user(
        self,
        user_id: UUID,
        accessed_by: Optional[UUID] = None
    ) -> Optional[Patient]:
        """Get patient by user ID."""
        result = await self.db.execute(
            select(Patient).where(Patient.user_id == user_id)
        )
        patient = result.scalar_one_or_none()
        
        if patient and accessed_by:
            await log_phi_access(
                self.db, accessed_by, "read", "patient", patient.id
            )
        
        return patient
    
    async def search_patients(
        self,
        search_term: str,
        limit: int = 20,
        accessed_by: Optional[UUID] = None
    ) -> List[Patient]:
        """Search patients by name or phone."""
        result = await self.db.execute(
            select(Patient)
            .join(User)
            .where(
                (User.full_name.ilike(f"%{search_term}%")) |
                (User.phone_number.ilike(f"%{search_term}%"))
            )
            .limit(limit)
        )
        patients = list(result.scalars().all())
        
        if accessed_by:
            await log_phi_access(
                self.db, accessed_by, "search", "patient",
                new_values={"search_term": search_term, "results": len(patients)}
            )
        
        return patients
    
    async def update_patient(
        self,
        patient_id: UUID,
        updated_by: Optional[UUID] = None,
        medical_history: Optional[str] = None,
        allergies: Optional[str] = None,
        emergency_contact: Optional[str] = None,
        preferred_contact_method: Optional[str] = None,
        sms_consent: Optional[bool] = None,
        email_consent: Optional[bool] = None,
        call_consent: Optional[bool] = None
    ) -> Optional[Patient]:
        """Update patient with PHI encryption."""
        patient = await self.db.get(Patient, patient_id)
        if not patient:
            return None
        
        old_values = {}
        new_values = {}
        
        if medical_history is not None:
            old_values["medical_history"] = "[encrypted]"
            patient.medical_history = encrypt_phi(medical_history)
            new_values["medical_history"] = "[encrypted]"
        
        if allergies is not None:
            old_values["allergies"] = "[encrypted]"
            patient.allergies = encrypt_phi(allergies)
            new_values["allergies"] = "[encrypted]"
        
        if emergency_contact is not None:
            old_values["emergency_contact"] = "[encrypted]"
            patient.emergency_contact = encrypt_phi(emergency_contact)
            new_values["emergency_contact"] = "[encrypted]"
        
        if preferred_contact_method is not None:
            old_values["preferred_contact_method"] = patient.preferred_contact_method
            patient.preferred_contact_method = preferred_contact_method
            new_values["preferred_contact_method"] = preferred_contact_method
        
        if sms_consent is not None:
            patient.sms_consent = sms_consent
        if email_consent is not None:
            patient.email_consent = email_consent
        if call_consent is not None:
            patient.call_consent = call_consent
        
        await self.db.flush()
        
        await log_phi_access(
            self.db, updated_by, "update", "patient",
            patient_id, old_values=old_values, new_values=new_values
        )
        
        return patient
    
    async def _decrypt_patient_phi(self, patient: Patient) -> Patient:
        """Decrypt PHI fields on patient object."""
        if patient.medical_history:
            patient.medical_history = decrypt_phi(patient.medical_history)
        if patient.allergies:
            patient.allergies = decrypt_phi(patient.allergies)
        if patient.emergency_contact:
            patient.emergency_contact = decrypt_phi(patient.emergency_contact)
        return patient
