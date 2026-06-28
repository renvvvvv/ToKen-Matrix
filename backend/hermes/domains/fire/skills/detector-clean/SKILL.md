---
name: detector-clean
display_name: 探测器清洁
version: v1.0
status: stable
domain: fire
tags: [detector, clean, dirty]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [全楼]
---

# 🔥 探测器清洁

> 所属系统：**消防系统** · 域 id：`fire` · 当前版本：**v1.0**

## 一、职责
误报探测器自动标脏 + 派单清洁

## 二、触发条件
参见 `domains/fire/soul.md`

## 三、输入
```json
{"skill": "detector-clean", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "detector-clean", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`fire/soul.md`
- 下游：全楼
- 标签：`detector, clean, dirty`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
