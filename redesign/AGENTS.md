# Working on the BLIP redesign

This directory is the durable workspace for the user-approved redesign.

## Start here

Read `PROGRESS.md` and inspect the current GitHub branch before doing work. The earlier generated ZIP may not be recoverable; verify source files rather than assuming they exist.

## Repository layout

- Work branch: `redesign/calm-chat-v2`
- App source: `redesign/app/`
- Progress and decisions: `redesign/PROGRESS.md`
- Original gallery at the repository root: references only; preserve it.

## Project requirements

Prioritize calm, conversation-first chat with progressive disclosure. Improve the wider app's hierarchy and navigation. Keep the mascot simple and recognizable while giving its expressions and motion clear lifecycle meaning. Design reduced-motion and interrupted/recovery states deliberately.

## Checkpoint practice

Commit bounded, working milestones and update `PROGRESS.md` with changed files, tests actually run, known issues, and the next step. Keep setup instructions and lockfiles alongside the source. Temporary exports are delivery artifacts, not the source of truth.

Do not claim old or reconstructed source is the exact delivered build without verification. Do not claim unrun tests passed. Do not force-push, rewrite history, overwrite the original gallery, or modify `main` as part of this branch's work. Keep tokens, account data and local uploads out of commits.
