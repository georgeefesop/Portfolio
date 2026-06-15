---
gbrain: v1
project: ge-portfolio
doc_type: adr
tier: 2
title: ADR 0001 - Record architecture decisions
summary: We use lightweight Nygard-format ADRs for one-way architectural decisions in this repo.
tags: [adr, process]
data_sources: []
canonical_paths:
  - docs/adr/
updated: 2026-06-15
---

# ADR 0001 - Record architecture decisions

- Status: Accepted
- Date: 2026-06-15

## Context

ge-portfolio is a single repo that absorbs decisions from several disjoint products (the public portfolio, three Stripe-funded sub-apps, a Kingfisher CMS-backed microsite, and a private billing admin). One-way decisions (account boundaries, schema homes, host routing) are easy to lose track of when a future agent or a future George revisits the repo cold.

## Decision

Capture each one-way architectural decision as a short ADR in `docs/adr/NNNN-<slug>.md` using the Nygard template: Context, Decision, Status, Consequences. Number monotonically. Status is one of `Proposed`, `Accepted`, `Superseded by NNNN`, `Deprecated`.

ADRs cover decisions that are expensive to reverse: account boundaries, persistence homes, routing topology, payment routing, public/private surface separation. They do NOT cover style preferences, copy choices, or anything captured per-commit in the changelog.

## Consequences

- Future agents have one place to look for "why is this structured this way".
- George avoids re-litigating one-way doors in random sessions.
- ADRs are append-only: superseding a decision means a new ADR that references the old one, not editing the old one in place.
