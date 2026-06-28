"""验证 L2 新布局: 左大(Skill 闭环) + 右上(飞书) + 右下(告警时间线)"""
import asyncio, os, json
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
        await page.wait_for_timeout(1800)
        await page.evaluate("document.querySelector('[data-page=\"agent-ops\"]').click()")
        await page.wait_for_timeout(1500)
        await page.evaluate("document.querySelector('.ops-mid.l2-grid').scrollIntoView({block:'center'})")
        await page.wait_for_timeout(500)
        info = await page.evaluate("""()=>{
          const g=document.querySelector('.ops-mid.l2-grid');
          const l=document.querySelector('.l2-left');
          const r=document.querySelector('.l2-right');
          const rps=document.querySelectorAll('.l2-right>.panel');
          const pipe=document.querySelector('#pipeline');
          return {
            grid:{w:g.offsetWidth,h:g.offsetHeight},
            left:{w:l.offsetWidth,h:l.offsetHeight},
            right:{w:r.offsetWidth,h:r.offsetHeight},
            right_panels:Array.from(rps).map(p=>({w:p.offsetWidth,h:p.offsetHeight,title:(p.querySelector('.panel-h b')||{}).textContent})),
            left_to_right_ratio:(l.offsetWidth/r.offsetWidth).toFixed(2),
            pipe_w:pipe?pipe.offsetWidth:0,
            pipe_h:pipe?pipe.offsetHeight:0,
            pipe_steps:pipe?(pipe.querySelectorAll('.pipe-step').length):0,
          };
        }""")
        print('INFO:', json.dumps(info, ensure_ascii=False, indent=2))
        await page.screenshot(path=os.path.join(OUT, 'l2_new_layout.png'), full_page=False)
        # 局部
        grid = await page.query_selector('.ops-mid.l2-grid')
        if grid:
            await grid.screenshot(path=os.path.join(OUT, 'l2_new_only.png'))
        await b.close()
    print('错误数:', len(errors))
    for e in errors[:5]: print(e)

asyncio.run(main())
