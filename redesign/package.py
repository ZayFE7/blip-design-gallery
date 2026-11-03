#!/usr/bin/env python3
"""Build a complete portable v2 source ZIP and no-install HTML preview."""
from pathlib import Path
import argparse,base64,hashlib,json,mimetypes,os,re,shutil,subprocess,zipfile

ROOT=Path(__file__).resolve().parent
APP=ROOT/'workspace'

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--skip-build',action='store_true',help='Only for an already freshly verified production build.')
    parser.add_argument('--revision',default='working-tree',help='Git commit or revision label for the build manifest.')
    args=parser.parse_args()
    if not (APP/'.blip-generated.json').is_file():
        raise SystemExit('Run python3 redesign/prepare.py first. This command packages the verified baseline plus tracked overrides, not the old ZIP unchanged.')
    if not args.skip_build:
        subprocess.run(['npm','run','build'],cwd=APP,check=True)
    html=(APP/'dist/index.html').read_text()
    scripts=re.findall(r'<script[^>]+src="([^"]+)"',html)
    styles=re.findall(r'<link[^>]+href="([^"]+\.css)"',html)
    if len(scripts)!=1 or len(styles)!=1:
        raise SystemExit('The standalone exporter expects the configured single-bundle production build.')
    js_path=(APP/'dist'/scripts[0].removeprefix('./')).resolve()
    css_path=(APP/'dist'/styles[0].removeprefix('./')).resolve()
    def asset(match):
        url=match.group(1).strip('\"\'')
        if url.startswith('data:'):return match.group(0)
        path=(css_path.parent/url).resolve()
        if not path.is_relative_to((APP/'dist').resolve()) or not path.is_file():
            raise RuntimeError('Unexpected standalone asset: '+url)
        mime=mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
        return 'url(data:'+mime+';base64,'+base64.b64encode(path.read_bytes()).decode()+')'
    css=re.sub(r'url\(([^)]+)\)',asset,css_path.read_text())
    js=re.sub('</script',r'<\\/script',js_path.read_text(),flags=re.I)
    standalone='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="theme-color" content="#f8f7f4"><title>Blip — quietly curious</title><style>'+css+'</style></head><body><div id="root"></div><script type="module">'+js+'</script></body></html>'
    (APP/'OPEN_ME.html').write_text(standalone)
    manifest={'revision':args.revision,'baseline_sha256':'38e0bfbdd3bd2efa4091b78585838b4273e162bc209ea9ebc5538433c47bc268','standalone_sha256':hashlib.sha256(standalone.encode()).hexdigest(),'screens':11,'mascot_states':37,'integrations':'local frontend demo; no real agent execution or OAuth'}
    (APP/'BUILD_MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
    out=ROOT/'deliverables';out.mkdir(exist_ok=True)
    target=out/'BLIP-Quietly-Curious-v2.zip'
    excluded={'node_modules','.git','__pycache__','.blip-generated.json'}
    files=[]
    for p in APP.rglob('*'):
        rel=p.relative_to(APP)
        if not p.is_file() or any(part in excluded for part in rel.parts) or p.name.startswith('.env'):
            continue
        files.append(p)
    with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED,compresslevel=8) as z:
        for p in sorted(files):z.write(p,'BLIP-Quietly-Curious-v2/'+str(p.relative_to(APP)))
    with zipfile.ZipFile(target) as z:
        if z.testzip():raise RuntimeError('Release ZIP integrity failure.')
    print(json.dumps({'zip':str(target),'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'files':len(files)},indent=2))

if __name__=='__main__':main()
