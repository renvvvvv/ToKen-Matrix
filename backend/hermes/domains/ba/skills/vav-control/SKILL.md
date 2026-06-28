---
name: vav-control
display_name: 变风量末端
version: v1.0
status: stable
domain: ba
tags: [vav, air, control]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [办公区-全]
---

# 🏢 变风量末端

> 所属系统：**BA 系统** · 域 id：`ba` · 当前版本：**v1.0**

## 一、职责
VAV 末端按室温闭环调节风量

## 二、触发条件
参见 `domains/ba/soul.md`

## 三、输入
```json
{"skill": "vav-control", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "vav-control", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`ba/soul.md`
- 下游：办公区-全
- 标签：`vav, air, control`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
