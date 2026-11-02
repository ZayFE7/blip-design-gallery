# Working on the BLIP redesign

## Start here

Read `PROGRESS.md`, `BASELINE.json`, and the current GitHub branch before doing work.

**The exact original delivered app has been recovered.** The user uploaded `ofsgfj31p3ht.zip` at the repository root on `redesign/calm-chat-v2`. Its verified SHA-256 is `38e0bfbdd3bd2efa4091b78585838b4273e162bc209ea9ebc5538433c47bc268`. It contains 140 entries rooted at `BLIP-Reimagined/`, including the actual source and standalone preview. Continue from it, not a new app or the older screenshot gallery. Do not ask for the same upload again while it is available in this branch.

## Repository layout

- Work branch: `redesign/calm-chat-v2`
- Immutable first app checkpoint: root `ofsgfj31p3ht.zip`
- Subsequent ordinary source changes: `redesign/app/`
- Progress, findings and decisions: `redesign/PROGRESS.md`
- Original reference gallery at the repository root: preserve it.

## Revision requirements

Preserve the visual direction the user liked while making chat substantially calmer. Conversation comes first; activity, sources and context use progressive disclosure. Remove always-visible debug/demo controls from the reading path. Improve the wider app's hierarchy and navigation.

Keep the mascot simple and recognizable while improving its styling and giving motions clear lifecycle meaning. Design state transitions, interruptions, recovery and reduced-motion presentations intentionally; do not merely smooth confusing motions.

## Checkpoint practice

Commit bounded, working milestones with source changes and an updated progress record. Keep setup instructions and lockfiles with the source. Use GitHub as the durable source of truth; temporary sandboxes and export links are not the project record.

Only report tests actually run. Do not force-push, rewrite history, overwrite the original gallery, or modify `main` as part of this branch's work. Keep credentials, real account data, local uploads and `node_modules` out of commits. Mock app activity must remain explicitly marked as simulated.
