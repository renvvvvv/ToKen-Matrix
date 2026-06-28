---
name: free-cooling
display_name: 自然冷源
version: v1.0
status: stable
domain: ba
tags: [free-cooling, economizer]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [冷机-A1]
---

# 🏢 自然冷源

> 所属系统：**BA 系统** · 域 id：`ba` · 当前版本：**v1.0**

## 一、职责
湿球温度低时切换自然冷源

## 二、触发条件
参见 `domains/ba/soul.md`

## 三、输入
```json
{"skill": "free-cooling", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "free-cooling", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`ba/soul.md`
- 下游：冷机-A1
- 标签：`free-cooling, economizer`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
