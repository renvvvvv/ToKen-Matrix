---
name: intruder
display_name: 入侵检测
version: v1.0
status: stable
domain: cctv
tags: [intrusion, perimeter, ai]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [周界-北, 周界-西]
---

# 📹 入侵检测

> 所属系统：**CCTV 系统** · 域 id：`cctv` · 当前版本：**v1.0**

## 一、职责
周界区域入侵识别 + 联动照明/广播

## 二、触发条件
参见 `domains/cctv/soul.md`

## 三、输入
```json
{"skill": "intruder", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "intruder", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`cctv/soul.md`
- 下游：周界-北, 周界-西
- 标签：`intrusion, perimeter, ai`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
