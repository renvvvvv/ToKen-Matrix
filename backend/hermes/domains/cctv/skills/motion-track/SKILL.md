---
name: motion-track
display_name: 移动追踪
version: v1.0
status: stable
domain: cctv
tags: [track, follow, ai]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [大厅-01]
---

# 📹 移动追踪

> 所属系统：**CCTV 系统** · 域 id：`cctv` · 当前版本：**v1.0**

## 一、职责
目标移动轨迹跟踪 + 跨摄像头接力

## 二、触发条件
参见 `domains/cctv/soul.md`

## 三、输入
```json
{"skill": "motion-track", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "motion-track", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`cctv/soul.md`
- 下游：大厅-01
- 标签：`track, follow, ai`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
