# OpenAI-Only Voice Mode

This document explains the current OpenAI-first refactor state.

## Goal

Make AgentDesk easier to run with minimal configuration by supporting an OpenAI-first provider path.

## Current state

AgentDesk now supports:
- `VOICE_MODE=demo`
- `VOICE_PROVIDER=openai`

This means:
- local onboarding can center around OpenAI
- the runtime no longer assumes Deepgram + Cartesia are always required in non-full mode
- the code now has a provider boundary for future refactors

## Important limitation

This is **not yet a fully verified end-to-end OpenAI-only telephony pipeline**.

Why:
- current transport still assumes LiveKit
- webhook routing still assumes Twilio + LiveKit room creation
- actual STT/TTS runtime behavior for null or OpenAI-only plugin wiring has not been fully runtime-tested here

## What was refactored

- configuration now distinguishes `VOICE_MODE` and `VOICE_PROVIDER`
- provider-specific logic moved behind `backend/agent/provider_factory.py`
- full stack mode still uses Deepgram + Cartesia + Silero
- openai mode avoids hard-coding those providers at agent construction time
- webhook transport is now provider-aware
- in `openai` mode, Twilio and LiveKit webhooks fail gracefully instead of pretending full routing exists

## Recommended use

### For OSS onboarding
Use:

```env
VOICE_MODE=demo
VOICE_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

### For production today
Use:

```env
VOICE_MODE=production
VOICE_PROVIDER=full
```

And configure the full stack:
- OpenAI
- Deepgram
- Cartesia
- LiveKit
- Twilio

## Next real step for true OpenAI-only voice

To fully complete this path, the repo still needs runtime-tested support for one of these:

1. OpenAI Realtime based voice transport integrated with the current call flow
2. OpenAI-native STT/TTS plugins verified inside the LiveKit agent runtime
3. a transport abstraction so Twilio/LiveKit path and OpenAI-native path can coexist cleanly

## Honest summary

This refactor makes the repo structurally ready for an OpenAI-only path.
It does **not** guarantee full phone-call parity yet without runtime verification.
