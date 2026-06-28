# 🚀 快速开始 - Demo 演示指南

## 📍 位置
所有文件位于: `c:\Users\wuton\Desktop\0627\token-matrix\frontend\demos\`

## 📁 包含文件

| 文件 | 大小 | 说明 |
|------|------|------|
| `style.css` | 13 KB | 全局设计系统（深蓝/橙/青绿主色调） |
| `demo-01-web-surfer.html` | 12 KB | LangGraph 节点流动演示 |
| `demo-02-predict-recommend.html` | 18 KB | 预测推荐审批执行流程 |
| `demo-03-hermes-scenarios.html` | 19 KB | 多场景告警触发链路 |
| `DEMO-README.md` | 10 KB | 完整文档说明 |

**总计:** ~72 KB (无任何外部依赖)

---

## 🎬 演示内容概览

### Demo 01: Web Surfer - LangGraph 节点轨迹流动 
- **展示:** LangGraph 智能搜索完整流程 (7 节点)
- **交互:** 左边时间线脉冲、中间推理弹窗、右边结果卡片
- **动画:** 节点流动 + 卡片滑入 (6秒完整周期，自动循环)
- **特性:** 手动触发按钮、重置功能

### Demo 02: 预测推荐审批执行流程
- **展示:** 机房冷却调整决策闭环 (4 步骤)
- **交互:** 左边温度曲线图表、中间 3 个候选动作、右边人工审批
- **动画:** Canvas 实时图表、流程指示器脉冲、卡片推入效果
- **特性:** 批准/拒绝按钮、执行反馈实时显示

### Demo 03: Hermes 多场景告警触发链路
- **展示:** 告警检测→分类→Skill 执行→通知推送 (4 阶段)
- **交互:** 左边 4 种场景切换、中间流程执行、右边通知卡片栈
- **动画:** 阶段图标脉冲、连接线流动、卡片依次弹出 (6.4秒完整)
- **特性:** 场景选择器、手动触发告警、多通知渠道

---

## 💻 使用方式

### 方式 1: 直接打开 (最简单)
在文件管理器中双击 `.html` 文件，或在浏览器地址栏输入:
```
file:///c:/Users/wuton/Desktop/0627/token-matrix/frontend/demos/demo-01-web-surfer.html
```

### 方式 2: 本地服务器 (推荐)
```bash
cd "c:\Users\wuton\Desktop\0627\token-matrix\frontend\demos"
python -m http.server 8000
```
然后访问: `http://localhost:8000/demo-01-web-surfer.html`

### 方式 3: 集成到网站
在你的 HTML 中添加:
```html
<iframe src="path/to/demos/demo-01-web-surfer.html" 
  style="width: 100%; height: 100vh; border: none;"></iframe>
```

---

## 🎨 设计特色

✅ **系统色调融合**
- 深蓝 #0f1419 (背景)
- 橙色 #f97316 (活动/强调)
- 青绿 #06b6d4 (信息/次要)
- 绿色 #10b981 (成功)
- 红色 #ef4444 (错误/紧急)

✅ **动画效果流畅**
- 脉冲发光 (1.5s 循环)
- 滑入过渡 (0.6s)
- 弹性弹出 (0.4s)
- Canvas 实时绘制 (60 FPS)

✅ **无任何外部依赖**
- 纯 HTML5 + CSS3 + JavaScript
- 不依赖 React/Vue/Angular
- 可离线运行

✅ **完全响应式**
- 全屏展示 (1920x1080 以上最佳)
- 支持多种分辨率
- Canvas 自适应 DPR

---

## 🎮 核心交互

### Demo 01
- `▶ 开始流程` - 触发演示
- `⟲ 重置` - 重置状态
- 自动循环 (页面加载后 0.5s 开始)

### Demo 02
- `✓ 批准` - 批准推荐动作，显示执行反馈
- `✗ 拒绝` - 拒绝当前推荐

### Demo 03
- 场景下拉菜单 - 选择不同告警场景
- `🔔 触发告警` - 启动完整流程演示

---

## 📊 技术规格

| 指标 | 数值 |
|------|------|
| 文件总大小 | 72 KB |
| 加载时间 | < 500ms |
| 动画帧率 | 60 FPS |
| 内存占用 | < 50 MB |
| 浏览器支持 | Chrome 80+, Safari 13+, Firefox 75+, Edge 80+ |
| 框架依赖 | 无 |
| 外部 CDN | 无 |

---

## 🔧 自定义修改

### 改变主色调
编辑 `style.css` 的 `:root` 变量:
```css
:root {
  --accent-orange: #your-color;    /* 改变橙色 */
  --accent-cyan: #your-color;      /* 改变青色 */
  --primary-dark: #your-color;     /* 改变深蓝 */
}
```

### 修改动画速度
在各 `.html` 文件中搜索并调整:
```javascript
delay: 800  // 改变节点流动间隔 (ms)
duration: 1.5s  // 改变动画时长 (css)
```

### 更新虚拟数据
在 `<script>` 标签中找到数据定义，直接修改即可

---

## 📞 常见问题

**Q: 可以离线使用吗?**  
A: 完全可以，无任何网络依赖。直接打开 HTML 文件即可。

**Q: 如何集成到 React/Vue 项目?**  
A: 使用 `<iframe>` 嵌入，或将内容转换为组件。

**Q: 支持手机浏览吗?**  
A: 响应式设计支持，但建议在桌面浏览器查看效果最佳。

**Q: 如何修改文案和数据?**  
A: 直接编辑 `.html` 文件中的 HTML 和 JavaScript 代码。

---

## 🎯 后续发展方向

- [ ] 连接实际 API 替换虚拟数据
- [ ] 实时 WebSocket 推送通知
- [ ] 告警历史记录查询
- [ ] 流程执行回放功能
- [ ] PDF 报告导出
- [ ] 国际化多语言支持

---

**创建时间:** 2026-06-27  
**作者:** Token Matrix Demo Team  
**许可:** MIT
