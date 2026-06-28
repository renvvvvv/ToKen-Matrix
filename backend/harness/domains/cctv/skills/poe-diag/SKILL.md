---
name: poe-diag
display_name: PoE 端口诊断
version: v1.2
status: stable
domain: cctv
tags: [power, port, poe]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [会议室-A-东侧]
---

# 📹 PoE 端口诊断

> 所属系统：**CCTV 系统** · 域 id：`cctv` · 当前版本：**v1.2**

## 一、职责
检测 PoE 交换机端口掉电、供电异常、功率超标

## 二、触发条件
参见 `domains/cctv/soul.md`

## 三、输入
```json
{"skill": "poe-diag", "version": "v1.2", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "poe-diag", "version": "v1.2", "applied": "已执行"}
```

## 五、依赖
- 上游：`cctv/soul.md`
- 下游：会议室-A-东侧
- 标签：`power, port, poe`

## 六、版本历史
- **v1.2**: 当前稳定版
- archive: 历史版本
