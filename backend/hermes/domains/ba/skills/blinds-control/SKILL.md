---
name: blinds-control
display_name: 电动遮阳
version: v1.0
status: stable
domain: ba
tags: [blind, shade, solar]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [西向-全]
---

# 🏢 电动遮阳

> 所属系统：**BA 系统** · 域 id：`ba` · 当前版本：**v1.0**

## 一、职责
按太阳角度自动调节百叶

## 二、触发条件
参见 `domains/ba/soul.md`

## 三、输入
```json
{"skill": "blinds-control", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "blinds-control", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`ba/soul.md`
- 下游：西向-全
- 标签：`blind, shade, solar`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
