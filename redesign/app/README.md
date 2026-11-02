# BLIP v2 — quietly curious

This is an in-progress revision of the user's exact delivered v1 app, not a replacement project.

The immutable original source is the root `ofsgfj31p3ht.zip` in this branch. Readable changed files live here under `redesign/app/`. A deterministic preparation script restores untouched source from that checked-in ZIP and overlays these files. Nothing depends on a previous sandbox or temporary download link.

## Run from a fresh checkout

```sh
python3 redesign/prepare.py
cd redesign/workspace
npm ci
npm run dev
```

Edit tracked files under `redesign/app/`, then run `python3 redesign/prepare.py --refresh` to regenerate the disposable workspace before checking/building. Do not keep your only copy of edits under `workspace/`.

## Direction

- A focused conversation, not four competing columns.
- One compact live activity line; tool logs and sources open only when requested.
- Workspace files/plan and demo-state controls are on-demand.
- A quieter, curious, warm companion with deliberate lifecycle expressions.

All agent execution and integrations remain explicitly simulated. This checkpoint is in progress; see `redesign/PROGRESS.md` for current validation status.
