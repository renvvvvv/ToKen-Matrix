"""端到端: 浏览器点击 → 后端代理 → 飞书 webhook 真实送达"""
import asyncio, os, json, urllib.request
from playwright.async_api import async_playwright

URL = 'http://127.0.0.1:8766/console.html'
OUT = r'c:\Users\wuton\Desktop\0627\token-matrix\backend'

async def main():
    errors = []
    net = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width':1680,'height':1050})
        page = await ctx.new_page()
        page.on('pageerror', lambda e: errors.append(f'[pageerror] {e}'))
        page.on('console', lambda m: errors.append(f'[{m.type}] {m.text}') if m.type in ('error',) else None)
        # 监听 webhook 代理请求
        page.on('response', lambda r: net.append(f'{r.request.method} {r.url} → {r.status}') if '/webhook/feishu' in r.url else None)
        await page.goto(URL, wait_until='networkidle', timeout=20000)
        await page.wait_for_timeout(1500)
        await page.evaluate("document.querySelector('[data-page=\"agent-ops\"]').click()")
        await page.wait_for_timeout(1200)
        await page.evaluate("document.querySelector('#paperPipe').scrollIntoView({block:'center'})")
        await page.wait_for_timeout(400)
        # 点击按钮
        await page.click('#paperPullBtn')
        await page.wait_for_timeout(800)
        # 等流程跑到第 5 步 (飞书推送), 大约 4-5 秒
        await page.wait_for_timeout(6500)
        # 截图
        await page.screenshot(path=os.path.join(OUT, 'webhook_step5.png'), full_page=False)
        # 检查 webhook 状态
        status = await page.evaluate("""()=>({
          status: PAPER_DEMO.webhookStatus,
          resp: PAPER_DEMO.webhookResp,
          badge_text: (document.getElementById('ppWhBadge')||{}).textContent
        })""")
        print('=== Webhook 状态 (5秒) ===')
        print(json.dumps(status, ensure_ascii=False, indent=2))
        # 等流程完成
        await page.wait_for_timeout(8000)
        status2 = await page.evaluate("""()=>({
          status: PAPER_DEMO.webhookStatus,
          resp: PAPER_DEMO.webhookResp
        })""")
        print('=== Webhook 状态 (13秒后/流程完成) ===')
        print(json.dumps(status2, ensure_ascii=False, indent=2))
        await page.screenshot(path=os.path.join(OUT, 'webhook_done.png'), full_page=False)
        await b.close()
    print('\n=== 网络请求 ===')
    for n in net: print(n)
    print('\n=== 错误数:', len(errors))
    for e in errors[:5]: print(e)

asyncio.run(main())
