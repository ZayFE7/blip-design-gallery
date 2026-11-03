# BLIP v2 — quietly curious

The enhanced app continues from the exact original delivered ZIP the user uploaded. It is not a restart. Main and the reference gallery remain unchanged.

## Two interactive previews

- **BLIP-App-Preview.html** — all 11 screens, calmer chat, persistent drafts and on-demand workspace/activity.
- **BLIP-Mascot-Animated-States.html** — separate animated studio with 37 states, replay, pause, speed and work/recovery sequences.

Download each generated HTML file and open it in a current browser. Fonts and code are inlined; no install or server is needed. These are interactive files, not screenshots. Reduced-motion settings are respected.

## Generate them from this branch

```sh
python3 redesign/prepare.py
cd redesign/workspace
npm ci
npm run build
cd ../..
python3 redesign/package.py --revision YOUR_COMMIT_SHA
python3 redesign/export_previews.py
```

Outputs are under `redesign/deliverables/`, including the full assembled source/build ZIP. Read [PROGRESS.md](./PROGRESS.md) for verified checks, [PREVIEW_MANIFEST.json](./PREVIEW_MANIFEST.json) for preview hashes and provenance, and [AGENTS.md](./AGENTS.md) before making changes.

Original source remains in the immutable root `ofsgfj31p3ht.zip`; readable v2 overrides live in `redesign/app/`. Edit tracked app files, then regenerate the disposable workspace using prepare.py --refresh. No progress depends on an old sandbox or temporary download link.

Agent execution and connected accounts are local demo simulations; no real email, tool command or OAuth flow is run.
