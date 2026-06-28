---
name: setpoint-clip
display_name: 设定值剪裁
version: v1.0
status: stable
domain: ba
tags: [setpoint, optimize, outdoor]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [冷机, AHU]
---

# 🏢 设定值剪裁

> 所属系统：**BA 系统** · 域 id：`ba` · 当前版本：**v1.0**

## 一、职责
按室外温湿度自动剪裁设定值

## 二、触发条件
参见 `domains/ba/soul.md`

## 三、输入
```json
{"skill": "setpoint-clip", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "setpoint-clip", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`ba/soul.md`
- 下游：冷机, AHU
- 标签：`setpoint, optimize, outdoor`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
