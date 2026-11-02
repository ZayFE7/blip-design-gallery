# BLIP redesign — durable progress

Updated: 2026-11-02 (UTC)

## Source of truth

- Repository: https://github.com/ZayFE7/blip-design-gallery
- Working branch: `redesign/calm-chat-v2`
- Intended tracked application directory: `redesign/app/`
- Reference-gallery base: `main` at `ba72bb60ced20cbd744e9ffbd3f2f1095b96c6b1`.
- Preserve `main`, the reference gallery, and the user's uploaded baseline ZIP.

## Current status — C1a: exact original deliverable recovered

**The user uploaded the original delivered redesign ZIP to this branch. It is available and verified. Do not restart from scratch.**

- Archive: [`ofsgfj31p3ht.zip`](../ofsgfj31p3ht.zip), at the repository root on this branch.
- Upload commit: [`4c75772273106d8483f42133634b7937a618db0e`](https://github.com/ZayFE7/blip-design-gallery/commit/4c75772273106d8483f42133634b7937a618db0e).
- Size: 3,963,028 bytes.
- SHA-256: `38e0bfbdd3bd2efa4091b78585838b4273e162bc209ea9ebc5538433c47bc268`.
- This matches the SHA-256 recorded when the original deliverable was created: **byte-for-byte identity confirmed**.
- ZIP integrity/CRC check passed; all 140 entries were safely extracted.
- Archive root: `BLIP-Reimagined/`.
- App source, package/lock files, `OPEN_ME.html`, production build, screenshots, and documentation are intact.
- Machine-readable provenance: [BASELINE.json](./BASELINE.json).

The earlier temporary download link expired, but that is no longer a blocker. The user's GitHub upload is the first complete application checkpoint. The extracted source has been inspected locally; ordinary extracted source files have not yet been committed under `redesign/app/`.

## Confirmed causes of chat overload in the actual delivered source

- `components/chat/ThreadView.tsx` initializes `railVisible` to `true`, exposing a 300px context panel by default on wide screens.
- The same component permanently displays a six-option demo-state toolbar above the transcript.
- `components/chat/EventTimeline.tsx` opens activity automatically for live work and failures, and automatically expands failed-event diagnostics.
- `components/chat/MessageItem.tsx` puts events before the answer and repeatedly exposes source lists, result badges, artifact cards, approval cards, and text action buttons.

These are findings from the recovered delivered source, not guesses based on screenshots.

## User feedback and approved direction

- Preserve the existing app and the visual direction the user liked. Revise it, do not replace it with an unrelated rebuild.
- Make conversation the default focus: one compact live status, execution/tool details collapsed by default, plan/files/context on demand.
- Move demo controls out of the primary reading path. Prefer contextual menus, quieter actions, and meaningful progressive disclosure.
- Refine spacing, hierarchy, navigation, and density across the whole app.
- Re-evaluate mascot animation semantics, not only interpolation quality. Creatively refine the character while preserving simplicity and recognizable expressive eyes.
- Cover rest, listening, planning, research, tool work, verification, queue/wait, approval, clarification, pause, interruption, failure, recovery, partial/full completion, and offline states.
- Preserve motion continuity during interruptions, settle naturally, and design useful reduced-motion/static presentations. Avoid arbitrary repeated hopping or busy ornament.
- Save actual working source and progress milestones to this branch as the work proceeds.

## Milestones

- [x] C0 — branch created; project brief, recovery status, and resumption instructions saved.
- [x] C1a — retrieve the user's uploaded original ZIP from GitHub; verify exact original SHA-256, integrity, and source presence.
- [ ] C1b — establish the tracked extracted source under `redesign/app/` and freshly verify the baseline setup/build.
- [ ] C2 — implement calmer conversation-first chat and inspect ready/running/approval/error/offline/empty states.
- [ ] C3 — improve mascot styling, lifecycle semantics, and continuous motion.
- [ ] C4 — refine the wider app and verify desktop/mobile, dialogs, keyboard behavior, and reduced motion.
- [ ] C5 — commit final source, setup instructions, current test results, and a versioned downloadable build.

## Current verification

The archive hash, CRC integrity, safe extraction, source presence, and chat source findings are verified. A fresh compile/browser pass on the recovered or revised app has not yet been run in the current workspace. Historical test reports inside the ZIP are baseline records, not proof that future edits pass.

## Resume checklist

1. Read this file and inspect the current working branch HEAD.
2. Fetch the existing root `ofsgfj31p3ht.zip` from GitHub, verify the SHA-256 in `BASELINE.json`, and extract `BLIP-Reimagined/` if no checked-out app workspace is present.
3. Continue from those actual source files. Do not reconstruct from the gallery or ask the user to upload the same ZIP again while it is available here.
4. Preserve the immutable ZIP; save ordinary source modifications under `redesign/app/` and update this document alongside each bounded milestone.
5. Run fresh checks and report what was actually changed and verified, with commit links.

## Boundaries

The app is a frontend demo. Real autonomous execution, account access, OAuth, server-side approval enforcement, and model calls require the actual agent backend. Never present mock execution or demo connections as real integration activity. Do not commit credentials, authentication links, local user data, or `node_modules`.
