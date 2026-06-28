---
name: recording-plan
display_name: 录像计划
version: v1.0
status: stable
domain: cctv
tags: [plan, schedule, backup]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [NVR-A1, NVR-B2]
---

# 📹 录像计划

> 所属系统：**CCTV 系统** · 域 id：`cctv` · 当前版本：**v1.0**

## 一、职责
按时段/事件触发录像 + 双备份

## 二、触发条件
参见 `domains/cctv/soul.md`

## 三、输入
```json
{"skill": "recording-plan", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "recording-plan", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`cctv/soul.md`
- 下游：NVR-A1, NVR-B2
- 标签：`plan, schedule, backup`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
