---
name: stream-bitrate
display_name: 码率自适应
version: v1.0
status: stable
domain: cctv
tags: [bitrate, stream, adaptive]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [IPC-001, IPC-188]
---

# 📹 码率自适应

> 所属系统：**CCTV 系统** · 域 id：`cctv` · 当前版本：**v1.0**

## 一、职责
根据带宽抖动动态调整主/子码流

## 二、触发条件
参见 `domains/cctv/soul.md`

## 三、输入
```json
{"skill": "stream-bitrate", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "stream-bitrate", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`cctv/soul.md`
- 下游：IPC-001, IPC-188
- 标签：`bitrate, stream, adaptive`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
