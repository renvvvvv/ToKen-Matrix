"""验证 Cloudsway 灯条 v3 - 两行文字 + 两排灯 + 占下半 1/4"""
import asyncio, os
from playwright.async_api import async_playwright

URL = 'http://127.0.0.1:8766/console.html'
OUT = r'c:\Users\wuton\Desktop\0627\token-matrix\backend'

async def main():
    errors = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width':1680,'height':1050})
        page = await ctx.new_page()
        page.on('pageerror', lambda e: errors.append(f'[pageerror] {e}'))
        page.on('console', lambda m: errors.append(f'[{m.type}] {m.text}') if m.type=='error' else None)
        await page.goto(URL, wait_until='domcontentloaded', timeout=30000)
        await page.wait_for_timeout(1500)
        await page.evaluate("document.querySelector('[data-page=\"agent-ops\"]').click()")
        await page.wait_for_timeout(1200)
        await page.evaluate("document.querySelector('.cloudsway-strip').scrollIntoView({block:'center'})")
        await page.wait_for_timeout(500)
        info = await page.evaluate("""()=>{
          const s=document.querySelector('.cloudsway-strip');
          const pb=document.querySelector('.ops-foot .panel:first-child .panel-b');
          return {
            strip:{w:s.offsetWidth,h:s.offsetHeight,padding:s.style.padding},
            panel_b:{w:pb.offsetWidth,h:pb.offsetHeight},
            ratio: pb.offsetHeight?(s.offsetHeight/pb.offsetHeight*100).toFixed(0)+'%':'0',
            rows: s.querySelectorAll('.cs-flow-row').length,
            line1: (s.querySelector('.cs-line1')||{}).textContent?.trim().slice(0,80),
            line2: (s.querySelector('.cs-line2')||{}).textContent?.trim().slice(0,80),
          };
        }""")
        print('INFO:', repr(info))
        await page.screenshot(path=os.path.join(OUT, 'cloudsway_v3_full.png'), full_page=False)
        strip = await page.query_selector('.cloudsway-strip')
        if strip:
            await strip.screenshot(path=os.path.join(OUT, 'cloudsway_v3_strip.png'))
        await b.close()
    print('错误数:', len(errors))
    for e in errors[:5]: print(e)

asyncio.run(main())
