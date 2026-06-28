---
name: plate-recog
display_name: 车牌识别
version: v1.5
status: stable
domain: cctv
tags: [plate, car, recog]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [车库-入口, 车库-出口]
---

# 📹 车牌识别

> 所属系统：**CCTV 系统** · 域 id：`cctv` · 当前版本：**v1.5**

## 一、职责
出入口车牌抓拍 + 黑名单拦截

## 二、触发条件
参见 `domains/cctv/soul.md`

## 三、输入
```json
{"skill": "plate-recog", "version": "v1.5", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "plate-recog", "version": "v1.5", "applied": "已执行"}
```

## 五、依赖
- 上游：`cctv/soul.md`
- 下游：车库-入口, 车库-出口
- 标签：`plate, car, recog`

## 六、版本历史
- **v1.5**: 当前稳定版
- archive: 历史版本
