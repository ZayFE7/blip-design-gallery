# BLIP redesign — durable progress

Updated: 2026-11-02 (UTC)

## Source of truth

- Repository: https://github.com/ZayFE7/blip-design-gallery
- Working branch: `redesign/calm-chat-v2`
- Application source location: `redesign/app/`
- Base: `main` at `ba72bb60ced20cbd744e9ffbd3f2f1095b96c6b1`.
- The reference gallery and `main` must remain unchanged by this work.

## Current status — C0: recovery and revision checkpoint

This checkpoint saves the project brief and recovery status. **It does not contain the rebuilt application source yet.**

The previously delivered `BLIP-Reimagined.zip` was not committed to GitHub. Its temporary download link returned HTTP 404 when recovery was attempted, and the previous local build workspace is no longer available. Do not describe that exact delivered build as recovered unless its actual source is obtained and verified. Any reconstruction from the earlier generated design must be labeled as such.

The original repository currently contains a reference gallery: 31 screenshots, a manifest, a mascot keyframe sheet, and the original 20-state animation lab. Those materials remain available in the repository.

## User feedback and approved direction

- The overall visual design was well received, but the conversation screen is too stacked and visually overwhelming.
- Make conversation the default focus. Show one compact live status, collapse execution/tool details by default, and expose plan/files/context only on demand.
- Improve spacing, hierarchy, navigation, and progressive disclosure across the entire application, not only chat.
- Re-evaluate mascot movements individually. Smoothing semantically confusing animation is not enough.
- The mascot may evolve creatively, but preserve its simplicity and recognizable personality. Favor a simple silhouette and expressive eyes over unnecessary decoration.
- Provide coherent states for the agent lifecycle: rest, listening, planning, research, tool work, verification, waiting, approval, clarification, pause, interruption, failure, recovery, completion, and offline operation.
- Motion should communicate intent, preserve continuity when interrupted, settle naturally, and provide useful reduced-motion/static presentations.
- Save real source and progress checkpoints to this GitHub branch as work proceeds; do not rely on temporary ZIP links or a particular sandbox remaining alive.

## Milestones

- [x] Inspect current repository and confirm only the original `main` branch exists.
- [x] Obtain explicit approval to create and commit to `redesign/calm-chat-v2`.
- [x] C0 — save this brief, recovery status, and resumption instructions.
- [ ] C1 — recover or reconstruct a runnable baseline and commit actual app source under `redesign/app/`.
- [ ] C2 — implement calmer, conversation-first chat and inspect all chat states.
- [ ] C3 — implement coherent mascot styling, state semantics, and continuous motion.
- [ ] C4 — refine app-wide UX and validate desktop/mobile, dialogs, keyboard behavior, and reduced motion.
- [ ] C5 — commit final source, setup instructions, verified test results, and a versioned downloadable build.

## Verification status

Only repository inspection and this documentation checkpoint are verified so far. Historical build/browser results from the unavailable ZIP do not validate future reconstructed or modified source. Run fresh checks before marking a code milestone complete.

## Resume checklist

1. Read this file from GitHub and inspect the working branch's current HEAD.
2. Inspect actual files under `redesign/app/`; do not infer their presence from old conversation claims.
3. If baseline source is still missing, attempt recovery from the connected design draft or request an uploaded copy. Clearly distinguish recovered material from newly reconstructed code.
4. Implement the next bounded milestone and commit source plus this progress update together.
5. Report the resulting commit link and what was actually verified.

## Boundaries

This is currently a frontend redesign project. Real autonomous execution, account access, OAuth, server-side approval enforcement, and model calls require the actual agent backend. Never present mock execution or demo connections as real integration activity. Do not commit credentials, authentication links, local user data, or `node_modules`.
