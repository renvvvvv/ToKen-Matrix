# 📹 CCTV 系统 · 灵魂

> 视频监控子系统：覆盖 摄像头 / NVR / PoE / 视频墙 / 智能识别 五大业务线

## 一、关键设备
NVR · PoE 交换机 · IPC 摄像头 · 视频墙服务器 · 人脸识别盒子

## 二、关键指标
| 指标 | 阈值 | 告警 |
|------|------|------|
| 在线率 | ≥ 99% | < 95% |
| 丢包率 | < 0.1% | > 1% |
| 录像完整率 | ≥ 98% | < 95% |
| 存储可用天数 | ≥ 30d | < 7d |

## 三、SOP 优先级
1. 离线摄像头 → PoE 自愈 → 链路 ping
2. 录像缺失 → NVR 录像计划重下发
3. 智能识别异常 → 重新建模 / 阈值复核

## 四、业务线 Skill（17 个）
- **PoE 端口诊断**（`poe-diag` · v1.2）— 检测 PoE 交换机端口掉电、供电异常、功率超标
- **摄像头链路巡检**（`link-check` · v1.4）— 对全部 IPC 做 ping + 端口 + 码流三重检测
- **离线告警自动派单**（`ticket` · v3.1）— CCTV 离线后自动生成工单并飞书推送
- **NVR 存储容量**（`nvr-storage` · v1.2）— 监测 NVR 磁盘使用率与剩余可录天数
- **码率自适应**（`stream-bitrate` · v1.0）— 根据带宽抖动动态调整主/子码流
- **人脸识别**（`face-recog` · v2.0）— 白名单比对 + 陌生人预警 + 抓拍归档
- **车牌识别**（`plate-recog` · v1.5）— 出入口车牌抓拍 + 黑名单拦截
- **入侵检测**（`intruder` · v1.0）— 周界区域入侵识别 + 联动照明/广播
- **丢帧检测**（`lost-frame` · v1.0）— RTSP 流丢帧率监测 + 重连机制
- **夜视模式切换**（`night-vision` · v1.0）— 光照低于阈值时切换红外/星光模式
- **云台控制**（`ptz-control` · v1.3）— 云台预置位 / 巡航轨迹 / 守望位
- **视频墙拼接**（`video-wall` · v1.0）— 多画面分屏 + 大屏轮巡策略
- **录像周期清理**（`retention-clean` · v1.0）— 按策略自动清理过期录像保留证据链
- **移动追踪**（`motion-track` · v1.0）— 目标移动轨迹跟踪 + 跨摄像头接力
- **音频异响检测**（`audio-detect` · v1.0）— 识别尖叫 / 撞击 / 玻璃破碎等异响
- **带宽管理**（`bandwidth-mgr` · v1.0）— PoE 端口带宽整形 + QoS 优先级
- **录像计划**（`recording-plan` · v1.0）— 按时段/事件触发录像 + 双备份

## 五、目录约定
- `domains/cctv/soul.md` — 本文件
- `domains/cctv/skills/<id>/SKILL.md` — Skill 元数据
- `domains/cctv/skills/<id>/v{x.y}.py` — 可执行脚本
- `domains/cctv/skills/<id>/archive/` — 历史版本
- `domains/cctv/skills/<id>/eval/` — 评测用例

> 最后更新：2026-06-27 · 维护人：Hermes AI Agent
