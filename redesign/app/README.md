# BLIP v2 — quietly curious

A calmer, more considered revision of the exact v1 redesign you reviewed. The original app and its visual direction are preserved; this is not a restart.

## Quick preview

In the full exported ZIP, extract the folder and open `OPEN_ME.html`. App code and fonts are inlined; no install, CDN, AI key or real app connection is needed. If file-origin browser storage is restricted, use the served development version for reliable persistence.

## From GitHub — durable source

The immutable original app is the root `ofsgfj31p3ht.zip`. Readable v2 changes live in `redesign/app/`. The preparation script verifies the original SHA-256, restores untouched source and applies tracked overrides.

```sh
python3 redesign/prepare.py
cd redesign/workspace
npm ci
npm run build
npm run dev
```

Edit tracked files under `redesign/app/`, not the disposable workspace. Regenerate after changes with `python3 redesign/prepare.py --refresh`.

## Reproduce checks and the downloadable build

```sh
pip install playwright
playwright install chromium
python3 redesign/smoke.py
python3 redesign/package.py --revision YOUR_COMMIT_SHA
```

The packager produces `redesign/deliverables/BLIP-Quietly-Curious-v2.zip` containing complete assembled source, production output, fonts, setup notes and the standalone preview. Temporary export links are conveniences, not the source of truth. Everything required to reconstruct the revision remains in this branch.

## What changed

- The selected conversation is a readable, bounded canvas, not three competing side panels.
- History is its own destination. Files/plan and demo controls open only on demand.
- Answers appear before diagnostics; activity, sources and command output start closed, including failures.
- Generated outputs use compact file links. Copy/read-aloud actions are quieter.
- Draft text and local attachment metadata persist between conversations and reloads. Queued follow-ups collapse under one count.
- Blip has a softer ink-like finish and a quietly curious personality. Its simple silhouette and expressive eyes remain recognizable.
- 37 purposefully described lifecycle states cover work, waiting, approval, clarification, pause, failure, retry/recovery, partial/full completion and offline status.
- Velocity-preserving springs, patient held expressions, grounded work, a small completion nod, continuous progress arcs and deliberate reduced-motion poses replace distracting arbitrary loops.

## Honest boundaries

This is a local frontend demo. AI/tool runs, connected accounts, OAuth, approvals and schedules are simulated; no real email or command is executed. Browser file previews/downloads, local editing, navigation, settings and supported browser read-aloud are genuine local interactions. Never paste credentials into the demo. Historical v1 reports are not v2 validation; current checks are documented in `docs/QA_REPORT.md`.
