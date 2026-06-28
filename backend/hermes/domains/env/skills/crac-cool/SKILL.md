---
name: crac-cool
display_name: CRAC 出风调节
version: v2.4
status: stable
domain: env
tags: [crac, cooling, control]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [CRAC-1#, CRAC-2#]
---

# 🌡️ CRAC 出风调节

> 所属系统：**动环监控系统** · 域 id：`env` · 当前版本：**v2.4**

## 一、职责
精密空调出风温度闭环控制

## 二、触发条件
参见 `domains/env/soul.md`

## 三、输入
```json
{"skill": "crac-cool", "version": "v2.4", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "crac-cool", "version": "v2.4", "applied": "已执行"}
```

## 五、依赖
- 上游：`env/soul.md`
- 下游：CRAC-1#, CRAC-2#
- 标签：`crac, cooling, control`

## 六、版本历史
- **v2.4**: 当前稳定版
- archive: 历史版本
