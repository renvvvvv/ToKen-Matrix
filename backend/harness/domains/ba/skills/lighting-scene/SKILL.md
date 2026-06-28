---
name: lighting-scene
display_name: 照明场景
version: v1.0
status: stable
domain: ba
tags: [lighting, scene, dali]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [办公区-全]
---

# 🏢 照明场景

> 所属系统：**BA 系统** · 域 id：`ba` · 当前版本：**v1.0**

## 一、职责
按时段 / 光照 / 占位自动场景

## 二、触发条件
参见 `domains/ba/soul.md`

## 三、输入
```json
{"skill": "lighting-scene", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "lighting-scene", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`ba/soul.md`
- 下游：办公区-全
- 标签：`lighting, scene, dali`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
