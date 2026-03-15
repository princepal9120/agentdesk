"""
Stripe billing — create checkout sessions, handle webhooks, manage subscriptions.
"""

from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
import stripe
import structlog

from app.core.config import get_settings
from app.core.database import get_db
from app.models.agency import Agency

settings = get_settings()
stripe.api_key = settings.stripe_secret_key
logger = structlog.get_logger()
router = APIRouter()

PLAN_PRICES = {
    "starter": settings.stripe_starter_price_id,
    "pro": settings.stripe_pro_price_id,
    "agency": settings.stripe_agency_price_id,
}


class CheckoutRequest(BaseModel):
    agency_id: str
    plan: str  # starter|pro|agency
    success_url: str
    cancel_url: str


@router.post("/checkout")
async def create_checkout_session(
    payload: CheckoutRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create a Stripe Checkout session for a plan upgrade."""
    import uuid as _uuid

    result = await db.execute(
        select(Agency).where(Agency.id == _uuid.UUID(payload.agency_id))
    )
    agency = result.scalar_one_or_none()
    if not agency:
        raise HTTPException(status_code=404, detail="Agency not found")

    price_id = PLAN_PRICES.get(payload.plan)
    if not price_id:
        raise HTTPException(status_code=400, detail="Invalid plan")

    session = stripe.checkout.Session.create(
        customer=agency.stripe_customer_id,
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=payload.success_url,
        cancel_url=payload.cancel_url,
        metadata={"agency_id": payload.agency_id},
    )

    return {"url": session.url}


@router.post("/portal")
async def create_billing_portal(
    agency_id: str,
    return_url: str,
    db: AsyncSession = Depends(get_db),
):
    """Create a Stripe billing portal session for self-service."""
    import uuid as _uuid

    result = await db.execute(
        select(Agency).where(Agency.id == _uuid.UUID(agency_id))
    )
    agency = result.scalar_one_or_none()
    if not agency or not agency.stripe_customer_id:
        raise HTTPException(status_code=404, detail="Agency not found or no billing setup")

    session = stripe.billing_portal.Session.create(
        customer=agency.stripe_customer_id,
        return_url=return_url,
    )
    return {"url": session.url}


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(alias="stripe-signature"),
    db: AsyncSession = Depends(get_db),
):
    """Handle Stripe webhook events."""
    body = await request.body()

    try:
        event = stripe.Webhook.construct_event(
            body, stripe_signature, settings.stripe_webhook_secret
        )
    except stripe.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    event_type = event["type"]
    data = event["data"]["object"]

    if event_type == "checkout.session.completed":
        agency_id = data.get("metadata", {}).get("agency_id")
        subscription_id = data.get("subscription")
        customer_id = data.get("customer")
        plan = _get_plan_from_subscription(subscription_id)

        if agency_id:
            import uuid as _uuid
            result = await db.execute(
                select(Agency).where(Agency.id == _uuid.UUID(agency_id))
            )
            agency = result.scalar_one_or_none()
            if agency:
                agency.stripe_customer_id = customer_id
                agency.stripe_subscription_id = subscription_id
                agency.plan = plan
                await db.commit()
                logger.info("agency_plan_updated", agency_id=agency_id, plan=plan)

    elif event_type == "customer.subscription.deleted":
        customer_id = data.get("customer")
        result = await db.execute(
            select(Agency).where(Agency.stripe_customer_id == customer_id)
        )
        agency = result.scalar_one_or_none()
        if agency:
            agency.plan = "starter"
            agency.stripe_subscription_id = None
            await db.commit()
            logger.info("agency_downgraded", customer_id=customer_id)

    return {"ok": True}


def _get_plan_from_subscription(subscription_id: str) -> str:
    """Look up which plan a subscription corresponds to."""
    try:
        sub = stripe.Subscription.retrieve(subscription_id)
        price_id = sub["items"]["data"][0]["price"]["id"]
        for plan, pid in PLAN_PRICES.items():
            if pid == price_id:
                return plan
    except Exception:
        pass
    return "starter"
