#!/bin/bash

# ============================================================================
# Healthcare Voice Agent - Backend Setup Script
# ============================================================================
# This script sets up and starts the backend server with all dependencies.
# Usage: ./setup.sh [options]
#   --dev     Start in development mode (default)
#   --prod    Start in production mode
#   --reset   Reset all data (removes volumes)
#   --build   Rebuild containers
#   --logs    Show logs after starting
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Default options
MODE="dev"
RESET=false
BUILD=false
SHOW_LOGS=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --prod)
            MODE="prod"
            shift
            ;;
        --dev)
            MODE="dev"
            shift
            ;;
        --reset)
            RESET=true
            shift
            ;;
        --build)
            BUILD=true
            shift
            ;;
        --logs)
            SHOW_LOGS=true
            shift
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# ============================================================================
# Helper Functions
# ============================================================================

print_header() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}  🏥 ${GREEN}Healthcare Voice Agent - Backend Setup${NC}                     ${BLUE}║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_step() {
    echo -e "${YELLOW}➤${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 is not installed. Please install it first."
        exit 1
    fi
}

# ============================================================================
# Pre-flight Checks
# ============================================================================

print_header

print_step "Checking dependencies..."

check_command docker
check_command docker-compose || check_command "docker compose"
print_success "Docker is installed"

# Check if Docker is running
if ! docker info &> /dev/null; then
    print_error "Docker is not running. Please start Docker Desktop."
    exit 1
fi
print_success "Docker is running"

# ============================================================================
# Environment Setup
# ============================================================================

print_step "Setting up environment..."

if [ ! -f ".env" ]; then
    if [ -f "env.template" ]; then
        cp env.template .env
        print_info "Created .env from env.template"
        print_info "${YELLOW}⚠️  Please edit .env and add your API keys!${NC}"
    else
        print_error "No env.template found. Creating minimal .env..."
        cat > .env << 'EOF'
# Healthcare Voice Agent - Environment Configuration

# LiveKit Configuration
LIVEKIT_URL=ws://localhost:7880
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret

# AI Service API Keys (REQUIRED - add your keys)
OPENAI_API_KEY=sk-your-openai-api-key
DEEPGRAM_API_KEY=your-deepgram-api-key
CARTESIA_API_KEY=your-cartesia-api-key

# Backend Configuration
BACKEND_URL=http://localhost:8000
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/healthcare_voice_agent
REDIS_URL=redis://localhost:6379/0

# Security
JWT_SECRET_KEY=dev-secret-key-change-in-production
ENCRYPTION_KEY=dev-encryption-key-change-in-production

# Agent Configuration
DEEPGRAM_MODEL=nova-2
AGENT_LANGUAGE=en
OPENAI_MODEL=gpt-4o-mini
LLM_TEMPERATURE=0.3
CARTESIA_VOICE_ID=248be419-c632-4f23-adf1-5324ed7dbf1d
EOF
        print_success "Created minimal .env file"
    fi
else
    print_success ".env file exists"
fi

# ============================================================================
# Docker Cleanup (if reset requested)
# ============================================================================

if [ "$RESET" = true ]; then
    print_step "Resetting all data..."
    docker compose down -v --remove-orphans 2>/dev/null || true
    print_success "Removed all containers and volumes"
fi

# ============================================================================
# Start Services
# ============================================================================

print_step "Starting Docker services..."

# Stop any existing containers
docker compose down 2>/dev/null || true

# Remove orphan containers
if [ "$BUILD" = true ]; then
    print_info "Rebuilding containers..."
    docker compose up -d --build --remove-orphans
else
    docker compose up -d --remove-orphans
fi

print_success "Docker services started"

# ============================================================================
# Wait for Services
# ============================================================================

print_step "Waiting for services to be ready..."

# Wait for PostgreSQL
echo -n "  Waiting for PostgreSQL..."
for i in {1..30}; do
    if docker exec healthcare_postgres pg_isready -U postgres &>/dev/null; then
        echo -e " ${GREEN}Ready${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

# Wait for Redis
echo -n "  Waiting for Redis..."
for i in {1..30}; do
    if docker exec healthcare_redis redis-cli ping &>/dev/null; then
        echo -e " ${GREEN}Ready${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

# Wait for LiveKit
echo -n "  Waiting for LiveKit..."
for i in {1..30}; do
    if curl -s http://localhost:7880 &>/dev/null; then
        echo -e " ${GREEN}Ready${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

# Wait for API
echo -n "  Waiting for API..."
for i in {1..60}; do
    if curl -s http://localhost:8000/health &>/dev/null || curl -s http://localhost:8000/docs &>/dev/null; then
        echo -e " ${GREEN}Ready${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

# ============================================================================
# Status Report
# ============================================================================

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}  ✅ ${GREEN}Backend is running!${NC}                                        ${GREEN}║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BLUE}Services:${NC}"
echo -e "    • API Server:    ${GREEN}http://localhost:8000${NC}"
echo -e "    • API Docs:      ${GREEN}http://localhost:8000/docs${NC}"
echo -e "    • LiveKit:       ${GREEN}http://localhost:7880${NC}"
echo -e "    • PostgreSQL:    ${GREEN}localhost:5432${NC}"
echo -e "    • Redis:         ${GREEN}localhost:6379${NC}"
echo ""
echo -e "  ${BLUE}Useful Commands:${NC}"
echo -e "    • View logs:     ${YELLOW}docker compose logs -f${NC}"
echo -e "    • Stop services: ${YELLOW}docker compose down${NC}"
echo -e "    • Restart:       ${YELLOW}docker compose restart${NC}"
echo -e "    • Run agent:     ${YELLOW}python run_agent.py dev${NC}"
echo ""

# Show logs if requested
if [ "$SHOW_LOGS" = true ]; then
    print_step "Showing logs (Ctrl+C to exit)..."
    docker compose logs -f
fi
