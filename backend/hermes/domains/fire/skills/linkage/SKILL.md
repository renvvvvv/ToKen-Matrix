---
name: linkage
display_name: 消防联动
version: v1.0
status: stable
domain: fire
tags: [linkage, power-cut, elevator]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [全楼]
---

# 🔥 消防联动

> 所属系统：**消防系统** · 域 id：`fire` · 当前版本：**v1.0**

## 一、职责
火警→切断非消防电源 + 电梯归首

## 二、触发条件
参见 `domains/fire/soul.md`

## 三、输入
```json
{"skill": "linkage", "version": "v1.0", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "linkage", "version": "v1.0", "applied": "已执行"}
```

## 五、依赖
- 上游：`fire/soul.md`
- 下游：全楼
- 标签：`linkage, power-cut, elevator`

## 六、版本历史
- **v1.0**: 当前稳定版
- archive: 历史版本
