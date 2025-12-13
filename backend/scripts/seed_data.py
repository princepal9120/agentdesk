#!/usr/bin/env python3
"""
Seed Data Script for Healthcare Voice Agent
Creates admin, doctors, and sample data for testing.
"""

import asyncio
from datetime import datetime, date, time
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

# Add parent to path for imports
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from app.core.database import AsyncSessionLocal
from app.core.security import hash_password
from app.models.user import User, UserRole
from app.models.doctor import Doctor
from app.models.patient import Patient


async def seed_admin():
    """Create admin user: admin@gmail.com / Admin@123"""
    async with AsyncSessionLocal() as session:
        # Check if admin exists
        result = await session.execute(
            select(User).where(User.email == "admin@gmail.com")
        )
        existing = result.scalar_one_or_none()
        
        if existing:
            print("✓ Admin user already exists")
            return existing
        
        admin = User(
            id=uuid4(),
            email="admin@gmail.com",
            phone_number="+15551234567",
            password_hash=hash_password("Admin@123"),
            full_name="System Administrator",
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True,
        )
        session.add(admin)
        await session.commit()
        print("✓ Created admin user: admin@gmail.com / Admin@123")
        return admin


async def seed_doctors():
    """Create sample doctors with availability"""
    async with AsyncSessionLocal() as session:
        doctors_data = [
            {
                "email": "dr.smith@clinic.com",
                "phone": "+15552001001",
                "full_name": "Dr. John Smith",
                "first_name": "John",
                "last_name": "Smith",
                "specialization": "General Practice",
                "license_number": "MD-123456",
            },
            {
                "email": "dr.johnson@clinic.com",
                "phone": "+15552001002",
                "full_name": "Dr. Sarah Johnson",
                "first_name": "Sarah",
                "last_name": "Johnson",
                "specialization": "Cardiology",
                "license_number": "MD-234567",
            },
            {
                "email": "dr.patel@clinic.com",
                "phone": "+15552001003",
                "full_name": "Dr. Raj Patel",
                "first_name": "Raj",
                "last_name": "Patel",
                "specialization": "Dermatology",
                "license_number": "MD-345678",
            }
        ]
        
        created_doctors = []
        
        for doc_data in doctors_data:
            # Check if doctor exists
            result = await session.execute(
                select(User).where(User.email == doc_data["email"])
            )
            existing = result.scalar_one_or_none()
            
            if existing:
                print(f"✓ Doctor {doc_data['full_name']} already exists")
                # Get doctor record
                doc_result = await session.execute(
                    select(Doctor).where(Doctor.user_id == existing.id)
                )
                doctor = doc_result.scalar_one_or_none()
                if doctor:
                    created_doctors.append(doctor)
                continue
            
            # Create user
            user = User(
                id=uuid4(),
                email=doc_data["email"],
                phone_number=doc_data["phone"],
                password_hash=hash_password("Doctor@123"),
                full_name=doc_data["full_name"],
                role=UserRole.DOCTOR,
                is_active=True,
                is_verified=True,
            )
            session.add(user)
            await session.flush()
            
            # Create doctor record with working hours
            working_hours = {
                "monday": {"start": "09:00", "end": "17:00"},
                "tuesday": {"start": "09:00", "end": "17:00"},
                "wednesday": {"start": "09:00", "end": "17:00"},
                "thursday": {"start": "09:00", "end": "17:00"},
                "friday": {"start": "09:00", "end": "15:00"},
            }
            
            doctor = Doctor(
                id=uuid4(),
                user_id=user.id,
                first_name=doc_data["first_name"],
                last_name=doc_data["last_name"],
                specialization=doc_data["specialization"],
                license_number=doc_data["license_number"],
                phone_number=doc_data["phone"],
                working_hours=working_hours,
                buffer_time_minutes=15,
                appointment_duration_minutes=30,
                max_patients_per_day=16,
                is_active=True,
            )
            session.add(doctor)
            created_doctors.append(doctor)
            print(f"✓ Created doctor: {doc_data['full_name']} (password: Doctor@123)")
        
        await session.commit()
        return created_doctors


async def link_existing_doctor_user():
    """Link existing doctor user to a Doctor record if not already linked"""
    async with AsyncSessionLocal() as session:
        # Find users with doctor role without Doctor record
        result = await session.execute(
            select(User).where(User.role == UserRole.DOCTOR)
        )
        doctor_users = result.scalars().all()
        
        for user in doctor_users:
            # Check if Doctor record exists
            doc_result = await session.execute(
                select(Doctor).where(Doctor.user_id == user.id)
            )
            existing_doc = doc_result.scalar_one_or_none()
            
            if not existing_doc:
                # Create Doctor record
                working_hours = {
                    "monday": {"start": "09:00", "end": "17:00"},
                    "tuesday": {"start": "09:00", "end": "17:00"},
                    "wednesday": {"start": "09:00", "end": "17:00"},
                    "thursday": {"start": "09:00", "end": "17:00"},
                    "friday": {"start": "09:00", "end": "15:00"},
                }
                
                doctor = Doctor(
                    id=uuid4(),
                    user_id=user.id,
                    first_name=user.full_name.split()[0] if user.full_name else "Doctor",
                    last_name=" ".join(user.full_name.split()[1:]) if user.full_name and len(user.full_name.split()) > 1 else "User",
                    specialization="General Practice",
                    license_number=f"MD-{str(user.id)[:8]}",
                    phone_number=user.phone_number,
                    working_hours=working_hours,
                    buffer_time_minutes=15,
                    appointment_duration_minutes=30,
                    max_patients_per_day=16,
                    is_active=True,
                )
                session.add(doctor)
                print(f"✓ Linked existing user {user.email} to Doctor record")
        
        await session.commit()


async def link_existing_patient_user():
    """Link existing patient user to a Patient record if not already linked"""
    async with AsyncSessionLocal() as session:
        # Find users with patient role without Patient record
        result = await session.execute(
            select(User).where(User.role == UserRole.PATIENT)
        )
        patient_users = result.scalars().all()
        
        for user in patient_users:
            # Check if Patient record exists
            pat_result = await session.execute(
                select(Patient).where(Patient.user_id == user.id)
            )
            existing_pat = pat_result.scalar_one_or_none()
            
            if not existing_pat:
                # Create Patient record
                patient = Patient(
                    id=uuid4(),
                    user_id=user.id,
                    date_of_birth=date(1990, 1, 1),  # Default DOB
                    preferred_contact_method="phone",
                    sms_consent=True,
                    email_consent=True,
                    call_consent=True,
                )
                session.add(patient)
                print(f"✓ Linked existing user {user.email} to Patient record")
        
        await session.commit()


async def print_summary():
    """Print summary of all users"""
    async with AsyncSessionLocal() as session:
        print("\n" + "="*60)
        print("DATABASE SUMMARY")
        print("="*60)
        
        # Users
        result = await session.execute(select(User))
        users = result.scalars().all()
        
        print(f"\n📋 Users ({len(users)} total):")
        for user in users:
            print(f"   • {user.email} ({user.role.value})")
        
        # Doctors
        result = await session.execute(select(Doctor))
        doctors = result.scalars().all()
        
        print(f"\n👨‍⚕️ Doctors ({len(doctors)} total):")
        for doc in doctors:
            print(f"   • Dr. {doc.first_name} {doc.last_name} - {doc.specialization} (ID: {doc.id})")
        
        # Patients
        result = await session.execute(select(Patient))
        patients = result.scalars().all()
        
        print(f"\n🏥 Patients ({len(patients)} total):")
        for pat in patients:
            print(f"   • ID: {pat.id}")
        
        print("\n" + "="*60)
        print("CREDENTIALS")
        print("="*60)
        print("Admin:   admin@gmail.com / Admin@123")
        print("Doctors: dr.smith@clinic.com / Doctor@123")
        print("         dr.johnson@clinic.com / Doctor@123")
        print("         dr.patel@clinic.com / Doctor@123")
        print("="*60)


async def main():
    print("\n🏥 Healthcare Voice Agent - Seed Data Script")
    print("="*60)
    
    await seed_admin()
    await seed_doctors()
    await link_existing_doctor_user()
    await link_existing_patient_user()
    await print_summary()
    
    print("\n✅ Seed data complete!\n")


if __name__ == "__main__":
    asyncio.run(main())
