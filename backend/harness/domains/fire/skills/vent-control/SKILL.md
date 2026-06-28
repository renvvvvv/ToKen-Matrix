---
name: vent-control
display_name: 防排烟
version: v1.0
status: stable
domain: fire
tags: [vent, smoke, pressurize]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [楼梯前室]
---

# 🔥 防排烟

> 所属系统：**消防系统** · 域 id：`fire` · 当前版本：**v1.0**

## 一、职责
火灾时正压送风 + 排烟联动

## 二、触发条件
参见 `domains/fire/soul.md`

## 三、输入
```json
{"skill": "vent-control", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "vent-control", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`fire/soul.md`
- 下游：楼梯前室
- 标签：`vent, smoke, pressurize`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
