---
name: access-control
display_name: 门禁控制
version: v1.0
status: stable
domain: security
tags: [door, card, access]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [大门-01, 机房-A]
---

# 🛡️ 门禁控制

> 所属系统：**安防系统** · 域 id：`security` · 当前版本：**v1.0**

## 一、职责
刷卡 / 密码 / 二维码多模开门

## 二、触发条件
参见 `domains/security/soul.md`

## 三、输入
```json
{"skill": "access-control", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "access-control", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`security/soul.md`
- 下游：大门-01, 机房-A
- 标签：`door, card, access`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
