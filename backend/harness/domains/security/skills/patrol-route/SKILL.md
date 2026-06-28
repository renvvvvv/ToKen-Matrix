---
name: patrol-route
display_name: 巡更路线
version: v1.0
status: stable
domain: security
tags: [patrol, route, guard]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [全楼]
---

# 🛡️ 巡更路线

> 所属系统：**安防系统** · 域 id：`security` · 当前版本：**v1.0**

## 一、职责
保安定时巡更 + 漏巡告警

## 二、触发条件
参见 `domains/security/soul.md`

## 三、输入
```json
{"skill": "patrol-route", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "patrol-route", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`security/soul.md`
- 下游：全楼
- 标签：`patrol, route, guard`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
