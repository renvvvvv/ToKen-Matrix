---
name: gate-barrier
display_name: 道闸
version: v1.0
status: stable
domain: security
tags: [barrier, gate, lpr]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [车库-入口]
---

# 🛡️ 道闸

> 所属系统：**安防系统** · 域 id：`security` · 当前版本：**v1.0**

## 一、职责
车牌识别自动抬杆 + 防砸

## 二、触发条件
参见 `domains/security/soul.md`

## 三、输入
```json
{"skill": "gate-barrier", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "gate-barrier", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`security/soul.md`
- 下游：车库-入口
- 标签：`barrier, gate, lpr`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
