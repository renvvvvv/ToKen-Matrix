---
name: pump-switch
display_name: 消防泵启停
version: v1.2
status: stable
domain: fire
tags: [pump, fire, auto]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [喷淋泵-01, 消火栓泵-01]
---

# 🔥 消防泵启停

> 所属系统：**消防系统** · 域 id：`fire` · 当前版本：**v1.2**

## 一、职责
喷淋泵 / 消火栓泵自动启停

## 二、触发条件
参见 `domains/fire/soul.md`

## 三、输入
```json
{"skill": "pump-switch", "version": "v1.2", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "pump-switch", "version": "v1.2", "applied": "已执行"}
```

## 五、依赖
- 上游：`fire/soul.md`
- 下游：喷淋泵-01, 消火栓泵-01
- 标签：`pump, fire, auto`

## 六、版本历史
- **v1.2**: 当前稳定版
- archive: 历史版本
