---
name: gas-flood
display_name: 气体灭火
version: v1.0
status: stable
domain: fire
tags: [gas, ig541, flooding]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [机房-A-电池室]
---

# 🔥 气体灭火

> 所属系统：**消防系统** · 域 id：`fire` · 当前版本：**v1.0**

## 一、职责
IG541/七氟丙烷自动喷放 + 延时撤离

## 二、触发条件
参见 `domains/fire/soul.md`

## 三、输入
```json
{"skill": "gas-flood", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "gas-flood", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`fire/soul.md`
- 下游：机房-A-电池室
- 标签：`gas, ig541, flooding`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
