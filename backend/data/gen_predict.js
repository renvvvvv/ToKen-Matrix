// 生成一天(5min 采样) 的机房预测数据
const fs = require('fs');
const path = require('path');

const N = 288; // 24h * 60 / 5min
const t0 = new Date('2026-06-27T00:00:00');

// 简易伪随机 (mulberry32) 保证可复现
function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260627);
const noise = (a, p) => a + (rng() - 0.5) * 2 * p;

// 高斯型日变化 (日间负载高, 夜间低)
const daily = (i, peakHour = 14, amp = 1, base = 0) => {
  const hour = (i * 5) / 60;
  const d = Math.cos((hour - peakHour) / 24 * 2 * Math.PI);
  return base + amp * (0.5 - 0.5 * d);
};

// 时间标签
const times = [];
for (let i = 0; i < N; i++) {
  const t = new Date(t0.getTime() + i * 5 * 60 * 1000);
  times.push(t.toISOString().slice(11, 16)); // HH:MM
}

// =========== BMS 电池系统 ===========
const bms = {
  soc: [], soh: [],
  pack_voltage: [], pack_current: [],
  cell_max_temp: [], cell_max_resistance: [],
  cluster_diff: [], cycles: [],
  charge_discharge_state: []
};
for (let i = 0; i < N; i++) {
  const t = i / N;
  bms.soc.push(+noise(95.5 - t * 1.2 + Math.sin(i / 24) * 0.6, 0.4).toFixed(2));
  bms.soh.push(+noise(96.0 - t * 0.05, 0.05).toFixed(2));
  bms.pack_voltage.push(+noise(53.6 + Math.sin(i / 20) * 0.3, 0.15).toFixed(2));
  bms.pack_current.push(+noise(daily(i, 14, 60, 80), 8).toFixed(1));
  bms.cell_max_temp.push(+noise(28 + daily(i, 14, 4, 0), 0.4).toFixed(1));
  bms.cell_max_resistance.push(+noise(0.35 + t * 0.03 + Math.sin(i / 12) * 0.02, 0.02).toFixed(3));
  bms.cluster_diff.push(+noise(15 + Math.sin(i / 18) * 5, 2).toFixed(0));
  bms.cycles.push(386 + Math.floor(i / 30));
  bms.charge_discharge_state.push(bms.pack_current[i] > 0 ? '放电' : '浮充');
}

// =========== 动环 ENV ===========
const env = {
  cold_aisle_temp: [], hot_aisle_temp: [],
  humidity: [], pressure_diff: [],
  ups_load: [], pdu_load: [],
  pue: [], it_load: []
};
for (let i = 0; i < N; i++) {
  env.cold_aisle_temp.push(+noise(22 + daily(i, 14, 1.5, 0), 0.4).toFixed(1));
  env.hot_aisle_temp.push(+noise(28 + daily(i, 14, 3, 0), 0.5).toFixed(1));
  env.humidity.push(+noise(45 + daily(i, 8, 5, 0), 1).toFixed(1));
  env.pressure_diff.push(+noise(12 + Math.sin(i / 16) * 2, 0.8).toFixed(1));
  env.ups_load.push(+noise(72 + daily(i, 14, 12, 0), 2).toFixed(1));
  env.pdu_load.push(+noise(58 + daily(i, 14, 14, 0), 2.5).toFixed(1));
  env.pue.push(+noise(1.32 + daily(i, 14, 0.08, 0), 0.02).toFixed(3));
  env.it_load.push(+noise(daily(i, 14, 180, 420), 12).toFixed(0));
}

// =========== 消防 FIRE ===========
const fire = {
  smoke_value: [], water_pressure: [],
  pump_status: [], valve_status: [],
  gas_level: [], emergency_light: []
};
for (let i = 0; i < N; i++) {
  fire.smoke_value.push(+noise(8 + Math.random() * 4, 1).toFixed(1));
  fire.water_pressure.push(+noise(4.2 + Math.sin(i / 30) * 0.1, 0.05).toFixed(2));
  fire.pump_status.push(i === 142 ? '启动' : '待机');
  fire.valve_status.push(i === 200 ? '关闭测试' : '正常开启');
  fire.gas_level.push(+noise(95 - i * 0.005, 0.2).toFixed(1));
  fire.emergency_light.push(i % 1440 < 480 ? '夜间模式' : '日间模式');
}

// =========== 安防 SECURITY ===========
const sec = {
  access_events: [], card_swipes: [],
  visitor_count: [], patrol_completed: [],
  camera_online: [], motion_alerts: []
};
for (let i = 0; i < N; i++) {
  const hour = (i * 5) / 60;
  const isWorkHour = hour >= 8 && hour <= 19;
  const freq = isWorkHour ? 12 : 2;
  sec.access_events.push(Math.max(0, Math.round(noise(freq, 2))));
  sec.card_swipes.push(Math.max(0, Math.round(noise(freq * 0.8, 1.5))));
  sec.visitor_count.push(isWorkHour ? Math.max(0, Math.round(noise(3, 1))) : 0);
  sec.patrol_completed.push(i % 36 === 0 ? 1 : 0);
  sec.camera_online.push(128 - (i === 80 ? 1 : (i === 200 ? 2 : 0)));
  sec.motion_alerts.push(i === 150 ? 1 : 0);
}

// =========== BA 楼宇自动化 ===========
const ba = {
  chiller_load: [], ahu_status: [],
  lighting: [], energy_total: [],
  free_cooling: [], occupancy: []
};
for (let i = 0; i < N; i++) {
  const hour = (i * 5) / 60;
  const isWorkHour = hour >= 8 && hour <= 19;
  ba.chiller_load.push(+noise(45 + daily(i, 14, 25, 0), 3).toFixed(1));
  ba.ahu_status.push(isWorkHour ? 8 : 5);
  ba.lighting.push(+noise(isWorkHour ? 65 : 22, 4).toFixed(1));
  ba.energy_total.push(+noise(daily(i, 14, 800, 2400), 60).toFixed(0));
  ba.free_cooling.push(hour >= 22 || hour <= 6 ? 100 : 30 + Math.random() * 30);
  ba.occupancy.push(isWorkHour ? Math.max(0, Math.round(noise(45, 6))) : Math.max(0, Math.round(noise(8, 3))));
}

// =========== 告警事件 (24h 内) ===========
const alerts = [
  { id: 'A-20260627-001', time: '02:15', system: 'bms', level: 'P1', device: 'BMS-F2-03#', msg: '簇间电压差 38mV 超过阈值', skill: 'bms/cluster-balance', state: '已收敛', auto: true, conf: 0.92 },
  { id: 'A-20260627-002', time: '03:42', system: 'env', level: 'P1', device: 'CRAC-2#', msg: '出风温度 18.2℃ 偏离基线 1.5℃', skill: 'env/crac-cool', state: '已收敛', auto: true, conf: 0.88 },
  { id: 'A-20260627-003', time: '07:08', system: 'security', level: 'P2', device: 'CARD-08#', msg: '非工作时间刷卡 1 次', skill: 'security/access-control', state: '已派单', auto: false, conf: null },
  { id: 'A-20260627-004', time: '09:36', system: 'bms', level: 'P1', device: 'BMS-F2-12#', msg: '单体最大内阻 0.42mΩ', skill: 'bms/active-balance', state: '已收敛', auto: true, conf: 0.94 },
  { id: 'A-20260627-005', time: '11:12', system: 'env', level: 'P0', device: 'RACK-F3-R12', msg: '机柜进风温度 32.6℃', skill: 'env/rack-temp', state: 'AI闭环', auto: true, conf: 0.91 },
  { id: 'A-20260627-006', time: '13:55', system: 'fire', level: 'P2', device: 'SPRINKLER-Z4', msg: '喷淋压力 3.8bar 偏低', skill: 'fire/valve-status', state: '已派单', auto: false, conf: null },
  { id: 'A-20260627-007', time: '14:21', system: 'env', level: 'P1', device: 'UPS-B', msg: 'UPS 负载率 87%', skill: 'env/ups-bypass', state: '已收敛', auto: true, conf: 0.83 },
  { id: 'A-20260627-008', time: '16:48', system: 'bms', level: 'P1', device: 'BMS-F2-07#', msg: 'SOC 95% 触发上限预警', skill: 'bms/soc-balance', state: '已收敛', auto: true, conf: 0.89 },
  { id: 'A-20260627-009', time: '18:30', system: 'ba', level: 'P2', device: 'AHU-3#', msg: '机组滤网压差 240Pa', skill: 'ba/ahu-start', state: '已派单', auto: false, conf: null },
  { id: 'A-20260627-010', time: '20:12', system: 'env', level: 'P1', device: 'CRAC-5#', msg: '回风湿度 58% 偏高', skill: 'env/dehumidify', state: 'AI闭环', auto: true, conf: 0.86 },
  { id: 'A-20260627-011', time: '22:05', system: 'security', level: 'P1', device: 'CAM-128', msg: '摄像机掉线 2 路', skill: 'cctv/link-check', state: 'AI闭环', auto: true, conf: 0.95 },
  { id: 'A-20260627-012', time: '23:48', system: 'fire', level: 'P0', device: 'SMOKE-F1-A12', msg: '烟感误报 (灰尘)', skill: 'fire/smoke-typo', state: '已收敛', auto: true, conf: 0.79 },
];

// =========== AI 巡检报告 (每 4h 一次 = 6 次) ===========
const inspections = [
  { time: '04:00', score: 96, abnormal: 0, items: 184, summary: '夜间各系统平稳,无异常' },
  { time: '08:00', score: 93, abnormal: 1, items: 184, summary: '安保刷卡有 1 条非工作时段,已记录' },
  { time: '12:00', score: 89, abnormal: 2, items: 184, summary: 'F3 机柜温度预警,CRAC-2# 自动调节已生效' },
  { time: '16:00', score: 91, abnormal: 1, items: 184, summary: 'UPS-B 负载短暂越限,已自动切分' },
  { time: '20:00', score: 94, abnormal: 1, items: 184, summary: '烟感误报 1 起,粉尘聚类识别已派单擦拭' },
  { time: '24:00', score: 95, abnormal: 0, items: 184, summary: '晚间全系统指标恢复绿区' },
];

// =========== Skill 执行闭环 ===========
const skillRuns = [
  { alert: 'A-20260627-001', skill: 'bms/cluster-balance', version: 'v1.4', execMs: 1280, result: '簇间电压差 38→15mV', conf: 0.92, feishu: true, userConfirm: 'one-time-link-9a3b', feedback: 'ok' },
  { alert: 'A-20260627-002', skill: 'env/crac-cool', version: 'v2.4', execMs: 940, result: '出风回正 18.2→20.5℃', conf: 0.88, feishu: true, userConfirm: 'one-time-link-7b21', feedback: 'ok' },
  { alert: 'A-20260627-004', skill: 'bms/active-balance', version: 'v1.2', execMs: 1620, result: '均衡启动,内阻回落到 0.36mΩ', conf: 0.94, feishu: true, userConfirm: 'one-time-link-3f88', feedback: 'ok' },
  { alert: 'A-20260627-005', skill: 'env/rack-temp', version: 'v1.0', execMs: 720, result: 'CRAC-2# 出风 -1.5℃', conf: 0.91, feishu: true, userConfirm: 'one-time-link-cc42', feedback: 'modified' },
  { alert: 'A-20260627-007', skill: 'env/ups-bypass', version: 'v1.0', execMs: 1840, result: '切分至 UPS-A,负载 87%→58%', conf: 0.83, feishu: true, userConfirm: 'one-time-link-2d77', feedback: 'ok' },
  { alert: 'A-20260627-008', skill: 'bms/soc-balance', version: 'v1.0', execMs: 1100, result: 'SOC 95%→89% 主动放电', conf: 0.89, feishu: true, userConfirm: 'one-time-link-44f1', feedback: 'ok' },
  { alert: 'A-20260627-010', skill: 'env/dehumidify', version: 'v1.0', execMs: 880, result: '湿度 58%→47%', conf: 0.86, feishu: true, userConfirm: 'one-time-link-8a05', feedback: 'ok' },
  { alert: 'A-20260627-011', skill: 'cctv/link-check', version: 'v1.4', execMs: 600, result: 'PoE 通道重连成功', conf: 0.95, feishu: true, userConfirm: 'one-time-link-e6b9', feedback: 'ok' },
  { alert: 'A-20260627-012', skill: 'fire/smoke-typo', version: 'v1.0', execMs: 1500, result: '灰尘聚类识别,推送擦拭工单', conf: 0.79, feishu: true, userConfirm: 'pending', feedback: null },
];

// =========== Skill 迭代记录 (LLM 版本更新) ===========
const iterations = [
  { time: '03:00', skill: 'env/crac-cool', from: 'v2.3', to: 'v2.4', reason: '夜间低负载场景增加早回正策略', gain: '+6% 收敛' },
  { time: '07:30', skill: 'bms/active-balance', from: 'v1.1', to: 'v1.2', reason: '内阻预警阈值 0.40→0.38mΩ 减少误收敛', gain: '+9% 命中率' },
  { time: '11:30', skill: 'env/rack-temp', from: 'v0.9', to: 'v1.0', reason: '新增热通道空气流速联动', gain: '+4% 节能' },
  { time: '15:00', skill: 'env/ups-bypass', from: 'v0.8', to: 'v1.0', reason: '高负载分级切分逻辑', gain: '+12% 切分成功率' },
  { time: '19:00', skill: 'fire/smoke-typo', from: 'v0.6', to: 'v1.0', reason: '灰尘聚类 + 季节性湿度关联', gain: '+18% 误报识别' },
];

// =========== 论文分析 (Layer 3) ===========
const papers = [
  { id: 'P-001', system: 'bms', device: '锂离子电池内阻', title: 'Lithium-ion battery internal resistance evolution under fast charging cycles', journal: 'Journal of Power Sources', year: 2025, conf: 0.91, summary: '建立 SEI 膜生长模型, 提出基于内阻预测 SOH 的 0.3mΩ 阈值方法', rag: '已归档 bms/rag' },
  { id: 'P-002', system: 'bms', device: '主动均衡控制', title: 'Active cell balancing control strategy based on multi-agent reinforcement learning', journal: 'IEEE Trans. Industrial Electronics', year: 2025, conf: 0.88, summary: '多智能体强化学习优化均衡电流分配, 提升 24% 收敛速度', rag: '已归档 bms/rag' },
  { id: 'P-003', system: 'env', device: 'CRAC 自适应控制', title: 'Adaptive CRAC control in data centers using digital twin and model predictive control', journal: 'Applied Energy', year: 2025, conf: 0.93, summary: '数字孪生 + MPC 实现 PUE 1.28, 节能 18%', rag: '已归档 env/rag' },
  { id: 'P-004', system: 'env', device: '热通道封闭', title: 'Hot aisle containment effectiveness: a CFD meta-analysis', journal: 'Energy and Buildings', year: 2024, conf: 0.86, summary: '热通道封闭能降低进回风温差 4-6℃, 推荐 F3 区域优先实施', rag: '已归档 env/rag' },
  { id: 'P-005', system: 'fire', device: '烟感误报', title: 'False alarm suppression for aspirating smoke detectors using deep learning', journal: 'Fire Safety Journal', year: 2025, conf: 0.84, summary: '基于 LSTM 的灰尘/烟雾分类, 误报率从 22% 降至 6%', rag: '已归档 fire/rag' },
  { id: 'P-006', system: 'ba', device: '冷水机组优化', title: 'Data-driven chiller sequencing optimization in data centers', journal: 'Applied Thermal Engineering', year: 2025, conf: 0.89, summary: '多目标遗传算法优化冷机开启数, COP 提升 11%', rag: '已归档 ba/rag' },
  { id: 'P-007', system: 'security', device: '门禁尾随检测', title: 'Tailgating detection in access control using depth-camera and gait analysis', journal: 'Computers & Security', year: 2024, conf: 0.82, summary: '步态分析 + 深度视觉, 准确率 94%, 已应用于工业门禁', rag: '已归档 security/rag' },
];

// =========== 飞书推送记录 ===========
const feishuLogs = [
  { time: '14:21:18', type: 'alert', msg: '【P0 告警】F3-R12 机柜温度 32.6℃ · Skill 触发 env/rack-temp v1.0', conf: 0.91 },
  { time: '14:22:05', type: 'skill', msg: '【Skill 执行】调节 CRAC-2# 出风 -1.5℃ · 用时 720ms · 置信度 0.91', conf: 0.91 },
  { time: '14:22:08', type: 'photo', msg: '【一次链接】https://lark.cn/one-time/cc42 · 等待人工确认 (有效 30min)', conf: 0 },
  { time: '14:35:11', type: 'feedback', msg: '【人工确认】摄影已上传, 标记"已修改需调整", 反馈至 LLM', conf: 0 },
  { time: '14:36:00', type: 'iterate', msg: '【Skill 迭代】env/rack-temp 草稿 v1.1 提交评估, 加入风速反馈', conf: 0 },
  { time: '22:05:42', type: 'paper', msg: '【论文归档】Lithium-ion battery internal resistance... → bms/rag', conf: 0.91 },
  { time: '22:05:50', type: 'paper', msg: '【论文归档】Active cell balancing... → bms/rag', conf: 0.88 },
  { time: '22:06:11', type: 'paper', msg: '【论文归档】Adaptive CRAC control... → env/rag', conf: 0.93 },
];

// =========== 总体结构 ===========
const out = {
  meta: {
    site: '数据中心 A',
    date: '2026-06-27',
    interval_min: 5,
    points: N,
    range: [times[0], times[N - 1]],
    systems: ['bms', 'env', 'fire', 'security', 'ba', 'agent'],
  },
  times,
  timeseries: { bms, env, fire, security: sec, ba },
  alerts,
  inspections,
  skill_runs: skillRuns,
  iterations,
  papers,
  feishu: feishuLogs,
};

fs.writeFileSync(path.resolve(__dirname, 'day_predict.json'), JSON.stringify(out, null, 2));
console.log('OK', path.resolve(__dirname, 'day_predict.json'));
console.log('size', fs.statSync(path.resolve(__dirname, 'day_predict.json')).size, 'bytes');
