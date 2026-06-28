---
name: hydrant-pressure
display_name: 消火栓压力
version: v1.0
status: stable
domain: fire
tags: [hydrant, pressure]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [消火栓-全部]
---

# 🔥 消火栓压力

> 所属系统：**消防系统** · 域 id：`fire` · 当前版本：**v1.0**

## 一、职责
消火栓管网压力监测

## 二、触发条件
参见 `domains/fire/soul.md`

## 三、输入
```json
{"skill": "hydrant-pressure", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "hydrant-pressure", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`fire/soul.md`
- 下游：消火栓-全部
- 标签：`hydrant, pressure`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
