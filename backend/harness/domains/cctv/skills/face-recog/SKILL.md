---
name: face-recog
display_name: 人脸识别
version: v2.0
status: stable
domain: cctv
tags: [face, ai, recog]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [大门-01, 走廊-12]
---

# 📹 人脸识别

> 所属系统：**CCTV 系统** · 域 id：`cctv` · 当前版本：**v2.0**

## 一、职责
白名单比对 + 陌生人预警 + 抓拍归档

## 二、触发条件
参见 `domains/cctv/soul.md`

## 三、输入
```json
{"skill": "face-recog", "version": "v2.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "face-recog", "version": "v2.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`cctv/soul.md`
- 下游：大门-01, 走廊-12
- 标签：`face, ai, recog`

## 六、版本历史
- **v2.0**: 当前稳定版
- archive: 历史版本
