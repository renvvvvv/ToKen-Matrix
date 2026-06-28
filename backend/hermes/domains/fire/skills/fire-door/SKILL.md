---
name: fire-door
display_name: 防火门
version: v1.0
status: stable
domain: fire
tags: [door, fire-rated]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [全楼]
---

# 🔥 防火门

> 所属系统：**消防系统** · 域 id：`fire` · 当前版本：**v1.0**

## 一、职责
常闭/常开防火门状态监测

## 二、触发条件
参见 `domains/fire/soul.md`

## 三、输入
```json
{"skill": "fire-door", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "fire-door", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`fire/soul.md`
- 下游：全楼
- 标签：`door, fire-rated`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
