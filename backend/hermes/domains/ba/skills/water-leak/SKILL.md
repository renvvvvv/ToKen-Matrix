---
name: water-leak
display_name: 管网漏水
version: v1.0
status: stable
domain: ba
tags: [leak, flow, pipe]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [卫生间, 茶水间]
---

# 🏢 管网漏水

> 所属系统：**BA 系统** · 域 id：`ba` · 当前版本：**v1.0**

## 一、职责
给排水管流量异常 + 漏点定位

## 二、触发条件
参见 `domains/ba/soul.md`

## 三、输入
```json
{"skill": "water-leak", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "water-leak", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`ba/soul.md`
- 下游：卫生间, 茶水间
- 标签：`leak, flow, pipe`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
