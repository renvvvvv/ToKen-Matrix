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

        # 完整截图
        await page.screenshot(path='screenshots/ops_top_new.png', full_page=True)
        # 仅顶部
        await page.screenshot(path='screenshots/ops_top_view.png', clip={'x': 0, 'y': 0, 'width': 1600, 'height': 900})

        # 检查日日志
        dl_count = await page.evaluate("() => document.querySelectorAll('#daylogTimeline .dl-row').length")
        dl_date = await page.evaluate("() => document.getElementById('daylogDate')?.textContent || '--'")
        dl_evt = await page.evaluate("() => document.getElementById('daylogEvents')?.textContent || '--'")
        dl_inspect = await page.evaluate("() => document.getElementById('dlInspect')?.textContent || '--'")
        print(f'日日志: rows={dl_count}, date={dl_date}, 事件={dl_evt}, 巡检={dl_inspect}')

        # 检查雷达
        radar_h = await page.evaluate("() => { const s=document.getElementById('radarHealth'); return s? s.getBoundingClientRect().height:0; }")
        print(f'雷达高度: {radar_h}px')

        # 检查 24h 巡检趋势图
        trend_w = await page.evaluate("() => { const s=document.getElementById('chartInspectTrend'); return s? s.getBoundingClientRect().width:0; }")
        trend_h = await page.evaluate("() => { const s=document.getElementById('chartInspectTrend'); return s? s.getBoundingClientRect().height:0; }")
        print(f'24h AI 巡检趋势: {trend_w}x{trend_h}')

        # 滚动到日日志
        await page.evaluate("() => document.getElementById('daylogTimeline').scrollIntoView({block:'center'})")
        await page.wait_for_timeout(500)
        await page.screenshot(path='screenshots/ops_daylog.png', full_page=False)

        # 滚动到顶部看整个 L1
        await page.evaluate("() => window.scrollTo(0,0)")
        await page.wait_for_timeout(500)
        await page.screenshot(path='screenshots/ops_layer1_new.png', full_page=False)

        print(f'Console 错误数: {len(errs)}')
        for e in errs[:3]: print('  -', e[:200])
        await browser.close()

asyncio.run(main())
