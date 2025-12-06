#!/usr/bin/env python3
"""
Specific Doctor Seeding Script
Run this to populate the database with the specific demo doctor requested.

Usage:
    cd backend
    python scripts/seed_specific_doctor.py
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
from app.models.doctor import Doctor, DEFAULT_WORKING_HOURS
from app.core.security import hash_password

DEMO_DOCTOR = {
    "email": "doctor@gmail.com",
    "password": "Doctor@123",
    "full_name": "Demo Doctor",
    "phone": "+15551112222",
    "specialization": "General Practice",
    "license": "LIC-DEMO-999"
}

async def seed_specific_doctor():
    """Seed specific demo doctor into the database."""
    async with AsyncSessionLocal() as db:
        print("👨‍⚕️ Seeding specific demo doctor...")
        
        # Check if doctor already exists
        result = await db.execute(
            select(User).where(User.email == DEMO_DOCTOR["email"])
        )
        if result.scalar_one_or_none():
            print(f"  ⏭️  {DEMO_DOCTOR['email']} already exists, skipping...")
            return
        
        # Create user
        user = User(
            email=DEMO_DOCTOR["email"],
            phone_number=DEMO_DOCTOR["phone"],
            password_hash=hash_password(DEMO_DOCTOR["password"]),
            full_name=DEMO_DOCTOR["full_name"],
            role=UserRole.DOCTOR,
            is_verified=True,
            is_active=True
        )
        db.add(user)
        await db.flush()
        
        # Create doctor profile
        name_parts = DEMO_DOCTOR["full_name"].split(' ', 1)
        doctor = Doctor(
            user_id=user.id,
            first_name=name_parts[0],
            last_name=name_parts[1] if len(name_parts) > 1 else '',
            specialization=DEMO_DOCTOR["specialization"],
            license_number=DEMO_DOCTOR["license"],
            phone_number=DEMO_DOCTOR["phone"],
            working_hours=DEFAULT_WORKING_HOURS,
            is_active=True
        )
        db.add(doctor)
        print(f"  ✅ Created: Dr. {DEMO_DOCTOR['full_name']} ({DEMO_DOCTOR['email']})")
        
        await db.commit()
        print("\n🎉 Specific demo doctor seeded successfully!")
        print(f"   Login: {DEMO_DOCTOR['email']} / {DEMO_DOCTOR['password']}")


if __name__ == "__main__":
    asyncio.run(seed_specific_doctor())
