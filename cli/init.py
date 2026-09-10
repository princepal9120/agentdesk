#!/usr/bin/env python3
"""
AgentDesk CLI — Interactive Setup Wizard

Usage:
    python -m cli.init

Or after pip install:
    agentdesk init
    agentdesk status
    agentdesk logs
"""

import os
import sys
import json
import time
import shutil
import sqlite3
import subprocess
from pathlib import Path
from textwrap import dedent

# ── ANSI Colors ───────────────────────────────────────────────────────────────
R = "\033[0m"
BOLD = "\033[1m"
DIM = "\033[2m"
PURPLE = "\033[35m"
CYAN = "\033[36m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
RED = "\033[31m"
WHITE = "\033[97m"


def c(text, color):
    return f"{color}{text}{R}"


def banner():
    print(f"""
{PURPLE}╔══════════════════════════════════════════════════════════════╗
║           ☎  AgentDesk — AI Voice Agent Setup              ║
║        Deploy a custom AI receptionist in 5 minutes        ║
╚══════════════════════════════════════════════════════════════╝{R}
""")


def step(n, text):
    print(f"\n{PURPLE}[{n}]{R} {BOLD}{text}{R}")


def ok(text):
    print(f"  {GREEN}✓{R} {text}")


def warn(text):
    print(f"  {YELLOW}⚠{R}  {text}")


def err(text):
    print(f"  {RED}✗{R} {text}")


def ask(prompt, default=None, choices=None):
    """Interactive prompt with optional default and choices."""
    hint = ""
    if choices:
        hint = f" [{'/'.join(choices)}]"
    if default:
        hint += f" (default: {c(default, CYAN)})"
    raw = input(f"  {CYAN}?{R} {prompt}{hint}: ").strip()
    if not raw and default:
        return default
    if choices and raw not in choices:
        warn(f"Invalid choice. Pick one of: {', '.join(choices)}")
        return ask(prompt, default, choices)
    return raw


# ── Template Presets ──────────────────────────────────────────────────────────

TEMPLATES = {
    "restaurant": {
        "label": "Restaurant / Café",
        "agent_name": "Bella",
        "system_prompt": dedent("""
            You are {agent_name}, the friendly AI receptionist at {business_name}.
            Your primary jobs are:
            1. Take table reservations (ask for: name, party size, date, time, phone number)
            2. Answer questions about the menu, hours, location, and specials
            3. Handle takeout/delivery inquiries

            Always be warm, efficient, and professional.
            Confirm all reservation details clearly before ending the call.
            If you cannot handle a request, offer to transfer to a human.
        """).strip(),
        "tools": ["book_table", "check_availability", "get_menu_info"],
        "dashboard_labels": {"calls": "Reservations", "bookings": "Table Bookings"},
    },
    "dental": {
        "label": "Dental Clinic",
        "agent_name": "Aria",
        "system_prompt": dedent("""
            You are {agent_name}, the virtual receptionist at {business_name} dental clinic.
            Your primary jobs are:
            1. Schedule new patient appointments and follow-ups
            2. Answer questions about dental services, pricing, and insurance
            3. Handle appointment cancellations and rescheduling
            4. Remind patients of upcoming appointments

            Always verify patient name and date of birth for existing patients.
            For emergencies, provide the emergency line and nearest urgent care.
        """).strip(),
        "tools": ["book_appointment", "check_schedule", "get_service_info"],
        "dashboard_labels": {"calls": "Appointment Calls", "bookings": "Appointments"},
    },
    "real-estate": {
        "label": "Real Estate Agency",
        "agent_name": "Max",
        "system_prompt": dedent("""
            You are {agent_name}, the virtual assistant for {business_name} real estate.
            Your primary jobs are:
            1. Qualify potential buyers and sellers (budget, timeline, requirements)
            2. Schedule property viewings and open houses
            3. Answer questions about listings, neighborhoods, and the buying/selling process
            4. Connect serious leads with available agents

            Always capture: name, phone, email, buy/sell intent, timeline, and budget range.
        """).strip(),
        "tools": ["schedule_viewing", "get_listing_info", "qualify_lead"],
        "dashboard_labels": {"calls": "Lead Calls", "bookings": "Viewings"},
    },
    "hr": {
        "label": "HR / Recruitment Screening",
        "agent_name": "Sam",
        "system_prompt": dedent("""
            You are {agent_name}, an AI HR screening agent for {business_name}.
            Your job is to conduct initial phone screenings for job applicants.
            Ask the following questions and record answers:
            1. Confirm the role they applied for
            2. Years of relevant experience
            3. Current location and willingness to relocate/commute
            4. Salary expectations
            5. Earliest available start date
            6. One behavioral question relevant to the role

            Be professional and encouraging. End with next steps timeline.
        """).strip(),
        "tools": ["save_screening_response", "get_role_requirements"],
        "dashboard_labels": {"calls": "Screening Calls", "bookings": "Interviews"},
    },
    "ecommerce": {
        "label": "E-commerce / Online Store",
        "agent_name": "Nova",
        "system_prompt": dedent("""
            You are {agent_name}, the customer support agent for {business_name}.
            Your primary jobs are:
            1. Track order status (ask for order number or email)
            2. Handle return and refund requests
            3. Answer product questions
            4. Resolve shipping issues

            Always look up order details before responding to order-related questions.
            For refunds over $100, flag for human review.
        """).strip(),
        "tools": ["track_order", "create_return_request", "get_product_info"],
        "dashboard_labels": {"calls": "Support Calls", "bookings": "Returns"},
    },
    "custom": {
        "label": "Custom (I'll configure manually)",
        "agent_name": "Alex",
        "system_prompt": dedent("""
            You are {agent_name}, the AI assistant for {business_name}.
            Help callers with their inquiries professionally and efficiently.
            Always be friendly and offer to transfer to a human if needed.
        """).strip(),
        "tools": [],
        "dashboard_labels": {"calls": "Calls", "bookings": "Bookings"},
    },
}


# ── Website Scraper ───────────────────────────────────────────────────────────

def scrape_website(url: str) -> str:
    """Scrape basic text content from a business website."""
    try:
        import urllib.request
        import html.parser

        class TextExtractor(html.parser.HTMLParser):
            def __init__(self):
                super().__init__()
                self.text_parts = []
                self._skip = False

            def handle_starttag(self, tag, attrs):
                if tag in ("script", "style", "nav", "footer"):
                    self._skip = True

            def handle_endtag(self, tag):
                if tag in ("script", "style", "nav", "footer"):
                    self._skip = False

            def handle_data(self, data):
                if not self._skip:
                    stripped = data.strip()
                    if stripped and len(stripped) > 3:
                        self.text_parts.append(stripped)

        req = urllib.request.Request(url, headers={"User-Agent": "AgentDesk/1.0"})
        with urllib.request.urlopen(req, timeout=10) as response:
            html_content = response.read().decode("utf-8", errors="ignore")

        parser = TextExtractor()
        parser.feed(html_content)
        text = " ".join(parser.text_parts)
        # Truncate to 2000 chars for prompt context
        return text[:2000].strip()
    except Exception as e:
        return ""


# ── Config Writer ─────────────────────────────────────────────────────────────

def write_env(config: dict, env_path: Path):
    """Write or update .env file with new config values."""
    lines = []
    if env_path.exists():
        existing = {
            k: v
            for line in env_path.read_text().splitlines()
            if "=" in line and not line.startswith("#")
            for k, v in [line.split("=", 1)]
        }
    else:
        existing = {}

    existing.update(config)

    # Write back
    with open(env_path, "w") as f:
        f.write("# AgentDesk — Generated by agentdesk init\n")
        for k, v in existing.items():
            f.write(f"{k}={v}\n")


def write_sqlite_config(db_path: Path, config: dict):
    """Write agent config to SQLite config table."""
    conn = sqlite3.connect(str(db_path))
    conn.execute("""
        CREATE TABLE IF NOT EXISTS setup_config (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at TEXT DEFAULT (datetime('now'))
        )
    """)
    for k, v in config.items():
        conn.execute(
            "INSERT OR REPLACE INTO setup_config (key, value) VALUES (?, ?)",
            (k, json.dumps(v) if isinstance(v, (dict, list)) else str(v)),
        )
    conn.commit()
    conn.close()


# ── Cloudflare Tunnel ─────────────────────────────────────────────────────────

def start_tunnel(port: int = 8000) -> str:
    """Start cloudflared tunnel and return public URL."""
    if not shutil.which("cloudflared"):
        warn("cloudflared not found. Install from https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/")
        warn("Skipping tunnel setup — configure Twilio webhook manually.")
        return ""

    try:
        proc = subprocess.Popen(
            ["cloudflared", "tunnel", "--url", f"http://localhost:{port}"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        # Give cloudflared a moment to start and print the URL
        time.sleep(3)
        for line in proc.stderr:
            if "trycloudflare.com" in line or ".cfargotunnel.com" in line:
                url = line.strip().split()[-1]
                return url
        return ""
    except Exception as e:
        warn(f"Could not start tunnel: {e}")
        return ""


# ── Main Init Wizard ──────────────────────────────────────────────────────────

def init():
    banner()

    # Detect project root
    root = Path.cwd()
    backend_env = root / "backend" / ".env"
    db_path = root / "agentdesk.db"

    print(f"{DIM}Project root: {root}{R}\n")

    # ── Step 1: Industry / Template ───────────────────────────────────────────
    step(1, "Choose your use case")
    print()
    for i, (key, tmpl) in enumerate(TEMPLATES.items(), 1):
        print(f"    {c(str(i), CYAN)}. {tmpl['label']:30s}  {DIM}({key}){R}")
    print()

    template_keys = list(TEMPLATES.keys())
    tmpl_input = ask(
        "Pick a number or type the template name",
        default="1",
    )
    if tmpl_input.isdigit():
        idx = int(tmpl_input) - 1
        if 0 <= idx < len(template_keys):
            template_key = template_keys[idx]
        else:
            template_key = "custom"
    else:
        template_key = tmpl_input if tmpl_input in TEMPLATES else "custom"

    template = TEMPLATES[template_key]
    ok(f"Template selected: {c(template['label'], GREEN)}")

    # ── Step 2: Business Info ─────────────────────────────────────────────────
    step(2, "Business details")
    business_name = ask("Business name", default="My Business")
    agent_name = ask("AI agent name", default=template["agent_name"])

    # ── Step 3: Website scrape ────────────────────────────────────────────────
    step(3, "Knowledge base (optional)")
    website_url = ask("Business website URL (press Enter to skip)", default="")

    kb_text = ""
    if website_url:
        print(f"  {DIM}Scraping {website_url}...{R}", end="", flush=True)
        kb_text = scrape_website(website_url)
        if kb_text:
            print(f" {GREEN}✓ {len(kb_text)} chars scraped{R}")
        else:
            print(f" {YELLOW}⚠ Could not scrape (site may block bots){R}")

    # ── Step 4: OpenAI API Key ────────────────────────────────────────────────
    step(4, "API Keys")
    existing_key = os.environ.get("OPENAI_API_KEY", "")
    if existing_key:
        ok(f"OPENAI_API_KEY already set in environment")
        openai_key = existing_key
    else:
        openai_key = ask("OpenAI API key (sk-...)", default="")
        if not openai_key:
            warn("No OpenAI key provided. Agent will fail to respond. Set OPENAI_API_KEY later.")

    # Twilio (optional)
    twilio_sid = ask("Twilio Account SID (Enter to skip)", default="")
    twilio_token = ask("Twilio Auth Token (Enter to skip)", default="") if twilio_sid else ""
    twilio_phone = ask("Twilio Phone Number e.g. +15551234567 (Enter to skip)", default="") if twilio_sid else ""

    # ── Step 5: Generate system prompt ───────────────────────────────────────
    step(5, "Generating agent configuration")

    system_prompt = template["system_prompt"].format(
        agent_name=agent_name,
        business_name=business_name,
    )

    if kb_text:
        system_prompt += f"\n\n## Business Knowledge Base\n{kb_text}"

    ok("System prompt generated")

    # ── Write .env ────────────────────────────────────────────────────────────
    env_config = {
        "APP_ENV": "development",
        "VOICE_MODE": "demo",
        "VOICE_PROVIDER": "openai",
        "APP_SECRET_KEY": os.urandom(16).hex(),
        "DEV_AGENCY_NAME": business_name,
    }
    if openai_key:
        env_config["OPENAI_API_KEY"] = openai_key
    if twilio_sid:
        env_config["TWILIO_ACCOUNT_SID"] = twilio_sid
        env_config["TWILIO_AUTH_TOKEN"] = twilio_token
        env_config["TWILIO_PHONE_NUMBER"] = twilio_phone

    write_env(env_config, backend_env)
    ok(f"Config written to {backend_env}")

    # ── Write SQLite config ───────────────────────────────────────────────────
    sqlite_config = {
        "template": template_key,
        "business_name": business_name,
        "agent_name": agent_name,
        "system_prompt": system_prompt,
        "website_url": website_url,
        "tools": template["tools"],
        "dashboard_labels": template["dashboard_labels"],
    }
    write_sqlite_config(db_path, sqlite_config)
    ok(f"Agent config saved to {db_path.name}")

    # ── Tunnel ────────────────────────────────────────────────────────────────
    if twilio_sid:
        step(6, "Starting public tunnel for Twilio webhooks")
        tunnel_url = start_tunnel()
        if tunnel_url:
            ok(f"Tunnel active: {c(tunnel_url, CYAN)}")
            webhook_url = f"{tunnel_url}/webhooks/twilio/voice"
            ok(f"Twilio webhook URL: {c(webhook_url, CYAN)}")
            warn("Set this URL in Twilio console → Phone Numbers → Configure → Voice webhook")
        else:
            warn("Manual step: point your Twilio webhook to http://your-server:8000/webhooks/twilio/voice")

    # ── Done ──────────────────────────────────────────────────────────────────
    print(f"""
{GREEN}{'═' * 62}
  ✓ AgentDesk setup complete!
{'═' * 62}{R}

  {BOLD}Next steps:{R}

  {CYAN}1.{R} Start the backend:
     {DIM}cd backend && uvicorn app.main:app --reload{R}

  {CYAN}2.{R} Start the frontend:
     {DIM}cd frontend && npm run dev{R}

  {CYAN}3.{R} Open the dashboard:
     {DIM}http://localhost:3000{R}

  {CYAN}4.{R} Test your agent:
     {DIM}http://localhost:8000/docs{R}

  {BOLD}Or run everything with Docker:{R}
     {DIM}docker compose up{R}

  Agent "{c(agent_name, PURPLE)}" is configured for {c(business_name, PURPLE)}.
  Template: {c(template['label'], CYAN)}

""")


if __name__ == "__main__":
    init()
