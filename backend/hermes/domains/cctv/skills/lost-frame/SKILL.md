---
name: lost-frame
display_name: 丢帧检测
version: v1.0
status: stable
domain: cctv
tags: [frame, rtsp, quality]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [IPC-3022, IPC-4501]
---

# 📹 丢帧检测

> 所属系统：**CCTV 系统** · 域 id：`cctv` · 当前版本：**v1.0**

## 一、职责
RTSP 流丢帧率监测 + 重连机制

## 二、触发条件
参见 `domains/cctv/soul.md`

## 三、输入
```json
{"skill": "lost-frame", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "lost-frame", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`cctv/soul.md`
- 下游：IPC-3022, IPC-4501
- 标签：`frame, rtsp, quality`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
