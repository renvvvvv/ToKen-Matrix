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

        # 1. 截图: 默认页面(系统总览),logo 应该隐藏
        await page.screenshot(path='screenshots/logo_overview.png', clip={'x': 0, 'y': 0, 'width': 1600, 'height': 90})
        logo_visible = await page.evaluate("() => document.getElementById('brandXiaosu').classList.contains('show')")
        print(f'系统总览页 logo 显示: {logo_visible} (应为 False)')

        # 2. 切换到 Agent 运营管理平台
        await page.click('.menu-item[data-page="agent-ops"]')
        await page.wait_for_timeout(800)

        # 3. 检查标题
        title_text = await page.evaluate("() => document.getElementById('pageTitle').textContent")
        print(f'pageTitle 文本: {title_text!r} (应为 "ToKen Matrix")')

        # 4. 检查 logo 是否显示
        logo_visible = await page.evaluate("() => document.getElementById('brandXiaosu').classList.contains('show')")
        print(f'Agent 页 logo 显示: {logo_visible} (应为 True)')
        logo_disp = await page.evaluate("() => getComputedStyle(document.getElementById('brandXiaosu')).display")
        print(f'logo display 样式: {logo_disp}')

        # 5. 截图: 顶栏
        await page.screenshot(path='screenshots/logo_agent_ops.png', clip={'x': 0, 'y': 0, 'width': 1600, 'height': 90})
        # 整页
        await page.screenshot(path='screenshots/logo_agent_ops_full.png', full_page=False)

        # 6. 切换到其他页面,logo 应隐藏
        await page.click('.menu-item[data-page="bms"]')
        await page.wait_for_timeout(600)
        logo_visible2 = await page.evaluate("() => document.getElementById('brandXiaosu').classList.contains('show')")
        print(f'BMS 页 logo 显示: {logo_visible2} (应为 False)')

        # 7. 切回 agent-ops
        await page.click('.menu-item[data-page="agent-ops"]')
        await page.wait_for_timeout(600)
        # 截图: 内容区(包含完整效果)
        await page.screenshot(path='screenshots/logo_final.png', full_page=False)

        print(f'\nConsole 错误数: {len(errs)}')
        for e in errs[:3]: print('  -', e[:200])
        await browser.close()

asyncio.run(main())
