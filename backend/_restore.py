# -*- coding: utf-8 -*-
"""恢复 console.html:补回缺失 CSS + 添加像素战图"""

PATH = r"c:\Users\wuton\Desktop\0627\token-matrix\backend\console.html"

# 1) 原 console.html 中 .llm-tag::before 与 </style> 之间的 CSS（从前面的 read 推导）
ORIGINAL_MIDDLE_CSS = """    .llm-tag{display:inline-flex;align-items:center;gap:5px;background:#e0f2fe;color:#0369a1;border-radius:999px;padding:2px 9px;font-size:10px;font-weight:900;margin-left:6px}
    .llm-tag::before{content:"";width:6px;height:6px;border-radius:50%;background:#10b981;animation:dotpulse 1.5s infinite}
    .role-strip{display:flex;align-items:center;gap:11px;background:linear-gradient(90deg,#fff,#e0f2fe);border:1px solid #cbe8f8;border-radius:10px;padding:9px 12px;margin-top:9px}
    .role-strip .role-av{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#0ea5e9,#06b6d4);color:#fff;font-weight:900;display:grid;place-items:center;font-size:14px;flex:0 0 auto;box-shadow:0 4px 12px rgba(14,165,233,.25)}
    .role-strip b{color:var(--title);font-size:13px;display:block}
    .role-strip small{color:var(--muted);font-size:11px}
    .role-strip .role-meta{margin-left:auto;display:flex;gap:5px;align-items:center}
    .role-strip .role-meta .tag{font-size:10px;font-weight:900;padding:2px 7px;border-radius:99px;background:#dcfce7;color:#047857}
    .six-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:10px}
    .six-card{background:#fff;border:1px solid var(--line);border-radius:11px;padding:10px 12px;position:relative;overflow:hidden;box-shadow:0 3px 12px rgba(15,23,42,.04);animation:fade .25s ease}
    .six-card .head{display:flex;align-items:center;gap:7px;margin-bottom:6px}
    .six-card .head .ix{width:22px;height:22px;border-radius:7px;background:linear-gradient(135deg,#0ea5e9,#06b6d4);color:#fff;font-size:11px;font-weight:900;display:grid;place-items:center;flex:0 0 auto}
    .six-card .head b{font-size:12px;color:var(--title)}
    .six-card .finding{font-size:12px;color:var(--text);line-height:1.55;margin-bottom:6px}
    .six-card .evidence{font-size:11px;color:var(--muted);background:#f4faff;border-left:2px solid var(--blue);padding:5px 8px;border-radius:6px;margin-bottom:6px}
    .six-card .suggest{font-size:11px;color:var(--text);background:#fef9c3;border-left:2px solid #ca8a04;padding:5px 8px;border-radius:6px}
    .skillsLearned{margin-top:10px;display:flex;flex-direction:column;gap:6px}
    .sl-skill{display:flex;align-items:center;gap:9px;background:#fff;border:1px solid var(--line);border-left:3px solid #f59e0b;border-radius:9px;padding:6px 10px;font-size:12px}
    .sl-skill .ver{font-size:9px;font-weight:900;background:#fef3c7;color:#b45309;padding:1px 5px;border-radius:4px}
    .sl-skill b{flex:1;color:var(--title)}
    .sl-skill .acc{border:0;background:#10b981;color:#fff;border-radius:6px;height:22px;padding:0 9px;font-size:11px;font-weight:900;cursor:pointer}
    .observe-list{margin-top:8px;background:#fff;border:1px solid var(--line);border-radius:9px;padding:8px 10px;font-size:12px;color:var(--text)}
    .observe-list .o-row{display:grid;grid-template-columns:42px 1fr auto;gap:8px;padding:5px 0;border-bottom:1px dashed #e8f0f8;align-items:center}
    .observe-list .o-row:last-child{border-bottom:0}
    .o-row .lv{font-size:9px;font-weight:900;color:#fff;border-radius:4px;padding:2px 5px;text-align:center}
    .o-row .lv.P0{background:#ef4444}.o-row .lv.P1{background:#f59e0b}.o-row .lv.P2{background:#0ea5e9}.o-row .lv.P3{background:#10b981}
    .o-row .acc{border:1px solid #10b981;color:#047857;background:#f0fdf4;border-radius:6px;height:22px;padding:0 8px;font-size:10px;font-weight:900;cursor:pointer}
    .observe-tools{display:flex;gap:7px;margin-top:9px;align-items:center;flex-wrap:wrap}
    .observe-tools .btn.active{background:#10b981;border-color:#10b981;color:#fff}"""

# 2) 新增的像素战图 CSS
NEW_PXM_CSS = """
    /* ============== 中央指挥中心 · 像素战图 ============== */
    .pxm-wrap{display:flex;flex-direction:column;height:calc(100vh - 180px);min-height:560px}
    .pxm-hd{display:flex;flex-wrap:wrap;gap:9px;align-items:center;padding:10px 14px;background:linear-gradient(90deg,#fff 0%,#f4faff 100%);border:1px solid var(--line);border-radius:12px;margin-bottom:12px;box-shadow:0 4px 14px rgba(15,23,42,.04)}
    .pxm-stat{display:flex;align-items:center;gap:7px;background:#fff;border:1px solid var(--line);border-radius:99px;padding:5px 12px;font-size:12px}
    .pxm-stat .pi{font-size:15px;line-height:1}
    .pxm-stat b{color:var(--title);font-size:13px;font-weight:900;margin:0 3px}
    .pxm-stat small{color:var(--muted);font-size:11px}
    .pxm-scn{border:0;color:#fff;border-radius:8px;height:30px;padding:0 12px;font-size:11px;font-weight:900;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:.2s;letter-spacing:.03em}
    .pxm-scn:hover{transform:translateY(-1px)}
    .pxm-scn.env{background:linear-gradient(135deg,#ef4444,#fb7185);box-shadow:0 4px 12px rgba(239,68,68,.3)}
    .pxm-scn.fire{background:linear-gradient(135deg,#f59e0b,#fbbf24);box-shadow:0 4px 12px rgba(245,158,11,.3)}
    .pxm-scn.cctv{background:linear-gradient(135deg,#8b5cf6,#a78bfa);box-shadow:0 4px 12px rgba(139,92,246,.3)}
    .pxm-scn.reset{background:#fff;color:var(--muted);border:1px solid var(--line);box-shadow:none}
    .pxm-split{display:grid;grid-template-columns:1fr 1fr;gap:12px;flex:1;min-height:0}
    .pxm-panel{background:#fff;border:1px solid var(--line);border-radius:14px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 6px 22px rgba(15,23,42,.05)}
    .pxm-phead{height:44px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:0 14px;background:linear-gradient(90deg,#f6fbff,#fff)}
    .pxm-phead b{color:var(--title);font-size:13px;font-weight:900}
    .pxm-phead small{color:var(--muted);font-size:11px}
    .pxm-pbody{flex:1;padding:10px;overflow:hidden;display:grid;place-items:center;position:relative}
    .pxm-pfoot{height:96px;border-top:1px solid var(--line);padding:10px 14px;background:#f8fbff;overflow:auto}
    .pxm-bd-svg{width:100%;height:100%;max-width:520px}
    .pxm-floor-front{fill:#cbd5e1;stroke:#475569;stroke-width:.8;cursor:pointer;transition:filter .2s}
    .pxm-floor-front:hover{filter:brightness(1.05)}
    .pxm-floor-top{fill:#e0f2fe;stroke:#0284c7;stroke-width:.7}
    .pxm-floor-side{fill:#94a3b8;stroke:#475569;stroke-width:.6}
    .pxm-floor-front.warn{fill:#fde68a;stroke:#b45309;stroke-width:.9}
    .pxm-floor-top.warn{fill:#fef3c7;stroke:#d97706}
    .pxm-floor-front.alert{fill:#fca5a5;stroke:#b91c1c;stroke-width:1;animation:floorAlarm 1.4s infinite}
    .pxm-floor-top.alert{fill:#fecaca;stroke:#dc2626;stroke-width:.9;animation:floorAlarm 1.4s infinite}
    .pxm-floor-side.alert{fill:#f87171;stroke:#b91c1c}
    .pxm-window{fill:#bae6fd;stroke:#0284c7;stroke-width:.4}
    .pxm-window.alert{fill:#fee2e2;stroke:#dc2626}
    .pxm-window.warn{fill:#fef3c7;stroke:#d97706}
    .pxm-floor-label{font:bold 10px "Microsoft YaHei",monospace;fill:#0f172a;text-anchor:middle;dominant-baseline:middle;paint-order:stroke;stroke:#fff;stroke-width:2.5;cursor:pointer}
    .pxm-floor-label.alert{fill:#b91c1c}
    @keyframes floorAlarm{50%{filter:brightness(1.18) saturate(1.2)}}
    .pxm-lib-svg{width:100%;height:100%;max-width:560px}
    .pxm-lib-floor{fill:#d4a574;opacity:.22}
    .pxm-lib-grid{stroke:#a0826d;stroke-width:.25;opacity:.4}
    .pxm-shelf-cool{fill:#3b82f6;stroke:#1d4ed8;stroke-width:.5}
    .pxm-shelf-power{fill:#eab308;stroke:#a16207;stroke-width:.5}
    .pxm-shelf-fire{fill:#ef4444;stroke:#b91c1c;stroke-width:.5}
    .pxm-shelf-cctv{fill:#a855f7;stroke:#7e22ce;stroke-width:.5}
    .pxm-shelf-sec{fill:#10b981;stroke:#047857;stroke-width:.5}
    .pxm-shelf-net{fill:#06b6d4;stroke:#0e7490;stroke-width:.5}
    .pxm-shelf-label{font:bold 9px "Microsoft YaHei",monospace;fill:#fff;text-anchor:middle;dominant-baseline:middle;pointer-events:none}
    .pxm-desk{fill:#94a3b8;stroke:#475569;stroke-width:.3}
    .pxm-node{fill:#fbbf24;stroke:#fff;stroke-width:1.5;filter:drop-shadow(0 0 5px #fbbf24)}
    .pxm-node.active{animation:nodeGlow 1.2s infinite}
    @keyframes nodeGlow{50%{filter:drop-shadow(0 0 12px #fde047)}}
    .pxm-rb-body{fill:#0ea5e9}
    .pxm-rb-head{fill:#38bdf8}
    .pxm-rb-eye{fill:#0f172a}
    .pxm-rb-leg{fill:#0284c7}
    .pxm-rb.active .pxm-rb-body{fill:#10b981}
    .pxm-rb.active .pxm-rb-head{fill:#34d399}
    .pxm-rb.active .pxm-rb-leg{fill:#047857}
    .pxm-rb.warn .pxm-rb-body{fill:#f59e0b}
    .pxm-rb.warn .pxm-rb-head{fill:#fbbf24}
    .pxm-rb.warn .pxm-rb-leg{fill:#b45309}
    .pxm-rb.alert .pxm-rb-body{fill:#ef4444;animation:rbPulse .8s infinite}
    .pxm-rb.alert .pxm-rb-head{fill:#fb7185;animation:rbPulse .8s infinite}
    .pxm-rb.alert .pxm-rb-leg{fill:#b91c1c}
    @keyframes rbPulse{50%{opacity:.7}}
    .pxm-rb-text{font:bold 6px monospace;fill:#0f172a;text-anchor:middle;pointer-events:none}
    .pxm-floor-info{font-size:11px;color:var(--muted);line-height:1.65}
    .pxm-floor-info b{color:var(--title);font-size:12px;display:block;margin-bottom:2px}
    .pxm-floor-info .tag{display:inline-block;font-size:9px;font-weight:900;padding:1px 5px;border-radius:4px;margin-left:4px}
    .pxm-floor-info .tag.alert{background:#fee2e2;color:#b91c1c}
    .pxm-floor-info .tag.warn{background:#fef3c7;color:#b45309}
    .pxm-floor-info .tag.ok{background:#dcfce7;color:#047857}
    .pxm-ev{display:flex;gap:8px;font-size:11px;color:var(--text);padding:4px 0;border-bottom:1px dashed #e8f0f8;align-items:center}
    .pxm-ev:last-child{border-bottom:0}
    .pxm-ev .t{color:var(--weak);font-variant-numeric:tabular-nums;flex:0 0 50px}
    .pxm-ev b{color:var(--title);font-weight:900}
    .pxm-ev .tag{font-size:9px;font-weight:900;padding:1px 5px;border-radius:4px;background:rgba(0,0,0,.06);color:#0369a1;margin-left:auto;white-space:nowrap}
    @media(max-width:1500px){.pxm-split{grid-template-columns:1fr}}
"""

# 读取当前文件
with open(PATH, "r", encoding="utf-8") as f:
    src = f.read()

print(f"当前文件长度: {len(src)} 字符")

# 1) 把 </style> 之前替换为 ORIGINAL_MIDDLE_CSS + NEW_PXM_CSS + </style>
# 当前文件: ... .llm-tag::before{...}\n  </style>\n</head>...
# 替换为: ... .llm-tag::before{...}\n  + ORIGINAL_AFTER_llmtag + NEW_PXM_CSS \n  </style>\n</head>...
# 注意 ORIGINAL_MIDDLE_CSS 已包含 .llm-tag::before 一行

anchor_old = '    .llm-tag::before{content:"";width:6px;height:6px;border-radius:50%;background:#10b981;animation:dotpulse 1.5s infinite}\n  </style>'
anchor_new = ORIGINAL_MIDDLE_CSS + NEW_PXM_CSS + "\n  </style>"

if anchor_old not in src:
    print("❌ 锚点未找到!")
    raise SystemExit(1)

src = src.replace(anchor_old, anchor_new, 1)
print(f"✅ CSS 恢复+扩展完成,新长度: {len(src)} 字符")

# 2) 添加菜单项 - 在 Agent运营管理平台 之后插入
menu_old = '<div class="menu-item" data-page="agent-ops" data-agent="token母体-AgentOps"><i class="menu-ico">A0</i>Agent运营管理平台<span class="badge warn">新</span></div>'
menu_new = menu_old + '<div class="menu-item" data-page="pixelmap" data-agent="token母体-总览"><i class="menu-ico">PX</i>中央指挥中心<span class="badge warn">新</span></div>'

if menu_old not in src:
    print("❌ 菜单锚点未找到!")
    raise SystemExit(1)

src = src.replace(menu_old, menu_new, 1)
print("✅ 菜单项已添加")

# 3) 添加新页面 HTML（在 page-agent-ops 结束之后）
# 锚点: ...</div></div></div>    <- page-agent-ops 的最后一个 </div>
# 实际找一个稳定的锚点
page_anchor_old = '''<div class="section-title">学习闭环 &nbsp;·&nbsp; 知识蒸馏</div>
        <div class="ops-foot">'''
page_anchor_new = '''<div class="section-title">学习闭环 &nbsp;·&nbsp; 知识蒸馏</div>
        <div class="ops-foot">'''

# 实际策略:在 page-agent-ops 之前插入新页面。找 page-agent-ops 之前的一个稳定字符串
page_before = '<div class="page" id="page-agent-ops">'
if page_before not in src:
    print("❌ page-agent-ops 锚点未找到!")
    raise SystemExit(1)

PX_PAGE_HTML = '''<div class="page" id="page-pixelmap">
  <div class="section-title">中央指挥中心 · 像素战图<small style="font-weight:500;color:var(--muted);font-size:11px;margin-left:8px">左：楼栋等距图 · 右：图书馆俯视图 · 告警联动</small></div>
  <div class="pxm-wrap">
    <div class="pxm-hd">
      <div class="pxm-stat"><span class="pi">🏢</span><div><b>6</b>层 · <b id="pxmRobotCount">12</b> 机器人在岗</div></div>
      <div class="pxm-stat"><span class="pi">🚨</span><div><b id="pxmAlarm">1</b> P0 · <b id="pxmWarn">2</b> P1</div></div>
      <div class="pxm-stat"><span class="pi">📚</span><div><b>148</b> 节点 · <b>28</b> SOP</div></div>
      <div class="pxm-stat"><span class="pi">🧠</span><div><b id="pxmIter">3</b> Skill 迭代中</div></div>
      <button class="pxm-scn env" data-scn="env">① 动环告警</button>
      <button class="pxm-scn fire" data-scn="fire">② 消防告警</button>
      <button class="pxm-scn cctv" data-scn="cctv">③ CCTV 告警</button>
      <button class="pxm-scn reset" data-scn="reset">↺ 重置</button>
    </div>
    <div class="pxm-split">
      <div class="pxm-panel">
        <div class="pxm-phead"><b>🏢 数据中心 A 楼 · 2.5D 等距视图</b><small>悬停楼层 · 点击机器人查看任务</small></div>
        <div class="pxm-pbody"><svg id="pxmBdSvg" class="pxm-bd-svg" viewBox="0 0 480 460" shape-rendering="crispEdges"></svg></div>
        <div class="pxm-pfoot"><div class="pxm-floor-info" id="pxmFloorInfo"><b>提示</b>悬停楼层查看实时状态 · 红色楼层 = 当前告警 · 每个机器人代表一个 Agent Worker</div></div>
      </div>
      <div class="pxm-panel">
        <div class="pxm-phead"><b>📚 Hermes 像素图书馆 · 俯视图</b><small>学者走动查询知识 · 高亮节点 = 学习中</small></div>
        <div class="pxm-pbody"><svg id="pxmLibSvg" class="pxm-lib-svg" viewBox="0 0 512 320" shape-rendering="crispEdges"></svg></div>
        <div class="pxm-pfoot"><div class="pxm-lib-events" id="pxmLibEvents">
          <div class="pxm-ev"><span class="t">14:36</span><span><b>Hermes-A</b> 抵达「动环冷却」书架 · 阅读 SOP</span><span class="tag">CRAC</span></div>
          <div class="pxm-ev"><span class="t">14:34</span><span><b>Hermes-B</b> 检索「CCTV 离线」历史案例</span><span class="tag" style="background:#a855f7;color:#fff">CCTV</span></div>
          <div class="pxm-ev"><span class="t">14:30</span><span><b>Hermes-C</b> 在「消防压力」区域巡逻</span><span class="tag" style="background:#fee2e2;color:#b91c1c">消防</span></div>
        </div></div>
      </div>
    </div>
  </div>
</div>
'''

src = src.replace(page_before, PX_PAGE_HTML + page_before, 1)
print("✅ 像素战图页面 HTML 已添加")

# 4) 更新菜单点击处理 - 添加 pixelmap 分支
handler_old = "else if(page==='agent-ops'){$('#page-agent-ops').classList.add('active')}"
handler_new = "else if(page==='agent-ops'){$('#page-agent-ops').classList.add('active')}else if(page==='pixelmap'){$('#page-pixelmap').classList.add('active');if(typeof pxmInit==='function')pxmInit();}"

if handler_old not in src:
    print("❌ 菜单 handler 锚点未找到!")
    raise SystemExit(1)

src = src.replace(handler_old, handler_new, 1)
print("✅ 菜单 handler 已更新")

# 5) 添加 JS 渲染代码 - 在 </script> 之前
PXM_JS = '''
/* ============== 中央指挥中心 · 像素战图 ============== */
const pxmFloors=[
  {id:'f6',name:'F6 · 网络核心',desc:'核心交换机 / BGP / 防火墙',robots:2,color:'ok',device:'Core-SW-01'},
  {id:'f5',name:'F5 · 计算A区',desc:'GPU 服务器集群 / AI 训练',robots:2,color:'ok',device:'GPU-A12'},
  {id:'f4',name:'F4 · 计算B区',desc:'通用计算 / 容器编排',robots:2,color:'warn',device:'K8s-Node-08'},
  {id:'f3',name:'F3 · 存储区',desc:'分布式存储 / NAS / 备份',robots:2,color:'alert',device:'CRAC 1# · R3-12'},
  {id:'f2',name:'F2 · 配电/UPS',desc:'高低压配电 / UPS / 电池',robots:2,color:'ok',device:'UPS-B-02'},
  {id:'f1',name:'F1 · 大厅/安防',desc:'门禁 / CCTV / 监控中心',robots:2,color:'ok',device:'门禁主控'}
];
const pxmW=240,pxmFH=32,pxmD=22,pxmGap=12;
const pxmBX=120,pxmBY=58;

function pxmRobotSvg(x,y,label,state){
  state=state||'';
  return `<g class="pxm-rb ${state}" transform="translate(${x-8},${y-14})">
    <ellipse cx="8" cy="15" rx="5" ry="1.2" fill="#000" opacity="0.3"/>
    <rect x="7" y="-1" width="2" height="3" class="pxm-rb-leg"/>
    <circle cx="8" cy="-2" r="1.4" class="pxm-rb-leg"/>
    <rect x="3" y="2" width="10" height="7" class="pxm-rb-head"/>
    <rect x="5" y="4" width="2" height="2" class="pxm-rb-eye"/>
    <rect x="9" y="4" width="2" height="2" class="pxm-rb-eye"/>
    <rect x="6" y="7" width="4" height="1" fill="#0c4a6e"/>
    <rect x="2" y="9" width="12" height="4" class="pxm-rb-body"/>
    <rect x="0" y="10" width="2" height="3" class="pxm-rb-body"/>
    <rect x="14" y="10" width="2" height="3" class="pxm-rb-body"/>
    <rect x="4" y="13" width="2" height="2" class="pxm-rb-leg"/>
    <rect x="10" y="13" width="2" height="2" class="pxm-rb-leg"/>
    <text x="8" y="-4" class="pxm-rb-text">${label}</text>
  </g>`;
}

function pxmRenderBuilding(){
  const svg=document.getElementById('pxmBdSvg');
  if(!svg) return;
  let h='<defs><linearGradient id="bdSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0f2fe"/><stop offset="1" stop-color="#f8fbff"/></linearGradient>';
  h+='<linearGradient id="bdGround" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a0826d"/><stop offset="1" stop-color="#78350f"/></linearGradient></defs>';
  h+=`<rect x="0" y="0" width="480" height="460" fill="url(#bdSky)"/>`;
  // ground
  h+=`<polygon points="${pxmBX-30},${pxmBY+6*pxmGap+pxmFH} ${pxmBX+pxmW+pxmD+30},${pxmBY+6*pxmGap+pxmFH} ${pxmBX+pxmW+pxmD+50},455 ${pxmBX-50},455" fill="url(#bdGround)" opacity="0.45"/>`;
  // shadow strip under building
  h+=`<polygon points="${pxmBX-4},${pxmBY+6*pxmGap+pxmFH+2} ${pxmBX+pxmW+pxmD+4},${pxmBY+6*pxmGap+pxmFH+2} ${pxmBX+pxmW+pxmD+4},${pxmBY+6*pxmGap+pxmFH+10} ${pxmBX-4},${pxmBY+6*pxmGap+pxmFH+10}" fill="#000" opacity="0.2"/>`;

  pxmFloors.forEach((f,i)=>{
    const y=pxmBY+i*(pxmFH+pxmGap);
    const cls=f.color;
    // shadow
    h+=`<polygon points="${pxmBX+5},${y+pxmFH+2} ${pxmBX+pxmW+pxmD+5},${y+pxmFH+2} ${pxmBX+pxmW+pxmD+15},${y+pxmFH+12} ${pxmBX+15},${y+pxmFH+12}" fill="#000" opacity="0.15"/>`;
    // front
    h+=`<polygon class="pxm-floor-front ${cls==='ok'?'':cls}" data-floor="${f.id}" points="${pxmBX},${y} ${pxmBX+pxmW},${y} ${pxmBX+pxmW},${y+pxmFH} ${pxmBX},${y+pxmFH}"/>`;
    // top (parallelogram going up-right)
    h+=`<polygon class="pxm-floor-top ${cls==='ok'?'':cls}" points="${pxmBX},${y} ${pxmBX+pxmW},${y} ${pxmBX+pxmW+pxmD},${y-pxmD} ${pxmBX+pxmD},${y-pxmD}"/>`;
    // right side
    h+=`<polygon class="pxm-floor-side ${cls==='alert'?'alert':''}" points="${pxmBX+pxmW},${y} ${pxmBX+pxmW+pxmD},${y-pxmD} ${pxmBX+pxmW+pxmD},${y+pxmFH-pxmD} ${pxmBX+pxmW},${y+pxmFH}"/>`;
    // windows (5 across front)
    for(let w=0;w<5;w++){
      const wx=pxmBX+18+w*42,wy=y+10;
      const wCls=cls==='alert'?'alert':(cls==='warn'?'warn':'');
      h+=`<rect class="pxm-window ${wCls}" x="${wx}" y="${wy}" width="16" height="14"/>`;
    }
    // floor label
    h+=`<text class="pxm-floor-label ${cls==='alert'?'alert':''}" x="${pxmBX+pxmW/2}" y="${y+pxmFH-6}">${f.name}</text>`;
    // robots on TOP face (1-2)
    const positions=[{rx:0.28,lab:'A'},{rx:0.72,lab:'B'}];
    positions.slice(0,f.robots).forEach(p=>{
      const fx=pxmBX+p.rx*pxmW+12;
      const fy=y-pxmD+5;
      const st=cls==='alert'?'alert':(cls==='warn'?'warn':'');
      h+=pxmRobotSvg(fx,fy,p.lab,st);
    });
  });
  svg.innerHTML=h;
  svg.querySelectorAll('[data-floor]').forEach(el=>{
    el.addEventListener('mouseenter',()=>pxmShowFloor(el.dataset.floor));
  });
}

function pxmShowFloor(fid){
  const f=pxmFloors.find(x=>x.id===fid);if(!f) return;
  const el=document.getElementById('pxmFloorInfo');
  if(!el) return;
  const tagCls=f.color==='alert'?'alert':(f.color==='warn'?'warn':'ok');
  const tagTxt=f.color==='alert'?'⚠ 告警中':(f.color==='warn'?'◐ 关注':'✓ 正常');
  el.innerHTML=`<b>${f.name}</b>${f.desc} · 关注设备：<b>${f.device}</b> · ${f.robots} 个 Agent Worker <span class="tag ${tagCls}">${tagTxt}</span>`;
}

/* ===== 图书馆 ===== */
const pxmCell=16, pxmCols=32, pxmRows=20;
const pxmLW=pxmCols*pxmCell, pxmLH=pxmRows*pxmCell;

const pxmShelves={
  cool:{label:'动环冷却',cluster:[{x:2,y:2,w:6,h:4},{x:3,y:7,w:5,h:3}],color:'cool'},
  power:{label:'电源管理',cluster:[{x:24,y:2,w:6,h:4},{x:25,y:7,w:5,h:3}],color:'power'},
  fire:{label:'消防告警',cluster:[{x:2,y:13,w:6,h:5},{x:3,y:8,w:4,h:3}],color:'fire'},
  cctv:{label:'CCTV监控',cluster:[{x:24,y:13,w:6,h:5},{x:25,y:8,w:5,h:3}],color:'cctv'},
  sec:{label:'安全管理',cluster:[{x:9,y:9,w:4,h:3}],color:'sec'},
  net:{label:'网络核心',cluster:[{x:18,y:9,w:5,h:3}],color:'net'}
};

const pxmScholars=[
  {id:'H-A',name:'Hermes-A',x:8,y:5,color:''},
  {id:'H-B',name:'Hermes-B',x:26,y:5,color:''},
  {id:'H-C',name:'Hermes-C',x:5,y:15,color:''},
  {id:'H-D',name:'Hermes-D',x:27,y:15,color:''},
  {id:'H-E',name:'Hermes-E',x:14,y:11,color:''},
  {id:'H-F',name:'Hermes-F',x:20,y:11,color:''}
];

const pxmNodes=[
  {x:5,y:4,name:'CRAC调节'},
  {x:26,y:4,name:'UPS切换'},
  {x:5,y:15,name:'喷淋压力'},
  {x:27,y:15,name:'PoE诊断'},
  {x:11,y:10,name:'门禁审批'},
  {x:20,y:10,name:'BGP路由'},
  {x:14,y:3,name:'冷通道'},
  {x:18,y:17,name:'AI识别'}
];

function pxmRenderLibrary(){
  const svg=document.getElementById('pxmLibSvg');
  if(!svg) return;
  let h=`<defs><pattern id="libFloor" width="${pxmCell}" height="${pxmCell}" patternUnits="userSpaceOnUse">
    <rect width="${pxmCell}" height="${pxmCell}" class="pxm-lib-floor"/>
    <rect width="${pxmCell}" height="${pxmCell}" fill="none" class="pxm-lib-grid"/>
  </pattern></defs>`;
  h+=`<rect x="0" y="0" width="${pxmLW}" height="${pxmLH}" fill="url(#libFloor)"/>`;
  h+=`<rect x="0" y="0" width="${pxmLW}" height="${pxmLH}" fill="none" stroke="#78350f" stroke-width="3"/>`;
  // shelves
  Object.entries(pxmShelves).forEach(([k,s])=>{
    s.cluster.forEach(c=>{
      h+=`<rect class="pxm-shelf-${s.color}" x="${c.x*pxmCell}" y="${c.y*pxmCell}" width="${c.w*pxmCell}" height="${c.h*pxmCell}" style="cursor:pointer" data-shelf="${k}"/>`;
      h+=`<text class="pxm-shelf-label" x="${(c.x+c.w/2)*pxmCell}" y="${(c.y+c.h/2)*pxmCell+3}">${s.label}</text>`;
    });
  });
  // desks
  const desks=[[12,11],[13,11],[16,11],[17,11],[19,12],[20,12]];
  desks.forEach(([dx,dy])=>{
    h+=`<rect class="pxm-desk" x="${dx*pxmCell+2}" y="${dy*pxmCell+2}" width="${pxmCell-4}" height="${pxmCell-4}"/>`;
  });
  // nodes
  pxmNodes.forEach(n=>{
    h+=`<circle class="pxm-node" cx="${(n.x+0.5)*pxmCell}" cy="${(n.y+0.5)*pxmCell}" r="5" data-node="${n.name}"/>`;
  });
  // scholars
  pxmScholars.forEach(s=>{
    const cx=s.x*pxmCell, cy=s.y*pxmCell;
    h+=`<g style="transition:transform 1s cubic-bezier(.4,0,.2,1)" transform="translate(${cx-8},${cy-14})">${pxmRobotSvg(0,0,s.id.replace('H-',''),s.color).replace(/transform="translate\\(-8,-14\\)"/,'')}</g>`;
  });
  svg.innerHTML=h;
  svg.querySelectorAll('[data-shelf]').forEach(el=>el.addEventListener('click',()=>pxmShowShelf(el.dataset.shelf)));
}

function pxmShowShelf(k){
  const s=pxmShelves[k]; if(!s) return;
  const el=document.getElementById('pxmLibEvents');
  const t=new Date().toLocaleTimeString('zh-CN',{hour12:false});
  el.insertAdjacentHTML('afterbegin',`<div class="pxm-ev"><span class="t">${t}</span><span><b>${s.label}</b> 书架被查询 · SOP 已加载</span><span class="tag" style="background:rgba(0,0,0,.06);color:#0369a1">${k}</span></div>`);
  const items=el.querySelectorAll('.pxm-ev');if(items.length>10)items[items.length-1].remove();
}

function pxmMoveScholar(sid,tx,ty,color){
  const s=pxmScholars.find(x=>x.id===sid);if(!s) return;
  s.x=tx;s.y=ty;if(color)s.color=color;
  pxmRenderLibrary();
}

/* ===== 场景触发 ===== */
function pxmTriggerScenario(key){
  const map={
    env:{floor:'f3',shelf:'cool',scholar:'H-A',desc:'动环 · F3 存储区温度异常'},
    fire:{floor:'f1',shelf:'fire',scholar:'H-C',desc:'消防 · 喷淋压力异常'},
    cctv:{floor:'f1',shelf:'cctv',scholar:'H-D',desc:'CCTV · 12#/27# 离线'}
  };
  const m=map[key];if(!m && key!=='reset') return;
  if(key==='reset'){
    pxmFloors.forEach(f=>{if(f.id==='f4')f.color='warn';else if(f.id==='f3')f.color='alert';else f.color='ok'});
    pxmScholars.forEach(s=>s.color='');
    pxmRenderBuilding();pxmRenderLibrary();
    document.getElementById('pxmAlarm').textContent='1';
    document.getElementById('pxmWarn').textContent='2';
    return;
  }
  pxmFloors.forEach(f=>{
    if(f.id===m.floor) f.color='alert';
    else if(f.id==='f4') f.color='warn';
    else f.color='ok';
  });
  pxmRenderBuilding();
  // move scholar to shelf center
  const shelf=pxmShelves[m.shelf];
  const cx=shelf.cluster[0].x+Math.floor(shelf.cluster[0].w/2);
  const cy=shelf.cluster[0].y+Math.floor(shelf.cluster[0].h/2);
  pxmMoveScholar(m.scholar,cx,cy,'alert');
  pxmShowShelf(m.shelf);
  document.getElementById('pxmAlarm').textContent='1';
  document.getElementById('pxmWarn').textContent='1';
  pxmShowFloor(m.floor);
  // log event
  const el=document.getElementById('pxmLibEvents');
  const t=new Date().toLocaleTimeString('zh-CN',{hour12:false});
  el.insertAdjacentHTML('afterbegin',`<div class="pxm-ev"><span class="t">${t}</span><span><b>${m.scholar}</b> → ${m.desc}</span><span class="tag" style="background:#fee2e2;color:#b91c1c">P0</span></div>`);
}

function pxmInit(){
  pxmRenderBuilding();
  pxmRenderLibrary();
  // bind scenario buttons (only once per init)
  if(!window._pxmBound){
    document.querySelectorAll('.pxm-scn').forEach(b=>b.onclick=()=>{
      const k=b.dataset.scn;
      pxmTriggerScenario(k);
      // 同时联动原有 demo 系统
      if(k!=='reset' && typeof triggerDemo==='function') triggerDemo(k);
    });
    window._pxmBound=true;
  }
}
'''

js_anchor_old = '</script>'
js_anchor_new = PXM_JS + '\n</script>'

if js_anchor_old not in src:
    print("❌ </script> 锚点未找到!")
    raise SystemExit(1)

src = src.replace(js_anchor_old, js_anchor_new, 1)
print("✅ JS 已添加")

# 写回
with open(PATH, "w", encoding="utf-8") as f:
    f.write(src)

print(f"✅ 文件写入完成,最终长度: {len(src)} 字符")