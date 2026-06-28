---
name: tail-detect
display_name: 尾随检测
version: v1.0
status: stable
domain: security
tags: [tailgating, detect, ai]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [大门-01]
---

# 🛡️ 尾随检测

> 所属系统：**安防系统** · 域 id：`security` · 当前版本：**v1.0**

## 一、职责
一人刷卡多人进入识别

## 二、触发条件
参见 `domains/security/soul.md`

## 三、输入
```json
{"skill": "tail-detect", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "tail-detect", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`security/soul.md`
- 下游：大门-01
- 标签：`tailgating, detect, ai`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
