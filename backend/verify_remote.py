import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx = await browser.new_context(viewport={'width': 1600, 'height': 1000})
        page = await ctx.new_page()
        console_errors = []
        page_errors = []
        page.on('console', lambda m: console_errors.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: page_errors.append(str(e)))

        # 1. 打开主控制台
        await page.goto('http://127.0.0.1:8766/console.html', wait_until='domcontentloaded')
        await page.wait_for_timeout(2000)
        try:
            await page.click('a[data-page="agent-ops"], .menu-item[data-page="agent-ops"]', timeout=5000)
        except Exception:
            pass
        await page.wait_for_timeout(1500)

        # 2. 启动演示
        await page.click('#inspectDemoBtn')
        await page.wait_for_timeout(500)
        # 选 BMS 内阻
        await page.click('.id-sys[data-sys="bms"] .id-param[data-param="1"]')
        await page.wait_for_timeout(300)
        await page.click('#idStartBtn')
        # 3. 等到链接弹到聊天流 (步骤 4-5)
        await page.wait_for_timeout(15000)
        # 4. 取出真实链接
        link_url = await page.evaluate("(() => { const a = document.querySelector('#idStream a[href*=\"confirm.html\"]'); return a ? a.href : null; })()")
        print('Real link:', link_url)
        if not link_url:
            print('No link found!')
            await page.screenshot(path='screenshots/no_link.png', full_page=False)
            return
        await page.screenshot(path='screenshots/demo_with_real_link.png', full_page=False)

        # 5. 在新页面打开真实链接
        confirm_page = await ctx.new_page()
        confirm_page.on('console', lambda m: console_errors.append('CONFIRM:'+m.text) if m.type == 'error' else None)
        confirm_page.on('pageerror', lambda e: page_errors.append('CONFIRM:'+str(e)))
        await confirm_page.goto(link_url, wait_until='domcontentloaded')
        await confirm_page.wait_for_timeout(1000)
        await confirm_page.screenshot(path='screenshots/confirm_page.png', full_page=False)

        # 6. 在 confirm 页面填反馈并确认
        await confirm_page.fill('#fb', '已到达现场,温度恢复正常,内阻已下降到 0.35mΩ,BMS 重新均衡完成。')
        # 模拟点击"已确认修复"
        await confirm_page.click('#btnYes')
        await confirm_page.wait_for_timeout(800)
        await confirm_page.screenshot(path='screenshots/confirm_submitted.png', full_page=False)

        # 7. 等主页面收到反馈并完成 LLM 迭代
        await page.wait_for_timeout(2000)
        await page.bring_to_front()
        await page.evaluate("document.getElementById('idStream').scrollTop = document.getElementById('idStream').scrollHeight")
        await page.wait_for_timeout(1000)
        await page.screenshot(path='screenshots/demo_after_remote_confirm.png', full_page=False)

        # 8. 等待 LLM 迭代完成
        try:
            await page.wait_for_function(
                "() => document.getElementById('idStartBtn').textContent.includes('确认并关闭')",
                timeout=60000
            )
            print('Demo fully complete after remote confirm ✓')
        except Exception as e:
            print('Wait done timeout:', e)

        await page.evaluate("document.getElementById('idStream').scrollTop = document.getElementById('idStream').scrollHeight")
        await page.wait_for_timeout(500)
        await page.screenshot(path='screenshots/demo_fully_done.png', full_page=False)

        print('Console errors:', len(console_errors))
        for e in console_errors[:5]:
            print('  -', e[:200])
        print('Page errors:', len(page_errors))
        for e in page_errors[:5]:
            print('  -', e[:200])

        await browser.close()

asyncio.run(main())
