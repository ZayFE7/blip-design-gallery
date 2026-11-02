#!/usr/bin/env python3
"""Restore the exact checked-in baseline and overlay the committed revision."""
from pathlib import Path
import argparse, hashlib, json, shutil, zipfile
ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent
EXPECTED = '38e0bfbdd3bd2efa4091b78585838b4273e162bc209ea9ebc5538433c47bc268'
EXTRA = ['planning','verifying','delegating','syncing','connecting','reconnecting','speaking','queued','permission-required','needs-input','paused','blocked','warning','partial-success','retrying','cancelled','error']
RETIRED = ('utils/mascotEngine.ts','utils/mascot-poses.js','utils/mascot-poses.d.ts')

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--refresh', action='store_true', help='Regenerate the recognized disposable workspace. Edit app/, not workspace/.')
    args = parser.parse_args()
    archive = REPO / 'ofsgfj31p3ht.zip'
    if not archive.is_file():
        raise SystemExit('Check out redesign/calm-chat-v2 with the original ofsgfj31p3ht.zip at the repository root.')
    if hashlib.sha256(archive.read_bytes()).hexdigest() != EXPECTED:
        raise SystemExit('Baseline checksum mismatch; refusing to substitute another app.')
    target = ROOT / 'workspace'
    marker = target / '.blip-generated.json'
    if target.exists() and any(target.iterdir()):
        if not marker.exists():
            raise SystemExit('Refusing to overwrite an unrecognized workspace.')
        if not args.refresh:
            raise SystemExit('Workspace exists. Save edits under app/, then use --refresh.')
    overlay = ROOT / 'app'
    motion_ready = all((overlay / p).is_file() for p in ('utils/mascot-runtime.ts','data/mascotStates.ts','components/mascot/MascotStill.tsx'))
    skipped = ('dist/','previews/','OPEN_ME.html') + (RETIRED if motion_ready else ())
    target.mkdir(exist_ok=True)
    count = 0
    with zipfile.ZipFile(archive) as z:
        if z.testzip():
            raise SystemExit('Baseline CRC check failed.')
        for item in z.infolist():
            prefix = 'BLIP-Reimagined/'
            if not item.filename.startswith(prefix) or item.is_dir():
                continue
            rel = item.filename[len(prefix):]
            if not rel or any(rel == s or rel.startswith(s) for s in skipped):
                continue
            path = (target / rel).resolve()
            if not path.is_relative_to(target.resolve()):
                raise SystemExit('Unsafe archive path.')
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(z.read(item)); count += 1
    if motion_ready:
        for name in RETIRED:
            old = target / name
            if old.exists():
                old.unlink()
        types = target / 'types/index.ts'
        text = types.read_text()
        needle = '  | "loading";'
        if needle not in text:
            raise SystemExit('Unexpected baseline state declaration.')
        addition = '  | "loading"\n' + '\n'.join('  | "'+s+'"'+(';' if i == len(EXTRA)-1 else '') for i,s in enumerate(EXTRA))
        types.write_text(text.replace(needle, addition, 1))
        run = target / 'contexts/RunContext.tsx'
        run.write_text(run.read_text().replace('planning: "thinking"','planning: "planning"').replace('verifying: "reading"','verifying: "verifying"'))
        for name in ('components/shell/navConfig.ts','pages/Settings.tsx','pages/Motion.tsx'):
            path = target / name
            path.write_text(path.read_text().replace('All 20 mascot states','All 37 mascot states').replace('20-state','37-state').replace('all twenty expressions','37 intentional expressions'))
    for source in overlay.rglob('*'):
        if source.is_file() and 'node_modules' not in source.parts and '__pycache__' not in source.parts:
            dest = target / source.relative_to(overlay)
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, dest)
    marker.write_text(json.dumps({'baseline_sha256':EXPECTED,'generated_from':'checked-in baseline ZIP + tracked overrides','motion_revision':2 if motion_ready else 1},indent=2))
    print(f'Restored {count} baseline files and applied tracked overrides to {target}.')
    print('Mascot:', 'v2 complete replacement' if motion_ready else 'intact v1 baseline')
    print('Next: cd redesign/workspace && npm ci && npm run build')

if __name__ == '__main__':
    main()
