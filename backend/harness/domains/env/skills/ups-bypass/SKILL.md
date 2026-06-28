---
name: ups-bypass
display_name: UPS 旁路切换
version: v1.0
status: stable
domain: env
tags: [ups, bypass, power]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [UPS-A1, UPS-B2]
---

# 🌡️ UPS 旁路切换

> 所属系统：**动环监控系统** · 域 id：`env` · 当前版本：**v1.0**

## 一、职责
市电中断时 UPS 旁路 + 柴发联动

## 二、触发条件
参见 `domains/env/soul.md`

## 三、输入
```json
{"skill": "ups-bypass", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "ups-bypass", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`env/soul.md`
- 下游：UPS-A1, UPS-B2
- 标签：`ups, bypass, power`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
