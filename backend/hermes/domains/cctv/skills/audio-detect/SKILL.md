---
name: audio-detect
display_name: 音频异响检测
version: v1.0
status: stable
domain: cctv
tags: [audio, anomaly, ai]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [走廊-08]
---

# 📹 音频异响检测

> 所属系统：**CCTV 系统** · 域 id：`cctv` · 当前版本：**v1.0**

## 一、职责
识别尖叫 / 撞击 / 玻璃破碎等异响

## 二、触发条件
参见 `domains/cctv/soul.md`

## 三、输入
```json
{"skill": "audio-detect", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "audio-detect", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`cctv/soul.md`
- 下游：走廊-08
- 标签：`audio, anomaly, ai`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
