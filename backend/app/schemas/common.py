"""
Common Schemas - Error responses
TRS Reference: Section 2.6 - Error Handling
"""

from typing import Optional, Dict, Any
from pydantic import BaseModel


class ErrorResponse(BaseModel):
    """Standardized error response per TRS 2.6."""
    error_code: str
    message: str
    details: Optional[Dict[str, Any]] = None
    request_id: str
