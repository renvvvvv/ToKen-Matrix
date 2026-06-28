---
name: card-issue
display_name: 卡片发放
version: v1.0
status: stable
domain: security
tags: [card, issue, permission]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [前台]
---

# 🛡️ 卡片发放

> 所属系统：**安防系统** · 域 id：`security` · 当前版本：**v1.0**

## 一、职责
新卡制作 / 权限分配 / 挂失

## 二、触发条件
参见 `domains/security/soul.md`

## 三、输入
```json
{"skill": "card-issue", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "card-issue", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`security/soul.md`
- 下游：前台
- 标签：`card, issue, permission`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
