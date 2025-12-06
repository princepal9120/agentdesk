#!/usr/bin/env python3
"""
Patient Seeding Script
Run this to populate the database with a specific demo patient.

Usage:
    cd backend
    python scripts/seed_patient.py
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import engine, AsyncSessionLocal
from app.models.user import User, UserRole
from app.models.patient import Patient
from app.core.security import hash_password

DEMO_PATIENT = {
    "email": "patient@gmail.com",
    "password": "Patient@123",
    "full_name": "Demo Patient",
    "phone": "+15559998888",
    "dob": "1990-01-01"
}

async def seed_patient():
    """Seed demo patient into the database."""
    async with AsyncSessionLocal() as db:
        print("👤 Seeding demo patient...")
        
        # Check if patient already exists
        result = await db.execute(
            select(User).where(User.email == DEMO_PATIENT["email"])
        )
        if result.scalar_one_or_none():
            print(f"  ⏭️  {DEMO_PATIENT['email']} already exists, skipping...")
            return
        
        # Create user
        user = User(
            email=DEMO_PATIENT["email"],
            phone_number=DEMO_PATIENT["phone"],
            password_hash=hash_password(DEMO_PATIENT["password"]),
            full_name=DEMO_PATIENT["full_name"],
            role=UserRole.PATIENT,
            is_verified=True,
            is_active=True
        )
        db.add(user)
        await db.flush()
        
        # Create patient profile
        from datetime import date
        patient = Patient(
            user_id=user.id,
            date_of_birth=date.fromisoformat(DEMO_PATIENT["dob"]),
            sms_consent=True,
            email_consent=True,
            call_consent=True
        )
        db.add(patient)
        print(f"  ✅ Created: {DEMO_PATIENT['full_name']} ({DEMO_PATIENT['email']})")
        
        await db.commit()
        print("\n🎉 Demo patient seeded successfully!")
        print(f"   Login: {DEMO_PATIENT['email']} / {DEMO_PATIENT['password']}")


if __name__ == "__main__":
    asyncio.run(seed_patient())
