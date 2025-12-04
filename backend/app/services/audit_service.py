"""
Audit Service - HIPAA Compliance Logging
TRS Reference: Section 5.3 - Audit Logging
"""

from datetime import datetime, timezone
from typing import Optional, Dict, Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.audit_log import AuditLog


async def log_phi_access(
    db: AsyncSession,
    user_id: Optional[UUID],
    action: str,
    resource_type: str,
    resource_id: Optional[UUID] = None,
    old_values: Optional[Dict[str, Any]] = None,
    new_values: Optional[Dict[str, Any]] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    contains_phi: bool = True
) -> AuditLog:
    """Log PHI access for HIPAA compliance."""
    audit_log = AuditLog(
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        user_id=user_id,
        performed_at=datetime.now(timezone.utc),
        old_values=old_values,
        new_values=new_values,
        ip_address=ip_address,
        user_agent=user_agent,
        contains_phi=contains_phi
    )
    db.add(audit_log)
    await db.flush()
    return audit_log
