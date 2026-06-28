---
name: hot-water
display_name: 热水循环
version: v1.0
status: stable
domain: ba
tags: [hot-water, circ-pump]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [锅炉房]
---

# 🏢 热水循环

> 所属系统：**BA 系统** · 域 id：`ba` · 当前版本：**v1.0**

## 一、职责
生活热水温度 / 循环泵控制

## 二、触发条件
参见 `domains/ba/soul.md`

## 三、输入
```json
{"skill": "hot-water", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "hot-water", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`ba/soul.md`
- 下游：锅炉房
- 标签：`hot-water, circ-pump`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
