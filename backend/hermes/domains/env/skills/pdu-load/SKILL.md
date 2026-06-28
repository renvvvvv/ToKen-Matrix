---
name: pdu-load
display_name: PDU 负载均衡
version: v1.0
status: stable
domain: env
tags: [pdu, load-balance, 3phase]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [机柜-R12, 机柜-R18]
---

# 🌡️ PDU 负载均衡

> 所属系统：**动环监控系统** · 域 id：`env` · 当前版本：**v1.0**

## 一、职责
机柜 PDU 三相不平衡自动调节

## 二、触发条件
参见 `domains/env/soul.md`

## 三、输入
```json
{"skill": "pdu-load", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "pdu-load", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`env/soul.md`
- 下游：机柜-R12, 机柜-R18
- 标签：`pdu, load-balance, 3phase`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
