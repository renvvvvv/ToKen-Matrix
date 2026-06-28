# 🌡️ 动环监控系统 · 灵魂

> 动力环境监控子系统：覆盖 供配电 / 暖通空调 / 漏水 / 柴发 四大业务线

## 一、关键设备
CRAC · UPS · PDU · 柴发 · 温湿度传感器 · 漏水绳

## 二、关键指标
| 指标 | 阈值 | 告警 |
|------|------|------|
| PUE | < 1.3 | > 1.5 |
| 进风温度 | 18~27℃ | > 30℃ |
| 湿度 | 40~55% | < 30% / > 65% |
| 热通道温差 | ≤ +5℃ | > +7℃ |

## 三、SOP 优先级
1. 温度异常 → CRAC 调节 + 备用压缩机
2. 湿度异常 → 加湿/除湿设备
3. UPS 告警 → 切换旁路 + 启动柴发

## 四、业务线 Skill（17 个）
- **CRAC 出风调节**（`crac-cool` · v2.4）— 精密空调出风温度闭环控制
- **热通道封闭**（`hot-aisle` · v1.7）— 热通道温差监测 + 通道门自动闭合
- **能耗趋势预测**（`predict` · v3.1）— 基于 LSTM 的 PUE / 负载预测
- **UPS 旁路切换**（`ups-bypass` · v1.0）— 市电中断时 UPS 旁路 + 柴发联动
- **PDU 负载均衡**（`pdu-load` · v1.0）— 机柜 PDU 三相不平衡自动调节
- **漏水检测**（`leak-detect` · v1.0）— 漏水绳定位 + 切断阀联动
- **湿度调节**（`humidity` · v1.0）— 加湿器/除湿机闭环控制
- **压差监测**（`pressure-differ` · v1.0）— 冷热通道压差监测 + 风机调节
- **电池放电测试**（`battery-test` · v1.0）— UPS 电池组定期放电测试
- **柴发启动**（`genset-start` · v1.0）— 柴油发电机自启动 + 暖机 + 并网
- **电能质量**（`power-quality` · v1.0）— 谐波 / 三相不平衡 / 闪变监测
- **机柜温度**（`rack-temp` · v1.0）— 机柜进/出风温度采集
- **气流组织**（`airflow` · v1.0）— CFD 仿真 + 盲板检测
- **环境趋势**（`env-trend` · v1.0）— 温度/湿度/PUE 长时间趋势分析
- **除湿联动**（`dehumidify` · v1.0）— 梅雨季除湿机联动 + 冷凝水排放
- **冷通道封闭**（`cold-aisle` · v1.0）— 冷通道门 / 顶板 / 盲板管理
- **实时 PUE**（`pue-realtime` · v1.0）— IT 负载 / 总能耗实时计算 PUE

## 五、目录约定
- `domains/env/soul.md` — 本文件
- `domains/env/skills/<id>/SKILL.md` — Skill 元数据
- `domains/env/skills/<id>/v{x.y}.py` — 可执行脚本
- `domains/env/skills/<id>/archive/` — 历史版本
- `domains/env/skills/<id>/eval/` — 评测用例

> 最后更新：2026-06-27 · 维护人：Hermes AI Agent
