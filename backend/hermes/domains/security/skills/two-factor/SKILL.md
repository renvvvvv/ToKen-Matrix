---
name: two-factor
display_name: 双因子认证
version: v1.0
status: stable
domain: security
tags: [2fa, mfa, high-security]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [机房-A, 财务]
---

# 🛡️ 双因子认证

> 所属系统：**安防系统** · 域 id：`security` · 当前版本：**v1.0**

## 一、职责
卡 + 密码 / 卡 + 人脸 双重认证

## 二、触发条件
参见 `domains/security/soul.md`

## 三、输入
```json
{"skill": "two-factor", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "two-factor", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`security/soul.md`
- 下游：机房-A, 财务
- 标签：`2fa, mfa, high-security`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
