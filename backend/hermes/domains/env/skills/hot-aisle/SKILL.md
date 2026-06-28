---
name: hot-aisle
display_name: 热通道封闭
version: v1.7
status: stable
domain: env
tags: [hot-aisle, containment]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [机房-A-热通道]
---

# 🌡️ 热通道封闭

> 所属系统：**动环监控系统** · 域 id：`env` · 当前版本：**v1.7**

## 一、职责
热通道温差监测 + 通道门自动闭合

## 二、触发条件
参见 `domains/env/soul.md`

## 三、输入
```json
{"skill": "hot-aisle", "version": "v1.7", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "hot-aisle", "version": "v1.7", "applied": "已执行"}
```

## 五、依赖
- 上游：`env/soul.md`
- 下游：机房-A-热通道
- 标签：`hot-aisle, containment`

## 六、版本历史
- **v1.7**: 当前稳定版
- archive: 历史版本
