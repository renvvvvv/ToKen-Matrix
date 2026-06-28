---
name: valve-status
display_name: 阀门状态
version: v1.0
status: stable
domain: fire
tags: [valve, status]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [管网-A]
---

# 🔥 阀门状态

> 所属系统：**消防系统** · 域 id：`fire` · 当前版本：**v1.0**

## 一、职责
信号阀 / 蝶阀实时位置监测

## 二、触发条件
参见 `domains/fire/soul.md`

## 三、输入
```json
{"skill": "valve-status", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "valve-status", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`fire/soul.md`
- 下游：管网-A
- 标签：`valve, status`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
