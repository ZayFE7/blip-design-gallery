# BLIP v2 — verified previews and durable progress

## Canonical source

Use `redesign/calm-chat-v2` in https://github.com/ZayFE7/blip-design-gallery. Main, the original gallery and the user's root `ofsgfj31p3ht.zip` remain untouched.

The ZIP is the exact first app checkpoint: SHA-256 `38e0bfbdd3bd2efa4091b78585838b4273e162bc209ea9ebc5538433c47bc268`, 140 verified entries. Do not restart from screenshots. Tracked changes are under `redesign/app/`; `prepare.py` verifies and restores the baseline plus these overrides into disposable, gitignored `redesign/workspace/`.

## Current completed revision

The app preserves the user's original redesign, while making selected conversations a focused reading canvas. History is a destination; workspace and demo controls are on demand; activity, sources and command output stay closed until requested. Draft text and local attachment metadata persist through navigation/reload, and offline follow-ups are honestly queued in a compact collapsed queue.

The mascot is re-authored with a quietly curious personality, ink-like finish, expressive eyes, 37 coherent lifecycle states, bounded motion, velocity-preserving springs, patient holds, calm failures and recovery, a restrained completion nod, exact pause and meaningful reduced-motion stills. A separate monotonic clock prevents progress arcs jumping at pose-loop boundaries.

Core UI/renderer source revision: `41aa98731a371902e4174decf23875e3cf2bfa89`.

## Fresh verification — 2026-11-03 UTC

The committed renderer was read back and matched the locally tested source hash. The committed packaging and smoke scripts were read back and actually executed.

- Strict TypeScript and production Vite build: passed.
- Committed smoke script: passed all 22 screen/viewport checks and 8 targeted interaction checks, with no runtime exceptions or external requests during the checked route pass.
- Full app HTML opened directly through file://, ran a simulated task, and retained the calm collapsed activity layout.
- Separate mascot HTML opened directly through file://, showed all 37 controls, had visibly changing canvas output, hid unrelated app navigation, and fit a 390px viewport.
- Both file previews made no external network requests in those checks.

These are targeted Chromium smoke checks, not exhaustive security, accessibility or cross-browser certification.

## Separate previews

`export_previews.py` creates:

1. `deliverables/BLIP-App-Preview.html` — complete enhanced frontend.
2. `deliverables/BLIP-Mascot-Animated-States.html` — separate animated mascot studio, using the exact same renderer and controls.

It also includes `MASCOT_PREVIEW.html` in the complete source/build ZIP. File checksums and provenance are in `PREVIEW_MANIFEST.json`. These files need only a current browser, not npm or a server. System reduced-motion preferences remain respected.

## Reproduce from GitHub

```sh
python3 redesign/prepare.py
cd redesign/workspace
npm ci
npm run build
cd ../..
pip install playwright
playwright install chromium
python3 redesign/smoke.py
python3 redesign/package.py --revision YOUR_COMMIT_SHA
python3 redesign/export_previews.py
```

The default packager builds again to avoid exporting stale source. Edit tracked files in app/, not workspace/. Use prepare.py --refresh after committing changes. Export links are temporary conveniences; the immutable baseline, readable overrides and reproducible scripts in GitHub are the durable source.

## Milestones

- [x] Durable branch and exact original app baseline recovered and verified.
- [x] Safe reproducible assembly, strict typecheck and production build.
- [x] Calmer chat, persistent drafts, queues and on-demand panels implemented and checked.
- [x] New 37-state character, interruptions, pause/reduced motion and continuous arcs implemented and checked.
- [x] Fresh committed regression script executed successfully.
- [x] Full app and separate animated mascot HTML previews exported and tested.
- [x] Complete source/build ZIP exported with standalone previews and QA results.

Real agent execution, accounts, OAuth and schedules remain explicitly simulated. Do not commit credentials, real account data, authentication links, local user uploads or node_modules. Save subsequent work and progress updates on this same branch.
