---
name: night-vision
display_name: 夜视模式切换
version: v1.0
status: stable
domain: cctv
tags: [ir, lowlight, auto]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [周界-外圈]
---

# 📹 夜视模式切换

> 所属系统：**CCTV 系统** · 域 id：`cctv` · 当前版本：**v1.0**

## 一、职责
光照低于阈值时切换红外/星光模式

## 二、触发条件
参见 `domains/cctv/soul.md`

## 三、输入
```json
{"skill": "night-vision", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "night-vision", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`cctv/soul.md`
- 下游：周界-外圈
- 标签：`ir, lowlight, auto`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
