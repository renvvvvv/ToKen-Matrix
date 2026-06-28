---
name: retention-clean
display_name: 录像周期清理
version: v1.0
status: stable
domain: cctv
tags: [retention, cleanup, policy]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [NVR-A1]
---

# 📹 录像周期清理

> 所属系统：**CCTV 系统** · 域 id：`cctv` · 当前版本：**v1.0**

## 一、职责
按策略自动清理过期录像保留证据链

## 二、触发条件
参见 `domains/cctv/soul.md`

## 三、输入
```json
{"skill": "retention-clean", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "retention-clean", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`cctv/soul.md`
- 下游：NVR-A1
- 标签：`retention, cleanup, policy`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
