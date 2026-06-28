---
name: feishu
display_name: 火警飞书推送
version: v2.0
status: stable
domain: fire
tags: [feishu, alert, fire]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [火警-全部]
---

# 🔥 火警飞书推送

> 所属系统：**消防系统** · 域 id：`fire` · 当前版本：**v2.0**

## 一、职责
火警信号飞书卡片通知 + 责任人 @

## 二、触发条件
参见 `domains/fire/soul.md`

## 三、输入
```json
{"skill": "feishu", "version": "v2.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "feishu", "version": "v2.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`fire/soul.md`
- 下游：火警-全部
- 标签：`feishu, alert, fire`

## 六、版本历史
- **v2.0**: 当前稳定版
- archive: 历史版本
