"""验证 论文拉取按钮 + 弹窗 + Xmind + 知识图谱"""
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
        # 1) 点击 A0 (系统总览) 进入总看板
        await page.evaluate("document.querySelector('[data-page=\"overview\"]').click()")
        await page.wait_for_timeout(800)
        # 2) 滚动到论文模块
        await page.evaluate("document.querySelector('#paperPipe').scrollIntoView({block:'center'})")
        await page.wait_for_timeout(500)
        await page.screenshot(path=os.path.join(OUT, 'paper_pipe_with_btn.png'), full_page=False)
        # 3) 点击主动论文拉取按钮
        btn = await page.query_selector('#paperPullBtn')
        if btn:
            await btn.click()
            await page.wait_for_timeout(2000)
            await page.screenshot(path=os.path.join(OUT, 'paper_demo_step1.png'), full_page=False)
            # 等 8s 让流程跑到飞书推送
            await page.wait_for_timeout(7000)
            await page.screenshot(path=os.path.join(OUT, 'paper_demo_step5.png'), full_page=False)
            # 等 10s 跑到结束
            await page.wait_for_timeout(8000)
            await page.screenshot(path=os.path.join(OUT, 'paper_demo_done.png'), full_page=False)
            # 关闭
            close = await page.query_selector('#ppClose')
            if close: await close.click()
            await page.wait_for_timeout(600)
        else:
            print('❌ paperPullBtn 按钮未找到')
        # 4) 截图 Xmind
        await page.evaluate("document.querySelector('#xmindTree').scrollIntoView({block:'center'})")
        await page.wait_for_timeout(500)
        await page.screenshot(path=os.path.join(OUT, 'xmind_tree.png'), full_page=False)
        # 5) 知识图谱小图
        await page.evaluate("document.querySelector('#kgMini').scrollIntoView({block:'center'})")
        await page.wait_for_timeout(500)
        await page.screenshot(path=os.path.join(OUT, 'kg_mini.png'), full_page=False)
        # 6) Cloudsway 灯
        await page.evaluate("document.querySelector('.cloudsway-strip').scrollIntoView({block:'center'})")
        await page.wait_for_timeout(500)
        await page.screenshot(path=os.path.join(OUT, 'cloudsway_strip.png'), full_page=False)
        # 7) 点击 Xmind 中的 BMS 展开
        btns = await page.query_selector_all('.xm-l1-row .b')
        if btns and len(btns) >= 2:
            await btns[1].click()  # 动环
            await page.wait_for_timeout(400)
            await page.screenshot(path=os.path.join(OUT, 'xmind_expand.png'), full_page=False)
        # 8) 点击文件查看细节
        files = await page.query_selector_all('.xm-l2 .l2-row .n')
        if files:
            await files[0].click()
            await page.wait_for_timeout(800)
            await page.screenshot(path=os.path.join(OUT, 'file_detail.png'), full_page=False)
        await b.close()
    print('==== 错误数:', len(errors))
    for e in errors[:20]:
        print(e)

asyncio.run(main())
