---
name: dehumidify
display_name: 除湿联动
version: v1.0
status: stable
domain: env
tags: [dehumidify, 梅雨]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [机房-A]
---

# 🌡️ 除湿联动

> 所属系统：**动环监控系统** · 域 id：`env` · 当前版本：**v1.0**

## 一、职责
梅雨季除湿机联动 + 冷凝水排放

## 二、触发条件
参见 `domains/env/soul.md`

## 三、输入
```json
{"skill": "dehumidify", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "dehumidify", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`env/soul.md`
- 下游：机房-A
- 标签：`dehumidify, 梅雨`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
