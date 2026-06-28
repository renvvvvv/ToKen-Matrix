---
name: power-quality
display_name: 电能质量
version: v1.0
status: stable
domain: env
tags: [power-quality, harmonic]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [配电室-A]
---

# 🌡️ 电能质量

> 所属系统：**动环监控系统** · 域 id：`env` · 当前版本：**v1.0**

## 一、职责
谐波 / 三相不平衡 / 闪变监测

## 二、触发条件
参见 `domains/env/soul.md`

## 三、输入
```json
{"skill": "power-quality", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "power-quality", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`env/soul.md`
- 下游：配电室-A
- 标签：`power-quality, harmonic`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
