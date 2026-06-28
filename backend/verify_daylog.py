import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx = await browser.new_context(viewport={'width': 1600, 'height': 900})
        page = await ctx.new_page()
        await page.goto('http://127.0.0.1:8766/console.html')
        await page.wait_for_timeout(2000)
        await page.click('.menu-item[data-page="agent-ops"]')
        await page.wait_for_timeout(2000)
        # 滚到日日志
        await page.evaluate("() => document.querySelector('.daylog-wrap').scrollIntoView({block:'start'})")
        await page.wait_for_timeout(800)
        await page.screenshot(path='screenshots/daylog_full.png', full_page=False)
        # 也看下 L1
        await page.evaluate("() => window.scrollTo(0,0)")
        await page.wait_for_timeout(500)
        await page.screenshot(path='screenshots/l1_full.png', full_page=False)
        await browser.close()

asyncio.run(main())
