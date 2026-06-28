---
name: parking
display_name: 停车场
version: v1.0
status: stable
domain: security
tags: [parking, guidance, find-car]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [地下-01]
---

# 🛡️ 停车场

> 所属系统：**安防系统** · 域 id：`security` · 当前版本：**v1.0**

## 一、职责
车位引导 + 反向寻车

## 二、触发条件
参见 `domains/security/soul.md`

## 三、输入
```json
{"skill": "parking", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "parking", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`security/soul.md`
- 下游：地下-01
- 标签：`parking, guidance, find-car`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
