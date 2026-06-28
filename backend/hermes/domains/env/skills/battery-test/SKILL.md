---
name: battery-test
display_name: 电池放电测试
version: v1.0
status: stable
domain: env
tags: [battery, discharge, test]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [UPS-A1]
---

# 🌡️ 电池放电测试

> 所属系统：**动环监控系统** · 域 id：`env` · 当前版本：**v1.0**

## 一、职责
UPS 电池组定期放电测试

## 二、触发条件
参见 `domains/env/soul.md`

## 三、输入
```json
{"skill": "battery-test", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "battery-test", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`env/soul.md`
- 下游：UPS-A1
- 标签：`battery, discharge, test`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
