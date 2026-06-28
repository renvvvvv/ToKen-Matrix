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

        await page.goto('file:///c:/Users/wuton/Desktop/0627/token-matrix/backend/console.html', wait_until='domcontentloaded')
        await page.wait_for_timeout(2500)

        # Navigate to Agent page
        try:
            await page.click('a[data-page="agent-ops"], .menu-item[data-page="agent-ops"]', timeout=5000)
        except Exception:
            pass
        await page.wait_for_timeout(1500)

        # Check demo button exists
        btn = await page.query_selector('#inspectDemoBtn')
        print('Demo button found:', btn is not None)

        if btn:
            await btn.scroll_into_view_if_needed()
            await page.screenshot(path='screenshots/agent_ops_with_btn.png', full_page=False)
            await btn.click()
            await page.wait_for_timeout(800)
            await page.screenshot(path='screenshots/demo_modal_open.png', full_page=False)

            # Select a system and param
            try:
                await page.click('.id-sys[data-sys="bms"] .id-param[data-param="1"]', timeout=2000)
                await page.wait_for_timeout(300)
            except Exception as e:
                print('Select param err:', e)
            await page.screenshot(path='screenshots/demo_selected.png', full_page=False)

            try:
                await page.click('#idStartBtn', timeout=2000)
            except Exception as e:
                print('Start err:', e)

            # Wait for link modal to open
            try:
                await page.wait_for_selector('#idLinkMask.open', timeout=30000)
                print('Link modal opened ✓')
                await page.screenshot(path='screenshots/demo_link_modal.png', full_page=False)
                # Click confirm
                await page.click('#idLinkYes')
                # Wait for the done message
                try:
                    await page.wait_for_function(
                        "() => document.getElementById('idStartBtn').textContent.includes('确认并关闭')",
                        timeout=60000
                    )
                    print('Demo complete ✓')
                except Exception as e:
                    print('Wait done timeout:', e)
                # Scroll chat to bottom
                await page.evaluate("document.getElementById('idStream').scrollTop = document.getElementById('idStream').scrollHeight")
                await page.wait_for_timeout(500)
                await page.screenshot(path='screenshots/demo_llm_iter.png', full_page=False)
                await page.wait_for_timeout(1500)
                await page.screenshot(path='screenshots/demo_done.png', full_page=False)
            except Exception as e:
                print('Link modal timeout:', e)
                await page.screenshot(path='screenshots/demo_link_wait.png', full_page=False)

        print('Console errors:', len(console_errors))
        for e in console_errors[:5]:
            print('  -', e[:200])
        print('Page errors:', len(page_errors))
        for e in page_errors[:5]:
            print('  -', e[:200])

        # Check iterLog on main page
        iter_log = await page.evaluate("(() => { const el = document.getElementById('iterLog'); return el ? el.innerHTML : 'NO'; })()")
        if 'bms/internal-r' in iter_log:
            print('iterLog updated ✓ (bms/internal-r found)')
        else:
            print('iterLog content:', iter_log[:500])

        # Check feishuLog
        fs_log = await page.evaluate("(() => { const el = document.getElementById('feishuLog'); return el ? el.innerHTML.length : 0; })()")
        print('feishuLog size:', fs_log)

        # Check alertTimeline
        at = await page.evaluate("(() => { const el = document.getElementById('alertTimeline'); return el ? el.children.length : 0; })()")
        print('alertTimeline count:', at)

        await browser.close()

asyncio.run(main())
