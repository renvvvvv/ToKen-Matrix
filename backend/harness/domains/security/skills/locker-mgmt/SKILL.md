---
name: locker-mgmt
display_name: 储物柜管理
version: v1.0
status: stable
domain: security
tags: [locker, storage]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [员工区]
---

# 🛡️ 储物柜管理

> 所属系统：**安防系统** · 域 id：`security` · 当前版本：**v1.0**

## 一、职责
员工柜分配 / 临时柜

## 二、触发条件
参见 `domains/security/soul.md`

## 三、输入
```json
{"skill": "locker-mgmt", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "locker-mgmt", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`security/soul.md`
- 下游：员工区
- 标签：`locker, storage`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
