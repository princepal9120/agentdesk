"""
Agent tools — callable by the LLM during voice calls.
Each tool is a function decorated with @function_tool (LiveKit pattern).
"""

import json
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from livekit.agents import function_tool, RunContext
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import structlog

logger = structlog.get_logger()


# ── Tool definitions ──────────────────────────────────────────────────────────

@function_tool
async def check_availability(
    ctx: RunContext,
    date: str,
    time: str,
    duration_min: int = 60,
) -> str:
    """
    Check if a time slot is available for booking.
    Args:
        date: Date in YYYY-MM-DD format
        time: Time in HH:MM format (24h)
        duration_min: Duration of appointment in minutes
    """
    db: AsyncSession = ctx.userdata.get("db")
    business_id = ctx.userdata.get("business_id")

    try:
        requested_dt = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
        requested_end = requested_dt + timedelta(minutes=duration_min)

        # Simple overlap check against existing bookings
        from app.models.call import Booking
        result = await db.execute(
            select(Booking).where(
                Booking.business_id == business_id,
                Booking.status == "confirmed",
                Booking.appointment_at >= requested_dt,
                Booking.appointment_at < requested_end,
            )
        )
        conflicts = result.scalars().all()

        if conflicts:
            return f"Sorry, {date} at {time} is already booked. Would you like to try a different time?"
        return f"Great news! {date} at {time} is available for {duration_min} minutes."

    except Exception as e:
        logger.error("check_availability_error", error=str(e))
        return "I had trouble checking availability. Let me take your details and we'll confirm by text."


@function_tool
async def book_appointment(
    ctx: RunContext,
    customer_name: str,
    customer_phone: str,
    service: str,
    date: str,
    time: str,
    duration_min: int = 60,
    notes: str = "",
) -> str:
    """
    Book an appointment for a customer.
    Args:
        customer_name: Full name of the customer
        customer_phone: Customer's phone number (digits only)
        service: Service being booked
        date: Date in YYYY-MM-DD format
        time: Time in HH:MM format (24h)
        duration_min: Duration in minutes
        notes: Any special requests or notes
    """
    db: AsyncSession = ctx.userdata.get("db")
    business_id = ctx.userdata.get("business_id")
    call_id = ctx.userdata.get("call_id")

    try:
        from app.models.call import Booking
        appointment_dt = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")

        booking = Booking(
            business_id=business_id,
            call_id=call_id,
            customer_name=customer_name,
            customer_phone=customer_phone,
            service=service,
            appointment_at=appointment_dt,
            duration_min=duration_min,
            status="confirmed",
            notes=notes,
        )
        db.add(booking)
        await db.commit()
        await db.refresh(booking)

        # Queue SMS confirmation
        ctx.userdata["pending_sms"] = {
            "to": customer_phone,
            "message": (
                f"Confirmed! {service} on {appointment_dt.strftime('%b %d at %I:%M %p')}. "
                f"Reply CANCEL to cancel. See you soon!"
            ),
        }

        logger.info("booking_created", booking_id=str(booking.id), customer=customer_name)
        return (
            f"Perfect! I've booked {service} for {customer_name} on "
            f"{appointment_dt.strftime('%B %d at %I:%M %p')}. "
            f"You'll get a confirmation text at {customer_phone} shortly."
        )

    except Exception as e:
        logger.error("book_appointment_error", error=str(e))
        return "I had trouble saving the booking. Let me take your details and we'll confirm shortly."


@function_tool
async def cancel_appointment(
    ctx: RunContext,
    customer_phone: str,
    appointment_date: str = "",
) -> str:
    """
    Cancel an existing appointment by customer phone number.
    Args:
        customer_phone: Customer's phone number
        appointment_date: Optional date to narrow down which booking (YYYY-MM-DD)
    """
    db: AsyncSession = ctx.userdata.get("db")
    business_id = ctx.userdata.get("business_id")

    try:
        from app.models.call import Booking
        query = select(Booking).where(
            Booking.business_id == business_id,
            Booking.customer_phone == customer_phone,
            Booking.status == "confirmed",
        ).order_by(Booking.appointment_at.asc())

        result = await db.execute(query)
        bookings = result.scalars().all()

        if not bookings:
            return f"I couldn't find any upcoming bookings for {customer_phone}. Could you double-check the number?"

        # Cancel the soonest upcoming booking
        booking = bookings[0]
        booking.status = "cancelled"
        await db.commit()

        return (
            f"Done! I've cancelled your {booking.service} appointment on "
            f"{booking.appointment_at.strftime('%B %d at %I:%M %p')}. "
            f"We hope to see you again soon!"
        )

    except Exception as e:
        logger.error("cancel_appointment_error", error=str(e))
        return "I had trouble processing the cancellation. Please call back or text us directly."


@function_tool
async def make_reservation(
    ctx: RunContext,
    customer_name: str,
    customer_phone: str,
    party_size: int,
    date: str,
    time: str,
    notes: str = "",
) -> str:
    """
    Make a restaurant table reservation.
    Args:
        customer_name: Name for the reservation
        customer_phone: Customer's phone number
        party_size: Number of people
        date: Date in YYYY-MM-DD format
        time: Time in HH:MM format
        notes: Special occasions or dietary requirements
    """
    db: AsyncSession = ctx.userdata.get("db")
    business_id = ctx.userdata.get("business_id")
    call_id = ctx.userdata.get("call_id")

    try:
        from app.models.call import Booking
        reservation_dt = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")

        booking = Booking(
            business_id=business_id,
            call_id=call_id,
            customer_name=customer_name,
            customer_phone=customer_phone,
            service=f"Table for {party_size}",
            appointment_at=reservation_dt,
            duration_min=90,
            status="confirmed",
            notes=notes,
        )
        db.add(booking)
        await db.commit()

        ctx.userdata["pending_sms"] = {
            "to": customer_phone,
            "message": (
                f"Reservation confirmed: {customer_name}, party of {party_size} on "
                f"{reservation_dt.strftime('%b %d at %I:%M %p')}. See you then!"
            ),
        }

        return (
            f"Reservation confirmed for {customer_name}, party of {party_size} on "
            f"{reservation_dt.strftime('%B %d at %I:%M %p')}. "
            f"Confirmation text sent to {customer_phone}."
        )

    except Exception as e:
        logger.error("make_reservation_error", error=str(e))
        return "I had trouble saving the reservation. Please call back and we'll sort it out."


@function_tool
async def take_message(
    ctx: RunContext,
    caller_name: str,
    caller_phone: str,
    message: str,
    best_time_to_call: str = "anytime",
) -> str:
    """
    Take a message for the business owner to follow up.
    Args:
        caller_name: Name of the caller
        caller_phone: Caller's phone number
        message: The message or reason for calling
        best_time_to_call: When to call back
    """
    ctx.userdata["message"] = {
        "caller_name": caller_name,
        "caller_phone": caller_phone,
        "message": message,
        "best_time": best_time_to_call,
        "received_at": datetime.utcnow().isoformat(),
    }

    return (
        f"Got it! I've passed your message to the team, {caller_name}. "
        f"Someone will call you back at {caller_phone} {best_time_to_call}."
    )


@function_tool
async def answer_faq(
    ctx: RunContext,
    question: str,
) -> str:
    """
    Answer a FAQ question using the business's configured FAQ.
    Args:
        question: The customer's question
    """
    faq: list = ctx.userdata.get("faq", [])

    if not faq:
        return "I don't have that information handy. Can I take your number and have the team follow up?"

    # Simple keyword matching — upgrade to semantic search later
    question_lower = question.lower()
    for item in faq:
        if any(word in question_lower for word in item.get("question", "").lower().split()):
            return item.get("answer", "")

    return "I'm not sure about that specific question. Can I take your number and have someone call you back?"


@function_tool
async def list_services(
    ctx: RunContext,
) -> str:
    """List available services at the business."""
    services: list = ctx.userdata.get("services", [])

    if not services:
        return "We offer a range of services. I can tell you more about what you're looking for."

    service_list = "\n".join(
        f"- {s['name']}: {s.get('duration_min', 60)} min, ${s.get('price', 'varies')}"
        for s in services
    )
    return f"Here are our services:\n{service_list}"


@function_tool
async def schedule_callback(
    ctx: RunContext,
    caller_name: str,
    caller_phone: str,
    preferred_time: str,
    reason: str = "",
) -> str:
    """
    Schedule a callback for a customer.
    Args:
        caller_name: Caller's name
        caller_phone: Callback phone number
        preferred_time: When they'd like to be called
        reason: Brief reason for the callback
    """
    ctx.userdata["callback"] = {
        "name": caller_name,
        "phone": caller_phone,
        "preferred_time": preferred_time,
        "reason": reason,
        "created_at": datetime.utcnow().isoformat(),
    }

    return (
        f"Scheduled! Someone will call you back at {caller_phone} {preferred_time}, {caller_name}. "
        f"We'll have everything ready for your call."
    )


# ── Tool registry ─────────────────────────────────────────────────────────────

ALL_TOOLS = {
    "check_availability": check_availability,
    "book_appointment": book_appointment,
    "cancel_appointment": cancel_appointment,
    "make_reservation": make_reservation,
    "take_message": take_message,
    "answer_faq": answer_faq,
    "list_services": list_services,
    "schedule_callback": schedule_callback,
}


def get_tools_for_template(tool_names: list[str]) -> list:
    """Return tool functions for a given list of tool names."""
    return [ALL_TOOLS[name] for name in tool_names if name in ALL_TOOLS]
