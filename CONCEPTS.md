# Concepts

Shared domain vocabulary for this project — entities, named processes, and status concepts with project-specific meaning. Seeded with core domain vocabulary, then accretes as ce-compound and ce-compound-refresh process learnings; direct edits are fine. Glossary only, not a spec or catch-all.

## Telephony

### Telephony Provider
A carrier or telephony platform that supplies PSTN number ownership, call origination, termination, and provider-level call status.

The telephony provider is distinct from the realtime agent platform: a provider such as Exotel or Twilio can carry the phone call while LiveKit hosts the agent room and media session.

### ExoPhone
An Exotel-assigned and verified phone number used as the caller identity or inbound destination for an Exotel workspace.

An ExoPhone is not a personal SIM transparently attached to application code; its ownership, verification, and trial lifecycle remain with Exotel.

### SIP Trunk
A managed signaling and media connection that links a PSTN telephony provider to the realtime agent platform.

The trunk is the boundary used when a phone call must enter or leave an agent room while the carrier remains responsible for PSTN access.

### Provider Call ID
The carrier-issued identifier that lets a local call record correlate asynchronous provider callbacks with the originating phone call.

The identifier is provider-neutral at the domain boundary even though its format and name are provider-specific at the carrier API boundary.
