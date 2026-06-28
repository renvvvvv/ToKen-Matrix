---
name: chiller-opt
display_name: 冷机优化
version: v1.0
status: stable
domain: ba
tags: [chiller, optimize, load]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [冷机-A1, 冷机-A2]
---

# 🏢 冷机优化

> 所属系统：**BA 系统** · 域 id：`ba` · 当前版本：**v1.0**

## 一、职责
冷机加减机 + 负载分配优化

## 二、触发条件
参见 `domains/ba/soul.md`

## 三、输入
```json
{"skill": "chiller-opt", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "chiller-opt", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`ba/soul.md`
- 下游：冷机-A1, 冷机-A2
- 标签：`chiller, optimize, load`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
