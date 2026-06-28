---
name: airflow
display_name: 气流组织
version: v1.0
status: stable
domain: env
tags: [airflow, cfd, blind]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [机房-A-全]
---

# 🌡️ 气流组织

> 所属系统：**动环监控系统** · 域 id：`env` · 当前版本：**v1.0**

## 一、职责
CFD 仿真 + 盲板检测

## 二、触发条件
参见 `domains/env/soul.md`

## 三、输入
```json
{"skill": "airflow", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "airflow", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`env/soul.md`
- 下游：机房-A-全
- 标签：`airflow, cfd, blind`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
