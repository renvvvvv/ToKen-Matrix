---
name: video-linkage
display_name: 视频联动
version: v1.0
status: stable
domain: security
tags: [video, linkage, popup]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [大门-01]
---

# 🛡️ 视频联动

> 所属系统：**安防系统** · 域 id：`security` · 当前版本：**v1.0**

## 一、职责
刷卡瞬间弹出该门附近视频

## 二、触发条件
参见 `domains/security/soul.md`

## 三、输入
```json
{"skill": "video-linkage", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "video-linkage", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`security/soul.md`
- 下游：大门-01
- 标签：`video, linkage, popup`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
