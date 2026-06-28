---
name: rack-temp
display_name: 机柜温度
version: v1.0
status: stable
domain: env
tags: [rack, temp, sensor]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [机柜-R01~R80]
---

# 🌡️ 机柜温度

> 所属系统：**动环监控系统** · 域 id：`env` · 当前版本：**v1.0**

## 一、职责
机柜进/出风温度采集

## 二、触发条件
参见 `domains/env/soul.md`

## 三、输入
```json
{"skill": "rack-temp", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "rack-temp", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`env/soul.md`
- 下游：机柜-R01~R80
- 标签：`rack, temp, sensor`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
