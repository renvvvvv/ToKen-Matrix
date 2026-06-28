"""
一次性验证 5 个子系统页面 (BMS/动环/消防/安防/BA) 的修复结果
- 检查所有元素正常显示
- 检查 console 错误清零
- 截图保存
"""
import asyncio
import json
import os
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOTS_DIR = Path(r"c:\Users\wuton\Desktop\0627\token-matrix\backend\screenshots")
SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)

SUBSYSTEMS = [
    {"page": "bms",      "title": "BMS 电池系统",   "ico": "BM", "score": 96, "kpis_n": 5, "table_rows": 20, "rings": 8, "events": 3, "has_cluster": True},
    {"page": "env",      "title": "动环监控系统",   "ico": "EH", "score": 93, "kpis_n": 5, "table_rows": 20, "rings": 8, "events": 4, "has_stacked": True},
    {"page": "fire",     "title": "消防系统",       "ico": "FR", "score": 97, "kpis_n": 5, "table_rows": 20, "rings": 12, "events": 3, "has_parts": True},
    {"page": "security", "title": "安防系统",       "ico": "SC", "score": 94, "kpis_n": 5, "table_rows": 20, "rings": 8, "events": 3, "has_stacked": True},
    {"page": "ba",       "title": "BA 楼宇自动化",  "ico": "BA", "score": 91, "kpis_n": 5, "table_rows": 20, "rings": 8, "events": 3, "has_stacked": True},
]

async def verify_subpage(page, sub):
    """进入子系统页面, 检查元素 + 收集 console 消息 + 截图"""
    report = {
        "page": sub["page"],
        "title": sub["title"],
        "checks": {},
        "console_errors": [],
        "page_errors": [],
        "screenshot": None,
        "pass": False,
    }
    # 收集 console 消息
    console_errors = []
    page_errors = []
    def on_console(msg):
        if msg.type == "error":
            console_errors.append(msg.text[:300])
    def on_pageerror(err):
        page_errors.append(str(err)[:300])
    page.on("console", on_console)
    page.on("pageerror", on_pageerror)

    # 点击菜单
    await page.click(f'.menu-item[data-page="{sub["page"]}"]')
    await page.wait_for_timeout(500)  # 等 setTimeout(renderTrendSVG, 30) 渲染
    # 强制等待 trend SVG 渲染完成 (>= 8 path)
    try:
        await page.wait_for_function(
            "() => { const s = document.getElementById('subTrend'); return s && s.querySelectorAll('path').length >= 8; }",
            timeout=3000
        )
    except Exception:
        pass  # 继续, 后面会显示 path_count

    # 1. 横幅
    banner = await page.query_selector("#subBanner")
    if banner:
        cls = await banner.get_attribute("class")
        ico_el = await page.query_selector(".sub-banner .ico")
        title_el = await page.query_selector(".sub-banner .txt b")
        score_el = await page.query_selector(".sub-banner .right .score")
        ico = await ico_el.text_content() if ico_el else ""
        title = await title_el.text_content() if title_el else ""
        score = await score_el.text_content() if score_el else ""
        report["checks"]["banner"] = {
            "exists": True, "class": cls, "ico": ico.strip(), "title": title.strip(), "score": score.strip()
        }
    else:
        report["checks"]["banner"] = {"exists": False}

    # 2. KPI 卡片
    kpi_cards = await page.query_selector_all(".sk-card")
    kpi_data = []
    for card in kpi_cards:
        n_el = await card.query_selector(".sk-card .name")
        v_el = await card.query_selector(".sk-card .val")
        n = await n_el.text_content() if n_el else ""
        v = await v_el.text_content() if v_el else ""
        kpi_data.append({"name": n.strip(), "val": v.strip()})
    report["checks"]["kpis"] = {"count": len(kpi_cards), "items": kpi_data}
    report["checks"]["kpis"]["expected"] = sub["kpis_n"]

    # 3. 趋势图 - 通过 evaluate 直接读取 SVG 内部 HTML
    trend_info = await page.evaluate("""() => {
      const svg = document.getElementById('subTrend');
      if (!svg) return {path_count: 0, html_len: 0, html_preview: 'NOT_FOUND', elementTypes: {}};
      // 统计各种元素类型
      const allChildren = svg.querySelectorAll('*');
      const types = {};
      allChildren.forEach(el => {
        const tag = el.tagName.toLowerCase();
        types[tag] = (types[tag] || 0) + 1;
      });
      return {
        path_count: svg.querySelectorAll('path').length,
        circle_count: svg.querySelectorAll('circle').length,
        text_count: svg.querySelectorAll('text').length,
        line_count: svg.querySelectorAll('line').length,
        html_len: svg.innerHTML.length,
        elementTypes: types,
        html_preview: svg.innerHTML.substring(0, 200),
        html_middle: svg.innerHTML.substring(200, 600),
        html_end: svg.innerHTML.substring(600)
      };
    }""")
    report["checks"]["trend"] = {
        "path_count": trend_info["path_count"],
        "circle_count": trend_info["circle_count"],
        "text_count": trend_info["text_count"],
        "line_count": trend_info.get("line_count", 0),
        "html_len": trend_info["html_len"],
        "elementTypes": trend_info.get("elementTypes", {}),
        "html_preview": trend_info.get("html_preview", ""),
        "valid": trend_info["path_count"] >= 8,
    }

    # 4. 簇分布 (BMS)
    if sub.get("has_cluster"):
        cells = await page.query_selector_all(".cluster-cell")
        report["checks"]["cluster"] = {"count": len(cells), "expected": 12}

    # 5. 堆叠条 (env/security/ba)
    if sub.get("has_stacked"):
        stacked = await page.query_selector_all(".stacked-bar i")
        report["checks"]["stacked"] = {"count": len(stacked)}

    # 6. 部件明细 (fire)
    if sub.get("has_parts"):
        parts = await page.query_selector_all(".cluster-cell")
        report["checks"]["parts"] = {"count": len(parts), "expected": 6}

    # 7. 环形进度条
    rings = await page.query_selector_all(".ring-row")
    report["checks"]["rings"] = {"count": len(rings), "expected": sub["rings"]}

    # 8. 事件列表
    events = await page.query_selector_all(".event-item")
    report["checks"]["events"] = {"count": len(events), "expected": sub["events"]}

    # 9. 数据表
    rows = await page.query_selector_all("#subTable tbody tr")
    report["checks"]["table"] = {"row_count": len(rows), "expected": sub["table_rows"]}

    # 10. 截图
    screenshot_path = SCREENSHOTS_DIR / f"{sub['page']}_fixed.png"
    await page.screenshot(path=str(screenshot_path), full_page=True)
    report["screenshot"] = str(screenshot_path)

    # 11. 报告 console 错误
    report["console_errors"] = console_errors
    report["page_errors"] = page_errors

    # 12. 判断通过
    report["pass"] = (
        report["checks"]["banner"].get("exists", False) and
        report["checks"]["kpis"]["count"] == sub["kpis_n"] and
        report["checks"]["trend"]["valid"] and
        report["checks"]["rings"]["count"] == sub["rings"] and
        report["checks"]["table"]["row_count"] == sub["table_rows"] and
        len(console_errors) == 0 and
        len(page_errors) == 0
    )

    # 取消事件监听
    page.remove_listener("console", on_console)
    page.remove_listener("pageerror", on_pageerror)
    return report

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1600, "height": 1000})
        page = await context.new_page()

        # 先访问页面一次, 加载所有依赖 (cache busting)
        await page.goto(f"http://localhost:8123/console.html?v={int(__import__('time').time())}")
        await page.wait_for_load_state("networkidle")
        # 启用 SVG 命名空间调试
        await page.evaluate("window._trendDebug = true;")
        await page.wait_for_timeout(1000)

        all_reports = []
        for sub in SUBSYSTEMS:
            print(f"\n{'='*60}\n>>> 验证 {sub['page']} ({sub['title']})")
            report = await verify_subpage(page, sub)
            all_reports.append(report)
            print(f"  横幅: {report['checks']['banner'].get('title', '?')}")
            print(f"  KPI: {report['checks']['kpis']['count']}/{sub['kpis_n']}")
            print(f"  趋势: path={report['checks']['trend']['path_count']}, html_len={report['checks']['trend'].get('html_len', 0)}")
            if report['checks']['trend'].get('html_preview'):
                print(f"    preview: {report['checks']['trend']['html_preview'][:200]}")
            print(f"  环形: {report['checks']['rings']['count']}/{sub['rings']}")
            print(f"  数据表: {report['checks']['table']['row_count']} 行")
            print(f"  事件: {report['checks']['events']['count']}/{sub['events']}")
            if "cluster" in report["checks"]:
                print(f"  簇: {report['checks']['cluster']['count']}/{sub.get('has_cluster','')}")
            if "stacked" in report["checks"]:
                print(f"  堆叠: {report['checks']['stacked']['count']} 段")
            if "parts" in report["checks"]:
                print(f"  部件: {report['checks']['parts']['count']}/6")
            print(f"  Console 错误: {len(report['console_errors'])} 条")
            for e in report["console_errors"][:5]:
                print(f"    - {e[:150]}")
            print(f"  Page 错误: {len(report['page_errors'])} 条")
            print(f"  截图: {report['screenshot']}")
            print(f"  通过: {report['pass']}")

        # 保存报告
        report_path = SCREENSHOTS_DIR / "all_subsystems_report.json"
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(all_reports, f, ensure_ascii=False, indent=2)
        print(f"\n报告已保存: {report_path}")

        # 总结
        print("\n" + "="*60)
        print("汇总:")
        passed = sum(1 for r in all_reports if r["pass"])
        print(f"通过: {passed}/{len(all_reports)}")
        total_console_errors = sum(len(r["console_errors"]) for r in all_reports)
        print(f"总 console 错误: {total_console_errors}")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
