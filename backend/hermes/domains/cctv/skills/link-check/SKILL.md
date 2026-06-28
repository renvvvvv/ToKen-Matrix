---
name: link-check
display_name: 摄像头链路巡检
version: v1.4
status: stable
domain: cctv
tags: [network, ip, stream]
author: hermes
created: 2026-06-01
updated: 2026-06-27
sources: [机房-A-01, 机房-B-03]
---

# 📹 摄像头链路巡检

> 所属系统：**CCTV 系统** · 域 id：`cctv` · 当前版本：**v1.4**

## 一、职责
对全部 IPC 做 ping + 端口 + 码流三重检测

## 二、触发条件
参见 `domains/cctv/soul.md`

## 三、输入
```json
{"skill": "link-check", "version": "v1.4", "params": {}}
```

## 四、输出
```json
{"status": "ok", "skill": "link-check", "version": "v1.4", "applied": "已执行"}
```

## 五、依赖
- 上游：`cctv/soul.md`
- 下游：机房-A-01, 机房-B-03
- 标签：`network, ip, stream`

## 六、版本历史
- **v1.4**: 当前稳定版
- archive: 历史版本
