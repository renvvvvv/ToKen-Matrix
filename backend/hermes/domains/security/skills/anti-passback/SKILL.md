---
name: anti-passback
display_name: 防反传
version: v1.0
status: stable
domain: security
tags: [anti-passback, sequence]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [大门-01]
---

# 🛡️ 防反传

> 所属系统：**安防系统** · 域 id：`security` · 当前版本：**v1.0**

## 一、职责
同一卡必须进→出，反向刷卡报警

## 二、触发条件
参见 `domains/security/soul.md`

## 三、输入
```json
{"skill": "anti-passback", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "anti-passback", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`security/soul.md`
- 下游：大门-01
- 标签：`anti-passback, sequence`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
