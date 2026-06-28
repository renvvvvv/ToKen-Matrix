---
name: video-wall
display_name: 视频墙拼接
version: v1.0
status: stable
domain: cctv
tags: [wall, split, tour]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [中控-大屏]
---

# 📹 视频墙拼接

> 所属系统：**CCTV 系统** · 域 id：`cctv` · 当前版本：**v1.0**

## 一、职责
多画面分屏 + 大屏轮巡策略

## 二、触发条件
参见 `domains/cctv/soul.md`

## 三、输入
```json
{"skill": "video-wall", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "video-wall", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`cctv/soul.md`
- 下游：中控-大屏
- 标签：`wall, split, tour`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
