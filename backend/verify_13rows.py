import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx = await browser.new_context(viewport={'width': 1600, 'height': 900})
        page = await ctx.new_page()
        errs = []
        page.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: errs.append(str(e)))
        await page.goto('http://127.0.0.1:8766/console.html')
        await page.wait_for_timeout(2000)
        await page.click('.menu-item[data-page="agent-ops"]')
        await page.wait_for_timeout(2500)
        # 检查巡检列表行数
        n = await page.evaluate("() => document.querySelectorAll('#inspList .insp-row').length")
        print(f'巡检列表行数: {n}')
        # 截图
        await page.screenshot(path='screenshots/insp_13rows.png', full_page=True)
        # 滚到 24h AI 巡检趋势
        await page.evaluate("() => document.querySelector('.insp-list').scrollIntoView({block:'center'})")
        await page.wait_for_timeout(500)
        await page.screenshot(path='screenshots/insp_13rows_view.png', full_page=False)
        print(f'Console 错误: {len(errs)}')
        for e in errs[:3]: print('  -', e[:200])
        await browser.close()

asyncio.run(main())
