---
name: ptz-control
display_name: 云台控制
version: v1.3
status: stable
domain: cctv
tags: [ptz, preset, patrol]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [广场-01, 大门-02]
---

# 📹 云台控制

> 所属系统：**CCTV 系统** · 域 id：`cctv` · 当前版本：**v1.3**

## 一、职责
云台预置位 / 巡航轨迹 / 守望位

## 二、触发条件
参见 `domains/cctv/soul.md`

## 三、输入
```json
{"skill": "ptz-control", "version": "v1.3", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "ptz-control", "version": "v1.3", "applied": "已执行"}
```

## 五、依赖
- 上游：`cctv/soul.md`
- 下游：广场-01, 大门-02
- 标签：`ptz, preset, patrol`

## 六、版本历史
- **v1.3**: 当前稳定版
- archive: 历史版本
