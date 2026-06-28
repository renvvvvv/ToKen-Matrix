---
name: cooling-tower
display_name: 冷却塔
version: v1.0
status: stable
domain: ba
tags: [tower, fan, drift]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [冷却塔-01]
---

# 🏢 冷却塔

> 所属系统：**BA 系统** · 域 id：`ba` · 当前版本：**v1.0**

## 一、职责
冷却塔风机变频 + 飘水率监测

## 二、触发条件
参见 `domains/ba/soul.md`

## 三、输入
```json
{"skill": "cooling-tower", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "cooling-tower", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`ba/soul.md`
- 下游：冷却塔-01
- 标签：`tower, fan, drift`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
