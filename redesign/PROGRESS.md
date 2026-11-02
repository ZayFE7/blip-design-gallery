# BLIP v2 — durable progress

Updated: 2026-11-02 UTC

## Source of truth

Work only on `redesign/calm-chat-v2` in https://github.com/ZayFE7/blip-design-gallery. Preserve `main`, the original reference gallery and the uploaded baseline ZIP.

The root `ofsgfj31p3ht.zip` is the exact original delivered app, verified against SHA-256 `38e0bfbdd3bd2efa4091b78585838b4273e162bc209ea9ebc5538433c47bc268`. All 140 entries passed integrity checks. See `BASELINE.json`. Do not restart from screenshots or ask the user to upload the same baseline again.

## Reproducible working source

Untouched files remain in the immutable ZIP. Readable v2 source changes are tracked under `redesign/app/`. `python3 redesign/prepare.py` verifies the ZIP and restores the complete source into the disposable, gitignored `redesign/workspace/`, then applies the tracked overrides. This preserves the original checkpoint without duplicating binary outputs or relying on an ephemeral sandbox. Edit app/, not workspace/. Keep code and progress checkpoints together.

## Current checkpoint: C2 source draft — validation pending

Committed the first conversation-focused revision:

- Conversation history is a destination rather than a permanently open second sidebar.
- The selected thread gets a full reading canvas with a bounded, readable transcript.
- Files and plan open in an explicit workspace sheet; no context rail opens by default.
- The six demo states moved into Conversation options.
- Agent answers appear before diagnostics. Tool activity and individual command/output details stay closed, including failures and running states.
- Source lists are collapsed; generated outputs use compact file links.
- Read/copy utilities no longer form a repeated toolbar under every reply.
- New replies do not force a reader away from older messages; a jump-to-new-reply control is available.
- Conversation cleanup marks linked goals/routines as needing repair and retains Library files.

This is a saved source draft, not a verified release. The new mascot runtime/catalog and its integration are the next checkpoint, followed by fresh compile/browser checks. The preparation script deliberately retires the old renderer files; it must be used after the new runtime overrides are present.

## Personality and remaining work

Personality: **quietly curious** — warm, observant and capable, never a noisy dashboard. Preserve a simple ink-like silhouette and expressive white eyes. Re-author confusing motions rather than smoothing them unchanged. Working, waiting, approval, clarification, interruption, failure, recovery and completion need coherent behavior.

- [x] C0: durable project instructions and branch.
- [x] C1a: retrieve and verify the exact original ZIP.
- [x] Save reproducible preparation workflow and tracked chat source overrides.
- [ ] C1b: freshly install, compile and run the assembled revision.
- [ ] C2: validate all calm-chat states and queued/blocked/error flows.
- [ ] C3: commit a coherent new mascot renderer, state catalog, and motion studio.
- [ ] C4: app-wide refinement and desktop/mobile/keyboard/reduced-motion checks.
- [ ] C5: verified source checkpoint and rebuilt downloadable ZIP/standalone preview.

## Resume

Read this file and the current branch HEAD. Use the checked-in archive plus tracked app overrides, not a new reconstruction. Complete the new mascot integration before preparing the current draft. Run fresh tests; historical v1 QA reports are not proof of v2 correctness. Record actual results, known issues and commit links. Do not commit credentials, real account data, local uploads or node_modules. Mock activity must stay visibly identified as simulated.
