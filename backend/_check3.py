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
    # 手动调用 addSkillLibItem
    res = await pg.evaluate("""() => {
      try {
        window._addSkillLibItem({
          name: 'bms/test-skill',
          from: 'v1.0', to: 'v1.1',
          reason: 'test',
          gain: '+15%',
          param: {n: 'TEST-DEV'},
          oldRules: [{k:'判定',v:'A'}],
          newRules: [{k:'判定',v:'B'}],
          sys: {ico: 'BM', name: 'BMS', skillIds: ['s1','s2']},
          ts: Date.now(),
        });
        return { ok: true, count: document.getElementById('skLibList').children.length };
      } catch (e) {
        return { ok: false, err: e.message };
      }
    }""")
    print('add test:', res)
    print('errs:', errs)
    await b.close()

asyncio.run(m())
