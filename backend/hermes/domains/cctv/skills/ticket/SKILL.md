---
name: ticket
display_name: 离线告警自动派单
version: v3.1
status: stable
domain: cctv
tags: [ticket, feishu, auto]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [NVR-01, IPC-0024]
---

# 📹 离线告警自动派单

> 所属系统：**CCTV 系统** · 域 id：`cctv` · 当前版本：**v3.1**

## 一、职责
CCTV 离线后自动生成工单并飞书推送

## 二、触发条件
参见 `domains/cctv/soul.md`

## 三、输入
```json
{"skill": "ticket", "version": "v3.1", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "ticket", "version": "v3.1", "applied": "已执行"}
```

## 五、依赖
- 上游：`cctv/soul.md`
- 下游：NVR-01, IPC-0024
- 标签：`ticket, feishu, auto`

## 六、版本历史
- **v3.1**: 当前稳定版
- archive: 历史版本
