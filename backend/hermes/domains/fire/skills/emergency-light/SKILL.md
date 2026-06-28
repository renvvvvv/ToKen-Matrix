---
name: emergency-light
display_name: 应急照明
version: v1.0
status: stable
domain: fire
tags: [light, emergency, eps]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [走廊, 楼梯]
---

# 🔥 应急照明

> 所属系统：**消防系统** · 域 id：`fire` · 当前版本：**v1.0**

## 一、职责
断电时自动点亮 + 每月自检

## 二、触发条件
参见 `domains/fire/soul.md`

## 三、输入
```json
{"skill": "emergency-light", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "emergency-light", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`fire/soul.md`
- 下游：走廊, 楼梯
- 标签：`light, emergency, eps`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
