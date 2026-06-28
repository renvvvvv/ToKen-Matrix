---
name: meter-pulse
display_name: 电表脉冲
version: v1.0
status: stable
domain: ba
tags: [meter, pulse, sub-meter]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [配电箱-全]
---

# 🏢 电表脉冲

> 所属系统：**BA 系统** · 域 id：`ba` · 当前版本：**v1.0**

## 一、职责
楼层 / 区域分项计量采集

## 二、触发条件
参见 `domains/ba/soul.md`

## 三、输入
```json
{"skill": "meter-pulse", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "meter-pulse", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`ba/soul.md`
- 下游：配电箱-全
- 标签：`meter, pulse, sub-meter`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
