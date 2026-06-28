---
name: duress-alarm
display_name: 胁迫报警
version: v1.0
status: stable
domain: security
tags: [duress, silent, panic]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [财务室, 机房-A]
---

# 🛡️ 胁迫报警

> 所属系统：**安防系统** · 域 id：`security` · 当前版本：**v1.0**

## 一、职责
特殊密码/卡触发静默报警

## 二、触发条件
参见 `domains/security/soul.md`

## 三、输入
```json
{"skill": "duress-alarm", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "duress-alarm", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`security/soul.md`
- 下游：财务室, 机房-A
- 标签：`duress, silent, panic`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
