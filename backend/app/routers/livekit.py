"""
LiveKit Router
TRS Reference: Section 3 - Voice Agent Server
PRD Reference: Section 3.1 - Voice Interaction Features

Handles LiveKit token generation for frontend client.
"""

import os
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from livekit import api
from pydantic import BaseModel

from app.core.dependencies import get_current_user
from app.models.user import User
from app.core.config import settings

router = APIRouter(prefix="/livekit", tags=["LiveKit"])


class TokenResponse(BaseModel):
    token: str
    server_url: str
    room_name: str


@router.get("/token", response_model=TokenResponse)
async def get_token(
    room_name: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """
    Generate a LiveKit token for the current user.
    """
    # Use environment variables directly or from settings if added there
    # For now, we'll use os.getenv as they might not be in Settings class yet
    api_key = os.getenv("LIVEKIT_API_KEY")
    api_secret = os.getenv("LIVEKIT_API_SECRET")
    livekit_url = os.getenv("LIVEKIT_URL")
    
    if not api_key or not api_secret or not livekit_url:
        raise HTTPException(
            status_code=500, 
            detail="LiveKit configuration missing"
        )
    
    # Generate a unique room name if not provided (e.g., for direct calls)
    # For this MVP, we'll use a single room per user or a shared lobby
    if not room_name:
        room_name = f"room-{current_user.id}"

    # Create token
    token = api.AccessToken(api_key, api_secret) \
        .with_identity(str(current_user.id)) \
        .with_name(current_user.full_name) \
        .with_grants(api.VideoGrants(
            room_join=True,
            room=room_name,
            can_publish=True,
            can_subscribe=True,
        ))
    
    jwt_token = token.to_jwt()
    
    return TokenResponse(
        token=jwt_token,
        server_url=livekit_url,
        room_name=room_name
    )
