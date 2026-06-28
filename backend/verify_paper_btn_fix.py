"""验证主动论文拉取按钮可弹窗"""
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
        page.on('console', lambda m: errors.append(f'[{m.type}] {m.text}') if m.type in ('error',) else None)
        await page.goto(URL, wait_until='networkidle', timeout=20000)
        await page.wait_for_timeout(1500)
        # 1) 进入 A1 Agent 运营平台
        await page.evaluate("document.querySelector('[data-page=\"agent-ops\"]').click()")
        await page.wait_for_timeout(1200)
        # 2) 滚动到论文模块
        await page.evaluate("document.querySelector('#paperPipe').scrollIntoView({block:'center'})")
        await page.wait_for_timeout(400)
        # 3) 点击 主动论文拉取 按钮
        await page.click('#paperPullBtn')
        await page.wait_for_timeout(1000)
        # 检查弹窗是否打开
        is_open = await page.evaluate("document.getElementById('paperDemoMask').classList.contains('open')")
        print('弹窗已打开:', is_open)
        await page.screenshot(path=os.path.join(OUT, 'paper_btn_fixed.png'), full_page=False)
        # 等 6s 让流程跑到中段
        await page.wait_for_timeout(6000)
        await page.screenshot(path=os.path.join(OUT, 'paper_btn_fixed_mid.png'), full_page=False)
        await b.close()
    print('==== 错误数:', len(errors))
    for e in errors[:10]: print(e)

asyncio.run(main())
