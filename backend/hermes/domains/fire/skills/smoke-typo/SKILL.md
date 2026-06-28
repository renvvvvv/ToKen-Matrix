---
name: smoke-typo
display_name: 烟感误报识别
version: v1.0
status: stable
domain: fire
tags: [smoke, false-positive, ai]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [茶水间, 卫生间]
---

# 🔥 烟感误报识别

> 所属系统：**消防系统** · 域 id：`fire` · 当前版本：**v1.0**

## 一、职责
AI 识别烹饪烟 / 蒸汽等误报

## 二、触发条件
参见 `domains/fire/soul.md`

## 三、输入
```json
{"skill": "smoke-typo", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "smoke-typo", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`fire/soul.md`
- 下游：茶水间, 卫生间
- 标签：`smoke, false-positive, ai`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
