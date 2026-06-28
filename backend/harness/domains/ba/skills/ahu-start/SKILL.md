---
name: ahu-start
display_name: 组合式空调
version: v1.0
status: stable
domain: ba
tags: [ahu, filter, start]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [AHU-01, AHU-02]
---

# 🏢 组合式空调

> 所属系统：**BA 系统** · 域 id：`ba` · 当前版本：**v1.0**

## 一、职责
AHU 启停 / 过滤网压差

## 二、触发条件
参见 `domains/ba/soul.md`

## 三、输入
```json
{"skill": "ahu-start", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "ahu-start", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`ba/soul.md`
- 下游：AHU-01, AHU-02
- 标签：`ahu, filter, start`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
