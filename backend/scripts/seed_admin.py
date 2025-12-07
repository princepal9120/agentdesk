"""
Seed Admin User Script
Creates a specific admin user for testing/demo purposes.
"""

import asyncio
import sys
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select

from app.core.config import settings
from app.core.security import hash_password
from app.models.user import User, UserRole


async def seed_admin():
    """Seed the specific admin user."""
    
    # Create async engine
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        # Check if admin already exists
        existing = await session.execute(
            select(User).where(User.email == "admin@gmail.com")
        )
        if existing.scalar_one_or_none():
            print("Admin user already exists: admin@gmail.com")
            return
        
        # Create admin user
        admin_user = User(
            email="admin@gmail.com",
            password_hash=hash_password("Admin@123"),
            full_name="Admin User",
            phone_number="+1234567890",
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True,
        )
        
        session.add(admin_user)
        await session.commit()
        
        print("=" * 50)
        print("Admin user created successfully!")
        print("=" * 50)
        print(f"Email: admin@gmail.com")
        print(f"Password: Admin@123")
        print(f"Role: admin")
        print("=" * 50)
    
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed_admin())
