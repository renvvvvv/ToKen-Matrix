---
name: elevator-monitor
display_name: 电梯监控
version: v1.0
status: stable
domain: ba
tags: [elevator, fault, trapped]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [全梯]
---

# 🏢 电梯监控

> 所属系统：**BA 系统** · 域 id：`ba` · 当前版本：**v1.0**

## 一、职责
电梯运行状态 / 故障 / 困人

## 二、触发条件
参见 `domains/ba/soul.md`

## 三、输入
```json
{"skill": "elevator-monitor", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "elevator-monitor", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`ba/soul.md`
- 下游：全梯
- 标签：`elevator, fault, trapped`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
