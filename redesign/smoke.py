#!/usr/bin/env python3
"""Targeted Chromium regression checks for the assembled BLIP v2 build.
Install: pip install playwright && playwright install chromium
Run after npm run build: python3 redesign/smoke.py
"""
import asyncio,functools,http.server,json,os,subprocess,tempfile,threading,time
from pathlib import Path
from playwright.async_api import async_playwright,expect
ROOT=Path(__file__).resolve().parent
APP=ROOT/'workspace'
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass

async def main():
    if not (APP/'dist/index.html').is_file():raise RuntimeError('Prepare and build the app first.')
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(APP/'dist')))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    report={'routes':[],'checks':[],'runtime_errors':[],'external_requests':[]}
    async with async_playwright() as pw:
        launch={'headless':True,'args':['--no-sandbox','--disable-dev-shm-usage']}
        if os.getenv('BLIP_CHROMIUM'):launch['executable_path']=os.environ['BLIP_CHROMIUM']
        browser=await pw.chromium.launch(**launch)
        try:
            context=await browser.new_context(viewport={'width':1440,'height':1000})
            page=await context.new_page();page.set_default_timeout(7000)
            page.on('pageerror',lambda e:report['runtime_errors'].append(str(e)))
            page.on('request',lambda r:report['external_requests'].append(r.url) if not r.url.startswith(base) and not r.url.startswith('data:') else None)
            async def go(route):
                await page.goto(base+'/?qa='+str(time.time())+'#/'+route,wait_until='networkidle')
            routes=['overview','chat','approvals','goals','automations','library','connections','capabilities','memory','settings','motion']
            for layout,w,h in [('desktop',1440,1000),('mobile',390,844)]:
                await page.set_viewport_size({'width':w,'height':h})
                for route in routes:
                    await go(route)
                    check=await page.evaluate("({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,crashed:document.body.textContent.includes('This preview hit a snag')})")
                    assert not check['crashed'] and check['width']==check['scroll'],(layout,route,check)
                    report['routes'].append({'layout':layout,'route':route,**check})
            await page.set_viewport_size({'width':1440,'height':1000});await go('chat/c-notes')
            assert await page.locator('main details[open]').count()==0
            assert await page.get_by_role('complementary',name='Conversation context').count()==0
            assert await page.get_by_role('radiogroup',name='Demo state').count()==0
            disclosure=page.locator('[data-testid="activity-disclosure"]').first
            assert not await disclosure.evaluate('(d)=>d.open')
            await disclosure.locator('summary').first.click();assert await disclosure.evaluate('(d)=>d.open')
            await disclosure.locator('summary').first.click()
            await page.get_by_role('button',name='Open files and run plan',exact=True).click()
            await expect(page.get_by_role('dialog')).to_be_visible();await page.wait_for_timeout(120)
            await page.keyboard.press('Escape');await expect(page.get_by_role('dialog')).to_have_count(0)
            report['checks'].append('Calm default; activity and workspace opt in')
            text='QA draft survives navigation and reload.'
            await page.locator('#chat-composer').fill(text)
            await page.locator('input[type=file]').set_input_files({'name':'qa-draft.txt','mimeType':'text/plain','buffer':b'Local metadata only.'})
            await page.wait_for_timeout(120);await page.get_by_role('button',name='All conversations',exact=True).click()
            await expect(page.locator('main h1')).to_have_text('Conversations')
            await page.evaluate("location.hash='#/chat/c-notes'")
            await expect(page.locator('#chat-composer')).to_have_value(text)
            await page.reload(wait_until='networkidle');await expect(page.locator('#chat-composer')).to_have_value(text)
            assert await page.get_by_role('button',name='Remove qa-draft.txt',exact=True).count()==1
            report['checks'].append('Draft and attachment metadata persist')
            await page.get_by_role('button',name='Conversation options',exact=True).click()
            await page.locator('#chat-preview-state').select_option('offline');await expect(page.get_by_role('dialog')).to_have_count(0)
            await page.locator('#chat-composer').fill('QA queued while offline.')
            await page.get_by_role('button',name='Queue message for reconnect',exact=True).click()
            await expect(page.locator('#chat-composer')).to_have_value('')
            queued=page.get_by_text('1 follow-up queued · waiting for reconnect',exact=True)
            await expect(queued).to_be_visible()
            assert not await page.locator('details').filter(has=queued).evaluate('(d)=>d.open')
            report['checks'].append('Offline queue represented and collapsed')
            await go('motion');buttons=page.locator('[data-mascot-state]');assert await buttons.count()==37
            states=await buttons.evaluate_all('(bs)=>bs.map(b=>b.dataset.mascotState)')
            for state in states:
                await page.locator(f'[data-mascot-state="{state}"]').click();await page.wait_for_timeout(90)
                pixels=await page.locator('main canvas').first.evaluate('(c)=>{let n=0;const d=c.getContext("2d").getImageData(0,0,c.width,c.height).data;for(let k=3;k<d.length;k+=4)if(d[k])n++;return n;}')
                assert pixels>1000,state
            for state in ['error','retrying','reconnecting','verifying','approval','done','idle']:
                await page.locator(f'[data-mascot-state="{state}"]').click()
            report['checks'].append('All 37 states and interrupted recovery')
            await page.locator('[data-mascot-state="idle"]').click();await page.wait_for_timeout(300)
            await page.get_by_role('button',name='Pause',exact=True).click();await page.wait_for_timeout(60)
            canvas=page.locator('main canvas').first
            a=await canvas.evaluate('(c)=>c.toDataURL()');await page.wait_for_timeout(300)
            assert a==await canvas.evaluate('(c)=>c.toDataURL()')
            report['checks'].append('Pause freezes current pose')
            await go('settings/appearance');await page.locator('#settings-motion').select_option('on');await go('motion')
            canvas=page.locator('main canvas').first;a=await canvas.evaluate('(c)=>c.toDataURL()');await page.wait_for_timeout(300)
            assert a==await canvas.evaluate('(c)=>c.toDataURL()')
            report['checks'].append('Reduced motion is still')
            await page.set_viewport_size({'width':390,'height':844});await go('chat/c-notes')
            assert await page.evaluate('document.documentElement.scrollWidth===390')
            await page.get_by_role('button',name='Conversation options',exact=True).click();await page.wait_for_timeout(120)
            await page.keyboard.press('Escape');await expect(page.get_by_role('dialog')).to_have_count(0)
            report['checks'].append('Mobile selected thread and menu')
            with tempfile.TemporaryDirectory() as tmp:
                harness=Path(tmp)/'motion.js'
                source=APP/'utils/mascot-runtime.ts'
                build="require('esbuild').buildSync("+json.dumps({'entryPoints':[str(source)],'bundle':True,'format':'iife','globalName':'MotionHarness','outfile':str(harness)})+");"
                subprocess.run(['node','-e',build],cwd=APP,check=True,capture_output=True)
                await page.goto('about:blank');await page.set_content('<canvas style="width:420px;height:420px"></canvas>')
                await page.add_script_tag(content=harness.read_text())
                await page.evaluate("()=>{const c=document.querySelector('canvas'),x=c.getContext('2d'),r=x.rotate.bind(x);window.arcAngles=[];x.rotate=a=>{if(a>.15)arcAngles.push(a);r(a)};window.motionQA=MotionHarness.mountMascot(c,{state:'loading',speed:2,reducedMotion:false});}")
                await page.wait_for_timeout(3400)
                arc=await page.evaluate("({frames:arcAngles.length,last:arcAngles.at(-1),minimumStep:Math.min(...arcAngles.slice(1).map((a,i)=>a-arcAngles[i]))})")
                assert arc['frames']>30 and arc['last']>3.6 and arc['minimumStep']>=0,arc
                await page.evaluate('motionQA.destroy()');report['arc_continuity']=arc
                report['checks'].append('Continuous progress arc across loop boundary')
            assert not report['runtime_errors'],report['runtime_errors']
            assert not report['external_requests'],report['external_requests']
            report['passed']=True
        finally:
            await browser.close()
    server.shutdown()
    out=APP/'docs/QA_V2_RESULTS.json';out.parent.mkdir(exist_ok=True);out.write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({'passed':report['passed'],'responsive_checks':len(report['routes']),'interaction_checks':len(report['checks']),'runtime_errors':report['runtime_errors'],'report':str(out)},indent=2))

if __name__=='__main__':asyncio.run(main())
