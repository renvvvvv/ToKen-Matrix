---
name: genset-start
display_name: 柴发启动
version: v1.0
status: stable
domain: env
tags: [genset, diesel, start]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [柴发-01]
---

# 🌡️ 柴发启动

> 所属系统：**动环监控系统** · 域 id：`env` · 当前版本：**v1.0**

## 一、职责
柴油发电机自启动 + 暖机 + 并网

## 二、触发条件
参见 `domains/env/soul.md`

## 三、输入
```json
{"skill": "genset-start", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "genset-start", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`env/soul.md`
- 下游：柴发-01
- 标签：`genset, diesel, start`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
