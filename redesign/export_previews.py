#!/usr/bin/env python3
"""Export two separate offline previews from the current assembled app build."""
from pathlib import Path
import json,hashlib,subprocess,sys
ROOT=Path(__file__).resolve().parent

def main():
    app=ROOT/'workspace';out=ROOT/'deliverables';out.mkdir(exist_ok=True)
    source=app/'OPEN_ME.html'
    if not source.is_file():
        raise SystemExit('Run python3 redesign/package.py first.')
    html=source.read_text()
    full=out/'BLIP-App-Preview.html';full.write_text(html)
    studio_css='<style>body[data-blip-preview="mascot"] #root>aside,body[data-blip-preview="mascot"] #root>nav[aria-label="Primary"],body[data-blip-preview="mascot"] #root>div>header{display:none!important}body[data-blip-preview="mascot"] #root>div.min-h-dvh{margin-left:0!important;padding-bottom:0!important}</style>'
    boot='<script>window.location.hash="/motion";window.addEventListener("keydown",function(e){if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();e.stopImmediatePropagation()}},true);</script>'
    if '<body>' not in html:
        raise SystemExit('Unexpected standalone HTML body.')
    mascot=html.replace('<body>','<body data-blip-preview="mascot">'+studio_css+boot,1)
    lab=out/'BLIP-Mascot-Animated-States.html';lab.write_text(mascot)
    (app/'MASCOT_PREVIEW.html').write_text(mascot)
    manifest={p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [full,lab]}
    (out/'PREVIEW_MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
    build_manifest=json.loads((app/'BUILD_MANIFEST.json').read_text())
    subprocess.run([sys.executable,str(ROOT/'package.py'),'--skip-build','--revision',build_manifest.get('revision','working-tree')],check=True)
    print(json.dumps(manifest,indent=2))

if __name__=='__main__':main()
