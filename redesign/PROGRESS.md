# BLIP v2 — durable progress

## Canonical source

Branch: `redesign/calm-chat-v2` in https://github.com/ZayFE7/blip-design-gallery. Preserve main, the reference gallery and the user-uploaded root `ofsgfj31p3ht.zip`.

The archive is the exact original delivered app: SHA-256 `38e0bfbdd3bd2efa4091b78585838b4273e162bc209ea9ebc5538433c47bc268`, 140 verified entries. Do not restart from screenshots. `BASELINE.json` records provenance.

Tracked changes live under `redesign/app/`. `python3 redesign/prepare.py` verifies and restores the immutable baseline, conditionally retires the old mascot renderer only when its replacement is complete, applies state/phase mappings and tracked overrides, and creates gitignored `redesign/workspace/`. Edit app/, not workspace/.

## Current verified state

Fresh strict TypeScript and production Vite builds pass. All 11 routes pass fresh Chromium checks at 1440x1000 and 390x844 without runtime exceptions, crash views, horizontal overflow or external requests in the checked route pass.

The calmer conversation flow is implemented and checked: history is a destination; selected threads have a bounded reading canvas; workspace/context and demo options open on demand; answers precede collapsed tool activity and sources; output links and utility controls are quieter. Draft text and local attachment metadata persist through navigation/reload, and offline follow-ups are honestly queued under a collapsed count.

The quietly curious mascot is implemented and checked: simple ink-like silhouette, expressive white eyes, 37 intentional lifecycle states, bounded movement, velocity-preserving transitions, patient waiting states, calm failure/recovery, a restrained completion nod, and actual pause/reduced-motion stillness. All 37 states and rapid recovery interruptions render without exceptions.

A final motion defect was found and fixed: progress arcs used wrapping facial-pose time and jumped at each cycle. A separate monotonic clock now keeps arcs continuous while retaining pause/reduced-motion behavior. An instrumented browser check crossed the cycle boundary and observed no backward angle step.

## Reproducible verification and export

- Build: `cd redesign/workspace && npm ci && npm run build`.
- Browser checks: install Python Playwright/Chromium, then `python3 redesign/smoke.py`.
- Export: `python3 redesign/package.py --revision YOUR_COMMIT_SHA`.
- The exporter builds the app and creates complete source plus an offline `OPEN_ME.html` in `redesign/deliverables/BLIP-Quietly-Curious-v2.zip`.

This commit saves the verified motion source and reusable scripts. The scripts themselves and final package still require a clean read-back execution before the export milestone is marked complete. Older interrupted-draft wording in historical repair notes is superseded by this file and current `app/docs/QA_REPORT.md`.

## Milestones

- [x] Durable branch, recovery metadata and exact original app checkpoint.
- [x] Safe reproducible assembly, strict typecheck and production build.
- [x] Calmer chat and fresh draft/queue/on-demand-panel checks.
- [x] New 37-state character, interruptions, exact pause and reduced motion checks.
- [x] Fresh 22-route/viewport pass and continuous progress-arc regression check.
- [ ] Read back and execute the committed smoke/export scripts, verify the standalone artifact, and deliver the new ZIP.

Only targeted Chromium smoke coverage is claimed, not exhaustive regression/security/accessibility certification. Real agent/backend integration remains out of scope for this local demo. Do not commit credentials, local user data, authentication links or node_modules. Main and the original gallery remain unchanged.
