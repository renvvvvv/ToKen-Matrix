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
        await page.wait_for_timeout(2000)
        # 1) 点击 A1 (Agent 运营平台) 进入论文模块所在页
        await page.evaluate("document.querySelector('[data-page=\"agent-ops\"]').click()")
        await page.wait_for_timeout(1500)
        # 直接看 body 高度和 page 状态
        info2 = await page.evaluate("""()=>{
          const ov=document.getElementById('page-overview');
          const ops=document.querySelector('.ops-foot');
          return {
            body_h:document.body.offsetHeight,
            overview_active:ov?ov.classList.contains('active'):false,
            overview_w:ov?ov.offsetWidth:0,
            overview_h:ov?ov.offsetHeight:0,
            overview_innerHTML_len:ov?ov.innerHTML.length:0,
            ops_foot_exists:!!ops,
            ops_foot_w:ops?ops.offsetWidth:0,
            ops_foot_h:ops?ops.offsetHeight:0
          };
        }""")
        print('STATE:', info2)
        # 调试: 把 paperPullBtn 的可见性诊断打印
        info = await page.evaluate("""()=>{
          const b=document.querySelector('#paperPullBtn');
          if(!b) return 'no btn';
          const el=b;
          const chain=[];
          let cur=el;
          for(let i=0;i<10 && cur;i++){chain.push({i,tag:cur.tagName,cls:cur.className||'',w:cur.offsetWidth,h:cur.offsetHeight,id:cur.id||''});cur=cur.parentElement;}
          return {chain};
        }""")
        print('BTN CHAIN:')
        for c in info['chain']:
            print(' ',c)
        # 2) 滚动到论文模块
        await page.evaluate("document.querySelector('#paperPipe').scrollIntoView({block:'center'})")
        await page.wait_for_timeout(500)
        # 强制 display flex 解决 demo-bar visibility
        await page.evaluate("document.querySelectorAll('.demo-bar').forEach(b=>{b.style.cssText+='display:flex!important;visibility:visible!important;opacity:1!important'})")
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
