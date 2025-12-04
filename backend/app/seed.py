"""
Database Seeding Script
Creates demo data for MVP testing.

Usage:
    cd backend
    python -m app.seed
"""

import asyncio
from datetime import datetime, timedelta
from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext

from app.core.database import async_session
from app.models import User, Doctor, Patient, Appointment, DoctorAvailability
from app.models.user import UserRole

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def seed_database():
    """Seed the database with demo data."""
    async with async_session() as session:
        print("🌱 Starting database seeding...")
        
        # Check if already seeded
        existing = await session.execute(
            "SELECT COUNT(*) FROM users WHERE email = 'admin@healthvoice.com'"
        )
        if existing.scalar() > 0:
            print("⚠️  Database already seeded. Skipping...")
            return
        
        # ========== 1. Create Admin User ==========
        admin_user = User(
            id=uuid4(),
            email="admin@healthvoice.com",
            phone_number="+1234567890",
            hashed_password=pwd_context.hash("admin123"),
            full_name="System Administrator",
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True,
        )
        session.add(admin_user)
        print("✅ Created Admin: admin@healthvoice.com / admin123")

        # ========== 2. Create Doctors ==========
        doctors_data = [
            {
                "email": "dr.smith@healthvoice.com",
                "name": "Dr. Sarah Smith",
                "phone": "+1234567891",
                "specialization": "General Practice",
                "license": "MD-12345",
            },
            {
                "email": "dr.johnson@healthvoice.com",
                "name": "Dr. Michael Johnson",
                "phone": "+1234567892",
                "specialization": "Cardiology",
                "license": "MD-67890",
            },
            {
                "email": "dr.patel@healthvoice.com",
                "name": "Dr. Priya Patel",
                "phone": "+1234567893",
                "specialization": "Dermatology",
                "license": "MD-11111",
            },
        ]

        doctors = []
        for doc in doctors_data:
            user = User(
                id=uuid4(),
                email=doc["email"],
                phone_number=doc["phone"],
                hashed_password=pwd_context.hash("doctor123"),
                full_name=doc["name"],
                role=UserRole.DOCTOR,
                is_active=True,
                is_verified=True,
            )
            session.add(user)
            
            doctor = Doctor(
                id=uuid4(),
                user_id=user.id,
                specialization=doc["specialization"],
                license_number=doc["license"],
                years_of_experience=10,
                consultation_fee=150.00,
                is_accepting_patients=True,
            )
            session.add(doctor)
            doctors.append(doctor)
            print(f"✅ Created Doctor: {doc['email']} / doctor123 ({doc['specialization']})")

        # ========== 3. Create Patients ==========
        patients_data = [
            {"email": "john.doe@email.com", "name": "John Doe", "phone": "+1555000001"},
            {"email": "jane.smith@email.com", "name": "Jane Smith", "phone": "+1555000002"},
            {"email": "bob.wilson@email.com", "name": "Bob Wilson", "phone": "+1555000003"},
            {"email": "alice.brown@email.com", "name": "Alice Brown", "phone": "+1555000004"},
            {"email": "demo@patient.com", "name": "Demo Patient", "phone": "+1555000005"},
        ]

        patients = []
        for pat in patients_data:
            user = User(
                id=uuid4(),
                email=pat["email"],
                phone_number=pat["phone"],
                hashed_password=pwd_context.hash("patient123"),
                full_name=pat["name"],
                role=UserRole.PATIENT,
                is_active=True,
                is_verified=True,
            )
            session.add(user)
            
            patient = Patient(
                id=uuid4(),
                user_id=user.id,
                date_of_birth=datetime(1990, 1, 15).date(),
                gender="other",
                address="123 Main Street",
                emergency_contact_name="Emergency Contact",
                emergency_contact_phone="+1555999999",
            )
            session.add(patient)
            patients.append(patient)
            print(f"✅ Created Patient: {pat['email']} / patient123")

        # ========== 4. Create Doctor Availability ==========
        # Create availability for next 7 days, 9 AM - 5 PM
        today = datetime.now().date()
        for doctor in doctors:
            for day_offset in range(7):
                date = today + timedelta(days=day_offset)
                if date.weekday() < 5:  # Monday to Friday only
                    availability = DoctorAvailability(
                        id=uuid4(),
                        doctor_id=doctor.id,
                        day_of_week=date.weekday(),
                        start_time=datetime.strptime("09:00", "%H:%M").time(),
                        end_time=datetime.strptime("17:00", "%H:%M").time(),
                        is_available=True,
                    )
                    session.add(availability)
        print("✅ Created Doctor Availability (Mon-Fri, 9 AM - 5 PM)")

        # ========== 5. Create Sample Appointments ==========
        appointments_data = [
            # Past appointments (completed)
            {"patient_idx": 0, "doctor_idx": 0, "days_ago": 7, "hour": 10, "status": "completed"},
            {"patient_idx": 1, "doctor_idx": 1, "days_ago": 5, "hour": 14, "status": "completed"},
            {"patient_idx": 2, "doctor_idx": 2, "days_ago": 3, "hour": 11, "status": "completed"},
            # Today's appointments
            {"patient_idx": 3, "doctor_idx": 0, "days_ago": 0, "hour": 10, "status": "scheduled"},
            {"patient_idx": 0, "doctor_idx": 1, "days_ago": 0, "hour": 15, "status": "confirmed"},
            # Future appointments
            {"patient_idx": 1, "doctor_idx": 0, "days_ago": -1, "hour": 9, "status": "scheduled"},
            {"patient_idx": 2, "doctor_idx": 1, "days_ago": -2, "hour": 16, "status": "scheduled"},
            {"patient_idx": 4, "doctor_idx": 2, "days_ago": -3, "hour": 11, "status": "scheduled"},
        ]

        for appt in appointments_data:
            appt_date = today + timedelta(days=-appt["days_ago"])
            start_time = datetime.combine(appt_date, datetime.strptime(f"{appt['hour']}:00", "%H:%M").time())
            end_time = start_time + timedelta(minutes=30)
            
            appointment = Appointment(
                id=uuid4(),
                patient_id=patients[appt["patient_idx"]].id,
                doctor_id=doctors[appt["doctor_idx"]].id,
                start_time=start_time,
                end_time=end_time,
                status=appt["status"],
                reason="General Checkup",
                notes="Created via seed script",
            )
            session.add(appointment)
        print(f"✅ Created {len(appointments_data)} Sample Appointments")

        # Commit all changes
        await session.commit()
        print("\n🎉 Database seeding completed successfully!")
        print("\n📋 Login Credentials:")
        print("   Admin:   admin@healthvoice.com / admin123")
        print("   Doctor:  dr.smith@healthvoice.com / doctor123")
        print("   Patient: demo@patient.com / patient123")


if __name__ == "__main__":
    asyncio.run(seed_database())
