---
name: cold-aisle
display_name: 冷通道封闭
version: v1.0
status: stable
domain: env
tags: [cold-aisle, containment]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [机房-A-冷通道]
---

# 🌡️ 冷通道封闭

> 所属系统：**动环监控系统** · 域 id：`env` · 当前版本：**v1.0**

## 一、职责
冷通道门 / 顶板 / 盲板管理

## 二、触发条件
参见 `domains/env/soul.md`

## 三、输入
```json
{"skill": "cold-aisle", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "cold-aisle", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`env/soul.md`
- 下游：机房-A-冷通道
- 标签：`cold-aisle, containment`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
