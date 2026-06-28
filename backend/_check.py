import asyncio
from playwright.async_api import async_playwright

async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    c=await b.new_context(viewport={'width':1600,'height':980})
    pg=await c.new_page()
    errs = []
    pg.on('console', lambda m: errs.append(f'{m.type}: {m.text[:200]}') if m.type in ('error','warning') else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERR: '+str(e)[:300]))
    await pg.goto('http://127.0.0.1:8766/console.html')
    await pg.wait_for_timeout(2500)
    print('Step 1 goto done')
    print('Errs so far:', errs)
    has_btn = await pg.evaluate("() => !!document.getElementById('inspectDemoBtn')")
    print('inspectDemoBtn exists:', has_btn)
    has_menu = await pg.evaluate("() => !!document.querySelector('.menu-item[data-page=\"agent-ops\"]')")
    print('agent-ops menu exists:', has_menu)
    await pg.click('.menu-item[data-page="agent-ops"]')
    await pg.wait_for_timeout(1500)
    has_btn2 = await pg.evaluate("() => !!document.getElementById('inspectDemoBtn')")
    print('After menu click inspectDemoBtn exists:', has_btn2)
    await pg.click('#inspectDemoBtn')
    await pg.wait_for_timeout(1500)
    mask = await pg.evaluate("() => document.getElementById('inspectDemoMask') ? document.getElementById('inspectDemoMask').className : 'NO MASK'")
    print('Mask class:', mask)
    print('Final errs:', errs)
    await b.close()

asyncio.run(m())
