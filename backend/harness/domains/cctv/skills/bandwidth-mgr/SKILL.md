---
name: bandwidth-mgr
display_name: 带宽管理
version: v1.0
status: stable
domain: cctv
tags: [qos, bandwidth, poe]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [汇聚-SW-01]
---

# 📹 带宽管理

> 所属系统：**CCTV 系统** · 域 id：`cctv` · 当前版本：**v1.0**

## 一、职责
PoE 端口带宽整形 + QoS 优先级

## 二、触发条件
参见 `domains/cctv/soul.md`

## 三、输入
```json
{"skill": "bandwidth-mgr", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "bandwidth-mgr", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`cctv/soul.md`
- 下游：汇聚-SW-01
- 标签：`qos, bandwidth, poe`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
