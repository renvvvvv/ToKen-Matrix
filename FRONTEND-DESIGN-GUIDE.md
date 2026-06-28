# Token 母体 · 前端设计学习指南

## 核心设计理念

基于 `frontend-design` Skill 的最佳实践，本项目采用**数据密集型仪表盘风格**，融合工业感与科技感。

### 设计三支柱

#### 1. **色彩系统** - 浅蓝色调工业风
```css
:root {
    --primary: #0EA5E9;           /* 天蓝色 - 主色调 */
    --primary-light: #7DD3FC;     /* 浅蓝色 - 亮点 */
    --primary-dark: #0369A1;      /* 深蓝色 - 强调 */
    --secondary: #06B6D4;         /* 青蓝色 - 补色 */
    --accent: #3DDC97;            /* 翠绿色 - 强调/成功 */
    --warning: #FF6B35;           /* 工业橙 - 警告 */
    --danger: #ff4444;            /* 红色 - 危险 */
}
```

**设计原则**：
- 主色（天蓝）占比 60%，营造冷静的技术感
- 补色（翠绿）占比 20%，用于成功状态和强调
- 警告色（橙）占比 15%，用于重要告警
- 中性色占比 5%，纯粹功能用途

#### 2. **排版系统** - 清晰的信息层级
```css
.card-title {
    font-size: 14px;      /* 卡片标题 */
    font-weight: 700;
}

.metric-label {
    font-size: 13px;      /* 指标标签 */
    color: var(--text-secondary);
}

.metric-value {
    font-size: 14px;      /* 指标数值 */
    font-weight: 600;
    color: var(--primary);
}
```

**规则**：不使用非标准字体（如 Inter），而是依赖系统字体栈。

#### 3. **组件系统** - 模块化设计

#### a. 卡片（Card）
- 背景：渐变 + 毛玻璃效果
- 边框：浅蓝色半透明
- 交互：Hover 时边框变主色、背景加深、投影增强

```css
.card {
    background: linear-gradient(135deg, rgba(20, 32, 60, 0.7) 0%, rgba(15, 40, 71, 0.5) 100%);
    border: 1px solid var(--border-light);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.card:hover {
    border-color: var(--primary);
    box-shadow: 0 8px 20px rgba(14, 165, 233, 0.1);
}
```

#### b. 进度条（Progress Bar）
- 高度：4px（极简）
- 填充：蓝青渐变
- 背景：半透明蓝色

```css
.progress-bar {
    height: 4px;
    background: rgba(14, 165, 233, 0.1);
    border-radius: 2px;
}

.progress-fill {
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    transition: width 0.5s ease;
}
```

#### c. 状态徽章（Badge）
- 三态：正常（绿）/ 警告（橙）/ 危险（红）
- 背景：半透明彩色 + 圆角

```css
.status-badge {
    padding: 4px 8px;
    border-radius: 4px;
}

.status-badge.normal {
    background: rgba(61, 220, 151, 0.2);
    color: var(--accent);
}
```

---

## 控制台设计模式

### 布局架构

```
┌─────────────────────────────────────────┐
│ Navbar (22px 渐变标题 + 实时指示器)      │
├──────────┬──────────────────────────────┤
│ Sidebar  │ Content Area                  │
│ 280px    │ 4列网格布局                   │
│          │ (响应式: 1920px以上 4列)      │
│          │        (1920px以下 3列)      │
└──────────┴──────────────────────────────┘
```

### 网格系统

使用 CSS Grid 实现 4 列布局：
```css
.content-area {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    auto-rows: max-content;
}

/* 大卡片占 2×2 */
.system-status {
    grid-column: span 2;
    grid-row: span 2;
}

/* 宽卡片占 2 列 */
.alert-list {
    grid-column: span 2;
}
```

### 核心卡片内容

#### 1. 指标卡片（6个）
- CPU 使用 / 内存 / 磁盘 / 网络 / 温度 / 服务
- 结构：标签 + 数值 + 进度条
- 交互：Hover 突显

#### 2. 系统状态卡片
- 大型浮动图标（64px，3s浮动动画）
- 标题 + 描述
- 4项状态检查清单

#### 3. 告警面板
- 3条告警（预警 + 信息 + 恢复）
- 每条：标题（工业橙）+ 描述

#### 4. 事件流
- 时间戳（蓝色、右对齐）
- 事件描述
- 5条历史事件

---

## 设计规范

### 间距系统
```
基础单位：4px
- 内边距：12px / 16px / 20px
- 外边距：8px / 12px / 20px / 25px / 30px
- 网格间隙：20px
```

### 圆角系统
```
- 卡片：10px
- 徽章/标签：4px
- 进度条：2px
```

### 动画系统

#### a. 脉冲动画（指示器）
```css
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
```
用途：实时状态指示器

#### b. 浮动动画（系统状态图标）
```css
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}
```
用途：大型状态卡片图标（3s循环）

#### c. 进度条动画
```css
.progress-fill {
    transition: width 0.5s ease;
}
```
用途：平滑的数值变化

#### d. 过渡动画
```css
.card {
    transition: all 0.3s ease;
}

.menu-item {
    transition: all 0.25s ease;
}
```
用途：交互反馈

### 深度系统（Shadow & Layers）

```css
/* 无投影 - 平面设计 */
.card { box-shadow: none; }

/* Hover 投影 - 交互反馈 */
.card:hover { 
    box-shadow: 0 8px 20px rgba(14, 165, 233, 0.1); 
}

/* 顶部边光 - 材质感 */
.card::before {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(61, 220, 151, 0.3), transparent);
}
```

---

## 侧边栏设计

### 菜单结构
```
Header
  └─ 品牌标题 + 版本号

Section 1: 核心功能
  ├─ 📊 系统总览 [active]
  ├─ 🖥️ 资源监控
  ├─ 🚨 告警中心
  └─ 🤖 AI 智能

Section 2: 管理工具
  ├─ 📋 任务队列
  ├─ 📈 数据分析
  ├─ ⚙️ 系统配置
  └─ 🔍 日志查询

Section 3: 运维工具
  ├─ 🔧 故障诊断
  ├─ 📱 消息推送
  └─ 🔐 权限管理
```

### 菜单项交互

#### 正常状态
```css
.menu-item {
    color: var(--text-secondary);
    border-left: 3px solid transparent;
}
```

#### Hover 状态
```css
.menu-item:hover {
    background: rgba(14, 165, 233, 0.1);
    color: var(--primary);
    border-left-color: var(--primary);
    padding-left: 18px;  /* 微妙的右移 */
}
```

#### Active 状态
```css
.menu-item.active {
    background: rgba(14, 165, 233, 0.15);
    color: var(--primary);
    border-left-color: var(--primary);
    font-weight: 600;
}
```

---

## 响应式设计

### 断点系统
```css
/* 默认：4列网格 (1920px+) */
.content-area {
    grid-template-columns: repeat(4, 1fr);
}

/* 平板：3列网格 (<1920px) */
@media (max-width: 1920px) {
    .content-area {
        grid-template-columns: repeat(3, 1fr);
    }
    /* 大卡片缩小为 1×1 */
    .system-status { 
        grid-column: span 1; 
        grid-row: span 1;
    }
}
```

---

## 代码最佳实践

### 1. CSS 变量统一管理
```css
:root {
    --primary: #0EA5E9;
    --text-primary: #e0e6ed;
    --border-light: rgba(61, 220, 151, 0.2);
}

/* 使用变量 */
.card {
    color: var(--text-primary);
    border: 1px solid var(--border-light);
}
```

### 2. 渐变背景创建深度
```css
/* 避免纯色 */
background: #0B1426;

/* 改用渐变 */
background: linear-gradient(135deg, #0B1426 0%, #0f2847 50%, #0B1426 100%);
```

### 3. 毛玻璃效果 (Glassmorphism)
```css
.card {
    background: rgba(20, 32, 60, 0.7);
    backdrop-filter: blur(10px);
}
```

### 4. 平滑过渡，避免突兀
```css
.element {
    transition: all 0.3s ease;  /* 所有属性平滑过渡 */
}
```

### 5. 准确的信息层级
```html
<!-- 大标题 -->
<div class="top-bar-title">🎯 系统总览 · Token 母体</div>

<!-- 卡片标题 -->
<div class="card-title"><span class="card-icon">⚡</span> CPU 使用</div>

<!-- 指标标签 -->
<span class="metric-label">当前</span>

<!-- 指标数值 -->
<span class="metric-value">42.5%</span>
```

---

## 图标使用指南

使用 Emoji 作为图标系统，符号清晰：
- 📊 数据/统计
- 🖥️ 计算机/设备
- 🚨 告警/严重
- 🤖 AI/自动化
- ⚡ 电力/性能
- 🧠 内存/计算
- 💾 存储/磁盘
- 🌐 网络
- 🌡️ 温度
- 🟢 在线/正常
- ✅ 成功/完成
- ⚙️ 配置/设置

---

## 前端交付清单

✅ **核心功能**
- [ ] 4 列响应式网格布局
- [ ] 6 个指标卡片 + 进度条
- [ ] 系统状态卡片 + 浮动动画
- [ ] 告警面板 + 3 条告警
- [ ] 事件流 + 5 条历史
- [ ] 侧边栏 + 3 个菜单分组

✅ **交互设计**
- [ ] 菜单 Hover 效果
- [ ] 菜单 Active 状态
- [ ] 卡片 Hover 高亮
- [ ] 实时时间更新
- [ ] 模拟数据闪烁

✅ **视觉细节**
- [ ] 渐变背景
- [ ] 毛玻璃效果
- [ ] 浮动/脉冲动画
- [ ] 一致的色彩主题
- [ ] 清晰的信息层级

---

## 常见问题 (FAQ)

### Q: 如何避免"AI 设计"感？
A: 
1. 使用系统字体，不用 Inter/Space Grotesk
2. 采用明确的设计意图（工业科技风）
3. 细节处理：顶部边光、毛玻璃、渐变
4. 限制颜色数量（5种主色）

### Q: 如何制作毛玻璃效果？
A:
```css
background: rgba(20, 32, 60, 0.7);
backdrop-filter: blur(10px);
```

### Q: 如何实现响应式网格？
A:
```css
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```

### Q: 动画会不会影响性能？
A: 使用 CSS animations 而非 JS 动画，GPU 加速。脉冲（2s）和浮动（3s）动画影响可忽略。

---

## 参考资源

- **Skill**: frontend-design (设计规范与最佳实践)
- **技术栈**: HTML + CSS + JavaScript (纯原生，无框架)
- **浏览器支持**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)

---

## 下一步扩展

### Phase 2：交互增强
- [ ] 图表库（Chart.js 或 ECharts）
- [ ] 实时数据 WebSocket
- [ ] 仪表盘拖拽重排
- [ ] 主题切换（亮/暗）

### Phase 3：组件库
- [ ] 模态框 / 弹窗
- [ ] 下拉菜单 / 选择器
- [ ] 表格 / 数据网格
- [ ] 表单 / 输入验证

### Phase 4：高级交互
- [ ] 动画过渡库（Framer Motion 风格）
- [ ] 拖拽排序
- [ ] 虚拟滚动（大数据列表）
- [ ] 键盘快捷键

---

**最后更新**: 2026年6月27日  
**设计版本**: v2.0 (基于 frontend-design Skill)  
**技术状态**: ✅ 生产就绪
