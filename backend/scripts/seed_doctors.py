#!/usr/bin/env python3
"""
Doctor Seeding Script
Run this to populate the database with demo doctors for testing.

Usage:
    cd backend
    python scripts/seed_doctors.py
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import engine, AsyncSessionLocal
from app.models.user import User, UserRole
from app.models.doctor import Doctor, DEFAULT_WORKING_HOURS
from app.core.security import hash_password


DEMO_DOCTORS = [
    {
        "email": "dr.sarah.johnson@clinic.com",
        "full_name": "Sarah Johnson",
        "phone": "+15551001001",
        "specialization": "Cardiology",
        "license": "LIC-CARD-001"
    },
    {
        "email": "dr.michael.chen@clinic.com",
        "full_name": "Michael Chen",
        "phone": "+15551001002",
        "specialization": "Dermatology",
        "license": "LIC-DERM-002"
    },
    {
        "email": "dr.emily.williams@clinic.com",
        "full_name": "Emily Williams",
        "phone": "+15551001003",
        "specialization": "Pediatrics",
        "license": "LIC-PEDI-003"
    },
    {
        "email": "dr.james.brown@clinic.com",
        "full_name": "James Brown",
        "phone": "+15551001004",
        "specialization": "General Practice",
        "license": "LIC-GENP-004"
    },
    {
        "email": "dr.lisa.martinez@clinic.com",
        "full_name": "Lisa Martinez",
        "phone": "+15551001005",
        "specialization": "Neurology",
        "license": "LIC-NEUR-005"
    },
]


async def seed_doctors():
    """Seed demo doctors into the database."""
    async with AsyncSessionLocal() as db:
        print("🏥 Seeding demo doctors...")
        
        for doc_data in DEMO_DOCTORS:
            # Check if doctor already exists
            from sqlalchemy import select
            result = await db.execute(
                select(User).where(User.email == doc_data["email"])
            )
            if result.scalar_one_or_none():
                print(f"  ⏭️  {doc_data['full_name']} already exists, skipping...")
                continue
            
            # Create user
            name_parts = doc_data["full_name"].split(' ', 1)
            user = User(
                email=doc_data["email"],
                phone_number=doc_data["phone"],
                password_hash=hash_password("Demo123!"),  # Demo password
                full_name=doc_data["full_name"],
                role=UserRole.DOCTOR,
                is_verified=True,
                is_active=True
            )
            db.add(user)
            await db.flush()
            
            # Create doctor profile
            doctor = Doctor(
                user_id=user.id,
                first_name=name_parts[0],
                last_name=name_parts[1] if len(name_parts) > 1 else '',
                specialization=doc_data["specialization"],
                license_number=doc_data["license"],
                phone_number=doc_data["phone"],  # Same phone as user
                working_hours=DEFAULT_WORKING_HOURS,
                is_active=True
            )
            db.add(doctor)
            print(f"  ✅ Created: Dr. {doc_data['full_name']} ({doc_data['specialization']})")
        
        await db.commit()
        print("\n🎉 Demo doctors seeded successfully!")
        print("   Login credentials: <doctor_email> / Demo123!")


if __name__ == "__main__":
    asyncio.run(seed_doctors())
