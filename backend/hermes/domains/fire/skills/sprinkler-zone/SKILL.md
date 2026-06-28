---
name: sprinkler-zone
display_name: 喷淋分区
version: v1.0
status: stable
domain: fire
tags: [zone, valve, sprinkler]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [机房-A, 机房-B]
---

# 🔥 喷淋分区

> 所属系统：**消防系统** · 域 id：`fire` · 当前版本：**v1.0**

## 一、职责
按防火分区控制喷淋阀启闭

## 二、触发条件
参见 `domains/fire/soul.md`

## 三、输入
```json
{"skill": "sprinkler-zone", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "sprinkler-zone", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`fire/soul.md`
- 下游：机房-A, 机房-B
- 标签：`zone, valve, sprinkler`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
