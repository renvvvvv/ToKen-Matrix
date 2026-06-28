import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx = await browser.new_context(viewport={'width': 1600, 'height': 980})
        page = await ctx.new_page()
        errs = []
        page.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: errs.append(str(e)))

        # 1. 主控制台
        await page.goto('http://127.0.0.1:8766/console.html', wait_until='domcontentloaded')
        await page.wait_for_timeout(2000)
        await page.click('.menu-item[data-page="agent-ops"]')
        await page.wait_for_timeout(1500)
        await page.click('#inspectDemoBtn')
        await page.wait_for_timeout(400)
        # 选 BMS
        await page.click('.id-sys[data-sys="bms"] .id-param[data-param="1"]')
        await page.wait_for_timeout(300)
        await page.click('#idStartBtn')
        # 等到内嵌确认面板自动弹出
        try:
            await page.wait_for_selector('#idLinkMask.open', timeout=20000)
            print('✓ 内嵌确认面板自动弹出')
        except Exception as e:
            print('✗ 内嵌确认面板未弹出:', e)

        # 截图:确认面板
        await page.screenshot(path='screenshots/fix_inline_confirm_open.png', full_page=False)

        # 2. 检查对话流是否有滚动条
        scroll_info = await page.evaluate('''() => {
          const s = document.getElementById('idStream');
          return {
            sh: s.scrollHeight,
            ch: s.clientHeight,
            st: s.scrollTop,
            canScroll: s.scrollHeight > s.clientHeight + 10,
            overflowY: getComputedStyle(s).overflowY,
          };
        }''')
        print(f'对话流: scrollH={scroll_info["sh"]} clientH={scroll_info["ch"]} canScroll={scroll_info["canScroll"]} overflowY={scroll_info["overflowY"]}')

        # 3. 滚动对话流到底部
        await page.evaluate("document.getElementById('idStream').scrollTop = document.getElementById('idStream').scrollHeight")
        await page.wait_for_timeout(500)
        await page.screenshot(path='screenshots/fix_stream_scrolled.png', full_page=False)

        # 4. 在内嵌确认面板填反馈并点确认(跳过文件上传)
        await page.fill('#idLinkFeedback', '已到达现场,内阻下降至 0.34mΩ,BMS 重均衡完成,设备稳定。')
        await page.wait_for_timeout(300)
        # 直接通过 JS 模拟上传(用 dataURL)
        await page.evaluate("""() => {
          const f = '已上传 · 1 张现场照片';
          const e = document.getElementById('idUploadText');
          e.textContent = f;
          document.getElementById('idLinkUpload').classList.add('has');
        }""")
        await page.wait_for_timeout(300)
        # 点击 ✓ 已确认修复
        await page.click('#idLinkYes')
        await page.wait_for_timeout(500)

        # 5. 等 7 步完成
        try:
            await page.wait_for_function(
                "() => document.getElementById('idStartBtn').textContent.includes('确认并关闭')",
                timeout=90000
            )
            print('✓ 7 步闭环完成')
        except Exception as e:
            print('✗ 7 步未完成:', e)

        # 截图:对话流到底
        await page.evaluate("document.getElementById('idStream').scrollTop = document.getElementById('idStream').scrollHeight")
        await page.wait_for_timeout(500)
        await page.screenshot(path='screenshots/fix_7step_done.png', full_page=False)

        # 6. 关闭演示 - 点击"确认并关闭"
        try:
            btn_text = await page.evaluate("() => document.getElementById('idStartBtn').textContent")
            print(f'开始按钮文字: {btn_text}')
            if '确认' in btn_text:
                await page.click('#idStartBtn')
                await page.wait_for_timeout(1500)
        except Exception as e:
            print('close demo click err:', e)

        # 7. 检查主面板 Skill 库 / RAG 归档
        sk_count = await page.evaluate("() => document.getElementById('skLibList').children.length")
        rag_count = await page.evaluate("() => document.getElementById('ragList').children.length")
        print(f'主面板 Skill 库: {sk_count} 项, RAG 归档: {rag_count} 篇')
        # 滚到能看到的位置
        await page.evaluate("document.querySelector('.iter-log').scrollIntoView({behavior:'smooth', block:'center'})")
        await page.wait_for_timeout(800)
        await page.screenshot(path='screenshots/fix_mainpanel_sk_rag.png', full_page=True)

        # 8. 点击 Skill 库的第一项
        if sk_count > 0:
            await page.click('#skLibList .item:first-child')
            await page.wait_for_timeout(500)
            await page.screenshot(path='screenshots/fix_skill_detail.png', full_page=False)
            detail_open = await page.evaluate("() => document.getElementById('skDetailMask').classList.contains('open')")
            print(f'Skill 详情弹窗打开: {detail_open}')

        # 9. 单独打开 confirm.html 验证
        link_url = await page.evaluate("() => { try { return JSON.parse(localStorage.getItem('tkm_c_'+window.INSPECT_DEMO._state.lastToken)).dev; } catch(e){return null;} }")
        print(f'localStorage 保存的 dev: {link_url}')
        # 用最近一次的链接打开
        oneTime = await page.evaluate("() => window.INSPECT_DEMO._state.lastToken")
        link_url = f'http://127.0.0.1:8766/confirm.html?token={oneTime}'
        confirm_page = await ctx.new_page()
        confirm_page.on('console', lambda m: errs.append('CONFIRM:'+m.text) if m.type == 'error' else None)
        await confirm_page.goto(link_url, wait_until='domcontentloaded')
        await confirm_page.wait_for_timeout(800)
        await confirm_page.screenshot(path='screenshots/fix_confirm_page_v2.png', full_page=False)
        title = await confirm_page.evaluate("() => document.getElementById('aDev')?.textContent || 'EMPTY'")
        print(f'confirm.html 解析: dev={title}')

        print('Console errors:', len(errs))
        for e in errs[:5]: print('  -', e[:200])
        await browser.close()

asyncio.run(main())
