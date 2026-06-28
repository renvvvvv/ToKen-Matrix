---
name: fault-diagnose
display_name: 故障诊断
version: v1.0
status: stable
domain: ba
tags: [fault, diagnose, fdd]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [冷机, AHU]
---

# 🏢 故障诊断

> 所属系统：**BA 系统** · 域 id：`ba` · 当前版本：**v1.0**

## 一、职责
设备故障树诊断 + 维修建议

## 二、触发条件
参见 `domains/ba/soul.md`

## 三、输入
```json
{"skill": "fault-diagnose", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "fault-diagnose", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`ba/soul.md`
- 下游：冷机, AHU
- 标签：`fault, diagnose, fdd`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
