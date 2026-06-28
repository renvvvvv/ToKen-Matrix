---
name: leak-detect
display_name: 漏水检测
version: v1.0
status: stable
domain: env
tags: [leak, water, rope]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [空调下方-01]
---

# 🌡️ 漏水检测

> 所属系统：**动环监控系统** · 域 id：`env` · 当前版本：**v1.0**

## 一、职责
漏水绳定位 + 切断阀联动

## 二、触发条件
参见 `domains/env/soul.md`

## 三、输入
```json
{"skill": "leak-detect", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "leak-detect", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`env/soul.md`
- 下游：空调下方-01
- 标签：`leak, water, rope`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
