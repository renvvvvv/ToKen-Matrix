---
name: intercom
display_name: 对讲系统
version: v1.0
status: stable
domain: security
tags: [intercom, audio, sip]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [全楼]
---

# 🛡️ 对讲系统

> 所属系统：**安防系统** · 域 id：`security` · 当前版本：**v1.0**

## 一、职责
门口机 / 室内机 / 中心三方对讲

## 二、触发条件
参见 `domains/security/soul.md`

## 三、输入
```json
{"skill": "intercom", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "intercom", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`security/soul.md`
- 下游：全楼
- 标签：`intercom, audio, sip`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
