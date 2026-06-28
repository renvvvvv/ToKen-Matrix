---
name: manual-call
display_name: 手报按钮
version: v1.0
status: stable
domain: fire
tags: [manual, call-point]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [全楼]
---

# 🔥 手报按钮

> 所属系统：**消防系统** · 域 id：`fire` · 当前版本：**v1.0**

## 一、职责
手动报警按钮位置 + 触发记录

## 二、触发条件
参见 `domains/fire/soul.md`

## 三、输入
```json
{"skill": "manual-call", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "manual-call", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`fire/soul.md`
- 下游：全楼
- 标签：`manual, call-point`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
