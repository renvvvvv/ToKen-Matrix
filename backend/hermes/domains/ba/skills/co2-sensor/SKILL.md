---
name: co2-sensor
display_name: CO2 监测
version: v1.0
status: stable
domain: ba
tags: [co2, iaq, fresh-air]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [会议室, 大开间]
---

# 🏢 CO2 监测

> 所属系统：**BA 系统** · 域 id：`ba` · 当前版本：**v1.0**

## 一、职责
CO2 浓度监测 + 新风联动

## 二、触发条件
参见 `domains/ba/soul.md`

## 三、输入
```json
{"skill": "co2-sensor", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "co2-sensor", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`ba/soul.md`
- 下游：会议室, 大开间
- 标签：`co2, iaq, fresh-air`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
