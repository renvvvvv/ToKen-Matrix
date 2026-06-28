import asyncio
from playwright.async_api import async_playwright

async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    c=await b.new_context(viewport={'width':1600,'height':980})
    pg=await c.new_page()
    errs = []
    pg.on('console', lambda m: errs.append(f'{m.type}: {m.text[:300]}'))
    pg.on('pageerror', lambda e: errs.append('PAGEERR: '+str(e)[:300]))
    await pg.goto('http://127.0.0.1:8766/console.html')
    await pg.wait_for_timeout(2000)
    await pg.click('.menu-item[data-page="agent-ops"]')
    await pg.wait_for_timeout(1500)
    info = await pg.evaluate("""() => ({
      addSL: typeof window._addSkillLibItem,
      addRAG: typeof window._addRagItem,
      INSPECT: typeof window.INSPECT_DEMO,
      skLib: !!document.getElementById('skLibList'),
      ragList: !!document.getElementById('ragList'),
    })""")
    print('globals:', info)
    print('errs:', errs)
    await b.close()

asyncio.run(m())
