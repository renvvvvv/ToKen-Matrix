---
name: intrusion-zone
display_name: 防区布防
version: v1.0
status: stable
domain: security
tags: [intrusion, arm, disarm]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [周界, 机房-A]
---

# 🛡️ 防区布防

> 所属系统：**安防系统** · 域 id：`security` · 当前版本：**v1.0**

## 一、职责
夜间防区布防 / 撤防 / 旁路

## 二、触发条件
参见 `domains/security/soul.md`

## 三、输入
```json
{"skill": "intrusion-zone", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "intrusion-zone", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`security/soul.md`
- 下游：周界, 机房-A
- 标签：`intrusion, arm, disarm`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
