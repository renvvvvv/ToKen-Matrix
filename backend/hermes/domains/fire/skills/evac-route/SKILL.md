---
name: evac-route
display_name: 疏散通道
version: v1.0
status: stable
domain: fire
tags: [evac, route, voice]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [全楼]
---

# 🔥 疏散通道

> 所属系统：**消防系统** · 域 id：`fire` · 当前版本：**v1.0**

## 一、职责
疏散指示 + 语音播报 + 门禁释放

## 二、触发条件
参见 `domains/fire/soul.md`

## 三、输入
```json
{"skill": "evac-route", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "evac-route", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`fire/soul.md`
- 下游：全楼
- 标签：`evac, route, voice`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
