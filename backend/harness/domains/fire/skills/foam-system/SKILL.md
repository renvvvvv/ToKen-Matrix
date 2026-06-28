---
name: foam-system
display_name: 泡沫系统
version: v1.0
status: stable
domain: fire
tags: [foam, ratio, level]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [车库-01]
---

# 🔥 泡沫系统

> 所属系统：**消防系统** · 域 id：`fire` · 当前版本：**v1.0**

## 一、职责
泡沫液位 + 泡沫比例混合器

## 二、触发条件
参见 `domains/fire/soul.md`

## 三、输入
```json
{"skill": "foam-system", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "foam-system", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`fire/soul.md`
- 下游：车库-01
- 标签：`foam, ratio, level`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
