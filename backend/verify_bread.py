import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx = await browser.new_context(viewport={'width': 1600, 'height': 900})
        page = await ctx.new_page()
        errs = []
        page.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        await page.goto('http://127.0.0.1:8766/console.html')
        await page.wait_for_timeout(2000)
        # 截图顶栏 (默认系统总览)
        await page.screenshot(path='screenshots/breadcrumb_overview.png', clip={'x': 0, 'y': 0, 'width': 900, 'height': 80})
        b1 = await page.evaluate("() => document.getElementById('breadcrumb').textContent")
        print(f'系统总览: {b1!r}')

        # 切换到 agent-ops
        await page.click('.menu-item[data-page="agent-ops"]')
        await page.wait_for_timeout(500)
        b2 = await page.evaluate("() => document.getElementById('breadcrumb').textContent")
        print(f'Agent 运营管理平台: {b2!r}')
        await page.screenshot(path='screenshots/breadcrumb_agent.png', clip={'x': 0, 'y': 0, 'width': 1100, 'height': 80})

        # 切换到 BMS
        await page.click('.menu-item[data-page="bms"]')
        await page.wait_for_timeout(500)
        b3 = await page.evaluate("() => document.getElementById('breadcrumb').textContent")
        print(f'BMS: {b3!r}')

        print(f'Console 错误: {len(errs)}')
        await browser.close()

asyncio.run(main())
