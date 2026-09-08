# AgentDesk — local OSS quickstart
# Zero-key by default. Voice is one flag + one key.

COMPOSE = docker compose

.PHONY: setup up voice down logs ps clean

## setup: copy env templates if missing (non-destructive). No keys required to boot.
setup:
	@if [ ! -f backend/.env ]; then cp backend/.env.example backend/.env && echo "Created backend/.env (edit to add a voice key later)"; else echo "backend/.env already exists — left untouched"; fi
	@if [ ! -f frontend/.env ]; then cp frontend/.env.example frontend/.env && echo "Created frontend/.env"; else echo "frontend/.env already exists — left untouched"; fi

## up: boot API + dashboard (no keys, no env file needed). Dashboard at http://localhost:3000
up:
	$(COMPOSE) up --build

## voice: boot API + dashboard + the voice worker. Requires a key in backend/.env.
voice: setup
	$(COMPOSE) --profile voice up --build

## down: stop everything
down:
	$(COMPOSE) down

## logs: follow logs
logs:
	$(COMPOSE) logs -f

## ps: show running services
ps:
	$(COMPOSE) ps

## clean: stop and wipe the local SQLite volume
clean:
	$(COMPOSE) down -v
