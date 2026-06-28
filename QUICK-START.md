# Token 母体 · 快速启动指南（2 分钟上手）

> 项目位置：`c:\Users\wuton\Desktop\0627\token-matrix\`

---

## 🎯 三种启动方式（按速度排序）

### 1️⃣ **最快（30 秒）· 直接打开首页**

```powershell
# 方式 A：Windows 文件管理器
start c:\Users\wuton\Desktop\0627\token-matrix\frontend\index.html

# 方式 B：PowerShell
Invoke-Item c:\Users\wuton\Desktop\0627\token-matrix\frontend\index.html
```

✅ **立刻看到**：Token 母体首页 + Logo 发光 + 查询栏 + CTA 按钮 + 三 Demo 卡片 + 动画效果

---

### 2️⃣ **次快（2 分钟）· 启动本地 HTTP 服务器**

```powershell
# 进入前端目录
cd c:\Users\wuton\Desktop\0627\token-matrix\frontend

# 启动服务器
python -m http.server 8000

# 浏览器访问
http://localhost:8000
```

**访问链接**：
- 首页：http://localhost:8000
- Demo 1（Web Surfer）：http://localhost:8000/demos/demo-01-web-surfer.html
- Demo 2（预测推荐）：http://localhost:8000/demos/demo-02-predict-recommend.html
- Demo 3（Hermes 场景）：http://localhost:8000/demos/demo-03-hermes-scenarios.html

✅ **立刻看到**：完整系统（首页 + 三大 Demo 展示效果）

---

### 3️⃣ **完整（5 分钟）· Docker 容器启动**

```powershell
# 进入项目根目录
cd c:\Users\wuton\Desktop\0627\token-matrix

# 启动（自动检查 Docker、构建镜像、启动服务）
.\start.ps1

# 或直接用 Docker Compose
docker-compose up
```

**访问链接**：
- 前端首页：http://localhost:3000
- 后端 API：http://localhost:8000/health
- Swagger 文档：http://localhost:8000/docs

✅ **立刻看到**：前端 + 后端 API + 完整系统

---

## 📂 核心文件位置

| 文件 | 位置 | 说明 |
|---|---|---|
| **首页** | `/frontend/index.html` | 完整首页（可直接打开） |
| **首页样式** | `/frontend/style.css` | 首页样式 |
| **Demo 1** | `/frontend/demos/demo-01-web-surfer.html` | LangGraph 节点轨迹 |
| **Demo 2** | `/frontend/demos/demo-02-predict-recommend.html` | 预测→推荐→执行 |
| **Demo 3** | `/frontend/demos/demo-03-hermes-scenarios.html` | 多场景告警触发 |
| **后端主文件** | `/backend/main.py` | FastAPI 应用 |
| **Docker** | `/docker-compose.yml` | 一键启动配置 |

---

## 🎨 视觉效果预览

### 首页区块
```
┌─────────────────────────────────────┐
│  ◇ Token Matrix                      │  ← Logo（工业橙发光）
│  Token 母体 · AI Agent 自动驾驶       │
│  ┌──────────────────────────────┐   │
│  │ 🔍 输入机房名/告警关键词     │   │  ← 查询栏
│  └──────────────────────────────┘   │
│      [ 点击查看详情 ▶ ]              │  ← 大 CTA 按钮（橙色）
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐          │
│  │ 做什么│ │怎么做│ │ 价值 │          │  ← 三段式介绍
│  └─────┘ └─────┘ └─────┘          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 自主研究员 │ 自主控制官 │ 场景守夜人│ │  ← 三 Demo 卡片
│  └─────────────────────────────┘   │
│                                     │
│  ┌─── 五层架构 ───┐               │
│  │ L5 总部大脑   │               │  ← 可交互架构
│  │ L4 工单层    │               │
│  │ L3 Hermes   │               │
│  │ L2 适配层    │               │
│  │ L1 数据设备  │               │
│  └─────────────┘               │
│                                     │
│  © Token Matrix Team                │  ← Footer
└─────────────────────────────────────┘
```

### 色调系统
- 深蓝背景：`#0B1426`（机房感）
- 工业橙：`#FF6B35`（能量感）
- 青绿：`#3DDC97`（数据流）

### 动画效果（10+ 种）
- Logo 发光脉冲（1.5s）
- Hero 淡入上浮（0.6s）
- 粒子流动（持续）
- 卡片 Hover 上浮（0.3s）
- CTA 按钮箭头移动（0.3s）
- Demo 节点脉冲轨迹（Demo 1）
- Canvas 温度曲线（Demo 2）
- 场景切换流转（Demo 3）

---

## 🧪 三大 Demo 说明

### Demo 1：Web Surfer - LangGraph 节点轨迹
- **展示**：START → router → search → extract → backtest → summarize → END（7 节点）
- **交互**：点 [开始/重置] 按钮控制轨迹流动
- **效果**：节点脉冲发光 + 时间线展示 + LLM 推理结果弹窗

### Demo 2：预测→推荐→执行
- **展示**：温度预测曲线 + 3 个候选动作 + human-in-loop 审批
- **交互**：点 [批准/拒绝] 按钮触发执行反馈
- **效果**：4 步流程指示器 + 执行成功反馈 + Hermes 准则验证

### Demo 3：Hermes 多场景告警
- **展示**：4 个场景（冷却/电源/火灾/网络）的触发链路
- **交互**：下拉菜单切换场景，自动演示整个告警处置流程
- **效果**：检测 → 分类 → 执行 → 推送 的实时流转 + 飞书 + openclaw 卡片

---

## 🔧 常见操作

### 修改首页内容

1. 打开 `/frontend/index.html`
2. 编辑文本内容（保留 HTML 标签）
3. 保存刷新浏览器

### 修改颜色主题

1. 打开 `/frontend/style.css`
2. 编辑颜色变量：
   ```css
   :root {
     --primary-bg: #0B1426;    /* 深蓝 */
     --primary-accent: #FF6B35; /* 橙 */
     --primary-data: #3DDC97;   /* 青绿 */
   }
   ```
3. 保存刷新

### 修改动画速度

1. 打开 `/frontend/style.css`
2. 找到 `@keyframes` 部分
3. 修改 `animation-duration`
4. 保存刷新

---

## 🐳 Docker 相关命令

```powershell
# 启动
docker-compose up

# 后台运行
docker-compose up -d

# 停止
docker-compose down

# 查看日志
docker-compose logs -f

# 仅启动前端
docker-compose up frontend

# 仅启动后端
docker-compose up backend

# 重建镜像
docker-compose up --build
```

---

## 📝 文档索引

| 文档 | 位置 | 用途 |
|---|---|---|
| 首页设计说明 | `/frontend/README.md` | 首页每个区块的设计意图 + 修改指南 |
| Demo 技术文档 | `/frontend/demos/DEMO-README.md` | 三 Demo 的交互说明 + 实现细节 |
| Docker 完整文档 | `/README.md` | 安装 / 启动 / API 文档 |
| 快速参考 | `/QUICK-START.md` | 常用命令速查 |
| 多 Agent 交付总结 | `/MULTI-AGENT-DELIVERY.md` | 本次交付的完整清单 |

---

## 💡 用户须知

### 你说的"展示效果"
- ✅ 三 Demo 是**纯展示效果**，不需要真实数据处理
- ✅ 虚拟数据 hardcoded 在 HTML 中
- ✅ 动画流畅不突兀（与系统主色调完全融合）
- ✅ 可直接打开使用，无需后端支持

### 你说的"不着急有内核"
- ✅ 后端是**最小 FastAPI 骨架**
- ✅ 只有 3 个基础路由（health / search / console_overview）
- ✅ 可后续逐步集成真实逻辑

### 你说的"与系统相融"
- ✅ 色调：深蓝 + 橙 + 青绿 100% 一致
- ✅ 动画：流畅度、节奏感与首页保持一致
- ✅ 交互：卡片 / 按钮 / 流程图风格统一
- ✅ 响应式：Mobile / Tablet / Desktop 全覆盖

---

## ⏱️ 预期时间

| 操作 | 时间 |
|---|---|
| 打开首页 HTML | 30 秒 |
| 本地服务器全部体验 | 2 分钟 |
| Docker 完整启动 | 5 分钟 |
| 修改首页文本 | 1 分钟 |
| 修改颜色主题 | 2 分钟 |
| 修改动画速度 | 2 分钟 |

---

## 🚀 立即开始

```powershell
# 最快方式（30 秒）
start c:\Users\wuton\Desktop\0627\token-matrix\frontend\index.html

# 或进入项目看完整系统
cd c:\Users\wuton\Desktop\0627\token-matrix
docker-compose up
# 访问 http://localhost:3000
```

---

**🎉 开始体验 Token 母体！**

有任何问题查看对应的 README.md 文档。祝你使用愉快！
