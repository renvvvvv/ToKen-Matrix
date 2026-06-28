"""
动环监控系统页面访问+截图+元素检查脚本 (修正版)
- 点击动环菜单后,实际激活的是 page-detail,其下含 subBanner / subKPI / subBody / subTable
- 重点检查这些子结构
"""
import json
import os
import sys
from playwright.sync_api import sync_playwright

URL = "http://localhost:8123/console.html"
SHOT = r"c:\Users\wuton\Desktop\0627\token-matrix\backend\screenshots\env.png"


def main():
    console_messages = []
    page_errors = []
    failed_requests = []

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        ctx = browser.new_context(
            viewport={"width": 1600, "height": 1000},
            device_scale_factor=1,
            locale="zh-CN",
        )
        page = ctx.new_page()

        page.on("console", lambda msg: console_messages.append({
            "type": msg.type, "text": msg.text, "location": str(msg.location)
        }))
        page.on("pageerror", lambda err: page_errors.append(str(err)))
        page.on("requestfailed", lambda req: failed_requests.append({
            "url": req.url, "failure": req.failure
        }))

        print(f"[1] 打开 {URL}")
        page.goto(URL, wait_until="domcontentloaded", timeout=30000)
        page.wait_for_load_state("networkidle", timeout=15000)
        page.wait_for_timeout(800)

        # 列出所有菜单
        menu = page.evaluate("""() => Array.from(document.querySelectorAll('.menu-item')).map(m=>({
            page:m.dataset.page, title:m.dataset.title, ico:(m.querySelector('.menu-ico')||{}).textContent||''
        }))""")
        print(f"[2] 菜单项数: {len(menu)}")

        # 点击动环
        target = page.locator('.menu-item[data-page="env"]')
        if target.count() == 0:
            print("[FATAL] 找不到动环菜单项 data-page='env'")
            sys.exit(2)
        print("[3] 点击动环菜单")
        target.first.click()
        page.wait_for_timeout(800)

        # 等 subKPI / subTable 出现 (动环子页内容已渲染)
        try:
            page.wait_for_selector('#subKPI .sk-card', timeout=10000)
            print("[4] subKPI 已渲染")
        except Exception as e:
            print(f"[WARN] 等不到 subKPI: {e}")

        try:
            page.wait_for_selector('#subTable table.data-table tbody tr', timeout=10000)
            print("[5] subTable 已渲染")
        except Exception as e:
            print(f"[WARN] 等不到 subTable: {e}")

        try:
            page.wait_for_selector('#subTrend path, #subTrend polyline', timeout=10000)
            print("[6] subTrend 趋势线已渲染")
        except Exception as e:
            print(f"[WARN] 等不到 subTrend 线条: {e}")

        page.wait_for_timeout(800)

        # 全屏截图
        os.makedirs(os.path.dirname(SHOT), exist_ok=True)
        page.screenshot(path=SHOT, full_page=True)
        size = os.path.getsize(SHOT)
        print(f"[7] 截图保存: {SHOT} ({size} bytes)")

        # 详细检查 sub-* 元素
        checks = page.evaluate("""() => {
            const out = {};
            // 1) 横幅
            const banner = document.getElementById('subBanner');
            out.banner = {
                found: !!banner,
                classes: banner ? banner.className : null,
                ico: banner ? (banner.querySelector('.ico')?.textContent || '').trim() : '',
                title: banner ? (banner.querySelector('.txt b')?.textContent || '').trim() : '',
                sub:   banner ? (banner.querySelector('.txt small')?.textContent || '').trim() : '',
                score: banner ? (banner.querySelector('.score')?.textContent || '').trim() : '',
                lvl:   banner ? (banner.querySelector('.lvl')?.textContent || '').trim() : '',
                badges: banner ? Array.from(banner.querySelectorAll('.badges span')).map(s => s.textContent.trim()) : []
            };

            // 2) KPI 5 张卡
            const kpiCards = Array.from(document.querySelectorAll('#subKPI .sk-card'));
            out.kpis = {
                count: kpiCards.length,
                items: kpiCards.map(c => ({
                    ico: (c.querySelector('.sk-ico')?.textContent || '').trim(),
                    name: (c.querySelector('.name')?.textContent || '').replace(/\\s+/g, ' ').trim(),
                    val: (c.querySelector('.val')?.textContent || '').replace(/\\s+/g, ' ').trim(),
                }))
            };
            const requiredKpi = ['冷通道', '热通道', '湿度', 'PUE', 'IT 负载'];
            out.kpis.checklist = requiredKpi.map(n => ({
                name: n,
                present: out.kpis.items.some(it => it.name.includes(n))
            }));

            // 3) 趋势图
            const trend = document.getElementById('subTrend');
            out.trend = {
                found: !!trend,
                pathCount: trend ? trend.querySelectorAll('path').length : 0,
                polylineCount: trend ? trend.querySelectorAll('polyline').length : 0,
                polygonCount: trend ? trend.querySelectorAll('polygon').length : 0,
                circles: trend ? trend.querySelectorAll('circle').length : 0,
                legendItems: Array.from(document.querySelectorAll('#subTrend-legend > *')).map(n => n.textContent.trim()).slice(0, 8)
            };

            // 4) 堆叠条形图
            const stackedBar = document.querySelector('#subBody .stacked-bar');
            const stackedItems = stackedBar ? Array.from(stackedBar.querySelectorAll('i')) : [];
            out.stacked = {
                found: !!stackedBar,
                segments: stackedItems.length,
                widths: stackedItems.map(i => i.getAttribute('style')),
                legend: Array.from(document.querySelectorAll('#subBody .stacked-legend span')).map(s => s.textContent.replace(/\\s+/g,' ').trim())
            };

            // 5) 环形进度条
            const rings = Array.from(document.querySelectorAll('#subBody .ring-list .ring, #subBody .ring'));
            out.rings = {
                count: rings.length,
                items: rings.map(r => ({
                    label: (r.querySelector('.r-name, .lbl, .name, .rl-name')?.textContent || r.textContent).replace(/\\s+/g,' ').trim().slice(0, 50),
                    pct: r.getAttribute('data-pct') || null
                }))
            };
            // SVG 圆环
            const svgRings = document.querySelectorAll('#subBody .ring svg, #subBody svg circle[stroke-dasharray]');
            out.rings.svgCount = svgRings.length;

            // 6) 事件列表
            const events = Array.from(document.querySelectorAll('#subBody .event-list .event-item'));
            out.events = {
                count: events.length,
                items: events.map(e => ({
                    time: (e.querySelector('.ev-time')?.textContent || '').trim(),
                    body: (e.querySelector('.ev-body')?.textContent || '').replace(/\\s+/g,' ').trim().slice(0, 80),
                    lvl:  (e.querySelector('.ev-lvl')?.textContent || '').trim()
                }))
            };

            // 7) 数据表
            const table = document.querySelector('#subTable table.data-table');
            const head = table ? Array.from(table.querySelectorAll('thead th')).map(t => t.textContent.trim()) : [];
            const rows = table ? Array.from(table.querySelectorAll('tbody tr')) : [];
            out.table = {
                found: !!table,
                header: head,
                rowCount: rows.length,
                firstRow: rows[0] ? Array.from(rows[0].querySelectorAll('td')).map(td => td.textContent.replace(/\\s+/g,' ').trim()) : [],
                lastRow: rows[rows.length-1] ? Array.from(rows[rows.length-1].querySelectorAll('td')).map(td => td.textContent.replace(/\\s+/g,' ').trim()) : []
            };

            // 区域统计
            const areaCount = {};
            rows.forEach(r => {
                const cells = Array.from(r.querySelectorAll('td')).map(td => td.textContent.trim());
                for (const c of cells) {
                    const m = c.match(/^F[1-4]$/);
                    if (m) areaCount[m[0]] = (areaCount[m[0]] || 0) + 1;
                }
            });
            out.table.areaDistribution = areaCount;

            return out;
        }""")

        # 控制台错误分类
        error_msgs = [m for m in console_messages if m["type"] == "error"]
        warn_msgs  = [m for m in console_messages if m["type"] == "warning"]
        log_msgs   = [m for m in console_messages if m["type"] == "log"]
        info_msgs  = [m for m in console_messages if m["type"] == "info"]

        # 统计 SVG <polygon> 类型错误
        polygon_errors = [m for m in error_msgs if "<polygon>" in m["text"]]

        report = {
            "url": URL,
            "screenshot": SHOT,
            "screenshot_size_bytes": size,
            "menu_items_count": len(menu),
            "menu_items": menu,
            "checks": checks,
            "console_summary": {
                "total": len(console_messages),
                "error": len(error_msgs),
                "warning": len(warn_msgs),
                "info": len(info_msgs),
                "log": len(log_msgs),
            },
            "polygon_svg_errors": polygon_errors[:5],
            "non_polygon_errors": [m for m in error_msgs if "<polygon>" not in m["text"]][:10],
            "page_errors": page_errors,
            "failed_requests": failed_requests,
        }
        out_json = SHOT.replace(".png", "_report.json")
        with open(out_json, "w", encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        print(f"[8] 报告写入: {out_json}")

        # 打印摘要
        print("\n========== 检查摘要 ==========")
        print(f"横幅 ico:  '{checks['banner']['ico']}'")
        print(f"横幅 title: '{checks['banner']['title']}'")
        print(f"横幅 score: {checks['banner']['score']} lvl={checks['banner']['lvl']} badges={checks['banner']['badges']}")
        print(f"KPI 数量: {checks['kpis']['count']}")
        for it in checks['kpis']['items']:
            print(f"   - {it['ico']} | {it['name']} | {it['val']}")
        print(f"KPI checklist: {checks['kpis']['checklist']}")
        print(f"趋势图: found={checks['trend']['found']} path={checks['trend']['pathCount']} polyline={checks['trend']['polylineCount']} polygon={checks['trend']['polygonCount']} circles={checks['trend']['circles']}")
        print(f"趋势图 legend: {checks['trend']['legendItems']}")
        print(f"stacked-bar 段数: {checks['stacked']['segments']}")
        print(f"stacked-bar legend: {checks['stacked']['legend']}")
        print(f"环形进度条(div.ring): {checks['rings']['count']} (含 svg: {checks['rings']['svgCount']})")
        for r in checks['rings']['items']:
            print(f"   - {r['label']}")
        print(f"事件列表条数: {checks['events']['count']}")
        for e in checks['events']['items'][:5]:
            print(f"   - {e['time']} | {e['body']} | {e['lvl']}")
        print(f"数据表: rows={checks['table']['rowCount']} head={checks['table']['header']}")
        print(f"   首行: {checks['table']['firstRow']}")
        print(f"   末行: {checks['table']['lastRow']}")
        print(f"   区域分布(F1-F4): {checks['table']['areaDistribution']}")
        print(f"\nConsole: total={len(console_messages)} error={len(error_msgs)} warn={len(warn_msgs)}")
        print(f"  其中 <polygon> SVG 错误: {len(polygon_errors)} 条")
        if polygon_errors:
            print(f"  示例: {polygon_errors[0]['text'][:150]}")
        non_poly = [m for m in error_msgs if "<polygon>" not in m["text"]]
        if non_poly:
            print("  非 polygon 错误:")
            for m in non_poly[:5]:
                print(f"    - [{m['type']}] {m['text'][:200]}")
        print(f"pageerror: {len(page_errors)}")
        print(f"failed_requests: {len(failed_requests)}")
        for fr in failed_requests[:5]:
            print(f"   - {fr}")
        print("================================\n")

        browser.close()
        return report


if __name__ == "__main__":
    main()
