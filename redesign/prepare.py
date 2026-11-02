#!/usr/bin/env python3
"""Assemble the exact checked-in v1 baseline plus tracked v2 source overrides."""
from pathlib import Path
import argparse, hashlib, json, shutil, zipfile

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent
EXPECTED = '38e0bfbdd3bd2efa4091b78585838b4273e162bc209ea9ebc5538433c47bc268'

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--refresh', action='store_true', help='Refresh the generated workspace from committed sources. Edit app/, not workspace/.')
    args = parser.parse_args()
    archive = REPO / 'ofsgfj31p3ht.zip'
    if not archive.is_file():
        raise SystemExit('Check out redesign/calm-chat-v2 with the original ofsgfj31p3ht.zip at the repository root.')
    if hashlib.sha256(archive.read_bytes()).hexdigest() != EXPECTED:
        raise SystemExit('Baseline checksum mismatch. Refusing to substitute a different app.')
    target = ROOT / 'workspace'
    marker = target / '.blip-generated.json'
    if target.exists() and any(target.iterdir()) and not args.refresh:
        raise SystemExit('workspace/ already exists. Commit edits in app/ first, then use --refresh to regenerate the disposable workspace.')
    if target.exists() and any(target.iterdir()) and not marker.exists():
        raise SystemExit('Refusing to overwrite an unrecognized workspace.')
    target.mkdir(exist_ok=True)
    skipped = ('dist/', 'previews/', 'OPEN_ME.html', 'utils/mascotEngine.ts', 'utils/mascot-poses.js', 'utils/mascot-poses.d.ts')
    count = 0
    with zipfile.ZipFile(archive) as z:
        if z.testzip():
            raise SystemExit('The baseline archive failed its CRC check.')
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
    types = target / 'types/index.ts'
    text = types.read_text()
    extra = ['planning','verifying','delegating','syncing','connecting','reconnecting','speaking','queued','permission-required','needs-input','paused','blocked','warning','partial-success','retrying','cancelled','error']
    needle = '  | "loading";'
    if needle not in text:
        raise SystemExit('Unexpected baseline mascot type declaration.')
    types.write_text(text.replace(needle, '  | "loading"\n' + '\n'.join('  | "'+s+'"' + (';' if i == len(extra)-1 else '') for i,s in enumerate(extra)), 1))
    run = target / 'contexts/RunContext.tsx'
    run.write_text(run.read_text().replace('planning: "thinking"', 'planning: "planning"').replace('verifying: "reading"', 'verifying: "verifying"'))
    nav = target / 'components/shell/navConfig.ts'
    nav.write_text(nav.read_text().replace('All 20 mascot states','All 37 mascot states'))
    overlay = ROOT / 'app'
    for source in overlay.rglob('*'):
        if source.is_file():
            dest = target / source.relative_to(overlay)
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, dest)
    marker.write_text(json.dumps({'baseline_sha256': EXPECTED, 'generated_from': 'checked-in baseline ZIP + redesign/app overrides'}, indent=2))
    print(f'Restored {count} baseline files and applied tracked overrides to {target}.')
    print('Next: cd redesign/workspace && npm ci && npm run dev')

if __name__ == '__main__':
    main()
