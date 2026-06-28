---
name: water
display_name: 喷淋水压
version: v1.5
status: stable
domain: fire
tags: [water, pressure, sprinkler]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [管网-A]
---

# 🔥 喷淋水压

> 所属系统：**消防系统** · 域 id：`fire` · 当前版本：**v1.5**

## 一、职责
管网水压实时监测 + 低压启泵

## 二、触发条件
参见 `domains/fire/soul.md`

## 三、输入
```json
{"skill": "water", "version": "v1.5", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "water", "version": "v1.5", "applied": "已执行"}
```

## 五、依赖
- 上游：`fire/soul.md`
- 下游：管网-A
- 标签：`water, pressure, sprinkler`

## 六、版本历史
- **v1.5**: 当前稳定版
- archive: 历史版本
