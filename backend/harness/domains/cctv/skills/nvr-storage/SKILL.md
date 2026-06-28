---
name: nvr-storage
display_name: NVR 存储容量
version: v1.2
status: stable
domain: cctv
tags: [storage, disk, nvr]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [NVR-A1, NVR-B2]
---

# 📹 NVR 存储容量

> 所属系统：**CCTV 系统** · 域 id：`cctv` · 当前版本：**v1.2**

## 一、职责
监测 NVR 磁盘使用率与剩余可录天数

## 二、触发条件
参见 `domains/cctv/soul.md`

## 三、输入
```json
{"skill": "nvr-storage", "version": "v1.2", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "nvr-storage", "version": "v1.2", "applied": "已执行"}
```

## 五、依赖
- 上游：`cctv/soul.md`
- 下游：NVR-A1, NVR-B2
- 标签：`storage, disk, nvr`

## 六、版本历史
- **v1.2**: 当前稳定版
- archive: 历史版本
