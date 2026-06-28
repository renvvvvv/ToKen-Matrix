---
name: guard-tour
display_name: 保安巡更
version: v1.0
status: stable
domain: security
tags: [guard, tour, stick]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [全楼]
---

# 🛡️ 保安巡更

> 所属系统：**安防系统** · 域 id：`security` · 当前版本：**v1.0**

## 一、职责
巡更棒记录 + 路线回放

## 二、触发条件
参见 `domains/security/soul.md`

## 三、输入
```json
{"skill": "guard-tour", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "guard-tour", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`security/soul.md`
- 下游：全楼
- 标签：`guard, tour, stick`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
