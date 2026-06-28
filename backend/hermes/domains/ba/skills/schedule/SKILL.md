---
name: schedule
display_name: 时间表
version: v1.0
status: stable
domain: ba
tags: [schedule, calendar]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [全楼]
---

# 🏢 时间表

> 所属系统：**BA 系统** · 域 id：`ba` · 当前版本：**v1.0**

## 一、职责
工作日 / 节假日 / 加班时段策略

## 二、触发条件
参见 `domains/ba/soul.md`

## 三、输入
```json
{"skill": "schedule", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "schedule", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`ba/soul.md`
- 下游：全楼
- 标签：`schedule, calendar`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
