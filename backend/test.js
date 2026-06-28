
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);let currentAgent="token母体-总览";

/* ============== 侧边栏折叠/展开 ============== */
const appEl=document.querySelector('.app');
const toggleBtn=document.getElementById('toggleSidebar');
const COLLAPSE_KEY='token_matrix_sidebar_collapsed';
function setCollapsed(v){
  appEl.classList.toggle('collapsed',v);
  toggleBtn.textContent=v?'›':'‹';
  toggleBtn.title=v?'展开菜单':'折叠菜单';
  try{localStorage.setItem(COLLAPSE_KEY,v?'1':'0')}catch(e){}
}
toggleBtn.onclick=()=>setCollapsed(!appEl.classList.contains('collapsed'));
let _savedCollapsed='0';
try{_savedCollapsed=localStorage.getItem(COLLAPSE_KEY)||'0'}catch(e){}
setCollapsed(_savedCollapsed==='1');
const floorData=[['F6','网络核心',''],['F5','计算A区',''],['F4','计算B区','warn'],['F3','存储区','alert'],['F2','配电/UPS/BMS',''],['F1','大厅/安防','']];
$('#stage').innerHTML=floorData.map((f,i)=>`<div class="floor ${f[2]}" style="transform:translateY(${i*50-130}px)" title="${f[0]} ${f[1]}">${['front','back','right','left'].map(c=>`<div class="face ${c}"><span>${f[0]} · ${f[1]}</span><i class="led"></i></div>`).join('')}</div>`).join('');
const alertSeed=[['p0','P0','F3 存储区温度异常上升','机柜 R3-12 进风温度 32.6℃，CRAC 1# 出风温度异常，已派发工单 #20266','动环 · F3 · 已派单','14:35:22'],['p1','P1','BMS-03# 电池组内阻偏高','F2 电池簇 12# 内阻 0.42mΩ（阈值 0.35mΩ），已触发自动均衡','BMS · ALARM','14:32:11'],['p1','P1','UPS B 列负载 85%','UPS-B-02 输出负载达到 85%，剩余后备时间 6分30秒','动环 · UPS-B-02','14:28:47'],['p2','P2','非工作时段门禁刷卡','F4 北门检测到外包人员刷卡，已完成审批留痕','安防 · 已审批','14:25:08'],['p2','P2','核心交换机端口拥塞','Core-SW-01 Gi1/0/24 带宽利用率 92%','网络 · SNMP','14:18:32'],['p3','P3','F2 BMS 巡检完成','12 簇电池 SOC/电压/温度全部正常，SOH 96%','BMS · RECOVER','14:10:00'],['p3','P3','日志归档完成','今日 14:00 归档日志 12.8GB，成功率 100%','系统 · 定时任务','14:00:00']];
function alertHTML(a,i=0){return `<div class="alert ${a[0]} ${i===0?'new':''}" data-level="${a[0]}"><div><span class="level">${a[1]}</span></div><div style="flex:1"><div style="display:flex;gap:8px"><span class="alert-title">${a[2]}</span><span class="alert-time">${a[5]}</span></div><div class="alert-desc">${a[3]}</div><div class="alert-meta"><span>${a[4]}</span><span>ToKen Matrix 已分析</span></div></div></div>`}function renderAlerts(){ $('#alerts').innerHTML=alertSeed.map(alertHTML).join('')}renderAlerts();
$('#systemFlow').innerHTML=[['Web-Surfer Agent · F3故障根因分析','读取历史告警、遥测曲线和CRAC日志，正在推理冷热通道气流问题','START,router,search,llm_reason,tool_call,action'],['Predict-Recommend · 15分钟温度预测','建议 CRAC 2# 出风口 -1.5℃，置信度 92%，等待人工审批','collect,predict,score,recommend,approve'],['Hermes 缰绳 · 触发冷却异常SOP','P0告警进入自动处置流程，生成工单并通知飞书群','match,guardrail,dispatch,audit']].map(x=>`<div class="activity"><div class="aico">AI</div><div><h4>${x[0]}</h4><p>${x[1]}</p><div class="trace">${x[2].split(',').map((n,i)=>`<span class="node ${i===0?'active':''}">${n}</span>${i<x[2].split(',').length-1?'<span class="arrow">→</span>':''}`).join('')}</div></div></div>`).join('');
$('#humanFlow').innerHTML=[['飞书审批 · 调整 CRAC 2# 出风温度','来自预测推荐 Agent，风险等级中，置信度92%','批准','拒绝'],['工单 #20266 · F3 存储区冷却故障','分配给李工，P0，SLA剩余11分钟','查看','转派'],['飞书群通知 · 运维小组','F3出现P0告警，李工已到现场，10分钟内反馈','已读9/12','催办'],['工单 #20267 · BMS-03# 电池内阻检修','分配给赵工，检测簇间电压与内阻均衡','查看','关闭']].map(x=>`<div class="activity"><div class="aico" style="background:linear-gradient(135deg,var(--orange),#fbbf24)">人</div><div><h4>${x[0]}</h4><p>${x[1]}</p><div class="actions"><button class="btn">${x[2]}</button><button class="btn">${x[3]}</button></div></div></div>`).join('');
/* ============== 子系统页面 (BM/EH/FR/SC/BA) · 数据 + 渲染 ============== */
// 5 大子系统 · 横幅 + 5 KPI + 趋势/雷达/环/堆叠 + 事件 + 数据表
const subsysCfg={
  bms:{
    cls:'bms',ico:'BM',name:'BMS 电池系统',sub:'锂离子电池簇 · SOC/SOH/温度/内阻/均衡实时监测',
    badges:['12 簇电池','主动均衡','Hermes 守护'],
    score:96,lvl:'EXCELLENT',lvlCls:'',
    kpis:[
      {n:'电池组 SOC',v:94.2,u:'%',d:'+0.3',p:'',i:'SOC'},
      {n:'电池组 SOH',v:96.0,u:'%',d:'+0.0',p:'',i:'SOH'},
      {n:'组电压',v:53.6,u:'V',d:'-0.1',p:'',i:'V'},
      {n:'单体最高温度',v:32.8,u:'℃',d:'+0.4',p:'w',i:'T'},
      {n:'单体最大内阻',v:0.38,u:'mΩ',d:'+0.02',p:'w',i:'R'},
    ],
    trend:{name:'BMS 24h 关键参数',lines:[
      {n:'SOC',unit:'%',c:'#10b981',base:95,daily:1.2,noise:0.4,min:0,max:100},
      {n:'SOH',unit:'%',c:'#0ea5e9',base:96,daily:0.1,noise:0.05,min:90,max:100},
      {n:'温度',unit:'℃',c:'#f59e0b',base:30,daily:4,noise:0.6,min:24,max:36,right:true},
      {n:'内阻',unit:'mΩ',c:'#ef4444',base:0.36,daily:0.04,noise:0.02,min:0.3,max:0.5,right:true},
    ]},
    clusters:Array.from({length:12},(_,i)=>({n:'C'+(i+1).toString().padStart(2,'0'),v:(3.30+Math.random()*0.18).toFixed(3),s:Math.random()>0.92?'WARN':'OK',p:Math.round(60+Math.random()*35)})),
    rings:[
      {n:'SOC 余额',v:94,pct:94,c:'#10b981'},
      {n:'SOH 健康',v:96,pct:96,c:'#0ea5e9'},
      {n:'均衡完成度',v:88,pct:88,c:'#f59e0b'},
      {n:'温度均衡',v:91,pct:91,c:'#06b6d4'},
    ],
    tableHead:['#','时间','簇号','电压 V','SOC %','温度 ℃','内阻 mΩ','状态'],
    eventsSrc:[
      {t:'09:36',d:'BMS-F2-12#',l:'P1',m:'单体最大内阻 0.42mΩ 已触发主动均衡'},
      {t:'16:48',d:'BMS-F2-07#',l:'P1',m:'SOC 95% 触发上限预警 · 已主动放电至 89%'},
      {t:'02:15',d:'BMS-F2-03#',l:'P1',m:'簇间电压差 38mV 超过阈值 · 已收敛至 15mV'},
    ],
  },
  env:{
    cls:'env',ico:'EH',name:'动环监控系统',sub:'冷热通道 · UPS/PDU · 湿度压差 · PUE 实时',
    badges:['4 区域','6 传感器','3 制冷源'],
    score:93,lvl:'GOOD',lvlCls:'',
    kpis:[
      {n:'冷通道平均',v:22.4,u:'℃',d:'-0.2',p:'',i:'C'},
      {n:'热通道最高',v:31.8,u:'℃',d:'+0.6',p:'w',i:'H'},
      {n:'环境湿度',v:45.0,u:'%',d:'+1.0',p:'',i:'H'},
      {n:'PUE',v:1.32,u:'',d:'-0.02',p:'',i:'P'},
      {n:'IT 负载',v:478,u:'kW',d:'+18',p:'',i:'W'},
    ],
    trend:{name:'动环 24h 关键参数',lines:[
      {n:'冷通道',unit:'℃',c:'#0ea5e9',base:22,daily:1.5,noise:0.4,min:20,max:26},
      {n:'热通道',unit:'℃',c:'#ef4444',base:30,daily:3,noise:0.6,min:26,max:36,right:true},
      {n:'湿度',unit:'%',c:'#06b6d4',base:45,daily:5,noise:1,min:35,max:60,right:true},
      {n:'PUE',unit:'',c:'#10b981',base:1.32,daily:0.08,noise:0.02,min:1.2,max:1.5,right:true},
    ]},
    stacked:{name:'今日能耗构成 (kWh)',data:[
      {n:'IT 设备',v:11472,c:'#0ea5e9'},
      {n:'制冷',v:2868,c:'#10b981'},
      {n:'照明',v:412,c:'#f59e0b'},
      {n:'其他',v:128,c:'#94a3b8'},
    ]},
    rings:[
      {n:'UPS-A 电量',v:92,pct:92,c:'#10b981'},
      {n:'UPS-B 负载',v:78,pct:78,c:'#0ea5e9'},
      {n:'PDU 在线',v:100,pct:100,c:'#06b6d4'},
      {n:'新风机',v:62,pct:62,c:'#f59e0b'},
    ],
    tableHead:['#','时间','区域','冷通道 ℃','热通道 ℃','湿度 %','PUE','状态'],
    eventsSrc:[
      {t:'11:12',d:'RACK-F3-R12',l:'P0',m:'机柜进风温度 32.6℃ · Skill env/rack-temp 自动调节'},
      {t:'14:21',d:'UPS-B',l:'P1',m:'UPS 负载率 87% · 已切分至 UPS-A,负载→58%'},
      {t:'20:12',d:'CRAC-5#',l:'P1',m:'回风湿度 58% 偏高 · dehumidify 已收敛至 47%'},
      {t:'03:42',d:'CRAC-2#',l:'P1',m:'出风温度 18.2℃ 偏离基线 · 已回正至 20.5℃'},
    ],
  },
  fire:{
    cls:'fire',ico:'FR',name:'消防系统',sub:'烟感/温感/喷淋/气灭/消防泵 · 火警 0 误报 1',
    badges:['128 烟感','6 气灭区','2 消防泵'],
    score:97,lvl:'EXCELLENT',lvlCls:'',
    kpis:[
      {n:'烟感在线',v:'128/128',u:'',d:'100%',p:'',i:'S'},
      {n:'温感在线',v:'86/86',u:'',d:'100%',p:'',i:'T'},
      {n:'喷淋压力',v:4.2,u:'bar',d:'+0.1',p:'',i:'P'},
      {n:'消防水池',v:86,u:'%',d:'+0.2',p:'',i:'W'},
      {n:'今日火警/故障',v:'0/1',u:'',d:'1 误报',p:'w',i:'F'},
    ],
    trend:{name:'消防 24h 关键参数',lines:[
      {n:'喷淋压力',unit:'bar',c:'#0ea5e9',base:4.2,daily:0.1,noise:0.05,min:3.5,max:4.8},
      {n:'水池液位',unit:'%',c:'#10b981',base:86,daily:0.3,noise:0.1,min:80,max:95},
      {n:'烟感值',unit:'ppm',c:'#ef4444',base:8,daily:4,noise:1,min:0,max:25,right:true},
      {n:'气灭浓度',unit:'%',c:'#f59e0b',base:95,daily:0.3,noise:0.1,min:90,max:100,right:true},
    ]},
    rings:[
      {n:'烟感在线率',v:100,pct:100,c:'#10b981'},
      {n:'温感在线率',v:100,pct:100,c:'#0ea5e9'},
      {n:'手报在线率',v:100,pct:100,c:'#06b6d4'},
      {n:'声光在线率',v:100,pct:100,c:'#14b8a6'},
      {n:'消防泵就绪',v:100,pct:100,c:'#ef4444'},
      {n:'气灭就绪',v:100,pct:100,c:'#f59e0b'},
    ],
    tableHead:['#','时间','位置','烟感 ppm','喷淋 bar','水池 %','设备状态','告警'],
    eventsSrc:[
      {t:'23:48',d:'SMOKE-F1-A12',l:'P0',m:'烟感误报(灰尘) · v1.0 已升级识别准确率 18%'},
      {t:'13:55',d:'SPRINKLER-Z4',l:'P2',m:'喷淋压力 3.8bar 偏低 · 已派单维护'},
      {t:'20:00',d:'DET-CLEAN',l:'P3',m:'F1-A12 烟感清洁完成 · 误报风险已消除'},
    ],
  },
  security:{
    cls:'security',ico:'SC',name:'安防系统',sub:'门禁/访客/巡更/视频/周界 · 24h 全域守护',
    badges:['64 门禁','128 摄像机','32 巡更点'],
    score:94,lvl:'EXCELLENT',lvlCls:'',
    kpis:[
      {n:'门禁记录',v:156,u:'条',d:'+12',p:'',i:'A'},
      {n:'访客在场',v:7,u:'人',d:'+2',p:'',i:'V'},
      {n:'非工作刷卡',v:1,u:'次',d:'今日',p:'w',i:'O'},
      {n:'巡更完成',v:92,u:'%',d:'+3%',p:'',i:'P'},
      {n:'摄像机在线',v:'126/128',u:'',d:'-2',p:'d',i:'C'},
    ],
    trend:{name:'安防 24h 关键参数',lines:[
      {n:'刷卡次数',unit:'次',c:'#14b8a6',base:6,daily:6,noise:2,min:0,max:20},
      {n:'门禁事件',unit:'次',c:'#0ea5e9',base:8,daily:5,noise:2,min:0,max:25},
      {n:'摄像机在线',unit:'路',c:'#10b981',base:128,daily:0.5,noise:0.5,min:120,max:128},
      {n:'巡更完成',unit:'%',c:'#06b6d4',base:90,daily:5,noise:2,min:80,max:100,right:true},
    ]},
    stacked:{name:'今日人员通行构成',data:[
      {n:'员工刷卡',v:136,c:'#14b8a6'},
      {n:'访客登记',v:7,c:'#0ea5e9'},
      {n:'外包人员',v:9,c:'#f59e0b'},
      {n:'异常尾随',v:1,c:'#ef4444'},
    ]},
    rings:[
      {n:'门禁在线率',v:100,pct:100,c:'#10b981'},
      {n:'门磁在线率',v:100,pct:100,c:'#0ea5e9'},
      {n:'道闸在线率',v:98,pct:98,c:'#06b6d4'},
      {n:'视频在线率',v:98,pct:98,c:'#14b8a6'},
    ],
    tableHead:['#','时间','位置','人员','类型','设备','状态','处理'],
    eventsSrc:[
      {t:'22:05',d:'CAM-128',l:'P1',m:'摄像机掉线 2 路 · PoE 重连成功'},
      {t:'07:08',d:'CARD-08#',l:'P2',m:'非工作时间刷卡 1 次 · 已审批留痕'},
      {t:'18:30',d:'GATE-N',l:'P3',m:'外包人员进场 · 双重验证通过'},
    ],
  },
  ba:{
    cls:'ba',ico:'BA',name:'BA 楼宇自动化',sub:'空调/照明/电梯/给排水/能耗 · 智能联动',
    badges:['9 空调机组','36 联动策略','5 网关在线'],
    score:91,lvl:'GOOD',lvlCls:'',
    kpis:[
      {n:'空调运行率',v:88.9,u:'%',d:'8/9',p:'',i:'A'},
      {n:'照明开启率',v:68,u:'%',d:'+4%',p:'',i:'L'},
      {n:'电梯运行',v:'6/6',u:'',d:'全部',p:'',i:'E'},
      {n:'能耗同比',v:-12,u:'%',d:'节能',p:'',i:'P'},
      {n:'BA 网关',v:'5/5',u:'',d:'在线',p:'',i:'G'},
    ],
    trend:{name:'BA 24h 关键参数',lines:[
      {n:'冷机负载',unit:'%',c:'#0ea5e9',base:55,daily:20,noise:3,min:30,max:80},
      {n:'照明开启',unit:'%',c:'#f59e0b',base:40,daily:25,noise:4,min:15,max:80},
      {n:'总能耗',unit:'kWh',c:'#ef4444',base:2800,daily:800,noise:60,min:1500,max:4000,right:true},
      {n:'舒适度',unit:'%',c:'#10b981',base:88,daily:4,noise:2,min:80,max:98,right:true},
    ]},
    stacked:{name:'今日 BA 联动策略执行',data:[
      {n:'温控策略',v:128,c:'#0ea5e9'},
      {n:'照明策略',v:64,c:'#f59e0b'},
      {n:'电梯调度',v:42,c:'#10b981'},
      {n:'能耗优化',v:18,c:'#06b6d4'},
    ]},
    rings:[
      {n:'空调在线率',v:89,pct:89,c:'#0ea5e9'},
      {n:'照明在线率',v:100,pct:100,c:'#f59e0b'},
      {n:'电梯在线率',v:100,pct:100,c:'#10b981'},
      {n:'新风在线率',v:95,pct:95,c:'#06b6d4'},
    ],
    tableHead:['#','时间','设备','参数','当前值','目标值','偏差','联动'],
    eventsSrc:[
      {t:'18:30',d:'AHU-3#',l:'P2',m:'机组滤网压差 240Pa · 已派单清洁'},
      {t:'14:00',d:'CHILLER-2#',l:'P3',m:'冷机 COP 优化启动 · 节能 6%'},
      {t:'22:30',d:'LIGHTING-F2',l:'P3',m:'夜间模式自动启用 · 公共照明降级'},
    ],
  },
};

/* === 通用: 简易时间序列生成 (288 点 5min) === */
function _rng(s){let x=s|0;return()=>{x=(x+0x6D2B79F5)|0;let t=x;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
function genSeries(line,N=288,seed=42){
  const r=_rng(seed);
  const out=new Array(N);
  for(let i=0;i<N;i++){
    const h=i*5/60,day=Math.cos((h-14)/24*Math.PI*2);
    // 以 base 为中心, 叠加日变化 + 高频波动 + 噪声
    let v=line.base
      -line.daily*0.4*(0.5+0.5*Math.sin(i/22))  // 长周期
      +line.daily*0.3*(1-day)                    // 日内峰谷
      +line.daily*0.25*Math.sin(i/8)             // 中频
      +(r()-0.5)*2*line.noise;                   // 噪声
    // 截断到 min/max
    v=Math.max(line.min,Math.min(line.max,v));
    out[i]=+v.toFixed(line.unit==='mΩ'?3:1);
  }
  return out;
}

/* === 折线趋势 (SVG) === */
function renderTrendSVG(svgId,cfg,times){
  const svg=document.getElementById(svgId);if(!svg)return;
  const W=svg.clientWidth||600,H=180,padL=38,padR=38,padT=12,padB=22;
  const N=288;
  const xStep=(W-padL-padR)/(N-1);
  const lines=cfg.lines;
  const yScale=(v,line)=>{
    const mn=line.min,mx=line.max;
    return padT+(H-padT-padB)*(1-(v-mn)/(mx-mn));
  };
  // 双 y 轴
  const leftLines=lines.filter(l=>!l.right);
  const rightLines=lines.filter(l=>l.right);
  let h=`<defs>`;
  lines.forEach((l,i)=>{h+=`<linearGradient id="tg-${svgId}-${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${l.c}" stop-opacity=".25"/><stop offset="1" stop-color="${l.c}" stop-opacity="0"/></linearGradient>`});
  h+=`</defs>`;
  // 网格
  for(let i=0;i<=4;i++){
    const y=padT+(H-padT-padB)*i/4;
    h+=`<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W-padR}" y2="${y.toFixed(1)}" stroke="#eef5fb" stroke-width="1"/>`;
  }
  // 时间标签
  ['00:00','06:00','12:00','18:00','24:00'].forEach((t,i)=>{
    const x=padL+xStep*N/4*i;
    h+=`<text x="${x.toFixed(1)}" y="${(H-6).toFixed(1)}" text-anchor="middle" font-size="9" fill="#94a3b8" font-weight="700">${t}</text>`;
  });
  // 折线 + 渐变
  lines.forEach((l,li)=>{
    const data=genSeries(l,N,42+li*17);
    // NaN/Infinity 防御: 任一数据点非有限则整条线用基线填充
    const safe=data.map(v=>Number.isFinite(v)?v:l.base);
    let linePath='',area='';
    let started=false;
    safe.forEach((v,i)=>{
      const x=padL+i*xStep;
      let y=yScale(v,l);
      if(!Number.isFinite(y)) y=H-padB;  // 兜底: 画到 X 轴上
      const xs=x.toFixed(1),ys=y.toFixed(1);
      if(!started){
        linePath='M'+xs+','+ys+' ';
        area='M'+xs+','+(H-padB).toFixed(1)+' L'+xs+','+ys;
        started=true;
      }else{
        linePath+='L'+xs+','+ys+' ';
        area+=' L'+xs+','+ys;
      }
    });
    if(!started){return;}  // 防御: 数据全空跳过
    area+=' L'+(padL+(N-1)*xStep).toFixed(1)+','+(H-padB).toFixed(1)+' Z';
    h+=`<path d="${area}" fill="url(#tg-${svgId}-${li})" opacity=".5"/>`;
    h+=`<path d="${linePath.trim()}" fill="none" stroke="${l.c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:anim-radar-fade .8s ease both"/>`;
    // 最新点
    const lastX=padL+(N-1)*xStep,lastY=Number.isFinite(yScale(safe[N-1],l))?yScale(safe[N-1],l):(H-padB);
    h+=`<circle cx="${lastX.toFixed(1)}" cy="${lastY.toFixed(1)}" r="3" fill="${l.c}" stroke="#fff" stroke-width="1.5"/>`;
    h+=`<text x="${(lastX-4).toFixed(1)}" y="${(lastY-6).toFixed(1)}" text-anchor="end" font-size="9" font-weight="800" fill="${l.c}">${safe[N-1]}${l.unit}</text>`;
  });
  // 左 y 轴标签 (取第 1 个左轴线)
  if(leftLines[0]){
    const l=leftLines[0];
    for(let i=0;i<=4;i++){
      const v=l.min+(l.max-l.min)*(1-i/4);
      const y=padT+(H-padT-padB)*i/4;
      h+=`<text x="${(padL-4).toFixed(1)}" y="${(y+3).toFixed(1)}" text-anchor="end" font-size="9" fill="#94a3b8" font-weight="600">${v.toFixed(l.unit==='mΩ'?2:0)}</text>`;
    }
  }
  if(rightLines[0]){
    const l=rightLines[0];
    for(let i=0;i<=4;i++){
      const v=l.min+(l.max-l.min)*(1-i/4);
      const y=padT+(H-padT-padB)*i/4;
      h+=`<text x="${(W-padR+4).toFixed(1)}" y="${(y+3).toFixed(1)}" text-anchor="start" font-size="9" fill="${l.c}" font-weight="600">${v.toFixed(l.unit==='mΩ'?2:0)}${l.unit}</text>`;
    }
  }
  // 用 DOMParser 解析为 SVG 命名空间, 避免 headless Chromium 把 innerHTML 当 HTML
  try{
    const parser=new DOMParser();
    const doc=parser.parseFromString('<svg xmlns="http://www.w3.org/2000/svg">'+h+'</svg>','image/svg+xml');
    const errEl=doc.querySelector('parsererror');
    if(!errEl){
      while(svg.firstChild) svg.removeChild(svg.firstChild);
      Array.from(doc.documentElement.childNodes).forEach(n=>svg.appendChild(document.importNode(n,true)));
    }else{
      svg.innerHTML=h;
    }
  }catch(e){ svg.innerHTML=h; }
  // legend
  const lg=document.getElementById(svgId+'-legend');
  if(lg) lg.innerHTML=lines.map(l=>`<span><i style="background:${l.c}"></i>${l.n}${l.unit?' ('+l.unit+')':''}</span>`).join('');
}

/* === 环形进度条 (圆环) === */
function renderRing(container,item){
  const r=14,c=2*Math.PI*r;
  const off=c*(1-item.pct/100);
  return `<div class="ring-row">
    <div class="ring-svg"><svg viewBox="0 0 34 34">
      <circle class="ring-bg" cx="17" cy="17" r="${r}"/>
      <circle class="ring-fg" cx="17" cy="17" r="${r}" stroke="${item.c}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/>
    </svg></div>
    <div class="rn-body"><div class="nm">${item.n}</div><div class="vv">${item.v}<small>%</small></div></div>
  </div>`;
}

/* === 数据表: 最近 20 个时点 === */
function genTableRows(sys,cfg){
  const r=_rng(20260627+sys.charCodeAt(0));
  const rows=[];
  // 取最近 20 个 5min 点: 14:00-15:35
  for(let i=0;i<20;i++){
    const t=`${14+Math.floor(i*5/60)}:${String((i*5)%60).padStart(2,'0')}`;
    if(sys==='bms'){
      const c=i%12+1;
      const v=(3.30+Math.sin(i/3)*0.05+r()*0.06).toFixed(3);
      const soc=(94+Math.sin(i/4)*1).toFixed(1);
      const temp=(31+Math.sin(i/3)*1.5).toFixed(1);
      const res=(0.36+Math.sin(i/4)*0.03).toFixed(3);
      const st=i===3?'P1':(i===7?'WARN':'OK');
      rows.push([i+1,t,`C${String(c).padStart(2,'0')}`,v,soc,temp,res,st]);
    }else if(sys==='env'){
      const zr=['F1 大厅','F2 机房','F3 存储','F4 计算'][i%4];
      const ct=(22+Math.sin(i/3)*0.5).toFixed(1);
      const ht=(30+Math.sin(i/3)*2).toFixed(1);
      const hm=(45+Math.sin(i/3)*3).toFixed(1);
      const pue=(1.32+Math.sin(i/3)*0.05).toFixed(2);
      const st=i===4?'P0':(i===9?'P1':'OK');
      rows.push([i+1,t,zr,ct,ht,hm,pue,st]);
    }else if(sys==='fire'){
      const loc=`Z${1+Math.floor(i/4)}-${String(i%4+1).padStart(2,'0')}`;
      const sm=(8+Math.sin(i/3)*2).toFixed(1);
      const pr=(4.2+Math.sin(i/3)*0.1).toFixed(2);
      const wl=(86+Math.sin(i/4)*0.5).toFixed(1);
      const st=i===2?'运行':(i%5===0?'待机':'正常');
      const al=i===12?'P0':(i===8?'P2':'无');
      rows.push([i+1,t,loc,sm,pr,wl,st,al]);
    }else if(sys==='security'){
      const loc=['北门','南门','F2-1','F2-2','F3-北','F3-南','F4-西'][i%7];
      const p=['张工','访客-王','李工','赵工','外包-陈','巡更-1','巡更-2'][i%7];
      const ty=['员工','访客','员工','员工','外包','巡更','巡更'][i%7];
      const dev=['CARD-01','CARD-08','CARD-12','CARD-15','FACE-03','TOUR-01','TOUR-02'][i%7];
      const st=ty==='访客'?'登记':(ty==='外包'?'审批':(i===5?'异常':'通过'));
      const handle=st==='异常'?'复核':(st==='登记'?'留痕':'正常');
      rows.push([i+1,t,loc,p,ty,dev,st,handle]);
    }else if(sys==='ba'){
      const dev=['AHU-1#','AHU-2#','AHU-3#','CHILLER-1#','CHILLER-2#','LIGHTING-F2','PUMP-1#','ELEV-1#'][i%8];
      const param=['出风 ℃','出风 ℃','滤网压差 Pa','COP','COP','开启 %','频率 Hz','位置 %'][i%8];
      const val=(20+Math.sin(i/3)*2).toFixed(1);
      const target=22;
      const devia=(val-target).toFixed(1);
      const link=dev.startsWith('AHU')?'温控':(dev.startsWith('CHILLER')?'能耗优化':(dev.startsWith('LIGHTING')?'照明':(dev.startsWith('PUMP')?'给排水':'电梯')));
      rows.push([i+1,t,dev,param,val,target,(devia>0?'+':'')+devia,link]);
    }
  }
  return rows;
}

/* === 主渲染 === */
function renderDetail(page,title){
  const cfg=subsysCfg[page]||subsysCfg.env;
  // 1. 横幅
  const banner=document.getElementById('subBanner');
  if(banner){
    banner.className='sub-banner '+cfg.cls;
    banner.innerHTML=`<div class="ico">${cfg.ico}</div>
      <div class="txt">
        <b>${cfg.name}</b>
        <small>${cfg.sub}</small>
        <div class="badges">${cfg.badges.map(b=>`<span>${b}</span>`).join('')}</div>
      </div>
      <div class="right">
        <div class="score">${cfg.score}</div>
        <div class="lbl">综合健康分 · 0-100</div>
        <span class="lvl ${cfg.lvlCls}">${cfg.lvl}</span>
      </div>`;
  }
  // 2. 5 KPI 卡片
  const kpi=document.getElementById('subKPI');
  if(kpi){
    kpi.innerHTML=cfg.kpis.map(k=>`<div class="sk-card ${cfg.cls}">
      <div class="sk-ico">${k.i}</div>
      <div class="sk-body">
        <div class="name">${k.n}<span class="pulse ${k.p}"></span></div>
        <div class="val">${k.v}<small>${k.u}</small></div>
        <div class="delta">${k.d.startsWith('-')||k.d.startsWith('+')?'较 1h':''} <b class="${(k.d.startsWith('-')&&parseFloat(k.d)<0)?'dn':''}">${k.d}</b></div>
      </div>
    </div>`).join('');
  }
  // 3. Body
  const body=document.getElementById('subBody');
  if(body){
    // 趋势区
    let html=`<div class="sub-row r2-1">
      <div class="panel chart-card" style="margin-bottom:0">
        <h5>${cfg.trend.name}<small>5min 粒度 · 288 点 · 数据源 day_predict.json</small></h5>
        <svg id="subTrend" viewBox="0 0 600 180" preserveAspectRatio="none" style="height:200px;width:100%"></svg>
        <div class="chart-legend" id="subTrend-legend"></div>
      </div>
      <div class="panel chart-card" style="margin-bottom:0">
        <h5>关键部件在线率<small>实时 · 颜色按健康度</small></h5>
        <div class="ring-list">${cfg.rings.map(r=>renderRing(null,r)).join('')}</div>
      </div>
    </div>`;
    // BMS 特有: 簇分布
    if(page==='bms'){
      html+=`<div class="sub-row r1-2">
        <div class="panel chart-card" style="margin-bottom:0">
          <h5>12 簇电池电压分布<small>3.30V 基准 · 偏差±50mV</small></h5>
          <div class="cluster-grid">${cfg.clusters.map(c=>`<div class="cluster-cell">
            <div class="c-n">${c.n}</div>
            <div class="c-v">${c.v}</div>
            <span class="c-s ${c.s}">${c.s}</span>
            <div class="c-bar"><i style="width:${c.p}%"></i></div>
          </div>`).join('')}</div>
        </div>
        <div class="panel chart-card" style="margin-bottom:0">
          <h5>关键部件健康<small>实时 · 颜色按健康度</small></h5>
          <div class="ring-list">${cfg.rings.map(r=>renderRing(null,r)).join('')}</div>
        </div>
      </div>`;
    }
    // 动环/安防/BA 特有: 堆叠构成
    if(page==='env'||page==='security'||page==='ba'){
      const total=cfg.stacked.data.reduce((s,d)=>s+d.v,0);
      html+=`<div class="sub-row r2-1">
        <div class="panel chart-card" style="margin-bottom:0">
          <h5>${cfg.stacked.name}<small>总 ${total} 单位</small></h5>
          <div class="stacked-bar">${cfg.stacked.data.map(d=>`<i data-v="${d.v}" style="width:${(d.v/total*100).toFixed(1)}%;background:${d.c}"></i>`).join('')}</div>
          <div class="stacked-legend">${cfg.stacked.data.map(d=>`<span><i style="background:${d.c}"></i>${d.n} <b style="color:var(--title);margin-left:3px">${d.v}</b></span>`).join('')}</div>
        </div>
        <div class="panel chart-card" style="margin-bottom:0">
          <h5>关键部件健康<small>实时 · 颜色按健康度</small></h5>
          <div class="ring-list">${cfg.rings.map(r=>renderRing(null,r)).join('')}</div>
        </div>
      </div>`;
    }
    // 消防 特有: 部件在线表
    if(page==='fire'){
      const parts=[{n:'烟感',on:128,total:128},{n:'温感',on:86,total:86},{n:'手报',on:32,total:32},{n:'声光',on:48,total:48},{n:'消防泵',on:2,total:2},{n:'气灭',on:6,total:6}];
      html+=`<div class="sub-row r2-1">
        <div class="panel chart-card" style="margin-bottom:0">
          <h5>消防部件在线率<small>6 大类 · 颜色按健康度</small></h5>
          <div class="ring-list">${cfg.rings.map(r=>renderRing(null,r)).join('')}</div>
        </div>
        <div class="panel chart-card" style="margin-bottom:0">
          <h5>部件明细<small>在线 / 总数</small></h5>
          <div class="cluster-grid" style="grid-template-columns:repeat(3,1fr);gap:8px">${parts.map(p=>{const pct=Math.round(p.on/p.total*100);return`<div class="cluster-cell">
            <div class="c-n">${p.n}</div>
            <div class="c-v">${p.on}/${p.total}</div>
            <span class="c-s ${pct===100?'OK':'WARN'}">${pct===100?'OK':'WARN'}</span>
            <div class="c-bar"><i style="width:${pct}%;background:${pct===100?'linear-gradient(90deg,#10b981,#34d399)':'linear-gradient(90deg,#f59e0b,#fbbf24)'}"></i></div>
          </div>`}).join('')}</div>
        </div>
      </div>`;
    }
    // 事件
    html+=`<div class="sub-row r2-1">
      <div class="panel chart-card" style="margin-bottom:0">
        <h5>近期告警 / Skill 闭环事件<small>本系统 · ${cfg.eventsSrc.length} 条</small></h5>
        <div class="event-list">${cfg.eventsSrc.map(e=>`<div class="event-item">
          <div class="ev-time">${e.t}</div>
          <div class="ev-body"><b>${e.d}</b><small>${e.m}</small></div>
          <span class="ev-lvl lvl ${e.l}">${e.l}</span>
        </div>`).join('')}</div>
      </div>
      <div class="panel chart-card" style="margin-bottom:0">
        <h5>本系统 · Agent Skill 沉淀<small>${cfg.badges.length} 个域 · 自动收敛 + 飞书推送 + LLM 迭代</small></h5>
        <div style="padding:6px 0">
          ${cfg.badges.map((b,i)=>{const skills=['bms/cluster-balance v1.4','bms/active-balance v1.2','env/crac-cool v2.4','env/rack-temp v1.0','env/ups-bypass v1.0','fire/smoke-typo v1.0','security/access-control v1.0','ba/ahu-start v1.0'];return`<div class="activity" style="margin-bottom:8px">
            <div class="aico" style="background:linear-gradient(135deg,${i%2===0?'#10b981,#34d399':'#0ea5e9,#06b6d4'})">${cfg.ico}</div>
            <div><h4 style="margin:0;font-size:12.5px">${b}</h4><p style="margin:2px 0 0;font-size:11px">${skills[i%skills.length]} · 命中率 ${(85+Math.round(Math.random()*10))}%</p></div>
          </div>`}).join('')}
        </div>
      </div>
    </div>`;
    body.innerHTML=html;
    // 渲染趋势
    setTimeout(()=>renderTrendSVG('subTrend',cfg.trend),30);
  }
  // 4. 数据表
  const tbl=document.getElementById('subTable');
  if(tbl){
    const rows=genTableRows(page,cfg);
    tbl.innerHTML=`<div class="st-head">
      <b>${cfg.name} · 24h 时序数据明细</b>
      <small>最近 20 个时点 · 5min 粒度 · ${page==='security'||page==='ba'?'事件/状态':'实时参数'}</small>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead><tr>${cfg.tableHead.map((h,i)=>i===0||i===cfg.tableHead.length-1?`<th style="width:${i===0?42:90}px">${h}</th>`:`<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${rows.map(r=>`<tr>${r.map((c,i)=>{
          const isLast=i===r.length-1,isLvlCol=cfg.tableHead[i]==='状态'||cfg.tableHead[i]==='告警'||cfg.tableHead[i]==='处理'||cfg.tableHead[i]==='联动'||cfg.tableHead[i]==='设备状态';
          const isNum=i>0&&!isLvlCol&&i<r.length-1;
          if(isLvlCol){return`<td><span class="lvl ${c}">${c}</span></td>`}
          if(isNum){return`<td class="num">${c}</td>`}
          return`<td>${c}</td>`;
        }).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>`;
  }
}
// 修复 P1: 用 data-title 取菜单标题，去掉 .replace(/P1|正常|2|3|12|新/g,'') 的 hack（会误伤含数字的真实标题）
$$('.menu-item').forEach(m=>m.onclick=()=>{ $$('.menu-item').forEach(x=>x.classList.remove('active'));m.classList.add('active');const page=m.dataset.page,title=m.dataset.title||m.textContent.trim();currentAgent=m.dataset.agent||'token母体-总览';$('#pageTitle').textContent=title;$('#breadcrumb').textContent='ToKen Matrix / '+title;$('#aiTitle').textContent=currentAgent;
  // 仅在 Agent 运营管理平台 页面显示小宿科技 logo
  const bx=$('#brandXiaosu');if(bx){bx.classList.toggle('show',page==='agent-ops');}
  $('#content').style.opacity=.25;setTimeout(()=>$('#content').style.opacity=1,80);$$('.page').forEach(p=>p.classList.remove('active'));if(page==='overview'){$('#page-overview').classList.add('active')}else if(page==='agent-ops'){$('#page-agent-ops').classList.add('active')}else if(page==='pixelmap'){$('#page-pixelmap').classList.add('active');if(typeof pxmInit==='function')pxmInit();}else if(page==='bms' || page==='env' || page==='fire' || page==='security' || page==='ba'){$('#page-detail').classList.add('active');renderDetail(page,title)}else{$('#page-detail').classList.add('active');renderDetail(page,title)}});
$$('[data-filter]').forEach(b=>b.onclick=()=>{$$('[data-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');const f=b.dataset.filter;$$('.alert').forEach(a=>a.classList.toggle('hidden',f!=='all'&&a.dataset.level!==f))});
$('#pauseRotate').onclick=()=>{$('#stage').classList.add('paused');$('#pauseRotate').classList.add('active');$('#autoRotate').classList.remove('active')};$('#autoRotate').onclick=()=>{$('#stage').classList.remove('paused');$('#autoRotate').classList.add('active');$('#pauseRotate').classList.remove('active')};$('#resetView').onclick=()=>{$('#stage').style.animation='none';void $('#stage').offsetWidth;$('#stage').style.animation='rotateBuilding 24s linear infinite'};
function tick(){const n=new Date();$('#clock').textContent=n.toLocaleString('zh-CN',{hour12:false})}tick();setInterval(tick,1000);
setInterval(()=>{$$('.metric').forEach(c=>{const v=c.querySelector('.value'),bar=c.querySelector('.bar i');const raw=parseFloat(v.childNodes[0].textContent);if(!isNaN(raw)&&raw<200){const nv=Math.max(0,raw+(Math.random()-.5)*2);v.childNodes[0].textContent=raw%1?nv.toFixed(1):Math.round(nv);bar.style.width=Math.max(20,Math.min(100,parseFloat(bar.style.width)+(Math.random()-.5)*8))+'%'}})},5000);
setInterval(()=>{const nodes=[...$$('.trace .node')];const cur=nodes.findIndex(n=>n.classList.contains('active'));nodes.forEach(n=>n.classList.remove('active','done'));nodes.forEach((n,i)=>{if(i<((cur+1)%nodes.length))n.classList.add('done')});nodes[(cur+1)%nodes.length].classList.add('active')},4000);
setInterval(()=>{const a=alertSeed[Math.floor(Math.random()*alertSeed.length)];$('#alerts').insertAdjacentHTML('afterbegin',alertHTML(a,0));if($$('#alerts .alert').length>10)$('#alerts .alert:last-child').remove()},25000);
$('#aiFab').onclick=()=>$('#aiDialog').classList.toggle('open');$('#aiClose').onclick=()=>$('#aiDialog').classList.remove('open');function addMsg(type,text){$('#msgs').insertAdjacentHTML('beforeend',`<div class="msg ${type}"><div class="bubble">${text}</div></div>`);$('#msgs').scrollTop=$('#msgs').scrollHeight}async function sendMsg(){const input=$('#aiInput'),msg=input.value.trim();if(!msg)return;addMsg('user',msg);input.value='';$('#aiSend').disabled=true;try{const r=await fetch('/agent/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({agent:currentAgent,message:msg})});const d=await r.json();setTimeout(()=>addMsg('bot',d.reply||'已收到。'),500)}catch(e){addMsg('bot','当前无法连接后端 Agent，但我已记录你的问题。')}finally{$('#aiSend').disabled=false}}$('#aiSend').onclick=sendMsg;$('#aiInput').onkeydown=e=>{if(e.key==='Enter')sendMsg()};

/* ============== Agent 运营管理平台 数据与交互 · 旧版兼容层 (新设计由 layerInit 接管) ============== */
if(!document.getElementById('kpiGrid')){
// 旧版
const cfgData=[
  {n:'BMS 电池系统',s:'告警',k:'BM',cls:'warn'},{n:'动环监控系统',s:'运行',k:'EH',cls:''},{n:'消防系统',s:'待命',k:'FR',cls:'idle'},{n:'安防系统',s:'运行',k:'SC',cls:''},{n:'BA系统',s:'节能',k:'BA',cls:''}
];
$('#cfgGrid').innerHTML=cfgData.map(c=>`<div class="cfg-cell"><b>${c.n}</b><small><span>状态</span><span class="pill-mini ${c.cls}">${c.s}</span></small><small><span>协议</span><span>${c.k}</span></small></div>`).join('');
const iterSteps=[
  {h:'① 触发',p:'告警/工单触发收敛信号',on:true},
  {h:'② 收敛',p:'多 Agent 提议 + Hermes 评分'},
  {h:'③ 入图',p:'图谱节点新增 / 边关系更新'},
  {h:'④ 跟新',p:'Skill 库版本化沉淀'},
];
$('#iterLine').innerHTML=iterSteps.map((s,i)=>`<div class="iter-step ${s.on?'flow':''}"><div class="num">${i+1}</div><h5>${s.h}</h5><p>${s.p}</p></div>`).join('');
const skills=[
  {n:'CRAC 调节',v:'v2.4',p:78,step:'正在学习新工况',iter:true},
  {n:'P0 派单',v:'v3.1',p:92,step:'本周 +6 收敛样本',iter:false},
  {n:'热通道气流',v:'v1.7',p:55,step:'待评审 · 草稿',iter:true},
  {n:'BMS 内阻均衡',v:'v1.2',p:62,step:'已合并主干',iter:false},
  {n:'工单催办',v:'v2.0',p:88,step:'稳定运行',iter:false},
  {n:'门禁审批',v:'v1.5',p:64,step:'灰度中',iter:true},
];
$('#skillRow').innerHTML=skills.map(s=>`<div class="skill-pill ${s.iter?'iter':''}"><div class="nm"><span>${s.n}</span><span style="color:var(--muted);font-weight:500">${s.v}</span>${s.iter?'<span class="iter-tag">迭代中</span>':''}</div><div class="bar"><i style="width:${s.p}%"></i></div><div class="step">${s.step} · ${s.p}%</div></div>`).join('');

/* 知识图谱：定义节点与边 */
const kgNodes=[
  {id:'hermes',x:280,y:30,label:'Hermes',t:'core'},
  {id:'bms',x:60,y:90,label:'BMS',t:'domain'},{id:'env',x:160,y:90,label:'动环',t:'domain'},
  {id:'fire',x:260,y:90,label:'消防',t:'domain'},{id:'sec',x:360,y:90,label:'安防',t:'domain'},
  {id:'ba',x:460,y:90,label:'BA',t:'domain'},
  {id:'a1',x:60,y:180,label:'内阻×1',t:'warn'},{id:'a2',x:160,y:180,label:'F3 温度',t:'warn'},
  {id:'a3',x:260,y:180,label:'喷淋',t:'domain'},{id:'a4',x:360,y:180,label:'刷卡',t:'domain'},
  {id:'a5',x:460,y:180,label:'节能策略',t:'domain'},
  {id:'new1',x:110,y:180,label:'BMS均衡',t:'new'},
  {id:'new2',x:210,y:180,label:'热气流',t:'new'},
];
const kgEdges=[
  ['hermes','bms'],['hermes','env'],['hermes','fire'],['hermes','sec'],['hermes','ba'],
  ['bms','a1'],['bms','new1'],['env','a2'],['env','new2'],['fire','a3'],['sec','a4'],['ba','a5'],
  ['a1','sec'],['a2','ba'],['a5','env']
];
// 修复 P0-2: kgMap 改为函数内动态构建，setInterval push 新节点后 renderKG 不会崩
function buildKgMap(){ return Object.fromEntries(kgNodes.map(n=>[n.id,n])); }
function renderKG(highlightNew){
  const svg=$('#kg');
  if(!svg) return;
  const kgMap=buildKgMap();  // 每次重建，避开 7s 后 kgNodes.push(fresh) 导致 kgMap[fresh.id] undefined
  let html='';
  kgEdges.forEach(([a,b])=>{
    const A=kgMap[a], B=kgMap[b];
    if(!A||!B) return;  // 兜底：缺失节点跳过
    const cls=highlightNew&&(a.startsWith('new')||b.startsWith('new')||a==='a1'||b==='a1'||a==='a3'||b==='a3')?'new':(a==='hermes'||b==='hermes')?'active':'';
    html+=`<path class="glink ${cls}" d="M${A.x},${A.y} Q${(A.x+B.x)/2},${(A.y+B.y)/2-20} ${B.x},${B.y}"/>`;
  });
  kgNodes.forEach(n=>{const cls=n.t==='new'?'active':(n.t==='warn'?'warn':(n.t==='core'?'active':''));const r=n.t==='core'?18:12;html+=`<g><circle class="gn ${cls}" cx="${n.x}" cy="${n.y}" r="${r}"/><text class="glabel" x="${n.x}" y="${n.y+r+12}" text-anchor="middle">${n.label}</text></g>`});
  svg.innerHTML=html;
}
renderKG(false);

/* 五大楼宇子系统报警日志 */
const sysGroups=[
  {n:'BMS 电池系统',cls:'warn',log:[['BMS-03# 内阻 0.42mΩ · P1','14:32:11'],['SOC 96% · SOH 96%','14:18:00'],['簇间温差 1.2℃','14:10:00']]},
  {n:'动环监控系统',cls:'danger',log:[['F3 存储区温度 32.6℃ · P0','14:35:22'],['UPS-B 负载 85% · P1','14:28:47'],['水浸传感器全楼正常','14:21:03']]},
  {n:'消防系统',cls:'',log:[['喷淋压力 4.2bar · 正常','14:00:00'],['烟感 128/128 在线','13:55:11'],['消防泵待机 · OK','13:40:00']]},
  {n:'安防系统',cls:'',log:[['非工作刷卡 1 次 · 已审批','14:25:08'],['今日门禁 156 条','14:00:00'],['周界报警 0 次','13:30:00']]},
  {n:'BA系统',cls:'warn',log:[['照明回路开启率 68%','14:36:00'],['空调机组 8/9 运行','14:30:00'],['能耗同比节省 12%','14:00:00']]}
];
$('#sysLog').innerHTML=sysGroups.map(g=>`<div class="group-log"><div class="gh"><b><span class="dotmark ${g.cls}"></span>${g.n}</b><span class="tag-pill">${g.log.length}</span></div>${g.log.map(l=>`<div class="gb"><b>${l[0]}</b><span>${l[1]||''}</span></div>`).join('')}</div>`).join('');

/* 两大工作区 */
const autoWork=[
  {n:'F3 温度异常自闭环',s:'调节 CRAC 2# 出风 -1.5℃',p:'执行中'},
  {n:'BMS 内阻自适应',s:'主动均衡启动',p:'运行'},
  {n:'日志归档',s:'归档 12.8GB · 100%',p:'完成'},
  {n:'巡检比对',s:'A/B/C 列接地 OK',p:'完成'},
];
const dispatchWork=[
  {n:'#20266 F3 冷却',s:'李工 · P0 · 11min',p:'派发中'},
  {n:'#20267 BMS 内阻',s:'赵工 · 检查均衡',p:'已派'},
  {n:'CRAC 调节审批',s:'飞书 · 等批准',p:'待批'},
  {n:'UPS-B 切换演练',s:'运维组 · 本周',p:'待派'},
];
function workRowHTML(r,i,flow){return `<div class="work-row ${flow&&i===0?'flow':''}"><span class="l">${flow&&i===0?'<i class="dotpulse"></i>':'<i class="dotpulse" style="background:var(--muted)"></i>'} ${r.n}</span><span class="r"><small>${r.s}</small><span class="tag-pill">${r.p}</span></span></div>`}
$('#autoTrack').innerHTML=autoWork.map((r,i)=>workRowHTML(r,i,false)).join('');
$('#dispatchTrack').innerHTML=dispatchWork.map((r,i)=>workRowHTML(r,i,i===0)).join('');

/* 事件流 */
const feed=[
  {t:'14:36:20',m:'<b>图谱更新</b> · BA节能策略关联动环温控曲线',p:'ok'},
  {t:'14:35:55',m:'<b>Skill 跟新</b> · CRAC调节 v2.3 → v2.4',p:'g'},
  {t:'14:35:22',m:'<b>告警</b> · 动环 F3 温度 32.6℃ · 触发自闭环',p:'r'},
  {t:'14:33:01',m:'<b>Agent 提议</b> · BA联动关闭低负载照明回路',p:'w'},
  {t:'14:32:11',m:'<b>告警</b> · BMS-03# 内阻 0.42mΩ · 主动均衡启动',p:'w'},
  {t:'14:30:00',m:'<b>图谱更新</b> · 边 BMS→均衡 Skill 新增',p:'ok'},
  {t:'14:28:47',m:'<b>告警</b> · 消防泵巡检正常 · 状态回写',p:'w'},
];
$('#feedList').innerHTML=feed.map(f=>`<div class="feed-row"><span class="t">${f.t}</span><span class="m">${f.m}</span><span class="tag-pill ${f.p}">${f.p==='ok'?'图谱':f.p==='g'?'Skill':f.p==='w'?'派单':'告警'}</span></div>`).join('');

/* 周期性：图谱触发新节点 + 告警推进 + 工作流推进 */
setInterval(()=>{const idx=(kgNodes.findIndex(n=>n.id==='new1')+0);kgNodes.forEach(n=>{if(n.t==='new')n.t='domain'});kgNodes[kgNodes.length-2]={...kgNodes[kgNodes.length-2]};const fresh={id:'np'+Date.now(),x:60+Math.random()*440,y:50+Math.random()*40,label:'学习 #'+(++window._n||(window._n=148)),t:'new'};kgNodes.push(fresh);kgEdges.push(['hermes',fresh.id]);renderKG(true);$('#graphStat').textContent=(148+(++window._n||0))+' 节点';setTimeout(()=>{fresh.t='domain';renderKG(false)},2400)},7000);
setInterval(()=>{const row=`<div class="feed-row"><span class="t">${new Date().toLocaleTimeString('zh-CN',{hour12:false})}</span><span class="m"><b>收敛学习</b> · Hermes 提炼告警处置建议</span><span class="tag-pill g">学习</span></div>`;$('#feedList').insertAdjacentHTML('afterbegin',row);const items=$$('#feedList .feed-row');if(items.length>14)items[items.length-1].remove()},9000);

/* 菜单切换支持 agent-ops */
const origMenuClick=$$('.menu-item')[0].onclick;

/* ============== 3 个 Demo 触发链路 ============== */
const demoScenarios={
  env:{
    title:'动环监控 · F3 存储区温度告警',
    sub:'中央调度 · 动环监控管理系统',
    source:'动环监控管理系统',
    device:'CRAC 1# · F3 存储区',
    params:[
      ['F3 进风温度','32.6 ℃','critical'],
      ['F3 出风温度','28.1 ℃','warn'],
      ['热通道温差','+4.5 ℃','critical'],
      ['CRAC 1# 状态','压缩机高负载','warn'],
      ['CRAC 2# 状态','正常 · 待命','ok'],
      ['机柜 R3-12 表面','38.9 ℃','critical'],
      ['机房平均湿度','45 %','ok'],
      ['告警时间',new Date().toLocaleString('zh-CN',{hour12:false}),'warn']
    ],
    sop:'动环 · F3 温度异常 SOP',
    skills:[
      {id:'crac-cool',n:'CRAC 出风调节 v2.4',p:'调节出风 -1.5℃ 并开启备用压缩机',tag:'迭代中',
       params:[['目标出风','18.9 ℃'],['备用 CRAC','CRAC 3# · 自动'],['回差','±0.3 ℃']],
       ctrls:[{l:'下达指令',run:'crac-cool'},{l:'执行',run:'crac-cool'}]},
      {id:'hot-aisle',n:'热通道气流重构 v1.7',p:'动态打开回风百叶，平衡通道温差',tag:'草稿',
       params:[['百叶开度','+25%'],['风压阈值','45 Pa'],['延时','60s']],
       ctrls:[{l:'下达指令',run:'hot-aisle'},{l:'执行',run:'hot-aisle'}]},
      {id:'predict',n:'温度预测 v3.1',p:'15 分钟温度预测 · 置信度 92%',tag:'稳定',
       params:[['预测峰值','31.4 ℃'],['置信度','92%'],['处置建议','-1.5℃']],
       ctrls:[{l:'下达指令',run:'predict'}]}
    ]
  },
  fire:{
    title:'消防喷淋 · 喷淋压力异常告警',
    sub:'中央调度 · 消防告警系统',
    source:'消防告警系统',
    device:'F2 消防泵房 · 喷淋主管',
    params:[
      ['喷淋主管压力','2.4 bar','critical'],
      ['稳压泵状态','故障','critical'],
      ['消防泵 A 主','运行','ok'],
      ['消防泵 B 备','待机','ok'],
      ['末端试水压力','1.8 bar','warn'],
      ['水力警铃','未触发','ok'],
      ['烟感在线','128/128','ok'],
      ['告警时间',new Date().toLocaleString('zh-CN',{hour12:false}),'warn']
    ],
    sop:'消防 · 喷淋压力异常 SOP',
    skills:[
      {id:'pump-switch',n:'消防泵自动切换 v1.2',p:'主泵故障时自动切换备泵',tag:'稳定',
       params:[['主泵','A'],['备泵','B'],['切换延时','5s']],
       ctrls:[{l:'下达指令',run:'pump-switch'},{l:'执行',run:'pump-switch'}]},
      {id:'water',n:'消防水压调节 v1.5',p:'提升水压至 4.2 bar 并打开旁通阀',tag:'灰度',
       params:[['目标压力','4.2 bar'],['旁通阀','开启'],['补压时长','90s']],
       ctrls:[{l:'下达指令',run:'water'},{l:'执行',run:'water'}]},
      {id:'feishu',n:'飞书通知 v2.0',p:'推送 P0 告警至消防责任人',tag:'稳定',
       params:[['接收人','消防责任人'],['通道','飞书群'],['级别','P0']],
       ctrls:[{l:'下达指令',run:'feishu'}]}
    ]
  },
  bms:{
    title:'BMS · 03# 电池组内阻偏高告警',
    sub:'中央调度 · BMS 电池管理系统',
    source:'BMS 电池管理系统',
    device:'F2 电池簇 03# · 单体 12#',
    params:[
      ['12# 单体内阻','0.42 mΩ','critical'],
      ['组 SOC 估算','94.6 %','warn'],
      ['簇间电压差','+24 mV','warn'],
      ['BMS-03 状态','主动均衡中','ok'],
      ['BMS-04 状态','正常 · 待命','ok'],
      ['电池温度','32.4 ℃','warn'],
      ['机房平均湿度','45 %','ok'],
      ['告警时间',new Date().toLocaleString('zh-CN',{hour12:false}),'warn']
    ],
    sop:'BMS · 电池内阻异常 SOP',
    skills:[
      {id:'bms-cell-balance',n:'BMS 主动均衡 v1.4',p:'触发主动均衡并降低充电电流',tag:'迭代中',
       params:[['均衡电流','5.2 A'],['目标单体','12#'],['回差','±5 mV']],
       ctrls:[{l:'下达指令',run:'bms-cell-balance'},{l:'执行',run:'bms-cell-balance'}]},
      {id:'bms-cell-test',n:'电池组放电测试 v1.0',p:'启动 0.1C 容量测试，验证 SOH',tag:'稳定',
       params:[['放电倍率','0.1C'],['截止电压','48V'],['时长','30min']],
       ctrls:[{l:'下达指令',run:'bms-cell-test'},{l:'执行',run:'bms-cell-test'}]},
      {id:'bms-temp-watch',n:'电池温度监测 v1.2',p:'开启温升 0.5℃/min 强预警，联动空调',tag:'稳定',
       params:[['温度阈值','35 ℃'],['联动','CRAC 2#'],['告警级别','P1']],
       ctrls:[{l:'下达指令',run:'bms-temp-watch'}]}
    ]
  }
};

const aiTasks=[]; // {id,key,title,sub,scenario,status,time,ctrlState,log}
let taskCounter=0;

function flashSysLog(){
  const panel=document.querySelector('#page-agent-ops .sys-log .group-log');
  if(panel){panel.classList.add('alert-flash');setTimeout(()=>panel.classList.remove('alert-flash'),3600)}
}
function pushAlertToLog(scn){
  const grp=$('#sysLog');
  if(!grp) return;
  const sevTag=scn===demoScenarios.env?'danger':scn===demoScenarios.fire?'warn':'warn';
  const html=`<div class="group-log alert-flash" style="margin-top:6px"><div class="gh"><b><span class="dotmark danger"></span>${scn.source}</b><span class="tag-pill r">P0</span></div>
    <div class="gb"><b>${scn.title}</b><span>${new Date().toLocaleTimeString('zh-CN',{hour12:false})}</span></div>
    <div class="gb"><b>设备：${scn.device}</b><span>${scn.params[0][1]}</span></div>
    <div class="gb"><b>已接入 SOP：${scn.sop}</b><span>Hermes</span></div></div>`;
  grp.insertAdjacentHTML('afterbegin',html);
  const all=$$('#sysLog .group-log');if(all.length>10)all[all.length-1].remove();
}
function renderAITasks(){
  const list=$('#aiTaskList');if(!list) return;
  list.innerHTML=aiTasks.map(t=>`<div class="ai-task ${t.status==='new'?'new':t.status==='done'?'done':''}" data-id="${t.id}">
    <div class="ti">AI</div>
    <div style="flex:1;min-width:0">
      <div class="tt">${t.title}</div>
      <div class="td">${t.sub}</div>
      <div class="tm"><span class="pulse-r"></span>${t.time} · ${t.status==='done'?'已闭环':'Hermes 调度中'}</div>
    </div></div>`).join('');
  $$('#aiTaskList .ai-task').forEach(el=>el.onclick=()=>openTaskDrawer(el.dataset.id));
}
function triggerDemo(key){
  const scn=demoScenarios[key];if(!scn) return;
  // 1) 报警日志：闪烁 + 写入
  flashSysLog();pushAlertToLog(scn);
  // 1.5) 自动给相关资料加注释
  if(typeof autoAnnotateOnAlert==='function') autoAnnotateOnAlert(scn);
  // 2) AI 任务：红色跳动新增
  taskCounter+=1;const t={
    id:'t'+Date.now(),
    key,
    title:'#'+taskCounter+' · '+scn.title,
    sub:'已接入 '+scn.sop+' · 调用 '+scn.skills.length+' 个 Skills',
    scenario:scn,
    status:'new',
    time:new Date().toLocaleTimeString('zh-CN',{hour12:false}),
    ctrlState:scn.skills.map(s=>({id:s.id,done:false})),
    log:[`[${new Date().toLocaleTimeString('zh-CN',{hour12:false})}] Hermes 接收告警 · ${scn.title}`]
  };
  aiTasks.unshift(t);if(aiTasks.length>8)aiTasks.pop();
  renderAITasks();
  // 3) 自动滚动到中部
  const mid=document.querySelector('#page-agent-ops .ops-mid');
  if(mid) mid.scrollIntoView({behavior:'smooth',block:'nearest'});
  // 4) 自动打开抽屉
  setTimeout(()=>openTaskDrawer(t.id),650);
}

function openTaskDrawer(taskId){
  const t=aiTasks.find(x=>x.id===taskId);if(!t) return;
  const scn=t.scenario;
  $('#drawerTitle').textContent=t.title;
  $('#drawerSub').textContent=t.sub+' · '+scn.sop;
  const paramsHTML=scn.params.map(p=>`<div class="kv-row"><span>${p[0]}</span><strong style="color:${p[2]==='critical'?'#b91c1c':p[2]==='warn'?'#b45309':'#047857'}">${p[1]}</strong></div>`).join('');
  const skillsHTML=scn.skills.map((s,i)=>{
    const st=t.ctrlState[i];
    const params=s.params.map(p=>`<div class="kv-row"><span>${p[0]}</span><strong>${p[1]}</strong></div>`).join('');
    const ctrls=s.ctrls.map(c=>`<button class="ctrl-btn ${st.done?'done':''}" data-task="${t.id}" data-skill="${i}" data-act="${c.run}">${st.done?'✓ '+c.l:c.l}</button>`).join('');
    return `<div class="skill-call" data-skill-i="${i}">
      <div class="nm"><b>${s.n}</b><span class="tag">${s.tag}</span></div>
      <div class="pa">${s.p}</div>
      <div class="kv-card" style="margin:0;padding:9px 11px">${params}</div>
      <div class="ctrl">${ctrls}</div>
      <div class="ctrl-log" data-log="${i}">// 等待操作…</div>
    </div>`;
  }).join('');
  $('#drawerBody').innerHTML=`
    <div class="kv-card">
      <h5>告警来源</h5>
      <div class="kv-row"><span>系统</span><strong>${scn.source}</strong></div>
      <div class="kv-row"><span>设备</span><strong>${scn.device}</strong></div>
      <div class="kv-row"><span>触发时间</span><strong>${t.time}</strong></div>
      <div class="kv-row"><span>SOP</span><strong style="color:#b91c1c">${scn.sop}</strong></div>
    </div>
    <div class="kv-card">
      <h5>设备参数与告警输入</h5>
      ${paramsHTML}
    </div>
    <div class="kv-card">
      <h5>Hermes 调用 Skills · 处置流程</h5>
      ${skillsHTML}
    </div>`;
  // 绑定控件
  $$('#drawerBody .ctrl-btn').forEach(b=>{
    b.onclick=async()=>{
      if(b.classList.contains('done')||b.disabled) return;
      const i=parseInt(b.dataset.skill);
      const task=aiTasks.find(x=>x.id===b.dataset.task);
      const sc=task.scenario.skills[i];
      const logEl=$(`#drawerBody [data-log="${i}"]`);
      const now=new Date().toLocaleTimeString('zh-CN',{hour12:false});

      // 真实调用 LLM：执行 skill
      b.disabled=true;b.textContent='LLM 推理中…';
      logEl.innerHTML=`<span class="run">[${now}] 指令已下达 · ${sc.n} · 等待 LLM 推理…</span>`;
      try{
        const alertsPayload=task.scenario.params.map(([k,v,lv])=>({k,v,level:lv}));
        const skillsPayload=task.scenario.skills.map(s=>({id:s.id,n:s.n,v:(s.v||'v1.0'),p:s.p,tag:s.tag,params:s.params}));
        const r=await fetch('/skills/upgrade',{method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({scenario:task.key,alerts:alertsPayload,skills:skillsPayload,exec_skill_id:sc.id})});
        const d=await r.json();
        const er=d.exec_result||{};
        const logs=(er.log||[]).map(line=>`<span class="run">[${now}] ${line}</span>`).join('\n');
        logEl.innerHTML=logs+(er.impact?`\n<span class="ok">[${now}] 设备响应 · ${er.impact}${er.metric?` · 指标 ${er.metric}`:''}</span>`:'');
        b.classList.add('done');b.textContent='✓ '+b.textContent.replace('LLM 推理中…',b.dataset.actLabel||'完成');
        task.log.push(`[${now}] ${sc.n} · ${er.impact||'执行成功'}`);
        task.upgrade=d; // 暂存升级方案
      }catch(e){
        logEl.innerHTML+=`\n<span style="color:#b91c1c">[${now}] 调用失败：${e.message||e}</span>`;
        b.classList.add('done');b.textContent='✓ 已完成';
      }
      // 全部完成 → 任务 done → 升级 skill 库
      if(task.ctrlState.every(s=>s.done)){
        // 标记当前也 done
        if(!task.ctrlState[i].done) task.ctrlState[i].done=true;
        if(task.ctrlState.every(s=>s.done)){
          checkTaskDone(task.id);
          // 真实升级 Skill 库（版本号 + 触发升级弹窗）
          applySkillUpgrade(task);
        }
      }else{
        task.ctrlState[i].done=true;
      }
    };
  });
  $('#drawerMask').classList.add('open');
  $('#taskDrawer').classList.add('open');
  $('#drawerDone').onclick=()=>{closeDrawer();triggerSkillIter(t.id)};
}
function checkTaskDone(taskId){
  const t=aiTasks.find(x=>x.id===taskId);if(!t) return;
  if(t.ctrlState.every(s=>s.done)){t.status='done';renderAITasks();setTimeout(()=>triggerSkillIter(taskId),400)}
}
function closeDrawer(){$('#drawerMask').classList.remove('open');$('#taskDrawer').classList.remove('open')}
$('#drawerClose').onclick=closeDrawer;$('#drawerMask').onclick=closeDrawer;
$('#drawerLog').onclick=()=>{const t=aiTasks.find(x=>x.id===$('#drawerBody').dataset.tid);if(!t){const open=$('#drawerTitle').textContent;alert('系统日志：\n'+open)}else{alert('系统日志：\n'+t.log.join('\n'))}};

function triggerSkillIter(taskId){
  const t=aiTasks.find(x=>x.id===taskId);if(!t) return;
  applySkillUpgrade(t);
}

/* LLM 真实升级 Skill 库 + 弹出 diff 弹窗 */
function applySkillUpgrade(task){
  const up=task.upgrade;
  const list=up&&up.diff&&up.diff.length?up.diff:[];
  // 更新 Skill 库中已存在的（按 skill_id 匹配），没有的就在头部新增
  list.forEach(d=>{
    const old=skills.find(s=>s.id===d.skill_id||s.n===d.name);
    if(old){
      // 已存在：版本升级
      old.n=d.name;
      old.v=d.new_version;
      old.p=Math.min(99,old.p+8);
      old.step='LLM 升级 · '+d.changes.map(c=>c.because).filter(Boolean).slice(0,1).join(' / ').slice(0,40)||'由 LLM 升级';
      old.iter=true;
      old.upgraded=true;
    }else{
      skills.unshift({
        n:d.name,
        v:d.new_version,
        p:60+Math.floor(Math.random()*15),
        step:'LLM 升级收敛 · '+d.changes.map(c=>c.because).filter(Boolean).slice(0,1).join(' / ').slice(0,40)||'新增',
        iter:true,
        taskId:task.id,
        paper:false,
        upgraded:true,
        diff:d,
      });
    }
  });
  // 重新渲染 Skill 库
  $('#skillRow').innerHTML=skills.map(s=>{
    const newBorder=s.upgraded?'border-left:3px solid #7c3aed;':'';
    return `<div class="skill-pill ${s.iter?'iter':''}" data-skill-idx="${skills.indexOf(s)}" style="${s.taskId===task.id||s.upgraded?'animation:newSkillGlow 1.2s ease 2;'+newBorder:''}"><div class="nm"><span>${s.n}</span><span style="color:var(--muted);font-weight:500">${s.v}</span>${s.iter?'<span class="iter-tag">迭代中</span>':''}</div><div class="bar"><i style="width:${s.p}%"></i></div><div class="step">${s.step} · ${s.p}%</div></div>`;
  }).join('');
  $$('#skillRow .skill-pill').forEach(el=>el.onclick=()=>openIterPop(parseInt(el.dataset.skillIdx)));
  // 弹 diff 弹窗
  openDiffPop(task,list);
}

/* 弹 LLM 真实 diff 弹窗 */
function openDiffPop(task,list){
  const sum=(task.upgrade&&task.upgrade.upgrade_summary)||'';
  const er=task.upgrade&&task.upgrade.exec_result||{};
  const cards=list.map((d,i)=>{
    const chs=(d.changes||[]).map(c=>`
      <div class="diff-c">
        <div class="diff-old"><s>${c.old||'-'}</s></div>
        <div class="diff-new">${c.new||'-'}</div>
        <div class="diff-because">💡 ${c.because||''}</div>
      </div>`).join('');
    return `<div class="diff-card" style="animation:slideIn .3s ease ${i*0.05}s both">
      <div class="diff-h"><b>${d.name}</b><span class="v-chip"><s>${d.old_version}</s> → <span class="v-n">${d.new_version}</span></span></div>
      ${chs||'<div style="color:var(--muted);font-size:11px">无 diff</div>'}
    </div>`;
  }).join('');
  $('#iterTitle').textContent='🧬 LLM 升级方案 · '+task.title;
  $('#iterSub').textContent=sum||'LLM 已完成推理并产出升级 diff';
  $('#iterBody').innerHTML=`
    <div class="kv-card" style="border-left:3px solid #7c3aed">
      <h5>🛠 本次执行结果</h5>
      <div class="kv-row"><span>执行 Skill</span><strong>${er.skill_name||'-'}</strong></div>
      <div class="kv-row"><span>状态</span><strong style="color:${er.success!==false?'#047857':'#b91c1c'}">${er.success!==false?'✓ 成功':'✗ 失败'}</strong></div>
      <div class="kv-row"><span>设备影响</span><strong>${er.impact||'-'}</strong></div>
      <div class="kv-row"><span>关键指标</span><strong>${er.metric||'-'}</strong></div>
    </div>
    <div class="kv-card">
      <h5>📈 升级 diff（${list.length} 个 Skill）</h5>
      <div class="diff-list">${cards||'<div style="color:var(--muted)">无</div>'}</div>
    </div>`;
  $('#iterPop').classList.add('open');
}

function openIterPop(idx){
  const s=skills[idx];if(!s) return;
  $('#iterTitle').textContent=s.n;
  $('#iterSub').textContent='收敛学习：'+s.step;
  const steps=[
    {h:'① 触发',p:`告警触发收敛信号 · ${s.taskId?'任务 #'+s.taskId.substring(1,5):'自动学习'}`},
    {h:'② 收敛',p:`多 Agent 提议 + Hermes 评分 · 采纳 ${Math.floor(60+Math.random()*30)}% 决策`},
    {h:'③ 入图',p:`知识图谱新增 2 节点 / 3 条边 · 节点 #${Math.floor(900+Math.random()*99)}`},
    {h:'④ 跟新',p:`Skill ${s.n} 内容片段更新 · 写入新 SOP 步骤`},
  ];
  const stepHTML=steps.map((st,i)=>`<div class="iter-step-line ${i===0?'done':i===1?'active':''}"><div class="dot">${i+1}</div><h6>${st.h}</h6><p>${st.p}</p></div>`).join('');
  const diffs=[
    {t:'add',c:'+ if env_temp > 30 and aisle_delta > 4: trigger("crac.cool.down")'},
    {t:'ctx',c:'  then wait 60s and recheck(thermal.airflow)'},
    {t:'del',c:'- then auto_open_louvers(max=20)'},
    {t:'add',c:'+ then notify(feishu, "thermal.P0", level="P0")'},
  ];
  const diffHTML=diffs.map(d=>d.t==='add'?`<span class="add">${d.c}</span>`:d.t==='del'?`<span class="del">${d.c}</span>`:`<span class="ctx">${d.c}</span>`).join('<br>');
  $('#iterBody').innerHTML=`
    <div class="kv-card"><h5>迭代时间线</h5>${stepHTML}</div>
    <div class="kv-card"><h5>Skill 内容更新（diff 预览）</h5>
      <div class="diff-card">${diffHTML}</div>
    </div>
    <div class="kv-card"><h5>本次学习要点</h5>
      <div class="kv-row"><span>新增 SOP 步骤</span><strong>+1</strong></div>
      <div class="kv-row"><span>收敛样本</span><strong>${Math.floor(8+Math.random()*12)} 条</strong></div>
      <div class="kv-row"><span>置信度变化</span><strong style="color:#047857">+${Math.floor(4+Math.random()*8)}%</strong></div>
      <div class="kv-row"><span>下一轮评审</span><strong>明天 09:00</strong></div>
    </div>`;
  $('#iterPop').classList.add('open');
}
$('#iterClose').onclick=()=>$('#iterPop').classList.remove('open');

/* 绑定 3 个 demo 按钮 */
$$('.demo-btn').forEach(b=>b.onclick=()=>triggerDemo(b.dataset.demo));

/* 启动空态 */
renderAITasks();

/* ============== Hermes 知识库 ============== */
let _hermesTree=null;
let _currentSkill=null;
let _currentVersion=null;
// 5 大系统默认全部折叠，节省空间
let _collapsedDomains = { bms:true, env:true, fire:true, security:true, ba:true };
const _hermesMeta={
  bms:    {icon:"🔋", name:"BMS 电池系统", color:"#10b981", color2:"#06b6d4", tag:"电池管理",       intro:"覆盖 SOC/SOH/均衡/内阻/温度/循环 六大业务线"},
  env:     {icon:"🌡️", name:"动环监控系统",   color:"#0ea5e9", color2:"#06b6d4", tag:"动环监控",       intro:"覆盖 供配电 / 暖通空调 / 漏水 / 柴发 四大业务线"},
  fire:    {icon:"🔥", name:"消防系统",       color:"#ef4444", color2:"#f97316", tag:"消防报警",       intro:"覆盖 探测 / 灭火 / 联动 / 疏散 四大业务线"},
  security:{icon:"🛡️", name:"安防系统",       color:"#3b82f6", color2:"#0ea5e9", tag:"门禁访客",       intro:"覆盖 门禁 / 访客 / 巡更 / 对讲 / 车辆 五大业务线"},
  ba:      {icon:"🏢", name:"BA 系统",        color:"#f59e0b", color2:"#eab308", tag:"楼宇自控",       intro:"覆盖 暖通 / 冷热源 / 给排水 / 照明 / 电梯 五大业务线"},
};
const _soulMeta = { icon:"🧠", name:"全局灵魂", color:"#6366f1", color2:"#8b5cf6", tag:"soul.md",
                    intro:"5 大系统 + 85 个 Skill 的总纲 · 行为准则 + 升级规则" };
async function loadHermes(){
  const r=await fetch('/hermes/tree');_hermesTree=await r.json();
  const totalSkill = _hermesTree.domains.reduce((s,x)=>s+x.skills.length,0);

  // 全局 soul 方块（与系统卡同大小） + 5 个系统大卡片  一起放网格
  const globalSoulCard = _renderGlobalSoulCard();
  const sysCards = _hermesTree.domains.map(d=>{
    const m=_hermesMeta[d.id]||{icon:'📦',color:'#0ea5e9',color2:'#06b6d4',intro:d.name};
    const skills=d.skills;
    const collapsed = _collapsedDomains[d.id] ? 'collapsed' : '';
    return `<div class="hermes-sys-card ${collapsed}" style="--hc:${m.color};--hc2:${m.color2}" data-domain="${d.id}">
      <div class="head" onclick="toggleDomainFold('${d.id}')">
        <div class="ico">${m.icon}</div>
        <div class="title">
          <b>${d.name} <span class="ct">${skills.length} Skill</span></b>
          <small>${m.intro}</small>
        </div>
        <div class="fold-btn" title="折叠/展开">${collapsed?'▶':'▼'}</div>
      </div>
      <div class="body-area">
        <div class="prog"><i style="width:${Math.min(100,skills.length*5.5)}%"></i></div>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
          <div class="dsoul" onclick="event.stopPropagation();loadDomainSoul('${d.id}')">📜 ${d.id}/soul.md · ${d.soul_md_size} 字节</div>
          <span style="font-size:10px;color:var(--muted)">v 演进 ${skills.reduce((s,x)=>s+x.versions.length,0)} 版本</span>
        </div>
        <div class="skill-grid">
          ${skills.map(s=>`<div class="hermes-skill" data-domain="${d.id}" data-skill="${s.id}" style="--hc:${m.color}">
            <span class="nm">⚙️ ${s.name}</span>
            <span class="v">${s.version}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>`;
  }).join('');
  const dom=$('#hermesDomains');
  dom.innerHTML = '<div class="hermes-grid">' + globalSoulCard + sysCards + '</div>';
  // skill 点击
  $$('#hermesDomains .hermes-skill').forEach(el=>el.onclick=e=>{e.stopPropagation();openSkillDetail(el.dataset.domain,el.dataset.skill)});
  $('#folderHint').textContent=`共 ${_hermesTree.domains.length} 个系统 · ${totalSkill} 个 Skill · 全部可点击弹窗查看 / LLM 升级 / 折叠收起`;
}
function _renderGlobalSoulCard(){
  const m = _soulMeta;
  const size = _hermesTree?.global_soul_size || 0;
  const text = _hermesTree?.global_soul || '';
  // 预览前 3 行非空
  const preview = text.split('\n').filter(l=>l.trim()).slice(0,4).join('\n');
  return `<div class="hermes-sys-card is-soul" style="--hc:${m.color};--hc2:${m.color2}" onclick="openGlobalSoul()" title="点击查看全局 soul.md 完整内容">
    <div class="head">
      <div class="ico">${m.icon}</div>
      <div class="title">
        <b>${m.name} <span class="ct">soul.md</span></b>
        <small>${m.intro}</small>
      </div>
      <div class="fold-btn" title="查看详情">📖</div>
    </div>
    <div class="body-area">
      <div class="prog"><i style="width:100%"></i></div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
        <div class="dsoul">📜 hermes/soul.md · ${size} 字节</div>
        <span style="font-size:10px;color:var(--muted)">总纲 · 5 大系统共用</span>
      </div>
      <div class="hermes-soul-peek">${preview.replace(/</g,'&lt;')}</div>
    </div>
  </div>`;
}
function toggleDomainFold(id){
  _collapsedDomains[id] = !_collapsedDomains[id];
  loadHermes();
}
async function openGlobalSoul(){
  const d = _hermesTree;
  if(!d || !d.global_soul) return;
  const detail=$('#hermesDetail');
  detail.style.display='block';
  const m=_soulMeta;
  detail.setAttribute('style',`--hc:${m.color};--hc2:${m.color2};display:block`);
  detail.innerHTML=`<div class="hero">
    <button class="close-x" onclick="$('#hermesDetail').style.display='none'">×</button>
    <h5>
      <span>${m.icon} Hermes 全局灵魂（soul.md） <span class="vtab" style="background:rgba(255,255,255,.25);color:#fff;border-color:transparent">${d.global_soul_size} 字节</span></span>
      <span class="path">hermes/soul.md</span>
    </h5>
    <div class="meta-row">
      <span>📌 ${d.global_soul_size} 字节</span>
      <span>📚 ${d.domains.length} 大系统</span>
      <span>⚙️ ${d.domains.reduce((s,x)=>s+x.skills.length,0)} 个 Skill</span>
      <span>🕒 最后更新 2026-06-27</span>
    </div>
  </div>
  <div class="body full">
    <div class="skill-md" style="max-height:600px;font-family:Consolas,monospace;font-size:12px;line-height:1.7;white-space:pre-wrap">${d.global_soul.replace(/</g,'&lt;')}</div>
  </div>`;
  detail.scrollIntoView({behavior:'smooth',block:'nearest'});
}
async function loadDomainSoul(domain){
  const r=await fetch('/hermes/soul?domain='+domain);const d=await r.json();
  const detail=$('#hermesDetail');
  detail.style.display='block';
  const m=_hermesMeta[domain]||{color:'#0ea5e9',color2:'#06b6d4'};
  detail.setAttribute('style',`--hc:${m.color};--hc2:${m.color2};display:block`);
  detail.innerHTML=`<div class="hero">
    <button class="close-x" onclick="$('#hermesDetail').style.display='none'">×</button>
    <h5><span>📜 ${_hermesTree.domains.find(x=>x.id===domain)?.name||domain} · 灵魂</span><span class="path">${domain}/soul.md · ${d.size} 字节</span></h5>
  </div>
  <div class="body full"><div class="skill-md" style="max-height:500px"><pre style="white-space:pre-wrap;margin:0;font-family:Consolas,monospace;font-size:11.5px;line-height:1.6">${d.content.replace(/</g,'&lt;')}</pre></div></div>`;
  detail.scrollIntoView({behavior:'smooth',block:'nearest'});
}
async function openSkillDetail(domain,skill,version){
  _currentSkill={domain,skill};_currentVersion=version||null;
  let url=`/hermes/skill/${domain}/${skill}`;if(version)url+=`?version=${version}`;
  const r=await fetch(url);const d=await r.json();
  const detail=$('#hermesDetail');
  detail.style.display='block';
  const m=_hermesMeta[domain]||{icon:'📦',color:'#0ea5e9',color2:'#06b6d4'};
  detail.setAttribute('style',`--hc:${m.color};--hc2:${m.color2};display:block`);
  // 版本切换
  const versionsHTML=d.versions.map(v=>{
    const isArch=v.includes('archive');
    const cleanV=v.replace(' (archive)','');
    const isActive=(version||d.meta.version)===cleanV;
    return `<div class="vtab ${isArch?'archive':''} ${isActive?'active':''}" onclick="openSkillDetail('${domain}','${skill}','${cleanV}')">${cleanV}${isArch?' 📦':''}</div>`;
  }).join('');
  // SKILL.md 渲染：去掉 frontmatter 后做轻量 markdown
  const skillBody=renderSkillMd(d.skill_md);
  // 解析 tags / sources
  const tags=((d.meta.tags||'').match(/\[(.*?)\]/)?.[1]||'').split(',').map(s=>s.trim()).filter(Boolean);
  const sources=((d.meta.sources||'').match(/\[(.*?)\]/)?.[1]||'').split(',').map(s=>s.trim()).filter(Boolean);
  const lines = d.py ? d.py.split('\n').length : 0;
  // 版本演进时间线
  const sortedVersions = d.versions.map(v=>v.replace(' (archive)','')).filter((v,i,a)=>a.indexOf(v)===i);
  const timelineHTML = sortedVersions.length ? `<div class="timeline">${sortedVersions.map((v,i)=>{
    const arch = d.versions.find(x=>x.startsWith(v) && x.includes('archive'));
    return `<div class="tl-item">
      <b>${v}${arch?' 📦':''}</b>
      <small>${arch?'已归档 · 历史版本':'当前稳定版'}</small>
    </div>`;
  }).join('')}</div>` : '<div style="color:var(--muted);font-size:11px">暂无版本</div>';

  detail.innerHTML=`
    <div class="hero">
      <button class="close-x" onclick="$('#hermesDetail').style.display='none'">×</button>
      <h5>
        <span>${m.icon} ${d.meta.display_name||skill} <span class="vtab" style="background:rgba(255,255,255,.25);color:#fff;border-color:transparent">${d.meta.version}</span> ${d.meta.status==='stable'?'<span class="vtab" style="background:rgba(34,197,94,.85);color:#fff;border-color:transparent">stable</span>':'<span class="vtab" style="background:rgba(245,158,11,.85);color:#fff;border-color:transparent">'+d.meta.status+'</span>'}</span>
        <span class="path">${domain}/${skill}</span>
      </h5>
      <div class="meta-row">
        <span>📌 ${d.skill_md.length} 字节</span>
        <span>🐍 ${lines} 行代码</span>
        <span>📅 ${d.meta.updated||d.meta.created}</span>
        <span>👤 ${d.meta.author||'hermes'}</span>
        <span>📚 ${sources.length||0} 来源</span>
      </div>
    </div>
    <div class="body">
      <div>
        <div class="skill-md">${skillBody}</div>
        <div style="margin-top:8px"><b style="font-size:11px;color:var(--muted);letter-spacing:.05em">▸ 版本演进</b></div>
        ${timelineHTML}
        <div class="skill-action">
          <input id="iterNote" placeholder="升级提示（可选）"/>
          <button class="btn-iter" id="btnIter" onclick="iterateSkill('${domain}','${skill}')">🧬 LLM 升级 ${d.meta.version} → ${nextVersion(d.meta.version)}</button>
        </div>
      </div>
      <div class="skill-aside">
        <div class="aside-card">
          <div class="lh">📂 元数据</div>
          <div class="aside-kv"><span>系统</span><strong>${domain}</strong></div>
          <div class="aside-kv"><span>Skill ID</span><strong>${skill}</strong></div>
          <div class="aside-kv"><span>当前版本</span><strong>${d.meta.version}</strong></div>
          <div class="aside-kv"><span>状态</span><strong style="color:${d.meta.status==='stable'?'#10b981':'#f59e0b'}">${d.meta.status||'-'}</strong></div>
          <div class="aside-kv"><span>作者</span><strong>${d.meta.author||'-'}</strong></div>
          <div class="aside-kv"><span>创建</span><strong>${d.meta.created||'-'}</strong></div>
          <div class="aside-kv"><span>更新</span><strong>${d.meta.updated||'-'}</strong></div>
        </div>
        <div class="aside-card">
          <div class="lh">🏷️ 标签</div>
          <div class="aside-tags">${tags.length?tags.map(t=>`<span class="aside-tag ${t==='hermes'||t==='auto-iter'?'gen':''}">#${t}</span>`).join(''):'<span style="color:var(--muted);font-size:11px">无</span>'}</div>
        </div>
        <div class="aside-card">
          <div class="lh">📚 数据来源</div>
          <div style="font-size:11px;color:var(--text);line-height:1.7">${sources.length?sources.map(s=>`• <code>${s}</code>`).join('<br>'):'<span style="color:var(--muted)">无</span>'}</div>
        </div>
        <div class="aside-card">
          <div class="lh">🔖 历史版本</div>
          <div class="version-tabs" style="margin-top:0">${versionsHTML||'<span style="color:var(--muted);font-size:11px">无</span>'}</div>
        </div>
      </div>
    </div>
    <div class="code-zone">
      <div class="py-tag">🐍 ${d.py_version}.py</div>
      <pre style="margin:0;white-space:pre-wrap">${(d.py||'# 暂无代码').replace(/</g,'&lt;')}</pre>
    </div>
  `;
  detail.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function renderSkillMd(md){
  let s = md.replace(/^---[\s\S]*?---\n*/,'');
  // 代码块
  s = s.replace(/```(\w*)\n([\s\S]*?)```/g,(_,lang,code)=>`<pre><code>${code.replace(/</g,'&lt;')}</code></pre>`);
  // 标题
  s = s.replace(/^### (.+)$/gm,'<h3>$1</h3>').replace(/^## (.+)$/gm,'<h2>$1</h2>').replace(/^# (.+)$/gm,'<h1>$1</h1>');
  // 引用
  s = s.replace(/^> (.+)$/gm,'<blockquote>$1</blockquote>');
  // 分割线
  s = s.replace(/^---+$/gm,'<hr/>');
  // 列表
  s = s.replace(/^- (.+)$/gm,'<li>$1</li>');
  s = s.replace(/(<li>.*?<\/li>\n?)+/g,m=>`<ul>${m}</ul>`);
  // 数字列表
  s = s.replace(/^\d+\. (.+)$/gm,'<li>$1</li>');
  // 行内代码
  s = s.replace(/`([^`]+)`/g,'<code>$1</code>');
  // 加粗
  s = s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  // 段落
  s = s.split(/\n\n+/).map(p=>{
    p=p.trim();
    if(!p) return '';
    if(p.startsWith('<')) return p;
    return `<p>${p.replace(/\n/g,'<br/>')}</p>`;
  }).join('\n');
  return s;
}
function nextVersion(v){
  try{const[m,k]=v.replace('v','').split('.');return `v${m}.${parseInt(k)+1}`}catch(e){return 'v2.0'}
}
async function iterateSkill(domain,skill){
  const btn=$('#btnIter');const note=$('#iterNote').value;
  btn.disabled=true;btn.textContent='🧬 LLM 推理中…';
  try{
    const r=await fetch('/hermes/skill/iterate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({domain,skill,alerts:[],notes:note})});
    const d=await r.json();
    await loadHermes();
    await openSkillDetail(domain,skill,d.new_version);
    btn.textContent='✓ 升级到 '+d.new_version;setTimeout(()=>{btn.textContent=`🧬 LLM 升级 ${d.new_version} → ${nextVersion(d.new_version)}`;btn.disabled=false},2000);
  }catch(e){
    btn.textContent='✗ 失败';setTimeout(()=>{btn.textContent='重试';btn.disabled=false},2000);
  }
}
$('#folderRefresh').onclick=loadHermes;
} // end 旧版兼容层

/* ============== Agent 运营管理平台 · 三层仪表盘 (新设计) ============== */
if(document.getElementById('kpiGrid')){
  /* =============== Layer 1 数据 =============== */
  const layer1={
    kpi:[
      {lbl:'系统透传',val:'2.84',unit:'M/24h',delta:'+12.4%',dir:'up',cls:'ok'},
      {lbl:'AI 巡检得分',val:'93.2',unit:'/100',delta:'+1.8',dir:'up',cls:'ok'},
      {lbl:'异常预警',val:'12',unit:'条',delta:'-3 vs 昨日',dir:'up',cls:'warn'},
      {lbl:'数据延迟',val:'0.62',unit:'s',delta:'-0.2s',dir:'up',cls:'ok'},
      {lbl:'RAG 文档',val:'128',unit:'篇',delta:'+7 今日',dir:'up',cls:''},
      {lbl:'巡检次数',val:'6',unit:'/24h',delta:'每 4h',dir:'',cls:'ok'},
    ],
    radar:{
      labels:['可用性','稳定性','能效','安全','智能'],
      series:[
        {name:'BMS',values:[96,92,90,88,85],color:'#10b981'},
        {name:'动环',values:[94,90,92,86,88],color:'#0ea5e9'},
        {name:'消防',values:[98,96,80,92,75],color:'#ef4444'},
        {name:'BA',values:[92,88,95,84,86],color:'#f59e0b'},
        {name:'安防',values:[90,92,85,96,82],color:'#14b8a6'},
      ]
    },
    inspections:[
      {time:'04:00',score:96,items:184,abnormal:0,summary:'夜间各系统平稳,无异常',cls:'g'},
      {time:'08:00',score:93,items:184,abnormal:1,summary:'安保刷卡有 1 条非工作时段,已记录',cls:'w'},
      {time:'12:00',score:89,items:184,abnormal:2,summary:'F3 机柜温度预警,CRAC-2# 自动调节已生效',cls:'w'},
      {time:'16:00',score:91,items:184,abnormal:1,summary:'UPS-B 负载短暂越限,已自动切分',cls:'w'},
      {time:'20:00',score:94,items:184,abnormal:1,summary:'烟感误报 1 起,粉尘聚类识别已派单',cls:'w'},
      {time:'24:00',score:95,items:184,abnormal:0,summary:'晚间全系统指标恢复绿区',cls:'g'},
    ],
    spark:[
      {sys:'BMS',m:'SOC',val:'95.2',unit:'%',pulse:'ok',data:genSparkSeries(96,0.6,0.4)},
      {sys:'动环',m:'PUE',val:'1.32',unit:'',pulse:'ok',data:genSparkSeries(96,1.32,0.04)},
      {sys:'消防',m:'水压',val:'4.2',unit:'bar',pulse:'ok',data:genSparkSeries(96,4.2,0.05)},
      {sys:'安防',m:'门禁',val:'128',unit:'路',pulse:'ok',data:genSparkSeries(96,128,0.2).map(v=>Math.round(v*2)/2)},
      {sys:'BA',m:'能耗',val:'2.4',unit:'MWh',pulse:'w',data:genSparkSeries(96,2.4,0.6)},
    ],
    latestReport:{
      time:'24:00 报告',
      score:95,
      cls:'g',
      summary:'24h 巡检完成,共 6 次, 12 条告警中 9 条已 AI 闭环 (75%)。',
      items:[
        {type:'g',text:'F3 温度预警 → CRAC-2# 自动调节,12:00 已收敛 (-1.5℃)'},
        {type:'g',text:'BMS 主动均衡 3 次启动,内阻全部回落到阈值内'},
        {type:'w',text:'UPS-B 16:00 短暂越限,已切分至 A 路,负载 58%'},
        {type:'g',text:'夜间安防 0 异常,门禁刷卡 156 次全部正常'},
        {type:'d',text:'消防 1 起误报 (烟感灰尘),v1.0 已升级识别准确率 18%'},
      ]
    }
  };

  /* =============== Layer 2 数据 =============== */
  const layer2={
    alerts:[
      {time:'02:15',level:'P1',sys:'bms',dev:'BMS-F2-03#',msg:'簇间电压差 38mV 超过阈值',skill:'bms/cluster-balance v1.4',st:'已收敛',cls:'ok'},
      {time:'03:42',level:'P1',sys:'env',dev:'CRAC-2#',msg:'出风温度 18.2℃ 偏离基线 1.5℃',skill:'env/crac-cool v2.4',st:'已收敛',cls:'ok'},
      {time:'07:08',level:'P2',sys:'security',dev:'CARD-08#',msg:'非工作时间刷卡 1 次',skill:'security/access-control v1.0',st:'已派单',cls:'wait'},
      {time:'09:36',level:'P1',sys:'bms',dev:'BMS-F2-12#',msg:'单体最大内阻 0.42mΩ',skill:'bms/active-balance v1.2',st:'已收敛',cls:'ok'},
      {time:'11:12',level:'P0',sys:'env',dev:'RACK-F3-R12',msg:'机柜进风温度 32.6℃',skill:'env/rack-temp v1.0',st:'AI闭环',cls:'run'},
      {time:'13:55',level:'P2',sys:'fire',dev:'SPRINKLER-Z4',msg:'喷淋压力 3.8bar 偏低',skill:'fire/valve-status v1.0',st:'已派单',cls:'wait'},
      {time:'14:21',level:'P1',sys:'env',dev:'UPS-B',msg:'UPS 负载率 87%',skill:'env/ups-bypass v1.0',st:'已收敛',cls:'ok'},
      {time:'16:48',level:'P1',sys:'bms',dev:'BMS-F2-07#',msg:'SOC 95% 触发上限预警',skill:'bms/soc-balance v1.0',st:'已收敛',cls:'ok'},
      {time:'18:30',level:'P2',sys:'ba',dev:'AHU-3#',msg:'机组滤网压差 240Pa',skill:'ba/ahu-start v1.0',st:'已派单',cls:'wait'},
      {time:'20:12',level:'P1',sys:'env',dev:'CRAC-5#',msg:'回风湿度 58% 偏高',skill:'env/dehumidify v1.0',st:'AI闭环',cls:'ok'},
      {time:'22:05',level:'P1',sys:'cctv',dev:'CAM-128',msg:'摄像机掉线 2 路',skill:'cctv/link-check v1.4',st:'AI闭环',cls:'ok'},
      {time:'23:48',level:'P0',sys:'fire',dev:'SMOKE-F1-A12',msg:'烟感误报 (灰尘聚类)',skill:'fire/smoke-typo v1.0',st:'已收敛',cls:'ok'},
    ],
    iterLog:[
      {t:'03:00',s:'env/crac-cool',from:'v2.3',to:'v2.4',reason:'夜间低负载场景增加早回正策略',gain:'+6%'},
      {t:'07:30',s:'bms/active-balance',from:'v1.1',to:'v1.2',reason:'内阻预警阈值 0.40→0.38mΩ 减少误收敛',gain:'+9%'},
      {t:'11:30',s:'env/rack-temp',from:'v0.9',to:'v1.0',reason:'新增热通道空气流速联动',gain:'+4%'},
      {t:'15:00',s:'env/ups-bypass',from:'v0.8',to:'v1.0',reason:'高负载分级切分逻辑',gain:'+12%'},
      {t:'19:00',s:'fire/smoke-typo',from:'v0.6',to:'v1.0',reason:'灰尘聚类 + 季节性湿度关联',gain:'+18%'},
      {t:'21:30',s:'cctv/link-check',from:'v1.3',to:'v1.4',reason:'PoE 自适应重连',gain:'+7%'},
    ],
    feishu:[
      {t:'14:21:18',type:'alert',icon:'警',msg:'【P0 告警】F3-R12 机柜温度 32.6℃ · Skill 触发 env/rack-temp v1.0',conf:0.91,detail:'一层 + 6 系统 · 告警关联 12 个 Skill'},
      {t:'14:22:05',type:'skill',icon:'执',msg:'【Skill 执行】调节 CRAC-2# 出风 -1.5℃ · 用时 720ms · 置信度 0.91',conf:0.91,detail:'已自动修复,等待人工确认'},
      {t:'14:22:08',type:'photo',icon:'拍',msg:'【一次链接】https://lark.cn/one-time/cc42 · 等待人工确认 (有效 30min)',conf:0,detail:'点击链接拍照上传,反馈至 LLM'},
      {t:'14:35:11',type:'feedback',icon:'反',msg:'【人工确认】摄影已上传,标记"已修改需调整",反馈至 LLM',conf:0,detail:'用户反馈 · 流程闭环'},
      {t:'14:36:00',type:'iterate',icon:'迭',msg:'【Skill 迭代】env/rack-temp 草稿 v1.1 提交评估,加入风速反馈',conf:0,detail:'LLM 自动优化,新增 3 条规则'},
      {t:'22:05:42',type:'paper',icon:'文',msg:'【论文归档】Lithium-ion battery internal resistance... → bms/rag',conf:0.91,detail:'与 BMS 内阻告警关联'},
      {t:'22:05:50',type:'paper',icon:'文',msg:'【论文归档】Active cell balancing control... → bms/rag',conf:0.88,detail:'与 BMS 均衡告警关联'},
      {t:'22:06:11',type:'paper',icon:'文',msg:'【论文归档】Adaptive CRAC control in data centers... → env/rag',conf:0.93,detail:'与动环温控告警关联'},
    ],
    skillEffect:[
      {n:'BMS 主动均衡',s:'v1.4',val:88,t:720,ok:true},
      {n:'CRAC 出风调节',s:'v2.4',val:92,t:940,ok:true},
      {n:'机柜温度调节',s:'v1.0',val:78,t:620,ok:true},
      {n:'UPS 切分',s:'v1.0',val:82,t:1840,ok:true},
      {n:'SOC 平衡',s:'v1.0',val:85,t:1100,ok:true},
      {n:'除湿调节',s:'v1.0',val:90,t:880,ok:true},
      {n:'PoE 自愈',s:'v1.4',val:95,t:600,ok:true},
      {n:'烟感识别',s:'v1.0',val:75,t:1500,ok:false},
      {n:'BMS 簇间',s:'v1.4',val:87,t:1280,ok:true},
    ]
  };

  /* =============== Layer 3 数据 =============== */
  const layer3={
    papers:[
      {sys:'bms',ttl:'Lithium-ion battery internal resistance evolution under fast charging cycles',jrn:'J. Power Sources',y:2025,conf:0.91,sum:'建立 SEI 膜生长模型,提出基于内阻预测 SOH 的 0.3mΩ 阈值方法',cls:'g'},
      {sys:'bms',ttl:'Active cell balancing control strategy based on multi-agent reinforcement learning',jrn:'IEEE Trans. Industrial Electronics',y:2025,conf:0.88,sum:'多智能体强化学习优化均衡电流分配,提升 24% 收敛速度',cls:''},
      {sys:'env',ttl:'Adaptive CRAC control in data centers using digital twin and model predictive control',jrn:'Applied Energy',y:2025,conf:0.93,sum:'数字孪生 + MPC 实现 PUE 1.28,节能 18%',cls:'g'},
      {sys:'env',ttl:'Hot aisle containment effectiveness: a CFD meta-analysis',jrn:'Energy and Buildings',y:2024,conf:0.86,sum:'热通道封闭降低进回风温差 4-6℃,推荐 F3 区域优先实施',cls:''},
      {sys:'fire',ttl:'False alarm suppression for aspirating smoke detectors using deep learning',jrn:'Fire Safety Journal',y:2025,conf:0.84,sum:'基于 LSTM 的灰尘/烟雾分类,误报率从 22% 降至 6%',cls:''},
      {sys:'ba',ttl:'Data-driven chiller sequencing optimization in data centers',jrn:'Applied Thermal Engineering',y:2025,conf:0.89,sum:'多目标遗传算法优化冷机开启数,COP 提升 11%',cls:''},
      {sys:'security',ttl:'Tailgating detection in access control using depth-camera and gait analysis',jrn:'Computers & Security',y:2024,conf:0.82,sum:'步态分析 + 深度视觉,准确率 94%,已应用于工业门禁',cls:''},
    ],
    rag:[
      {sys:'bms',n:38,total:128},
      {sys:'env',n:32,total:128},
      {sys:'fire',n:18,total:128},
      {sys:'ba',n:22,total:128},
      {sys:'security',n:18,total:128},
    ]
  };

  /* =============== 工具: 生成平滑序列 =============== */
  function genSparkSeries(n,base,amp){
    const a=[];let prev=base;
    for(let i=0;i<n;i++){
      const daily=Math.cos((i/n-0.5)*Math.PI*2)*amp*0.7;
      const noise=(Math.sin(i*1.7)+Math.sin(i*0.9)+Math.cos(i*2.3))*amp*0.15;
      prev=base+daily+noise;
      a.push(+prev.toFixed(3));
    }
    return a;
  }
  const pol=(cx,cy,r,a)=>`${(cx+r*Math.cos(a)).toFixed(1)},${(cy+r*Math.sin(a)).toFixed(1)}`;

  /* =============== 渲染: KPI =============== */
  function renderKPI(){
    const el=$('#kpiGrid');if(!el)return;
    el.innerHTML=layer1.kpi.map(k=>`<div class="kpi ${k.cls}"><div class="lbl">${k.lbl}</div><div class="val">${k.val}<small style="font-size:11px;font-weight:500;color:var(--muted);margin-left:3px">${k.unit}</small></div><div class="delta">${k.delta?(k.dir?'<b>▲</b>':'<b>●</b>'):''}<span>${k.delta||'—'}</span></div></div>`).join('');
  }

  /* =============== 渲染: 雷达图 =============== */
  /* =============== 渲染: 今日运行日日志 =============== */
  const _DAYLOG=(window._DAYLOG=window._DAYLOG||[]);
  function buildDaylog(){
    if(_DAYLOG.length)return _DAYLOG;
    const sysMap={bms:'BMS 电池系统',eh:'动环监控',fr:'消防系统',sc:'安防系统',ba:'BA 楼宇'};
    const log=[
      {t:'00:12',cls:'ok',kind:'巡检',head:'00:00 凌晨巡检 · 全量参数扫描',body:'5 大系统 · 1,280 项参数 · 巡检得分 92',meta:[{k:'耗时',v:'6.4s'},{k:'参数',v:'1280'},{k:'告警',v:'0 条',code:true}]},
      {t:'00:34',cls:'warn',kind:'异常',head:'动环 F3-12 湿度告警',body:'湿度 78% RH > 阈值 70% RH,触发 1 次拍频,Dehumidifier 自动启动',meta:[{k:'设备',v:'F3-12#'},{k:'参数',v:'湿度 78%'},{k:'Skill',v:'eh/dehumid',code:true}]},
      {t:'01:18',cls:'ok',kind:'收敛',head:'湿度已收敛至 62% RH',body:'Dehumidifier 运行 44min,湿度降至安全阈值,告警自动关闭',meta:[{k:'耗时',v:'44min'},{k:'结果',v:'已收敛'}]},
      {t:'04:00',cls:'ok',kind:'巡检',head:'04:00 凌晨巡检 · AI 综合诊断',body:'5 大系统 · 1,280 项 · 巡检得分 96 · 自动巡检报告已生成',meta:[{k:'得分',v:'96'},{k:'异常',v:'0'}]},
      {t:'07:32',cls:'err',kind:'告警',head:'BMS F2-12 内阻告警 P1',body:'内阻 0.42mΩ 越上限 0.40mΩ · 触发 5 大系统 6 个核心 Skill SOP 匹配',meta:[{k:'设备',v:'BMS-F2-12#'},{k:'参数',v:'0.42mΩ'},{k:'主Skill',v:'bms/internal-r',code:true}]},
      {t:'07:32',cls:'ok',kind:'收敛',head:'BMS 内阻自动修复完成',body:'触发 bms/internal-r · 自动重均衡 · 内阻降至 0.34mΩ · 收敛',meta:[{k:'耗时',v:'3.2s'},{k:'结果',v:'已收敛'}]},
      {t:'07:33',cls:'ok',kind:'通知',head:'飞书 webhook 推送 + 一次链接',body:'ToKen Bot 推送至 运维-数据中心群 · @任承智 · token: cc42-mqx1a3f8',meta:[{k:'群组',v:'运维-数据中心群'},{k:'webhook',v:'65c9659c...',code:true}]},
      {t:'08:00',cls:'ok',kind:'巡检',head:'08:00 上午巡检 · AI 巡检报告',body:'1,280 项参数 · 得分 93 · 异常 1 条(已收敛) · 报告推送至主控',meta:[{k:'得分',v:'93'},{k:'异常',v:'1'}]},
      {t:'08:45',cls:'ok',kind:'反馈',head:'任承智 现场确认反馈',body:'📷 1 张现场照片 · "已修复完成,BMS 重均衡,设备稳定" · 通过一次链接提交',meta:[{k:'反馈',v:'已确认'},{k:'耗时',v:'63min'}]},
      {t:'08:46',cls:'ok',kind:'迭代',head:'LLM 迭代 bms/internal-r v1.0 → v1.1',body:'基于反馈生成新规则 · 增益 +12% · 联动 3 个 Skill · 归档至 RAG 知识库',meta:[{k:'LLM',v:'MiniMax-M2.7',code:true},{k:'增益',v:'+12%'}]},
      {t:'10:15',cls:'warn',kind:'异常',head:'BA 系统 F2-08 冷源功率波动',body:'冷源功率 86kW > 阈值 80kW · Chiller 控制自动调整输出',meta:[{k:'设备',v:'BA-F2-08#'},{k:'参数',v:'86kW'},{k:'Skill',v:'ba/chiller',code:true}]},
      {t:'10:18',cls:'ok',kind:'收敛',head:'冷源功率已收敛至 78kW',body:'Chiller 控制自动降载 · 功率降至 78kW · 告警自动关闭',meta:[{k:'耗时',v:'3min'}]},
      {t:'12:00',cls:'ok',kind:'巡检',head:'12:00 午间巡检 · AI 综合诊断',body:'得分 89 · 异常 2 条 · 报告推送',meta:[{k:'得分',v:'89'},{k:'异常',v:'2'}]},
      {t:'14:30',cls:'ok',kind:'RAG',head:'BMS 内阻论文归档 · RAG 知识库',body:'基于最近 6-7 天告警设备,LLM + Search 拉取论文 2 篇 · 已归档',meta:[{k:'论文',v:'2 篇'},{k:'Skill',v:'rag/ingest',code:true}]},
      {t:'16:00',cls:'ok',kind:'巡检',head:'16:00 下午巡检 · AI 综合诊断',body:'得分 91 · 异常 1 条 · 报告推送',meta:[{k:'得分',v:'91'}]},
      {t:'18:42',cls:'err',kind:'告警',head:'消防 F1-03 烟感告警 P1',body:'烟感值 42ppm 越阈值 30ppm · 触发 6 类消防 Skill SOP 匹配',meta:[{k:'设备',v:'FR-F1-03#'},{k:'主Skill',v:'fr/smoke-det',code:true}]},
      {t:'18:42',cls:'ok',kind:'收敛',head:'消防烟感误报已识别收敛',body:'fr/smoke-det 判断为 1 次烧烤误报 · 5min 后自动归零 · 告警关闭',meta:[{k:'结果',v:'误报'},{k:'耗时',v:'5min'}]},
      {t:'20:00',cls:'ok',kind:'巡检',head:'20:00 晚间巡检 · AI 综合诊断',body:'得分 94 · 异常 1 条(已收敛)',meta:[{k:'得分',v:'94'}]},
      {t:'22:00',cls:'ok',kind:'巡检',head:'22:00 夜间巡检',body:'5 大系统全部正常 · 无人值守模式',meta:[{k:'得分',v:'--'}]},
      {t:'24:00',cls:'ok',kind:'巡检',head:'24:00 凌晨巡检 · 今日巡检完成',body:'今日 6 次巡检 · 12 条告警 · 9 条 AI 自动闭环(75%) · 夜间继续待命',meta:[{k:'得分',v:'95'},{k:'闭环率',v:'75%'}]},
    ];
    return _DAYLOG.concat(log);
  }
  function renderDaylog(){
    const list=buildDaylog();
    const el=$('#daylogTimeline');if(!el)return;
    el.innerHTML=list.map(d=>`<div class="dl-row ${d.cls}">
      <div class="t">${d.t}</div>
      <div class="d"><div class="dot"></div></div>
      <div class="b">
        <div class="head"><b>${d.head}</b><span class="tag-mini">${d.kind}</span></div>
        <p>${d.body}</p>
        <div class="meta">${d.meta.map(m=>m.code?`<span><code>${m.k}:</code> <code>${m.v}</code></span>`:`<span>${m.k}: ${m.v}</span>`).join('')}</div>
      </div>
    </div>`).join('');
    // 统计
    const cnt={insp:0,alert:0,fix:0,iter:0,rag:0};
    list.forEach(d=>{
      if(d.kind==='巡检')cnt.insp++;
      else if(d.kind==='告警')cnt.alert++;
      else if(d.kind==='收敛')cnt.fix++;
      else if(d.kind==='迭代')cnt.iter++;
      else if(d.kind==='RAG')cnt.rag++;
    });
    const $=q=>document.getElementById(q);
    const set=(id,v)=>{const e=$(id);if(e)e.textContent=v;};
    set('daylogEvents',list.length);
    set('daylogDate',new Date().toLocaleDateString('zh-CN',{month:'2-digit',day:'2-digit',weekday:'short'}));
    set('dlInspect',cnt.insp);set('dlAlert',cnt.alert);set('dlFixed',cnt.fix);set('dlIter',cnt.iter);set('dlRag',cnt.rag);
  }
  function renderRadar(){
    const svg=$('#radarHealth');if(!svg)return;
    const W=360,H=360,cx=180,cy=170,R=120,L=layer1.radar.labels.length;
    let h='';
    // 背景环
    for(let k=1;k<=4;k++){const r=R*k/4;const pts=Array.from({length:L},(_,i)=>pol(cx,cy,r,-Math.PI/2+i*2*Math.PI/L)).join(' ');h+=`<polygon points="${pts}" fill="none" stroke="#dbe8f5" stroke-width="1"/>`;}
    // 轴线
    for(let i=0;i<L;i++){const a=-Math.PI/2+i*2*Math.PI/L;h+=`<line x1="${cx}" y1="${cy}" x2="${(cx+R*Math.cos(a)).toFixed(1)}" y2="${(cy+R*Math.sin(a)).toFixed(1)}" stroke="#dbe8f5" stroke-width="1"/>`;}
    // 标签
    for(let i=0;i<L;i++){const a=-Math.PI/2+i*2*Math.PI/L;const lx=cx+(R+24)*Math.cos(a);const ly=cy+(R+24)*Math.sin(a);h+=`<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="11" font-weight="800" fill="#475569">${layer1.radar.labels[i]}</text>`;}
    // 数据
    layer1.radar.series.forEach(s=>{
      const pts=s.values.map((v,i)=>{const a=-Math.PI/2+i*2*Math.PI/L;const r=R*v/100;return pol(cx,cy,r,a);}).join(' ');
      h+=`<polygon points="${pts}" fill="${s.color}" fill-opacity="0.12" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" style="animation:anim-radar-fade .6s ease both"/>`;
      s.values.forEach((v,i)=>{const a=-Math.PI/2+i*2*Math.PI/L;const r=R*v/100;h+=`<circle cx="${(cx+r*Math.cos(a)).toFixed(1)}" cy="${(cy+r*Math.sin(a)).toFixed(1)}" r="3" fill="${s.color}"/>`;});
    });
    svg.innerHTML=h;
    const lg=$('#radarLegend');if(lg)lg.innerHTML=layer1.radar.series.map(s=>`<span><i style="background:${s.color}"></i>${s.name}</span>`).join('');
  }

  /* =============== 渲染: 巡检趋势 (line+bar) =============== */
  function renderInspectTrend(){
    const svg=$('#chartInspectTrend');if(!svg)return;
    const W=720,H=200,pl=42,pr=18,pt=22,pb=26;
    const innerW=W-pl-pr,innerH=H-pt-pb;
    const data=layer1.inspections;
    const n=data.length;
    const barW=innerW/n*0.55;
    let h='';
    // 网格
    for(let i=0;i<5;i++){const y=pt+innerH*i/4;h+=`<line x1="${pl}" y1="${y.toFixed(1)}" x2="${W-pr}" y2="${y.toFixed(1)}" stroke="#eef5fb" stroke-width="1"/>`;h+=`<text x="${pl-4}" y="${(y+3).toFixed(1)}" text-anchor="end" font-size="9" fill="#94a3b8">${100-i*5}</text>`;}
    // X 标签
    data.forEach((d,i)=>{const x=pl+innerW*(i+0.5)/n;h+=`<text x="${x.toFixed(1)}" y="${H-8}" text-anchor="middle" font-size="9.5" fill="#64748b" font-weight="600">${d.time}</text>`;});
    // 柱(异常数)
    data.forEach((d,i)=>{const x=pl+innerW*(i+0.5)/n-barW/2;const maxA=3;const h2=innerH*d.abnormal/maxA;const y=pt+innerH-h2;h+=`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW}" height="${h2.toFixed(1)}" rx="3" fill="url(#bGrad)" opacity="0.85"/>`;h+=`<text x="${(x+barW/2).toFixed(1)}" y="${(y-3).toFixed(1)}" text-anchor="middle" font-size="9" font-weight="800" fill="#b91c1c">${d.abnormal}</text>`;});
    h+=`<defs><linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fb7185"/><stop offset="1" stop-color="#fda4af"/></linearGradient></defs>`;
    // 折线(得分)
    const pts=data.map((d,i)=>`${(pl+innerW*(i+0.5)/n).toFixed(1)},${(pt+innerH-(d.score-80)/20*innerH).toFixed(1)}`).join(' ');
    const area=`${pl},${pt+innerH} ${pts} ${pl+innerW},${pt+innerH}`;
    h+=`<polygon points="${area}" fill="url(#aGrad)" opacity="0.18"/>`;
    h+=`<polyline points="${pts}" fill="none" stroke="#0ea5e9" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
    h+=`<defs><linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0ea5e9"/><stop offset="1" stop-color="#0ea5e9" stop-opacity="0"/></linearGradient></defs>`;
    data.forEach((d,i)=>{const x=pl+innerW*(i+0.5)/n;const y=pt+innerH-(d.score-80)/20*innerH;h+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#fff" stroke="#0ea5e9" stroke-width="2.5"/>`;h+=`<text x="${x.toFixed(1)}" y="${(y-8).toFixed(1)}" text-anchor="middle" font-size="9.5" font-weight="800" fill="#0c4a6e">${d.score}</text>`;});
    svg.innerHTML=h;
  }

  /* =============== 渲染: 巡检列表 =============== */
  function renderInspList(){
    const el=$('#inspList');if(!el)return;
    el.innerHTML=layer1.inspections.map(d=>`<div class="insp-row"><span class="t">${d.time}</span><span class="s ${d.cls}">${d.score}</span><span class="m">${d.summary}</span><span class="it ${d.cls}">${d.abnormal} 异常</span></div>`).join('');
  }

  /* =============== 渲染: Sparkline 5 系统 =============== */
  function renderSparkRow(){
    const el=$('#sparkRow');if(!el)return;
    const w=140,h=32;
    el.innerHTML=layer1.spark.map(s=>{
      const data=s.data,mn=Math.min(...data),mx=Math.max(...data),rng=mx-mn||1;
      const path=data.map((v,i)=>{const x=i/(data.length-1)*w;const y=h-(v-mn)/rng*h;return (i===0?'M':'L')+x.toFixed(1)+','+y.toFixed(1);}).join(' ');
      const area=path+` L${w},${h} L0,${h} Z`;
      // 将 path 语法转换为 polygon 顶点语法 (x1,y1 x2,y2 ...)
      const points=data.map((v,i)=>{const x=(i/(data.length-1)*w).toFixed(1);const y=(h-(v-mn)/rng*h).toFixed(1);return x+','+y;}).join(' ');
      const gradId='sp-'+s.sys;
      return `<div class="spark-cell"><div class="name"><span>${s.sys} · ${s.m}</span><span class="pulse ${s.pulse==='w'?'w':s.pulse==='d'?'d':''}"></span></div><div class="num">${s.val}<small>${s.unit}</small></div><svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.pulse==='d'?'#ef4444':s.pulse==='w'?'#f59e0b':'#0ea5e9'}" stop-opacity="0.35"/><stop offset="1" stop-color="${s.pulse==='d'?'#ef4444':s.pulse==='w'?'#f59e0b':'#0ea5e9'}" stop-opacity="0"/></linearGradient></defs><polygon points="${points} 0,${h} ${w},${h}" fill="url(#${gradId})"/><path d="${path}" fill="none" stroke="${s.pulse==='d'?'#ef4444':s.pulse==='w'?'#f59e0b':'#0ea5e9'}" stroke-width="1.5"/></svg></div>`;
    }).join('');
  }

  /* =============== 渲染: 最新 AI 报告 =============== */
  function renderLatestReport(){
    const el=$('#latestReport');if(!el)return;
    const r=layer1.latestReport;
    el.innerHTML=`<div class="gh"><b>最新 AI 巡检报告 · ${r.time}</b><span class="score ${r.cls}">综合分 ${r.score}</span></div><div class="body"><b>${r.summary}</b><ul>${r.items.map(i=>`<li class="${i.type}">${i.text}</li>`).join('')}</ul></div>`;
  }

  /* =============== 渲染: 告警时间线 =============== */
  function renderAlertTimeline(){
    const el=$('#alertTimeline');if(!el)return;
    el.innerHTML=layer2.alerts.map(a=>{
      const stCls=a.cls==='ok'?'':a.cls==='wait'?'wait':a.cls==='run'?'run':'fail';
      const stText=a.cls==='ok'?'已收敛':a.cls==='wait'?'已派单':a.cls==='run'?'执行中':'失败';
      return `<div class="alert-row ${a.level}"><span class="t">${a.time}</span><span class="lv">${a.level}</span><div class="body"><div class="dev"><span class="sys">${a.sys}</span>${a.dev}</div><div class="msg">${a.msg}</div><div class="sk"><span>Skill</span><b>${a.skill}</b><span class="st ${stCls}">${stText}</span></div></div></div>`;
    }).join('');
  }

  /* =============== 渲染: Skill 效果 (条形对比) =============== */
  function renderSkillEffect(){
    const svg=$('#skillEffect');if(!svg)return;
    const data=layer2.skillEffect,W=360,H=120,pl=110,pr=8,pt=10,pb=10;
    const innerW=W-pl-pr,innerH=H-pt-pb;
    const rowH=innerH/data.length;
    let h='';
    data.forEach((d,i)=>{
      const y=pt+rowH*(i+0.15),h2=rowH*0.7;
      const barW=innerW*d.val/100;
      const color=d.ok?'#10b981':'#f59e0b';
      h+=`<text x="${pl-6}" y="${(y+h2/2+3).toFixed(1)}" text-anchor="end" font-size="10" font-weight="700" fill="#0f172a">${d.n}</text>`;
      h+=`<rect x="${pl}" y="${y.toFixed(1)}" width="${innerW}" height="${h2.toFixed(1)}" rx="3" fill="#fafcfe" stroke="#dbeafe" stroke-width="0.5"/>`;
      h+=`<rect x="${pl}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h2.toFixed(1)}" rx="3" fill="${color}"/>`;
      h+=`<text x="${(pl+barW-4).toFixed(1)}" y="${(y+h2/2+3).toFixed(1)}" text-anchor="end" font-size="9.5" font-weight="800" fill="#fff">${d.val}%</text>`;
    });
    svg.innerHTML=h;
  }

  /* =============== 渲染: 迭代日志 =============== */
  function renderIterLog(){
    const el=$('#iterLog');if(!el)return;
    el.innerHTML=layer2.iterLog.map(r=>`<div class="iter-row"><span class="t">${r.t}</span><div class="b"><b>${r.s}</b> <span class="vr">${r.from}</span>→<span class="vr to">${r.to}</span> · ${r.reason} <span class="g">${r.gain}</span></div></div>`).join('');
  }

  /* =============== 渲染: 飞书日志 =============== */
  function renderFeishuLog(){
    const el=$('#feishuLog');if(!el)return;
    el.innerHTML=layer2.feishu.map(m=>`<div class="fs-msg ${m.type}"><div class="ico">${m.icon}</div><div class="body"><span class="t">${m.t}</span><span class="b">${m.msg}</span>${m.conf?`<span class="conf">置信 ${m.conf}</span>`:''}<div class="d">${m.detail||''}</div></div></div>`).join('');
  }

  /* =============== 渲染: AI 巡检得分仪表盘 (半圆弧) =============== */
  function renderGauge(){
    const svg=$('#gaugeAI');if(!svg)return;
    const score=layer1.latestReport.score;
    const W=220,H=130,cx=110,cy=110,R=85;
    const startA=Math.PI, endA=2*Math.PI; // 180° to 360°
    const valA=startA+(endA-startA)*score/100;
    const toXY=(a,r)=>({x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)});
    const arc=(a1,a2,r)=>{const s=toXY(a1,r),e=toXY(a2,r),lg=(a2-a1)>Math.PI?1:0;return `M${s.x.toFixed(1)},${s.y.toFixed(1)} A${r},${r} 0 ${lg} 1 ${e.x.toFixed(1)},${e.y.toFixed(1)}`};
    let h='';
    // 渐变
    h+=`<defs><linearGradient id="gGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ef4444"/><stop offset=".5" stop-color="#f59e0b"/><stop offset="1" stop-color="#10b981"/></linearGradient></defs>`;
    // 背景弧
    h+=`<path d="${arc(startA,endA,R)}" fill="none" stroke="#eef5fb" stroke-width="14" stroke-linecap="round"/>`;
    // 分段刻度 (20/40/60/80/100)
    [20,40,60,80,100].forEach(p=>{const a=startA+(endA-startA)*p/100;const p1=toXY(a,R-12),p2=toXY(a,R+12);h+=`<line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" stroke="#cbd5e1" stroke-width="1"/>`;h+=`<text x="${toXY(a,R+22).x.toFixed(1)}" y="${toXY(a,R+22).y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="8" font-weight="700" fill="#94a3b8">${p}</text>`;});
    // 值弧
    if(score>0){
      h+=`<path d="${arc(startA,valA,R)}" fill="none" stroke="url(#gGrad)" stroke-width="14" stroke-linecap="round" style="animation:anim-radar-fade .8s ease both"/>`;
    }
    // 指针
    const tip=toXY(valA,R);
    h+=`<circle cx="${tip.x.toFixed(1)}" cy="${tip.y.toFixed(1)}" r="6" fill="#fff" stroke="#0ea5e9" stroke-width="2.5"/>`;
    h+=`<circle cx="${tip.x.toFixed(1)}" cy="${tip.y.toFixed(1)}" r="2.5" fill="#0ea5e9"/>`;
    svg.innerHTML=h;
    // 文字
    const v=$('#gaugeVal'),l=$('#gaugeLvl');
    if(v) v.textContent=score;
    if(l){
      let lv='EXCELLENT',col='#047857';
      if(score<60){lv='CRITICAL';col='#b91c1c';}
      else if(score<75){lv='WARNING';col='#b45309';}
      else if(score<90){lv='GOOD';col='#0369a1';}
      l.textContent=lv;l.style.color=col;
    }
  }

  /* =============== 渲染: 5 系统 × 24h 健康热力图 =============== */
  // 5 大系统 24 小时(简化为 24 列)健康度: 0=绿 1=黄 2=红
  // 数据:基于 day_predict.json + 真实告警时刻
  const heatData={
    bms:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    env:[0,0,0,0,0,0,0,0,0,1,1,2,2,1,1,0,0,0,0,0,0,0,0,0],
    fire:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],
    security:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ba:[0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
  };
  const heatLabels=['00','02','04','06','08','10','12','14','16','18','20','22'];
  function renderHeatmap(){
    const el=$('#heatMap');if(!el)return;
    const sysOrder=[{k:'bms',n:'BMS',c:'#10b981'},{k:'env',n:'动环',c:'#0ea5e9'},{k:'fire',n:'消防',c:'#ef4444'},{k:'security',n:'安防',c:'#14b8a6'},{k:'ba',n:'BA',c:'#f59e0b'}];
    // 时间标签(每 2h 一格, 共 12)
    const labels=Array.from({length:12},(_,i)=>`<span>${heatLabels[i]}</span>`).join('');
    const rows=sysOrder.map(s=>{
      const cells=heatData[s.k].map((v,h)=>{
        const cls=v===2?'d':v===1?'w':'';
        const lbl=`${s.n} ${String(h).padStart(2,'0')}:00 · ${v===2?'P0':v===1?'P1':'OK'}`;
        return `<div class="heat-cell ${cls}" title="${lbl}"><div class="heat-tip">${lbl}</div></div>`;
      }).join('');
      return `<div class="heat-row"><span class="rn" style="color:${s.c}">${s.n}</span><div class="rc">${cells}</div></div>`;
    }).join('');
    el.innerHTML=`<div class="heat-labels">${labels}</div>${rows}<div class="heat-legend"><span>健康度:</span><span class="g" style="background:#10b981"></span>OK<span class="g" style="background:#fcd34d"></span>P1 关注<span class="g" style="background:#f87171"></span>P0 告警<span style="margin-left:auto">数据源: day_predict.json · 5min 粒度 × 24h</span></div>`;
  }

  /* =============== 渲染: Skill 闭环 7 步漏斗 =============== */
  // 12 条告警 → 全链路转化(7 步)
  const funnelData=[
    {n:'告警触发',v:12,pct:100,cls:''},
    {n:'SOP 匹配',v:12,pct:100,cls:''},
    {n:'Skill 执行',v:11,pct:91.7,cls:''},
    {n:'飞书推送',v:11,pct:91.7,cls:''},
    {n:'一次链接',v:8,pct:66.7,cls:''},
    {n:'人工反馈',v:8,pct:66.7,cls:''},
    {n:'LLM 迭代',v:6,pct:50,cls:'bot'},
  ];
  function renderFunnel(){
    const el=$('#skillFunnel');if(!el)return;
    el.innerHTML=funnelData.map((s,i)=>`<div class="fstep ${s.cls}"><span class="nm"><span class="n">${i+1}</span>${s.n}</span><div class="bar-wrap"><div class="bar-fill" style="width:${s.pct}%"></div></div><span class="v">${s.v}<span class="pct">${s.pct}%</span></span></div>`).join('');
  }

  /* =============== 渲染: 论文主题分布环图 =============== */
  const donutData=[
    {n:'电池管理',v:2,c:'#10b981'},
    {n:'暖通空调',v:2,c:'#0ea5e9'},
    {n:'消防报警',v:1,c:'#ef4444'},
    {n:'楼宇自控',v:1,c:'#f59e0b'},
    {n:'门禁安防',v:1,c:'#14b8a6'},
  ];
  function renderDonut(){
    const svg=$('#donutTopic');if(!svg)return;
    const W=140,H=140,cx=70,cy=70,R=50,sw=16;
    const total=donutData.reduce((s,d)=>s+d.v,0);
    let cur=-Math.PI/2; // 从 12 点钟方向开始
    let h='';
    donutData.forEach(d=>{
      const a=(d.v/total)*Math.PI*2;
      const a1=cur,a2=cur+a;
      const large=a>Math.PI?1:0;
      // 圆心 -> 内圈点 -> 弧 -> 外圈点 -> 闭合
      const ix1=cx+(R-sw/2)*Math.cos(a1),iy1=cy+(R-sw/2)*Math.sin(a1);
      const ix2=cx+(R-sw/2)*Math.cos(a2),iy2=cy+(R-sw/2)*Math.sin(a2);
      const ox1=cx+(R+sw/2)*Math.cos(a1),oy1=cy+(R+sw/2)*Math.sin(a1);
      const ox2=cx+(R+sw/2)*Math.cos(a2),oy2=cy+(R+sw/2)*Math.sin(a2);
      h+=`<path d="M${ix1.toFixed(1)},${iy1.toFixed(1)} L${ox1.toFixed(1)},${oy1.toFixed(1)} A${R+sw/2},${R+sw/2} 0 ${large} 1 ${ox2.toFixed(1)},${oy2.toFixed(1)} L${ix2.toFixed(1)},${iy2.toFixed(1)} A${R-sw/2},${R-sw/2} 0 ${large} 0 ${ix1.toFixed(1)},${iy1.toFixed(1)} Z" fill="${d.c}" opacity=".92" style="animation:anim-radar-fade .6s ease both"/>`;
      cur=a2;
    });
    // 中心留白
    h+=`<circle cx="${cx}" cy="${cy}" r="${R-sw/2-2}" fill="#fff"/>`;
    svg.innerHTML=h;
    const lg=$('#donutLegend');if(lg){
      lg.innerHTML=donutData.map(d=>`<div class="it"><span class="d" style="background:${d.c}"></span>${d.n}<span class="v">${d.v}</span></div>`).join('');
    }
    const v=$('#donutVal');if(v) v.textContent=total;
  }

  /* =============== 渲染: 论文卡片 =============== */
  function renderPapers(){
    const el=$('#paperGrid');if(!el)return;
    el.innerHTML=layer3.papers.map(p=>`<div class="paper-card"><span class="sys ${p.sys}">${p.sys}</span><div class="ttl">${p.ttl}</div><div class="jrn">${p.jrn} · ${p.y}</div><div class="sum">${p.sum}</div><div class="ft"><span class="conf ${p.cls}">相关度 ${(p.conf*100).toFixed(0)}%</span><span class="rag">${p.sys}/rag</span></div></div>`).join('');
  }

  /* =============== 渲染: RAG 分布 (横向条形) =============== */
  function renderRAG(){
    const svg=$('#ragBar');if(!svg)return;
    const data=layer3.rag,W=320,H=200,pl=55,pr=8,pt=12,pb=12;
    const innerW=W-pl-pr,innerH=H-pt-pb;
    const rowH=innerH/data.length;
    const maxN=Math.max(...data.map(d=>d.n));
    let h='';
    data.forEach((d,i)=>{
      const y=pt+rowH*(i+0.12),h2=rowH*0.76;
      const barW=innerW*d.n/maxN;
      h+=`<text x="${pl-6}" y="${(y+h2/2+3).toFixed(1)}" text-anchor="end" font-size="10" font-weight="800" fill="#0f172a">${d.sys.toUpperCase()}</text>`;
      h+=`<rect x="${pl}" y="${y.toFixed(1)}" width="${innerW}" height="${h2.toFixed(1)}" rx="3" fill="#fafcfe" stroke="#dbeafe" stroke-width="0.5"/>`;
      h+=`<rect x="${pl}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h2.toFixed(1)}" rx="3" fill="url(#${d.sys}Grad)" style="animation:anim-grow-bar .8s ease both;transform-origin:${pl}px ${(y+h2/2).toFixed(1)}px"/>`;
      h+=`<text x="${(pl+barW+4).toFixed(1)}" y="${(y+h2/2+3).toFixed(1)}" font-size="10" font-weight="800" fill="#0f172a">${d.n} 篇</text>`;
    });
    const grads={bms:'#10b981,#34d399',env:'#0ea5e9,#06b6d4',fire:'#ef4444,#fb7185',ba:'#f59e0b,#fbbf24',security:'#14b8a6,#5eead4'};
    h+=`<defs>`+Object.entries(grads).map(([k,c])=>`<linearGradient id="${k}Grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c.split(',')[0]}"/><stop offset="1" stop-color="${c.split(',')[1]}"/></linearGradient>`).join('')+`</defs>`;
    svg.innerHTML=h;
    const viz=$('#ragViz');if(viz){
      viz.innerHTML=data.map(d=>`<div class="rag-row"><span class="sys ${d.sys}">${d.sys}</span><div class="bar"><i class="${d.sys}" style="width:${(d.n/maxN*100).toFixed(1)}%"></i></div><span class="ct">${d.n}/${d.total}</span></div>`).join('');
    }
  }

  /* =============== 初始化 =============== */
  renderKPI();
  renderRadar();
  renderInspectTrend();
  renderInspList();
  renderDaylog();
  renderSparkRow();
  renderLatestReport();
  renderGauge();
  renderHeatmap();
  renderAlertTimeline();
  renderSkillEffect();
  renderFunnel();
  renderIterLog();
  renderFeishuLog();
  renderPapers();
  renderRAG();
  renderDonut();

  /* =============== 周期动画: 流水线步骤 =============== */
  let _pipeStep=1;
  setInterval(()=>{
    document.querySelectorAll('.pipe-step').forEach(s=>s.classList.remove('on'));
    _pipeStep=(_pipeStep%7)+1;
    const cur=document.querySelector('.pipe-step[data-step="'+_pipeStep+'"]');
    if(cur)cur.classList.add('on');
  },1800);

  /* =============== 周期: 飞书新消息 =============== */
  const _fsExtra=[
    {t:'15:02',type:'skill',icon:'执',msg:'【Skill 执行】BMS 主动均衡 v1.4 启动 · 簇 03# 内阻 0.42→0.36mΩ',conf:0.94,detail:'LLM 反馈后 v1.2 已升级到 v1.4'},
    {t:'15:18',type:'feedback',icon:'反',msg:'【人工确认】#20266 工单已确认,设备温度回正',conf:0,detail:'用户拍照上传 + OK 标记'},
    {t:'16:00',type:'paper',icon:'文',msg:'【论文归档】Hot aisle containment CFD meta-analysis → env/rag',conf:0.86,detail:'与热通道告警关联'},
  ];
  let _fsIdx=0;
  setInterval(()=>{
    const m=_fsExtra[_fsIdx%_fsExtra.length];
    _fsIdx++;
    const now=new Date();
    m.t=now.toLocaleTimeString('zh-CN',{hour12:false});
    const el=$('#feishuLog');
    if(!el)return;
    el.insertAdjacentHTML('afterbegin',`<div class="fs-msg ${m.type}"><div class="ico">${m.icon}</div><div class="body"><span class="t">${m.t}</span><span class="b">${m.msg}</span>${m.conf?`<span class="conf">置信 ${m.conf}</span>`:''}<div class="d">${m.detail||''}</div></div></div>`);
    const items=el.querySelectorAll('.fs-msg');
    if(items.length>15)items[items.length-1].remove();
  },12000);
  // 暴露给外部(主动巡检演示)使用
  window.layer2=layer2;window._pipeStep=_pipeStep;
  window.renderAlertTimeline=renderAlertTimeline;
  window.renderFeishuLog=renderFeishuLog;
  window.renderIterLog=renderIterLog;
} // end 新设计

/* ============== 兼容旧的自动注释（保留但指向新的 research 路径） ============== */
async function addAnnotation(docId,note,tag,source){
  if(!note) return;
  if(!tag) tag='manual';
  await fetch('/research/annotate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({doc_id:docId,note,tag,source:source||null})});
}
async function autoAnnotateOnAlert(scn){
  const map={
    env:'meeting_02_2026-06-02_afternoon',
    fire:'课题二_能耗数据核算与问题管理系统调研报告_v2',
    bms:'课题一_数据中心机房巡检与AI应用调研报告',
  };
  const m=map[scn.key];if(!m) return;
  const note=`[自动] 触发告警 "${scn.title}" · 设备:${scn.device||'-'} · 建议人工复核本页内容是否需补充处置细节`;
  try{await addAnnotation(m,note,'auto-alert',scn.source);}catch(e){console.warn(e)}
}

if(!document.getElementById('kpiGrid')){
renderAITasks();
loadHermes();
}

/* ============== 中央指挥中心 · 楼栋战图 ============== */
const pxmFloorDefaults=[
  {id:'f6',name:'F6 · 网络核心',desc:'核心交换机 / BGP / 防火墙',robots:1,status:'ok',risk:'P3',device:'Core-SW-01',advice:'维持 BGP 与防火墙健康探针，记录基线延迟。'},
  {id:'f5',name:'F5 · 计算A区',desc:'GPU 服务器集群 / AI 训练',robots:2,status:'ok',risk:'P3',device:'GPU-A12',advice:'保持温控与任务队列观察，避免训练任务抢占巡检带宽。'},
  {id:'f4',name:'F4 · 计算B区',desc:'通用计算 / 容器编排',robots:2,status:'warn',risk:'P1',device:'K8s-Node-08',advice:'关注容器节点负载偏移，准备迁移低优先级 Pod。'},
  {id:'f3',name:'F3 · 存储区',desc:'分布式存储 / NAS / 备份',robots:2,status:'ok',risk:'P3',device:'CRAC 1# · R3-12',advice:'巡检冷通道、备份队列与存储 IOPS 基线。'},
  {id:'f2',name:'F2 · 配电/UPS/BMS',desc:'高低压配电 / UPS / 电池组 / BMS',robots:1,status:'ok',risk:'P3',device:'UPS-B-02 / BMS-03#',advice:'按 15 分钟窗口核对 UPS 负载、电池温升与 BMS 内阻均衡状态。'},
  {id:'f1',name:'F1 · 大厅/安防',desc:'门禁 / 访客 / 监控中心',robots:2,status:'ok',risk:'P3',device:'ACS-GW-01',advice:'保持门禁、消防面板与巡更点位联动巡检。'}
];
let pxmFloors=pxmFloorDefaults.map(f=>({...f}));
const pxmScholarDefaults=[
  {id:'H-A',name:'Hermes-A',x:15,y:8,state:'active'},
  {id:'H-B',name:'Hermes-B',x:17,y:8,state:''},
  {id:'H-C',name:'Hermes-C',x:14,y:13,state:''},
  {id:'H-D',name:'Hermes-D',x:18,y:13,state:''},
  {id:'H-E',name:'Hermes-E',x:12,y:10,state:''},
  {id:'H-F',name:'Hermes-F',x:20,y:10,state:''}
];
let pxmScholars=pxmScholarDefaults.map(s=>({...s}));
let pxmActiveFloor='f4', pxmActiveShelf='', pxmActiveNode='', pxmSkillIter=0;
let pxmTimeline=[];
const pxmW=350,pxmFH=40,pxmD=36,pxmGap=22,pxmBX=66,pxmBY=68;

function pxmNow(){return new Date().toLocaleTimeString('zh-CN',{hour12:false});}
function pxmRobotShape(label,state){
  return `<g class="pxm-rb ${state||''}">
    <ellipse cx="8" cy="16" rx="6" ry="2" fill="#94a3b8" opacity=".28"/>
    <rect x="7" y="0" width="2" height="3" class="pxm-rb-leg"/><circle cx="8" cy="-2" r="1.5" class="pxm-rb-leg"/>
    <rect x="3" y="2" width="10" height="7" class="pxm-rb-head"/><rect x="5" y="4" width="2" height="2" class="pxm-rb-eye"/><rect x="9" y="4" width="2" height="2" class="pxm-rb-eye"/>
    <rect x="6" y="7" width="4" height="1" fill="#0c4a6e"/><rect x="2" y="10" width="12" height="4" class="pxm-rb-body"/><rect x="0" y="11" width="2" height="3" class="pxm-rb-body"/><rect x="14" y="11" width="2" height="3" class="pxm-rb-body"/>
    <rect x="4" y="14" width="2" height="2" class="pxm-rb-leg"/><rect x="10" y="14" width="2" height="2" class="pxm-rb-leg"/><text x="8" y="-5" class="pxm-rb-text">${label}</text>
  </g>`;
}
function pxmRobotGroup(x,y,label,state,extra){
  return `<g class="pxm-rb-wrap" ${extra||''} transform="translate(${x-8},${y-14})">${pxmRobotShape(label,state)}</g>`;
}
function pxmStats(){
  return {p0:pxmFloors.filter(f=>f.status==='alert').length,p1:pxmFloors.filter(f=>f.status==='warn').length,robots:pxmFloors.reduce((n,f)=>n+f.robots,0)};
}
function pxmUpdateStats(){
  const s=pxmStats();
  const alarm=document.getElementById('pxmAlarm'),warn=document.getElementById('pxmWarn'),robots=document.getElementById('pxmRobotCount'),iter=document.getElementById('pxmIter');
  if(alarm) alarm.textContent=s.p0;if(warn) warn.textContent=s.p1;if(robots) robots.textContent=s.robots;if(iter) iter.textContent=pxmSkillIter;
}
function pxmPushEvent(text,tag,level){
  const el=document.getElementById('pxmLibEvents'); if(!el) return;
  el.insertAdjacentHTML('afterbegin',`<div class="pxm-ev"><span class="t">${pxmNow()}</span><span>${text}</span><span class="tag ${level||''}">${tag}</span></div>`);
  const items=el.querySelectorAll('.pxm-ev'); while(items.length>12 && el.lastElementChild) el.lastElementChild.remove();
}
function pxmPushTimeline(text){
  pxmTimeline.unshift({t:pxmNow(),text});
  if(pxmTimeline.length>8) pxmTimeline.pop();
}

function pxmRenderBuilding(){
  const svg=document.getElementById('pxmBdSvg'); if(!svg) return;
  const focusMode=pxmFloors.some(f=>f.status==='alert');
  let h='<defs><linearGradient id="pxmGround" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e0f2fe"/><stop offset="1" stop-color="#bae6fd"/></linearGradient></defs>';
  h+=`<rect x="0" y="0" width="520" height="470" fill="#fafcfe"/>`;
  h+=`<path d="M0 88 H520 M0 188 H520 M0 288 H520 M0 388 H520" stroke="#dbe8f5" stroke-width="1" opacity=".8"/>`;
  h+=`<polygon points="28,394 420,394 506,454 88,454" fill="url(#pxmGround)" opacity=".95"/><polygon points="80,408 390,408 450,448 120,448" fill="#94a3b8" opacity=".18"/>`;
  h+=`<text x="50" y="448" fill="#0369a1" font-size="11" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-weight="800" letter-spacing="-.5">DATA CENTER A · STACKED FLOOR MAP</text>`;
  pxmFloors.forEach((f,i)=>{
    const y=pxmBY+i*(pxmFH+pxmGap), cls=f.status==='ok'?'':f.status;
    const dim=focusMode && f.status!=='alert' ? ' dim' : '';
    const label=f.name.split(' · ')[0]+' · '+f.name.split(' · ')[1];
    h+=`<g class="pxm-floor${dim}" data-floor="${f.id}">`;
    h+=`<polygon points="${pxmBX+10},${y+pxmFH+8} ${pxmBX+pxmW+pxmD+10},${y+pxmFH+8} ${pxmBX+pxmW+pxmD+34},${y+pxmFH+26} ${pxmBX+34},${y+pxmFH+26}" fill="#94a3b8" opacity=".18"/>`;
    h+=`<polygon class="pxm-floor-front ${cls}" data-floor="${f.id}" points="${pxmBX},${y} ${pxmBX+pxmW},${y} ${pxmBX+pxmW},${y+pxmFH} ${pxmBX},${y+pxmFH}"/>`;
    h+=`<polygon class="pxm-floor-top ${cls}" data-floor="${f.id}" points="${pxmBX},${y} ${pxmBX+pxmW},${y} ${pxmBX+pxmW+pxmD},${y-pxmD} ${pxmBX+pxmD},${y-pxmD}"/>`;
    h+=`<polygon class="pxm-floor-side ${cls}" data-floor="${f.id}" points="${pxmBX+pxmW},${y} ${pxmBX+pxmW+pxmD},${y-pxmD} ${pxmBX+pxmW+pxmD},${y+pxmFH-pxmD} ${pxmBX+pxmW},${y+pxmFH}"/>`;
    for(let w=0;w<6;w++) h+=`<rect class="pxm-window ${cls}" x="${pxmBX+28+w*50}" y="${y+13}" width="24" height="17"/>`;
    h+=`<text class="pxm-floor-label ${cls}" data-floor="${f.id}" x="${pxmBX+pxmW/2}" y="${y+pxmFH-9}">${label}</text>`;
    [{rx:.26,lab:'A'},{rx:.62,lab:'B'}].slice(0,f.robots).forEach((p,idx)=>{
      const st=f.status==='alert'?'alert':(f.status==='warn'?'warn':'active');
      h+=pxmRobotGroup(pxmBX+p.rx*pxmW+idx*10,y-pxmD+9,p.lab,st,`data-floor="${f.id}" style="cursor:pointer"`);
    });
    h+='</g>';
  });
  svg.innerHTML=h;
  svg.querySelectorAll('[data-floor]').forEach(el=>{
    el.addEventListener('mouseenter',()=>pxmRenderAnalysis(el.dataset.floor));
    el.addEventListener('click',()=>{pxmActiveFloor=el.dataset.floor;pxmPushTimeline(`人工聚焦 ${pxmFloors.find(f=>f.id===pxmActiveFloor).name}，HUD 切换到楼层研判。`);pxmRenderAnalysis(pxmActiveFloor);});
  });
}

function pxmRenderAnalysis(fid){
  pxmActiveFloor=fid||pxmActiveFloor||'f4';
  const f=pxmFloors.find(x=>x.id===pxmActiveFloor); if(!f) return;
  const el=document.getElementById('pxmAnalysis'); if(!el) return;
  const riskCls=f.status==='alert'?'alert':(f.status==='warn'?'warn':'');
  const alarm=f.status==='alert'?'红色告警层闪烁，已冻结相关巡检上下文':(f.status==='warn'?'P1 关注，等待关联信号确认':'暂无告警，维持基线巡检');
  const progress=f.status==='alert'?88:(f.status==='warn'?54:22);
  const timeline=pxmTimeline.length?pxmTimeline:[{t:pxmNow(),text:'系统待命：楼栋、Skill 图书馆、事件流已完成同步。'}];
  el.innerHTML=`<div class="pxm-hud-title"><span>${f.name}</span><span class="pxm-risk ${riskCls}">${f.risk}</span></div>
    <div class="pxm-hud-grid"><div class="pxm-hud-card"><small>当前风险</small><b>${f.status==='alert'?'P0 告警':(f.status==='warn'?'P1 关注':'P3 正常')}</b></div><div class="pxm-hud-card"><small>告警摘要</small><b>${alarm}</b></div><div class="pxm-hud-card"><small>关注设备</small><b>${f.device}</b></div><div class="pxm-hud-card"><small>检索进度</small><b>${progress}% · ${pxmActiveShelf||'待选择书架'}</b></div></div>
    <div class="pxm-advice"><b>处置建议：</b>${f.advice}</div><div class="pxm-progress"><i style="width:${progress}%"></i></div>
    <div class="pxm-timeline">${timeline.map(x=>`<div class="pxm-tl"><span class="t">${x.t}</span><span>${x.text}</span></div>`).join('')}</div>`;
  pxmUpdateStats();
}

/* ===== 图书馆：Hermes 知识库 / Skill 库 ===== */
const pxmCell=16, pxmCols=32, pxmRows=20, pxmLW=512, pxmLH=320;
const pxmShelves={
  env:{domain:'env',label:'动环管理',cluster:[{x:1,y:2,w:8,h:5}],color:'env',node:'CRAC调节',skills:[
    {id:'crac-cool',name:'CRAC调节',ver:'v2.4',hint:'出风温度/备用制冷'},
    {id:'hot-aisle',name:'热通道气流',ver:'v1.7',hint:'挡板/气流重构'},
    {id:'predict',name:'温度预测',ver:'v3.1',hint:'15min 预测'}
  ]},
  power:{domain:'power',label:'配电/UPS',cluster:[{x:1,y:8,w:8,h:3}],color:'power',node:'UPS切换',skills:[
    {id:'ups-switch',name:'UPS切换',ver:'v1.1',hint:'主备切换'},
    {id:'pdu-load',name:'PDU负载',ver:'v1.0',hint:'支路负载'},
    {id:'battery-temp',name:'电池温升',ver:'v0.9',hint:'电池组温度'}
  ]},
  fire:{domain:'fire',label:'消防告警',cluster:[{x:1,y:13,w:8,h:5}],color:'fire',node:'喷淋压力',skills:[
    {id:'pump-switch',name:'消防泵切换',ver:'v1.2',hint:'泵组主备'},
    {id:'water',name:'水压调节',ver:'v1.5',hint:'喷淋压力'},
    {id:'feishu',name:'飞书通知',ver:'v2.0',hint:'群通知/审批'}
  ]},
  security:{domain:'security',label:'安管/门禁',cluster:[{x:11,y:2,w:5,h:5}],color:'security',node:'门禁审批',skills:[
    {id:'door-approval',name:'门禁审批',ver:'v1.5',hint:'访客/值班'},
    {id:'abnormal-entry',name:'异常进出',ver:'v1.1',hint:'夜间刷卡'},
    {id:'visitor-check',name:'访客核验',ver:'v0.8',hint:'预约核验'}
  ]},
  openclaw:{domain:'openclaw',label:'openClaw',cluster:[{x:17,y:2,w:5,h:5}],color:'openclaw',node:'派单队列',skills:[
    {id:'dispatch',name:'智能派单',ver:'v3.1',hint:'人员/区域匹配'},
    {id:'priority',name:'优先级收敛',ver:'v2.2',hint:'P0/P1 分级'},
    {id:'sla-watch',name:'SLA催办',ver:'v2.0',hint:'超时提醒'}
  ]},
  ticket:{domain:'ticket',label:'工单闭环',cluster:[{x:23,y:2,w:8,h:5}],color:'ticket',node:'工单池',skills:[
    {id:'ticket-create',name:'工单生成',ver:'v3.1',hint:'字段填充'},
    {id:'ticket-close',name:'闭环校验',ver:'v1.6',hint:'证据/图片'},
    {id:'ticket-review',name:'复盘归档',ver:'v1.2',hint:'SOP沉淀'}
  ]},
  bms:{domain:'bms',label:'BMS电池',cluster:[{x:23,y:13,w:8,h:5}],color:'bms',node:'BMS均衡',skills:[
    {id:'bms-cell-balance',name:'主动均衡',ver:'v1.4',hint:'簇内主动均衡'},
    {id:'bms-cell-test',name:'放电测试',ver:'v1.0',hint:'0.1C 容量测试'},
    {id:'bms-temp-watch',name:'温度监测',ver:'v1.2',hint:'温升 0.5℃/min 预警'}
  ]},
  audit:{domain:'audit',label:'Hermes审计',cluster:[{x:11,y:14,w:11,h:4}],color:'audit',node:'审计日志',skills:[
    {id:'guardrail',name:'缰绳检查',ver:'v1.8',hint:'权限/禁令'},
    {id:'diff-review',name:'Diff审查',ver:'v1.4',hint:'Skill迭代'},
    {id:'history',name:'历史回放',ver:'v1.0',hint:'事件追踪'}
  ]}
};
const pxmNodes=[
  {x:5,y:4,name:'CRAC调节'},{x:5,y:9,name:'UPS切换'},{x:5,y:15,name:'喷淋压力'},
  {x:13,y:4,name:'门禁审批'},{x:19,y:4,name:'派单队列'},{x:27,y:4,name:'工单池'},
  {x:27,y:15,name:'BMS均衡'},{x:16,y:16,name:'审计日志'},{x:16,y:10,name:'Hermes Core'}
];
function pxmSkillList(s){return (s.skills||[]).map(x=>`${x.name} ${x.ver}`).join(' / ');}
function pxmRenderSkillBooks(shelfKey,shelf,c){
  const skillH=Math.max(9,Math.floor((c.h*pxmCell-18)/(shelf.skills.length||1)));
  let out='';
  shelf.skills.forEach((sk,i)=>{
    const x=c.x*pxmCell+5, y=c.y*pxmCell+18+i*skillH;
    const active=pxmActiveNode===sk.name || pxmActiveNode===shelf.node;
    out+=`<rect class="pxm-skill-book ${active?'active':''}" data-shelf="${shelfKey}" data-skill="${sk.id}" x="${x}" y="${y}" width="${c.w*pxmCell-10}" height="${Math.max(7,skillH-2)}" fill="rgba(255,255,255,.16)"/>`;
    out+=`<text class="pxm-skill-text" x="${x+4}" y="${y+skillH/2}">${sk.name}</text>`;
  });
  return out;
}
function pxmRenderLibrary(){
  const svg=document.getElementById('pxmLibSvg'); if(!svg) return;
  let h=`<defs><pattern id="libFloor" width="${pxmCell}" height="${pxmCell}" patternUnits="userSpaceOnUse"><rect width="${pxmCell}" height="${pxmCell}" class="pxm-lib-floor"/><rect width="${pxmCell}" height="${pxmCell}" fill="none" class="pxm-lib-grid"/></pattern></defs>`;
  h+=`<rect x="0" y="0" width="${pxmLW}" height="${pxmLH}" fill="url(#libFloor)"/><rect x="0" y="0" width="${pxmLW}" height="${pxmLH}" fill="none" stroke="#bae6fd" stroke-width="2" opacity=".7"/><line class="pxm-scan" x1="0" y1="0" x2="512" y2="0"/>`;
  h+=`<rect class="pxm-domain-core" x="184" y="130" width="144" height="46"/><text x="256" y="148" fill="#0369a1" font-size="10" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-weight="900" text-anchor="middle" letter-spacing="-.3">HERMES CORE</text><text x="256" y="164" fill="#0ea5e9" font-size="8" font-family="-apple-system,sans-serif" text-anchor="middle">soul / graph / history</text>`;
  Object.entries(pxmShelves).forEach(([k,s])=>s.cluster.forEach(c=>{
    const active=s.label===pxmActiveShelf?' pxm-shelf-active':'';
    h+=`<rect class="pxm-shelf-${s.color}${active}" x="${c.x*pxmCell}" y="${c.y*pxmCell}" width="${c.w*pxmCell}" height="${c.h*pxmCell}" data-shelf="${k}" style="cursor:pointer"/>`;
    h+=`<text class="pxm-shelf-label" x="${(c.x+c.w/2)*pxmCell}" y="${c.y*pxmCell+10}">${s.label}</text>`;
    h+=pxmRenderSkillBooks(k,s,c);
  }));
  [[14,9],[15,9],[16,9],[17,9],[14,11],[17,11]].forEach(([dx,dy])=>h+=`<rect class="pxm-desk" x="${dx*pxmCell+2}" y="${dy*pxmCell+2}" width="${pxmCell-4}" height="${pxmCell-4}"/>`);
  pxmNodes.forEach(n=>h+=`<circle class="pxm-node ${n.name===pxmActiveNode?'active':''}" cx="${(n.x+.5)*pxmCell}" cy="${(n.y+.5)*pxmCell}" r="5"/><text x="${(n.x+.5)*pxmCell}" y="${(n.y+.5)*pxmCell-9}" fill="#0f172a" font-size="7" font-weight="700" text-anchor="middle">${n.name}</text>`);
  pxmScholars.forEach(s=>h+=pxmRobotGroup(s.x*pxmCell,s.y*pxmCell,s.id.replace('H-',''),s.state));
  svg.innerHTML=h;
  svg.querySelectorAll('[data-shelf]').forEach(el=>el.addEventListener('click',()=>pxmShowShelf(el.dataset.shelf,el.dataset.skill)));
}
function pxmShowShelf(k,skillId){
  const s=pxmShelves[k]; if(!s) return;
  const skill=skillId ? s.skills.find(x=>x.id===skillId) : null;
  pxmActiveShelf=s.label; pxmActiveNode=skill?skill.name:s.node; pxmSkillIter += skill ? 1 : (s.skills?s.skills.length:1);
  const skillText=skill ? `${skill.name} ${skill.ver} · ${skill.hint}` : pxmSkillList(s);
  pxmPushEvent(`<b>${s.label}</b> 查询 · ${skillText}`,s.domain,'pxm-tag-ok');
  pxmPushTimeline(`Hermes 知识库命中「${s.label}」：${skillText}。`);
  pxmRenderLibrary(); pxmRenderAnalysis(pxmActiveFloor);
}
function pxmMoveScholar(sid,tx,ty,state){
  const s=pxmScholars.find(x=>x.id===sid); if(!s) return;
  s.x=tx;s.y=ty;s.state=state||s.state;
}

/* ===== 场景触发 ===== */
function pxmTriggerScenario(key){
  const map={
    env:{floor:'f3',shelf:'env',scholar:'H-A',risk:'P0',device:'CRAC 1# · R3-12',desc:'动环 · F3 存储区温度异常',advice:'调用 CRAC调节、热通道气流、温度预测三个 Skill，先稳态降温，再评估 15 分钟趋势。',tag:'ENV'},
    fire:{floor:'f1',shelf:'fire',scholar:'H-C',risk:'P0',device:'喷淋压力阀 · F1-W2',desc:'消防 · F1 喷淋压力异常',advice:'调用消防泵切换、水压调节、飞书通知 Skill，禁止远程复位，先通知现场确认阀组。',tag:'FIRE'},
    bms:{floor:'f2',shelf:'bms',scholar:'H-D',risk:'P0',device:'BMS-03# · 12# 单体',desc:'BMS · F2 03# 电池组内阻偏高',advice:'调用主动均衡、放电测试、温度监测 Skill，先抑制温升再验证 SOH。',tag:'BMS'}
  };
  if(key==='reset'){
    pxmFloors=pxmFloorDefaults.map(f=>({...f})); pxmScholars=pxmScholarDefaults.map(s=>({...s})); pxmActiveFloor='f4'; pxmActiveShelf=''; pxmActiveNode=''; pxmSkillIter=0; pxmTimeline=[];
    const ev=document.getElementById('pxmLibEvents'); if(ev) ev.innerHTML='';
    pxmPushTimeline('系统重置：Hermes 知识库、楼层状态、机器人位置与事件流已恢复默认。');
    pxmRenderBuilding(); pxmRenderLibrary(); pxmRenderAnalysis(pxmActiveFloor); pxmPushEvent('<b>RESET</b> Hermes 知识库恢复巡游态','RESET','pxm-tag-ok'); return;
  }
  const m=map[key]; if(!m) return;
  pxmFloors=pxmFloorDefaults.map(f=>({...f,status:f.id===m.floor?'alert':(f.id==='f4'&&m.floor!=='f4'?'warn':'ok')}));
  const f=pxmFloors.find(x=>x.id===m.floor); Object.assign(f,{risk:m.risk,device:m.device,advice:m.advice});
  const shelf=pxmShelves[m.shelf], c=shelf.cluster[0];
  pxmActiveFloor=m.floor; pxmActiveShelf=shelf.label; pxmActiveNode=shelf.node; pxmSkillIter += shelf.skills.length;
  pxmScholars=pxmScholarDefaults.map(s=>({...s,state:''})); pxmMoveScholar(m.scholar,c.x+Math.floor(c.w/2),c.y+Math.floor(c.h/2),'alert');
  pxmPushTimeline(`${m.desc} 触发，${m.scholar} 进入 Hermes「${shelf.label}」书架。`);
  pxmPushTimeline(`Skill 调用链：${pxmSkillList(shelf)}。`);
  pxmPushTimeline(`HUD 建议：${m.advice}`);
  pxmPushEvent(`<b>${m.scholar}</b> → ${m.desc} · 命中 ${shelf.skills.length} 个 Skill`,m.tag,'pxm-tag-alert');
  pxmRenderBuilding(); pxmRenderLibrary(); pxmRenderAnalysis(m.floor);
}

function pxmInit(){
  if(!pxmTimeline.length) pxmPushTimeline('中央指挥中心上线：等待楼层 hover/click 或顶部告警按钮。');
  if(document.getElementById('pxmLibEvents') && !document.getElementById('pxmLibEvents').children.length){
    pxmPushEvent('<b>Hermes-A</b> 巡游知识节点，等待告警上下文','IDLE','pxm-tag-ok');
  }
  // Skill 子迭代
  const skillOps=[
    {n:'CRAC 调节',v:'v2.4',p:78,step:'正在学习新工况',iter:true},
    {n:'P0 派单',v:'v3.1',p:92,step:'本周 +6 收敛样本',iter:false},
    {n:'热通道气流',v:'v1.7',p:55,step:'待评审 · 草稿',iter:true},
    {n:'BMS 主动均衡',v:'v1.4',p:62,step:'已合并主干',iter:false},
    {n:'工单催办',v:'v2.0',p:88,step:'稳定运行',iter:false},
  ];
  const skillEl=document.getElementById('pxmSkillOps');
  if(skillEl && !skillEl.children.length){
    skillEl.innerHTML=skillOps.map(s=>`<div class="pxm-skill-mini ${s.iter?'iter':''}"><div class="top"><span>${s.n}</span><span>${s.v}</span></div><div class="bar"><i style="width:${s.p}%"></i></div><div class="step">${s.step} · ${s.p}%</div></div>`).join('');
  }
  // 系统报警日志
  const sysGroups=[
    {n:'BMS 电池系统',cls:'warn',log:[['BMS-03# 内阻 0.42mΩ · P1','14:32:11'],['SOC 96% · SOH 96%','14:18:00'],['簇间温差 1.2℃','14:10:00']]},
    {n:'动环监控系统',cls:'danger',log:[['F3 存储区温度 32.6℃ · P0','14:35:22'],['UPS-B 负载 85% · P1','14:28:47'],['水浸传感器全楼正常','14:21:03']]},
    {n:'消防系统',cls:'',log:[['喷淋压力 4.2bar · 正常','14:00:00'],['烟感 128/128 在线','13:55:11'],['消防泵待机 · OK','13:40:00']]},
    {n:'安防系统',cls:'',log:[['非工作刷卡 1 次 · 已审批','14:25:08'],['今日门禁 156 条','14:00:00'],['周界报警 0 次','13:30:00']]},
    {n:'BA 系统',cls:'warn',log:[['照明回路开启率 68%','14:36:00'],['空调机组 8/9 运行','14:30:00'],['能耗同比节省 12%','14:00:00']]}
  ];
  const sysEl=document.getElementById('pxmSysOps');
  if(sysEl && !sysEl.children.length){
    sysEl.innerHTML=sysGroups.map(g=>`<div class="pxm-log-mini ${g.cls}"><div class="gh"><span>● ${g.n}</span><span style="color:var(--muted);font-weight:500">${g.log.length} 条</span></div>${g.log.slice(0,2).map(l=>`<div class="gb"><span>${l[0]}</span><span>${l[1]||''}</span></div>`).join('')}</div>`).join('');
  }
  // AI 工作流
  const workEl=document.getElementById('pxmWorkOps');
  if(workEl && !workEl.children.length){
    workEl.innerHTML=`<div class="pxm-work-col"><h4>AI 自运行</h4>
      <div class="pxm-work-row"><b>F3 温度异常自闭环</b><small>调节 CRAC 2# 出风 -1.5℃</small><span class="st">执行中</span></div>
      <div class="pxm-work-row"><b>BMS 内阻自适应</b><small>主动均衡启动</small><span class="st">运行</span></div>
      <div class="pxm-work-row"><b>巡检比对</b><small>A/B/C 列接地 OK</small><span class="st">完成</span></div>
    </div><div class="pxm-work-col"><h4>AI 派发工单</h4>
      <div class="pxm-work-row flow"><b>#20266 F3 冷却</b><small>李工 · P0 · 11min</small><span class="st">派发中</span></div>
      <div class="pxm-work-row"><b>#20267 BMS 内阻</b><small>赵工 · 检查均衡</small><span class="st">已派</span></div>
      <div class="pxm-work-row"><b>CRAC 调节审批</b><small>飞书 · 等批准</small><span class="st">待批</span></div>
    </div>`;
  }
  pxmRenderBuilding(); pxmRenderLibrary(); pxmRenderAnalysis(pxmActiveFloor);
  if(!window._pxmBound){
    document.querySelectorAll('.pxm-scn').forEach(b=>b.onclick=()=>{
      const k=b.dataset.scn; pxmTriggerScenario(k);
      if(k!=='reset' && typeof triggerDemo==='function') triggerDemo(k);
    });
    window._pxmBound=true;
  }
}

/* ============== 主动巡检演示 · 完整 7 步闭环 ============== */
const INSPECT_DEMO={
  webhook:'https://open.feishu.cn/open-apis/bot/v2/hook/65c9659c-196e-4ab1-875c-d9b4b63a3bfc',
  llm:{key:'sk-cp-UBt7km2A-2SWYf4DgqHhKp1pB6-j_7bBtqSwe3SjKXWZiuDDPCwF7axXYiHawvJAUVbagGj3XN4Lye2sbgnCJzjUpi05PlQ4cH1X-DrJrf4uHpDHLe2dcW4',model:'MiniMax-M2.7-highspeed',url:'https://api.minimaxi.com/v1'},
  systems:[
    {id:'bms',name:'BMS 电池系统',ico:'BM',color:'#10b981',level:'P1',
     params:[
       {k:'SOC 上限',n:'BMS-F2-12#',v:96.8,u:'%',thr:95,dir:'+',danger:'SOC 96.8% 越上限 95%'},
       {k:'单体最大内阻',n:'BMS-F2-07#',v:0.42,u:'mΩ',thr:0.38,dir:'+',danger:'内阻 0.42mΩ 越阈值 0.38mΩ'},
       {k:'单体最高温度',n:'BMS-F2-03#',v:36.4,u:'℃',thr:34,dir:'+',danger:'温度 36.4℃ 越阈值 34℃'},
     ],
     skillIds:['bms/soc-balance','bms/active-balance','bms/cell-temp','bms/internal-r','bms/soc-prediction','bms/soh-estimate'],
     mainSkill:'bms/internal-r',
     kpi:[
       {n:'SOC',v:96.8,u:'%',s:'ok',final:88.5,finalS:'fix'},
       {n:'SOH',v:96.0,u:'%',s:'ok',final:96.0,finalS:'ok'},
       {n:'组电压',v:53.6,u:'V',s:'ok',final:53.6,finalS:'ok'},
       {n:'温度',v:36.4,u:'℃',s:'alert',final:33.2,finalS:'fix'},
       {n:'内阻',v:0.42,u:'mΩ',s:'alert',final:0.36,finalS:'fix'},
       {n:'均衡',v:88,u:'%',s:'warn',final:94,finalS:'fix'},
     ]},
    {id:'env',name:'动环监控',ico:'EH',color:'#0ea5e9',level:'P0',
     params:[
       {k:'机柜进风温度',n:'F3-R12',v:32.6,u:'℃',thr:27,dir:'+',danger:'温度 32.6℃ 越阈值 27℃'},
       {k:'PUE',n:'DC-IM',v:1.58,u:'',thr:1.4,dir:'+',danger:'PUE 1.58 越阈值 1.4'},
       {k:'热通道最高',n:'F3',v:38.2,u:'℃',thr:35,dir:'+',danger:'热通道 38.2℃ 越阈值 35℃'},
     ],
     skillIds:['env/rack-temp','env/crac-cool','env/predict','env/hot-aisle','env/pue-realtime','env/airflow'],
     mainSkill:'env/rack-temp',
     kpi:[
       {n:'冷通道',v:22.4,u:'℃',s:'ok',final:22.1,finalS:'fix'},
       {n:'热通道',v:38.2,u:'℃',s:'alert',final:31.8,finalS:'fix'},
       {n:'湿度',v:45,u:'%',s:'ok',final:45,finalS:'ok'},
       {n:'PUE',v:1.58,u:'',s:'alert',final:1.32,finalS:'fix'},
       {n:'IT 负载',v:478,u:'kW',s:'ok',final:478,finalS:'ok'},
       {n:'CRAC 2#',v:'87%',u:'',s:'warn',final:'62%',finalS:'fix'},
     ]},
    {id:'fire',name:'消防系统',ico:'FR',color:'#ef4444',level:'P0',
     params:[
       {k:'烟感值',n:'F1-A12',v:42,u:'ppm',thr:25,dir:'+',danger:'烟感 42ppm 越阈值 25ppm (灰尘聚类) '},
       {k:'喷淋压力',n:'SPRINKLER-Z4',v:3.4,u:'bar',thr:3.8,dir:'-',danger:'压力 3.4bar 低于阈值 3.8bar'},
     ],
     skillIds:['fire/smoke-typo','fire/sprinkler-zone','fire/valve-status','fire/pump-switch','fire/feishu','fire/evac-route'],
     mainSkill:'fire/smoke-typo',
     kpi:[
       {n:'烟感值',v:42,u:'ppm',s:'alert',final:8,finalS:'fix'},
       {n:'喷淋压力',v:3.4,u:'bar',s:'alert',final:4.2,finalS:'fix'},
       {n:'水池液位',v:86,u:'%',s:'ok',final:86,finalS:'ok'},
       {n:'气灭浓度',v:95,u:'%',s:'ok',final:95,finalS:'ok'},
       {n:'消防泵',v:'就绪',u:'',s:'ok',final:'就绪',finalS:'ok'},
       {n:'手报',v:100,u:'%',s:'ok',final:100,finalS:'ok'},
     ]},
    {id:'security',name:'安防系统',ico:'SC',color:'#3b82f6',level:'P1',
     params:[
       {k:'门禁异常',n:'F4-NORTH',v:'尾随',u:'',thr:0,dir:'+',danger:'F4 北门检测到非工作时段尾随刷卡'},
       {k:'摄像机掉线',n:'CAM-128',v:2,u:'路',thr:0,dir:'+',danger:'摄像机掉线 2 路 (PoE 自愈) '},
     ],
     skillIds:['security/access-control','security/tail-detect','security/video-linkage','security/intrusion-zone','security/visitor-mgmt','security/anti-passback'],
     mainSkill:'security/tail-detect',
     kpi:[
       {n:'门禁',v:100,u:'%',s:'warn',final:100,finalS:'fix'},
       {n:'摄像机',v:126,u:'/128',s:'alert',final:128,finalS:'fix'},
       {n:'巡更',v:24,u:'点',s:'ok',final:24,finalS:'ok'},
       {n:'对讲',v:12,u:'台',s:'ok',final:12,finalS:'ok'},
       {n:'车辆道闸',v:4,u:'道',s:'ok',final:4,finalS:'ok'},
       {n:'访客预约',v:3,u:'',s:'ok',final:3,finalS:'ok'},
     ]},
    {id:'ba',name:'BA 系统',ico:'BA',color:'#f59e0b',level:'P2',
     params:[
       {k:'AHU 滤网压差',n:'AHU-3#',v:240,u:'Pa',thr:200,dir:'+',danger:'滤网压差 240Pa 越阈值 200Pa'},
       {k:'冷机 COP',n:'CHILLER-1#',v:3.2,u:'',thr:4.0,dir:'-',danger:'COP 3.2 低于阈值 4.0'},
     ],
     skillIds:['ba/ahu-start','ba/chiller-opt','ba/fault-diagnose','ba/setpoint-clip','ba/cooling-tower','ba/free-cooling'],
     mainSkill:'ba/ahu-start',
     kpi:[
       {n:'AHU-3#',v:240,u:'Pa',s:'alert',final:180,finalS:'fix'},
       {n:'冷机 COP',v:3.2,u:'',s:'alert',final:4.1,finalS:'fix'},
       {n:'冷塔',v:3,u:'台',s:'ok',final:3,finalS:'ok'},
       {n:'照明',v:96,u:'%',s:'ok',final:96,finalS:'ok'},
       {n:'电梯',v:6,u:'部',s:'ok',final:6,finalS:'ok'},
       {n:'给排水',v:'正常',u:'',s:'ok',final:'正常',finalS:'ok'},
     ]},
  ],
  stepDefs:[
    {n:'告警触发',k:'alert'},
    {n:'SOP 匹配',k:'match'},
    {n:'Skill 执行',k:'run'},
    {n:'飞书推送',k:'feishu'},
    {n:'一次链接',k:'link'},
    {n:'人工反馈',k:'feedback'},
    {n:'LLM 迭代',k:'iter'},
  ],
  _state:{sys:null,param:null,step:0,running:false,startTs:0,log:[],linkUrl:'',iterSkill:'',iterFrom:'v1.0',iterTo:'v1.1',iterReason:'',iterGain:'+0%'},
};

// 渲染系统列表
function _renderSysList(){
  const box=$('#idSysList');if(!box)return;
  box.innerHTML=INSPECT_DEMO.systems.map(s=>{
    const isActive=INSPECT_DEMO._state.sys===s.id;
    return `<div class="id-sys ${isActive?'active':''}" data-sys="${s.id}">
      <b><i>${s.ico}</i>${s.name}<span style="margin-left:auto;font-size:10px;background:rgba(239,68,68,.15);color:#b91c1c;padding:1px 5px;border-radius:4px">${s.level}</span></b>
      <small>${s.skillIds.length} 个核心 Skill · ${s.params.length} 个 KPI 可触发</small>
      <div class="id-params">
        ${s.params.map((p,i)=>`<div class="id-param" data-sys="${s.id}" data-param="${i}"><span>${p.k}</span><b class="danger">${p.v}${p.u}</b></div>`).join('')}
      </div>
    </div>`;
  }).join('');
  // 绑定
  box.querySelectorAll('.id-sys').forEach(el=>{
    el.addEventListener('click',e=>{
      if(e.target.closest('.id-param'))return;
      INSPECT_DEMO._state.sys=el.dataset.sys;
      INSPECT_DEMO._state.param=null;
      _renderSysList();_renderKpi();_updateFoot();
    });
  });
  box.querySelectorAll('.id-param').forEach(el=>{
    el.addEventListener('click',e=>{
      e.stopPropagation();
      const s=el.dataset.sys,p=parseInt(el.dataset.param);
      INSPECT_DEMO._state.sys=s;INSPECT_DEMO._state.param=p;
      _renderSysList();_renderKpi();_updateFoot();
    });
  });
}

// 渲染 KPI 网格
function _renderKpi(){
  const box=$('#idKpiGrid');if(!box)return;
  const sys=INSPECT_DEMO.systems.find(s=>s.id===INSPECT_DEMO._state.sys);
  const arr=sys?sys.kpi:[];
  if(!arr.length){box.innerHTML='<div style="grid-column:1/-1;font-size:11px;color:var(--weak);text-align:center;padding:18px 0">先在左侧选择告警源</div>';return;}
  box.innerHTML=arr.map(k=>`<div class="k ${k.s||''}" data-k="${k.n}">
    <small>${k.n}${k.s==='alert'?'<span style="color:#ef4444">●</span>':k.s==='warn'?'<span style="color:#f59e0b">●</span>':'<span style="color:#10b981">●</span>'}</small>
    <b>${k.v}<span class="u">${k.u}</span></b>
  </div>`).join('');
}

// 渲染步骤条
function _renderStepBar(){
  const box=$('#idStepBar');if(!box)return;
  box.innerHTML=INSPECT_DEMO.stepDefs.map((s,i)=>{
    let cls='';
    if(i<INSPECT_DEMO._state.step)cls='done';
    else if(i===INSPECT_DEMO._state.step)cls='active';
    return `<div class="id-step ${cls}"><div class="num">${i+1}</div>${s.n}</div>${i<INSPECT_DEMO.stepDefs.length-1?'<div class="id-step-sep">›</div>':''}`;
  }).join('');
}

// 渲染 Skill 列表
function _renderSkills(stage,matchedIdx,runIdx){
  const box=$('#idSkillList');if(!box)return;
  const sys=INSPECT_DEMO.systems.find(s=>s.id===INSPECT_DEMO._state.sys);
  if(!sys){box.innerHTML='<div style="font-size:11px;color:var(--weak);text-align:center;padding:18px 0">待选系统</div>';$('#idSkillCount').textContent='0 / 0';return;}
  const all=sys.skillIds;
  const matched=matchedIdx||all.map((_,i)=>i);
  box.innerHTML=matched.map(i=>{
    const sk=all[i];const isMain=sk===sys.mainSkill;
    let cls='',st='待匹配',barW='0%';
    if(stage==='match'){cls=i===runIdx?'match':'';st=i===runIdx?'已匹配':'待评估';barW=i<=runIdx?'30%':'0%';}
    else if(stage==='run'){cls=i===runIdx?'run':(i<runIdx?'run':'');st=i<runIdx?'已执行':(i===runIdx?'执行中...':'待执行');barW=i<runIdx?'100%':(i===runIdx?'50%':'0%');}
    else if(stage==='iter'){cls=i===runIdx?'iter':(i<runIdx?'run':'');st=i<runIdx?'已执行':(i===runIdx?'迭代中...':'已执行');barW=i<runIdx?'100%':(i===runIdx?'90%':'100%');}
    else if(stage==='done'){cls='run';st='已闭环';barW='100%';}
    return `<div class="id-skill ${cls}">
      <div class="ttl">${sk}${isMain?' ⭐':''}<span class="v">v1.0</span></div>
      <div class="sub">${isMain?'主修复 Skill · 自动收敛候选':'辅助诊断 · 上下文支撑'}</div>
      <div class="bar"><i style="width:${barW}"></i></div>
      <span class="st">${st}</span>
    </div>`;
  }).join('');
  $('#idSkillCount').textContent=`${Math.min((runIdx||0)+1,matched.length)} / ${matched.length}`;
}

// 追加对话消息
function _appendMsg(role,text,extra){
  const box=$('#idStream');if(!box)return;
  const div=document.createElement('div');div.className='id-msg '+role;
  const avMap={sys:'系统',user:'运维',thinking:'AI',bot:'AI',llm:'LLM'};
  const avMap2={sys:'S',user:'运',thinking:'T',bot:'B',llm:'L'};
  div.innerHTML=`<div class="av">${avMap2[role]||'A'}</div><div class="bub">${text}</div>`;
  box.appendChild(div);box.scrollTop=box.scrollHeight;
  if(extra&&extra.tags){
    const bub=div.querySelector('.bub');
    bub.insertAdjacentHTML('beforeend','<div class="chips">'+extra.tags.map(t=>`<span class="chip ${t.cls||''}">${t.n}</span>`).join('')+'</div>');
  }
  return div;
}

function _clearStream(){
  const box=$('#idStream');if(!box)return;
  box.innerHTML='';
}

function _updateFoot(text,state){
  if(text)$('#idFootInfo').textContent=text;
  const lb=$('#idLiveBadge'),lt=$('#idLiveText');
  if(state==='alert'){lb.classList.add('alert');lt.textContent='告警';}
  else if(state==='ok'){lb.classList.remove('alert');lt.textContent='已收敛';}
  else if(state==='normal'){lb.classList.remove('alert');lt.textContent='正常';}
}

function _tickTime(){
  if(!INSPECT_DEMO._state.running)return;
  const t=Math.floor((Date.now()-INSPECT_DEMO._state.startTs)/1000);
  const h=String(Math.floor(t/3600)).padStart(2,'0');
  const m=String(Math.floor(t/60)%60).padStart(2,'0');
  const s=String(t%60).padStart(2,'0');
  $('#idTimeBadge').textContent=`${h}:${m}:${s}`;
  setTimeout(_tickTime,500);
}

// 推送到飞书 webhook
async function _pushFeishu(report){
  try{
    const card={
      msg_type:'interactive',
      card:{
        config:{wide_screen_mode:true},
        header:{title:{tag:'plain_text',content:'【告警处置报告】'+report.title},template:'red'},
        elements:[
          {tag:'div',text:{tag:'lark_md',content:report.detail}},
          {tag:'hr'},
          {tag:'action',actions:[
            {tag:'button',text:{tag:'plain_text',content:'📸 一次链接 · 现场确认'},type:'primary',url:INSPECT_DEMO._state.linkUrl||'https://lark.cn/one-time/demo'},
          ]},
        ],
      },
    };
    // 真实推送 (CORS 受限时会失败,但不影响演示)
    const r=await fetch(INSPECT_DEMO.webhook,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(card),mode:'no-cors'});
    return {ok:true,status:'pushed'};
  }catch(e){
    return {ok:false,status:'simulated',err:String(e).slice(0,80)};
  }
}

// LLM 迭代 - 调用 MiniMax API
async function _callLLMIterate(skill,reason){
  const prompt=`你是一个数据中心 Agent 技能迭代专家。当前 Skill: ${skill}\n用户现场反馈: ${reason}\n请基于反馈优化此 Skill 的判定规则,返回 1 条核心规则变更建议(20 字内)。`;
  try{
    const r=await fetch(INSPECT_DEMO.llm.url+'/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+INSPECT_DEMO.llm.key},
      body:JSON.stringify({model:INSPECT_DEMO.llm.model,messages:[
        {role:'system',content:'你是 ToKen Matrix 数据中心 Skill 迭代助手。'},
        {role:'user',content:prompt},
      ],max_tokens:120,temperature:0.3}),
    });
    if(r.ok){
      const j=await r.json();
      return (j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content)||'基于反馈增加联动控制规则';
    }
  }catch(e){}
  // 兜底: 离线模拟
  return `基于反馈调整: ${reason.slice(0,12)} → 增加联动`;
}

function _sleep(ms){return new Promise(r=>setTimeout(r,ms));}

// 主流程
async function _runDemo(){
  if(INSPECT_DEMO._state.running)return;
  const sys=INSPECT_DEMO.systems.find(s=>s.id===INSPECT_DEMO._state.sys);
  const pi=INSPECT_DEMO._state.param;
  if(!sys||pi===null||pi===undefined){
    _appendMsg('bot','⚠ 请先在左侧选定一个系统及参数 (例如:BMS-电池系统 → 单体最大内阻)。');
    return;
  }
  const param=sys.params[pi];
  INSPECT_DEMO._state.running=true;
  INSPECT_DEMO._state.startTs=Date.now();
  INSPECT_DEMO._state.step=0;
  $('#idStartBtn').disabled=true;$('#idStartBtn').textContent='演示进行中...';
  _tickTime();
  _clearStream();
  _renderStepBar();_renderSkills('match',null,0);
  _updateFoot('告警已触发 · Agent 启动',null);

  // 步骤 1: 告警触发
  _appendMsg('user',`选定参数触发预警 · <span class="tag danger">${sys.ico}</span> ${sys.name} → <b>${param.n}</b> · ${param.danger}`);
  await _sleep(700);
  _appendMsg('thinking',`<span class="dots">Hermes 接收告警 · 触发级别 ${sys.level} · 关联域 ${sys.id}</span>`);
  await _sleep(900);
  _appendMsg('sys',`<span class="tag danger">实时透传</span> 检测到 <code>${param.n}</code> 越阈值 <code>${param.thr}${param.u}</code> → 当前值 <b style="color:#b91c1c">${param.v}${param.u}</b>。5 大系统已同步刷新 KPI 视图。`);
  // KPI 闪烁红
  _updateFoot('KPI 透传中 · 红色告警',null);
  $('#idLiveBadge').classList.add('alert');
  sys.kpi.forEach(k=>{
    if(k.s==='alert'){
      const el=document.querySelector(`#idKpiGrid .k[data-k="${k.n}"]`);
      if(el)el.classList.add('alert');
    }
  });
  await _sleep(800);
  _appendMsg('bot',`已确认 <code>${sys.name}</code> 域告警 · 拉取该域下 <b>${sys.skillIds.length} 个核心 Skill</b> 进行 SOP 匹配。`);
  INSPECT_DEMO._state.step=1;_renderStepBar();

  // 步骤 2: SOP 匹配
  _updateFoot('SOP 匹配中 · 125+ 流程检索',null);
  for(let i=0;i<sys.skillIds.length;i++){
    _appendMsg('thinking',`<span class="dots">${i+1}/${sys.skillIds.length} · 评估 Skill</span> <code>${sys.skillIds[i]}</code>${sys.skillIds[i]===sys.mainSkill?' ⭐ (主候选)':''} · 关联度 ${(95-i*4)}%`);
    _renderSkills('match',null,i);
    await _sleep(420);
  }
  await _sleep(400);
  _appendMsg('bot',`主修复 Skill 已锁定: <code>${sys.mainSkill}</code> · 历史收敛成功率 <b style="color:#047857">92%</b> · 自动执行路径开启。`);
  INSPECT_DEMO._state.step=2;_renderStepBar();

  // 步骤 3: Skill 执行
  _updateFoot('Skill 执行 · 自动修复中',null);
  const mainIdx=sys.skillIds.indexOf(sys.mainSkill);
  INSPECT_DEMO._state.mainIdx=mainIdx;
  for(let i=0;i<sys.skillIds.length;i++){
    const sk=sys.skillIds[i];const isMain=i===mainIdx;
    _appendMsg('thinking',`<span class="dots">调用 ${sk}</span>${isMain?' · 自动修复':' · 上下文诊断'}`);
    _renderSkills('run',null,i);
    await _sleep(isMain?650:380);
    if(isMain){
      _appendMsg('bot',`<span class="tag ok">AUTO</span> <code>${sk}</code> 自动下发修复指令:\n<b>${param.n}</b> 触发收敛条件 → 已调整相关控制参数。KPI 实时刷新中...`);
      // KPI 翻转修复
      sys.kpi.forEach(k=>{
        const el=document.querySelector(`#idKpiGrid .k[data-k="${k.n}"]`);
        if(el&&k.finalS==='fix'){
          el.classList.remove('alert');el.classList.add('fix');
          const b=el.querySelector('b');b.innerHTML=`${k.final}${k.u?` <span class="u">${k.u}</span>`:''}`;
        }
      });
      $('#idLiveBadge').classList.remove('alert');
    }
  }
  await _sleep(600);
  _appendMsg('bot',`<span class="tag ok">修复完成</span> KPI 已收敛至安全阈值 · 生成 <b>处置报告</b> 待推送飞书。`);
  INSPECT_DEMO._state.step=3;_renderStepBar();

  // 步骤 4: 飞书推送
  _updateFoot('飞书 webhook 推送中',null);
  const oneTimeId='cc42-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);
  INSPECT_DEMO._state.lastToken=oneTimeId;
  // 告警上下文:用于 confirm.html 渲染
  const ctxObj={
    level:sys.level,
    time:new Date().toLocaleString('zh-CN',{hour12:false}),
    skill:sys.mainSkill,
    dev:param.n,
    desc:`系统域 <b>${sys.name}</b> 告警 → 参数 <code>${param.k}</code> 触发:<br><b>${param.danger}</b><br>主修复 Skill <code>${sys.mainSkill}</code> 已完成自动收敛,KPI 已恢复至安全阈值。`,
    meta:[
      {k:'系统',v:sys.name},
      {k:'设备',v:param.n},
      {k:'阈值',v:param.thr+param.u},
      {k:'主Skill',v:sys.mainSkill},
      {k:'辅助',v:sys.skillIds.length+'个'},
    ],
    ts:Date.now(),
    host:'console',
  };
  // 存到 localStorage(同源时 confirm.html 可读)
  try{localStorage.setItem('tkm_c_'+oneTimeId,JSON.stringify(ctxObj));}catch(e){}
  // 链接:优先用 query 参数(短小可靠),用 encodeURIComponent
  const qs=encodeURIComponent(JSON.stringify(ctxObj));
  INSPECT_DEMO._state.linkUrl=`http://127.0.0.1:8766/confirm.html?token=${oneTimeId}&d=${qs}`;
  // 也保留短链(群里显示)
  INSPECT_DEMO._state.shortUrl=`http://127.0.0.1:8766/confirm.html?token=${oneTimeId}`;
  const report={
    title:`${sys.ico} ${sys.name} · ${param.n} ${sys.level} 告警收敛`,
    detail:`**告警时间**: ${new Date().toLocaleString('zh-CN',{hour12:false})}\n**系统**: ${sys.name}\n**设备**: ${param.n}\n**参数**: ${param.danger}\n**主 Skill**: \`${sys.mainSkill}\`\n**调用辅助**: ${sys.skillIds.length} 个\n**修复结果**: 全部参数已收敛至安全阈值\n**通知**: @任承智 · 30min 内有效 · 点击下方一次链接拍照确认`,
  };
  const fh=await _pushFeishu(report);
  // 在对话流中渲染飞书群聊通知卡片(可点击的真实链接)
  _appendMsg('sys',`<span class="tag ok">飞书群聊</span> 报告已推送 · webhook ${fh.status} ${fh.ok?'✓':'(模拟)'}`);
  const feishuCard=document.createElement('div');feishuCard.className='id-msg sys';
  feishuCard.innerHTML=`<div class="av">S</div><div class="bub">
    <div class="feishu-card">
      <div class="head">
        <div class="bot-ico">飞</div>
        <b>ToKen Bot</b>
        <small>刚刚 · 运维-数据中心群</small>
      </div>
      <div class="body">
        <b>【${sys.level} 告警收敛】</b> <span class="alert-line">${sys.name} · ${param.n}</span><br>
        ⚠ ${param.danger}<br>
        <b>主修复 Skill:</b> <code>${sys.mainSkill}</code><br>
        <b>辅助诊断:</b> ${sys.skillIds.length} 个 · <b>耗时:</b> 3.2s<br>
        ✓ KPI 已收敛至安全阈值<br>
        <b>@任承智</b> 请到现场拍照确认
      </div>
      <div class="actions">
        <a class="act green" href="${INSPECT_DEMO._state.linkUrl}" target="_blank">📸 一次链接 · 拍照确认</a>
        <a class="act" href="${INSPECT_DEMO._state.linkUrl}" target="_blank">📋 查看详情</a>
        <button class="act gray" onclick="this.textContent='✓ 已 @';this.disabled=true">📨 @任承智</button>
      </div>
    </div>
  </div>`;
  $('#idStream').appendChild(feishuCard);
  $('#idStream').scrollTop=$('#idStream').scrollHeight;
  // 写入主面板飞书日志
  if(window.layer2&&window.layer2.feishu){
    window.layer2.feishu.unshift({t:new Date().toLocaleTimeString('zh-CN',{hour12:false}),type:'alert',icon:'警',msg:`【${sys.level} 告警】${param.n} ${param.danger}`,conf:0.91,detail:`主 Skill ${sys.mainSkill} · 一次链接 ${INSPECT_DEMO._state.linkUrl}`});
    if(window.layer2.feishu.length>10)window.layer2.feishu.pop();
    if(typeof window.renderFeishuLog==='function')window.renderFeishuLog();
  }
  await _sleep(700);
  INSPECT_DEMO._state.step=4;_renderStepBar();

  // 步骤 5: 一次链接
  _updateFoot('等待现场确认 · @任承智',null);
  _appendMsg('bot',`<b>一次链接已生成</b> · 30min 有效 · 任承智可点击下方"📋 在此确认"按钮,上传现场照片并填写反馈。Agent 将自动监听反馈。`);
  // 在对话流中渲染"现场确认"快捷操作
  const linkBubble=document.createElement('div');linkBubble.className='id-msg bot';
  linkBubble.innerHTML=`<div class="av">B</div><div class="bub">
    <div class="id-msg-t">${new Date().toLocaleTimeString('zh-CN',{hour12:false})} · ToKen Bot</div>
    <div class="id-msg-c">📬 飞书群聊已推送一次链接至运维群(共 5 人,任承智已 @), 30 分钟内有效。请任承智到场后通过以下任一方式反馈:</div>
    <div class="id-msg-actions" style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
      <button class="id-btn primary" id="idOpenInlineBtn" style="border:0;cursor:pointer;font-size:12px;padding:8px 12px">📋 在此确认 (上传照片+反馈)</button>
      <a class="id-btn" id="idOpenWinBtn" href="${INSPECT_DEMO._state.linkUrl}" target="_blank" style="text-decoration:none;font-size:12px;padding:8px 12px;display:inline-flex;align-items:center;gap:4px">🔗 在新窗口打开</a>
      <button class="id-btn" id="idCopyLinkBtn" style="border:0;cursor:pointer;font-size:12px;padding:8px 12px">📎 复制短链</button>
    </div>
    <div class="id-msg-foot">token: <code>${oneTimeId}</code> · 链接: <a href="${INSPECT_DEMO._state.linkUrl}" target="_blank" style="color:#0ea5e9;word-break:break-all">${INSPECT_DEMO._state.linkUrl.length>80?INSPECT_DEMO._state.linkUrl.slice(0,80)+'...':INSPECT_DEMO._state.linkUrl}</a></div>
  </div>`;
  $('#idStream').appendChild(linkBubble);
  $('#idStream').scrollTop=$('#idStream').scrollHeight;
  // 绑定内嵌确认按钮:打开演示弹窗内的内嵌确认面板
  const openInline=()=>{
    $('#idLinkSub').textContent=`@任承智 · ${sys.name} ${param.n} ${sys.level} 告警 · 请到现场确认修复`;
    $('#idLinkDesc').textContent=`${param.danger} · 主修复 Skill: ${sys.mainSkill} · 30 分钟内有效。任承智到场拍照后请选择反馈结果。`;
    $('#idLinkUrl').textContent=INSPECT_DEMO._state.linkUrl;
    $('#idLinkUrl').setAttribute('data-url',INSPECT_DEMO._state.linkUrl);
    $('#idLinkUpload').classList.remove('has');
    $('#idUploadText').textContent='点击上传现场照片 (修复确认)';
    $('#idLinkFeedback').value='';
    $('#idLinkMask').classList.add('open');
    _updateFoot('等待 @任承智 现场反馈',null);
  };
  linkBubble.querySelector('#idOpenInlineBtn').addEventListener('click',openInline);
  linkBubble.querySelector('#idCopyLinkBtn').addEventListener('click',(e)=>{
    e.preventDefault();
    try{
      const ta=document.createElement('textarea');ta.value=INSPECT_DEMO._state.linkUrl;
      document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);
    }catch(_){}
    e.target.textContent='✓ 已复制';setTimeout(()=>e.target.textContent='📎 复制短链',1500);
  });
  // 自动弹出内嵌确认(让用户直接看到反馈面板,无需多点击一次)
  setTimeout(openInline,600);
  INSPECT_DEMO._state.step=5;_renderStepBar();
}

// 内嵌确认面板 → 主流程
async function _onLinkConfirm(isOK){
  const sys=INSPECT_DEMO.systems.find(s=>s.id===INSPECT_DEMO._state.sys);
  const pi=INSPECT_DEMO._state.param;
  const param=sys.params[pi];
  const uploadTxt=$('#idUploadText').textContent;
  const hasPhoto=uploadTxt.indexOf('已上传')>=0;
  const fbTxt=$('#idLinkFeedback').value.trim();
  // 把结果写入 localStorage,供外部 confirm.html/其他 tab 同步
  try{
    const rk='tkm_c_'+INSPECT_DEMO._state.lastToken+'_result';
    localStorage.setItem(rk,JSON.stringify({ok:isOK,fb:fbTxt,pics:hasPhoto?1:0,ts:Date.now()}));
  }catch(_){}
  $('#idLinkMask').classList.remove('open');
  _appendMsg('user',isOK?(hasPhoto?`📷 现场照片已上传 · 确认修复完成${fbTxt?' · 备注:'+fbTxt:''}`:`✓ 确认修复完成${fbTxt?' · 备注:'+fbTxt:''}`):`⚠ 反馈需调整 · ${fbTxt||'自动修复后参数仍波动,需要人工介入'}`);
  await _sleep(600);
  _appendMsg('thinking',`<span class="dots">回收反馈 · ${isOK?'已闭环':'需迭代'}</span> · 上传至 Skill 优化队列`);
  await _sleep(500);

  // 步骤 6: 人工反馈
  if(window.layer2&&window.layer2.feishu){
    window.layer2.feishu.unshift({t:new Date().toLocaleTimeString('zh-CN',{hour12:false}),type:'feedback',icon:'反',msg:`【${isOK?'确认':'反馈'}】${param.n} ${isOK?'已修复完成':'需调整'}${fbTxt?' · '+fbTxt:''}`,conf:0,detail:hasPhoto?'含现场照片':'文字反馈'});
    if(typeof window.renderFeishuLog==='function')window.renderFeishuLog();
  }
  INSPECT_DEMO._state.step=6;_renderStepBar();
  _updateFoot('反馈已回收 · 准备 LLM 迭代',null);

  // 步骤 7: LLM 迭代
  _appendMsg('llm',`<span class="tag llm">LLM</span> <b>${INSPECT_DEMO.llm.model}</b> 接入 · 接收反馈 → 调用 Skill 优化接口`);
  await _sleep(500);
  _appendMsg('llm',`<span class="dots">分析反馈 + 历史数据 → 生成新规则</span>`);
  // 调用 LLM (可能离线,采用 fallback)
  const reason=isOK?`已修复:${param.k}=${param.v}${param.u} → 收敛`:`反馈:${fbTxt||'自动修复后参数波动,需增强风速联动'}`;
  const rule=await _callLLMIterate(sys.mainSkill,reason);
  await _sleep(400);
  _appendMsg('llm',`<span class="tag llm">规则生成</span> ${rule}`);
  // 模拟版本号
  const fromVer='v1.0',toVer='v1.1';
  INSPECT_DEMO._state.iterSkill=sys.mainSkill;
  INSPECT_DEMO._state.iterFrom=fromVer;
  INSPECT_DEMO._state.iterTo=toVer;
  INSPECT_DEMO._state.iterReason=rule;
  INSPECT_DEMO._state.iterGain=isOK?'+12%':'+18%';
  _appendMsg('llm',`<span class="tag llm">迭代提交</span> <code>${sys.mainSkill}</code> <code>${fromVer}</code> → <code style="color:#9d174d">${toVer}</code> · 增益 <b style="color:#047857">${INSPECT_DEMO._state.iterGain}</b> · 规则:<i>${rule}</i>`);
  await _sleep(300);
  // 构造 diff 数据
  const oldRules=[
    {k:'判定阈值',v:`${param.k} > ${param.thr}${param.u} 时触发`},
    {k:'修复策略',v:'单参数控制(降低 5%)'},
    {k:'收敛条件',v:`${param.k} < ${param.thr}${param.u}`},
    {k:'联动范围',v:'仅本设备'},
  ];
  const newRules=[
    {k:'判定阈值',v:`${param.k} > ${param.thr}${param.u} 时触发(增加连续 3 次确认)`},
    {k:'修复策略',v:'多参数联动 + 预测性降载 + 风速联动'},
    {k:'收敛条件',v:`${param.k} < ${param.thr-0.1}${param.u} (留 5% 安全余量)`},
    {k:'联动范围',v:`本设备 + 关联 ${Math.min(sys.skillIds.length,3)} 个 Skill`},
  ];
  // Skill 升级 diff 详情卡片(在对话流中)
  const diffCard=document.createElement('div');diffCard.className='id-msg llm';
  diffCard.innerHTML=`<div class="av">L</div><div class="bub">
    <div class="skill-diff">
      <div class="head">
        <div class="sk"><i>⚡</i>${sys.mainSkill}</div>
        <div class="ver"><code>${fromVer}</code> → <code>${toVer}</code> <b>已激活</b></div>
      </div>
      ${oldRules.map((o,i)=>{const n=newRules[i];return `<div class="row">
        <div class="col del"><small>v1.0 · 旧规则</small>${o.k}: <b>${o.v}</b></div>
        <div class="arr">→</div>
        <div class="col add"><small>v1.1 · 新规则</small>${n.k}: <b>${n.v}</b></div>
      </div>`}).join('')}
      <div class="stats">
        <div class="s"><small>收敛时间</small><b>-32%</b></div>
        <div class="s"><small>误报率</small><b>-58%</b></div>
        <div class="s"><small>覆盖率</small><b>+24%</b></div>
        <div class="s"><small>综合增益</small><b>${INSPECT_DEMO._state.iterGain}</b></div>
      </div>
      <div class="gain">✨ 优化点: 基于任承智反馈"<i>${reason.slice(0,18)}${reason.length>18?'...':''}</i>" 生成 · 已联动 <code>${sys.skillIds.slice(0,3).join('</code>+<code>')}</code> 三个 Skill · 归档至 RAG 知识库</div>
    </div>
  </div>`;
  $('#idStream').appendChild(diffCard);
  $('#idStream').scrollTop=$('#idStream').scrollHeight;

  // 写入主面板 iterLog
  if(window.layer2&&window.layer2.iterLog){
    window.layer2.iterLog.unshift({t:new Date().toLocaleTimeString('zh-CN',{hour12:false}).slice(0,5),s:sys.mainSkill,from:fromVer,to:toVer,reason:rule,gain:INSPECT_DEMO._state.iterGain});
    if(window.layer2.iterLog.length>10)window.layer2.iterLog.pop();
    if(typeof window.renderIterLog==='function')window.renderIterLog();
  }
  _renderSkills('iter',null,INSPECT_DEMO._state.mainIdx);
  await _sleep(700);
  _appendMsg('bot',`<span class="tag ok">完成</span> Skill 迭代已落库 · 同步推送至 7 步闭环 · 7 步计划已记录日志。`);

  // 高亮主面板 7 步流水线
  if(typeof window._pipeStep!=='undefined'){window._pipeStep=7;setTimeout(()=>{if(typeof window._animatePipe==='function')window._animatePipe();},50);}
  // 同步主面板告警时间线
  if(window.layer2&&window.layer2.alerts){
    window.layer2.alerts.unshift({time:new Date().toLocaleTimeString('zh-CN',{hour12:false}),level:sys.level,sys:sys.id,dev:param.n,msg:param.danger,skill:sys.mainSkill,st:'AI闭环',cls:'ok'});
    if(window.layer2.alerts.length>12)window.layer2.alerts.pop();
    if(typeof window.renderAlertTimeline==='function')window.renderAlertTimeline();
  }

  INSPECT_DEMO._state.step=7;_renderStepBar();
  _updateFoot('演示完成 · 7 步闭环已落库',null);
  _appendMsg('bot',`<b style="color:#047857">✔ 7 步闭环完成</b> · 告警已收敛 · 迭代日志已记录于 Agent 管理 7 步计划。点击"确认"关闭对话框。`);
  $('#idStartBtn').disabled=false;$('#idStartBtn').textContent='✔ 确认并关闭';
  // 同步到主面板 Skill 库 / RAG 归档
  if(typeof window._addSkillLibItem==='function'){
    window._addSkillLibItem({
      name:sys.mainSkill,
      from:fromVer,
      to:toVer,
      reason:rule,
      gain:INSPECT_DEMO._state.iterGain,
      param:param,
      oldRules:oldRules,
      newRules:newRules,
      sys:sys,
      ts:Date.now(),
    });
  }
  if(typeof window._addRagItem==='function'){
    window._addRagItem({
      title:`${sys.name} ${param.n} 告警收敛经验`,
      sys:sys.id,
      skill:sys.mainSkill,
      paper:`${sys.name} ${param.n} ${sys.level} 告警处理 SOP`,
      gain:INSPECT_DEMO._state.iterGain,
      ts:Date.now(),
    });
  }
  INSPECT_DEMO._state.running=false;
}

/* Skill 库 / RAG 归档 · 主面板渲染 */
const _SK_LIB=(window._SK_LIB=window._SK_LIB||[]);
const _RAG=(window._RAG=window._RAG||[]);

window._addSkillLibItem=function(rec){
  _SK_LIB.unshift(rec);
  if(_SK_LIB.length>8)_SK_LIB.pop();
  const elEmpty=$('#skLibEmpty');if(elEmpty)elEmpty.style.display='none';
  const list=$('#skLibList');if(!list)return;
  const html=_SK_LIB.map((s,i)=>{
    const sysIco=(s.sys&&s.sys.ico)||'S';
    return `<div class="item new" data-i="${i}" onclick="window._openSkillDetail(${i})">
      <b style="color:var(--ico-c);font-size:11px">${sysIco}</b>
      <span class="nm">${s.name}</span>
      <span class="v">${s.from} → ${s.to}</span>
      <span class="ar">›</span>
    </div>`;
  }).join('');
  list.innerHTML=html;
  const ct=$('#skLibCount');if(ct)ct.textContent=_SK_LIB.length+' 项';
};
window._addRagItem=function(rec){
  _RAG.unshift(rec);
  if(_RAG.length>8)_RAG.pop();
  const elEmpty=$('#ragEmpty');if(elEmpty)elEmpty.style.display='none';
  const list=$('#ragList');if(!list)return;
  const html=_RAG.map((r,i)=>{
    return `<div class="item new" data-i="${i}">
      <b style="color:#9d174d;font-size:11px">📚</b>
      <span class="nm">${r.paper}</span>
      <span class="v">${r.gain}</span>
    </div>`;
  }).join('');
  list.innerHTML=html;
  const ct=$('#ragCount');if(ct)ct.textContent=_RAG.length+' 篇';
};
window._openSkillDetail=function(i){
  const s=_SK_LIB[i];if(!s)return;
  $('#skDIco').textContent=(s.sys&&s.sys.ico)||'⚡';
  $('#skDName').textContent=s.name;
  $('#skDMeta').innerHTML=`
    <div class="m">系统: <b>${s.sys?s.sys.name:'--'}</b></div>
    <div class="m">设备: <b>${s.param?s.param.n:'--'}</b></div>
    <div class="m">${s.from} → <b>${s.to}</b></div>
    <div class="m">增益: <b style="color:#047857">${s.gain}</b></div>
  `;
  $('#skDDiff').innerHTML=(s.oldRules||[]).map((o,j)=>{
    const n=(s.newRules||[])[j]||{k:o.k,v:o.v};
    return `<div class="col old"><h6>v1.0 旧规则</h6><p>${o.k}: <del>${o.v}</del></p></div>
            <div class="col new"><h6>v1.1 新规则</h6><p>${n.k}: <ins>${n.v}</ins></p></div>`;
  }).join('');
  $('#skDStats').innerHTML=`
    <div class="s"><small>收敛时间</small><b class="pos">-32%</b></div>
    <div class="s"><small>误报率</small><b class="pos">-58%</b></div>
    <div class="s"><small>覆盖率</small><b class="pos">+24%</b></div>
    <div class="s"><small>综合增益</small><b class="pos">${s.gain}</b></div>
  `;
  const t=new Date(s.ts||Date.now()).toLocaleString('zh-CN',{hour12:false});
  $('#skDLog').innerHTML=`
    <p>📅 <b>迭代时间</b>: ${t}</p>
    <p>🤖 <b>LLM</b>: <code>${(window.INSPECT_DEMO&&INSPECT_DEMO.llm&&INSPECT_DEMO.llm.model)||'MiniMax-M2.7-highspeed'}</code></p>
    <p>📝 <b>触发反馈</b>: ${s.reason||'--'}</p>
    <p>🔗 <b>关联 Skill</b>: ${(s.sys&&s.sys.skillIds||[]).slice(0,3).map(x=>'<code>'+x+'</code>').join(' + ')||'--'}</p>
    <p>📦 <b>归档</b>: 已落库至 Skill 库 + RAG 知识库</p>
  `;
  $('#skDetailMask').classList.add('open');
};
// 关闭弹窗
document.addEventListener('click',(e)=>{
  if(e.target.id==='skDClose'||e.target.id==='skDetailMask'){
    $('#skDetailMask').classList.remove('open');
  }
});

async function _closeDemo(){
  $('#inspectDemoMask').classList.remove('open');
  INSPECT_DEMO._state.running=false;
  INSPECT_DEMO._state.step=0;
  $('#idStartBtn').disabled=false;$('#idStartBtn').textContent='▶ 启动演示';
  _updateFoot('就绪 · 待选择告警源','normal');
  _renderStepBar();_renderSkills('match',null,0);
}

function _resetDemo(){
  INSPECT_DEMO._state.running=false;INSPECT_DEMO._state.step=0;INSPECT_DEMO._state.sys=null;INSPECT_DEMO._state.param=null;
  $('#idStartBtn').disabled=false;$('#idStartBtn').textContent='▶ 启动演示';
  _clearStream();
  _appendMsg('bot',`已重置 · 请重新在左侧选定告警源。`);
  _renderSysList();_renderKpi();_renderStepBar();_renderSkills('match',null,0);
  _updateFoot('就绪 · 待选择告警源','normal');
}

// 初始化
function _initInspectDemo(){
  const mask=$('#inspectDemoMask');if(!mask)return;
  // 打开
  $('#inspectDemoBtn').addEventListener('click',()=>{
    mask.classList.add('open');
    _renderSysList();_renderKpi();_renderStepBar();_renderSkills('match',null,0);
    _updateFoot('就绪 · 待选择告警源','normal');
  });
  $('#idClose').addEventListener('click',_closeDemo);
  $('#idStartBtn').addEventListener('click',()=>{
    if(INSPECT_DEMO._state.running)return;
    const btn=$('#idStartBtn');
    if(btn.textContent.includes('确认')){
      // 闭环完成后:关闭演示弹窗
      _closeDemo();
      btn.textContent='▶ 启动演示';
      return;
    }
    _runDemo();
  });
  $('#idResetBtn').addEventListener('click',_resetDemo);
  // 一次链接
  $('#idLinkUpload').addEventListener('click',()=>$('#idLinkFile').click());
  $('#idLinkFile').addEventListener('change',e=>{
    const f=e.target.files&&e.target.files[0];
    if(f){
      $('#idUploadText').textContent='✓ 已上传 · '+f.name;
      $('#idLinkUpload').classList.add('has');
    }
  });
  $('#idLinkUrl').addEventListener('click',()=>{
    const url=$('#idLinkUrl').textContent;
    if(navigator.clipboard)navigator.clipboard.writeText(url).catch(()=>{});
  });
  $('#idLinkYes').addEventListener('click',()=>_onLinkConfirm(true));
  $('#idLinkNo').addEventListener('click',()=>_onLinkConfirm(false));
  // ESC 关闭
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#idLinkMask').classList.remove('open');_closeDemo();}});
}
_initInspectDemo();

