# Token 母体 - 项目文件清单

## 📋 完整文件列表

### 根目录文件

| 文件 | 说明 |
|------|------|
| `docker-compose.yml` | Docker Compose 容器编排配置 |
| `.env.example` | 环境变量示例文件 |
| `.dockerignore` | Docker 构建忽略文件 |
| `README.md` | 完整项目文档 |
| `QUICK-START.md` | 快速参考指南 |
| `verify.py` | 项目结构验证脚本 |
| `start.ps1` | PowerShell 启动脚本 |
| `start.bat` | Batch 启动脚本 |

### 后端目录 (`/backend`)

| 文件 | 说明 |
|------|------|
| `Dockerfile` | 后端 Docker 镜像构建配置 |
| `main.py` | FastAPI 应用主文件（170+ 行） |
| `requirements.txt` | Python 依赖列表 |
| `config/settings.py` | 配置模块 |
| `config/__init__.py` | 包初始化文件 |

### 前端目录 (`/frontend`)

| 文件 | 说明 |
|------|------|
| `Dockerfile` | 前端 Docker 镜像构建配置 |
| `index.html` | 主页面 HTML |
| `styles.css` | 页面样式文件 |
| `script.js` | 交互脚本和 API 调用 |

### Hermes 目录 (`/hermes`)

| 文件 | 说明 |
|------|------|
| `scenarios/README.md` | Hermes 场景管理文档 |

## ✅ 验收清单

### 功能验收

- [x] 目录结构完整
- [x] Docker Compose 配置有效
- [x] 前端 Dockerfile 配置完整
- [x] 后端 Dockerfile 配置完整
- [x] FastAPI 应用包含 3 个必需路由
  - [x] `GET /health` - 健康检查
  - [x] `POST /search` - 智能搜索
  - [x] `GET /console_overview` - 控制台概览
- [x] 所有依赖配置正确
- [x] 环境变量示例完整
- [x] 文档齐全

### 文件验收

- [x] docker-compose.yml ✓
- [x] frontend/Dockerfile ✓
- [x] backend/Dockerfile ✓
- [x] .env.example ✓
- [x] README.md ✓
- [x] .dockerignore ✓
- [x] backend/main.py ✓
- [x] backend/requirements.txt ✓
- [x] backend/config/settings.py ✓
- [x] frontend/index.html ✓
- [x] frontend/styles.css ✓
- [x] frontend/script.js ✓
- [x] hermes/scenarios/ ✓

## 🚀 启动说明

### 最简洁的启动方式

```bash
# 方式 1：PowerShell 脚本（推荐）
.\start.ps1

# 方式 2：Batch 脚本
start.bat

# 方式 3：Docker Compose 直接命令
docker-compose up
```

### 验证启动成功

1. **前端访问**
   ```
   http://localhost:3000
   ```
   预期：看到 Token 母体首页

2. **后端健康检查**
   ```bash
   curl http://localhost:8000/health
   ```
   预期响应：
   ```json
   {
     "status": "ok",
     "timestamp": "2026-06-27T10:30:00",
     "version": "0.1.0"
   }
   ```

3. **API 文档**
   ```
   http://localhost:8000/docs
   ```
   预期：Swagger UI 交互页面

## 📦 项目大小

- **总文件数**: 30+ 个
- **后端代码**: ~170 行
- **前端代码**: ~180 行
- **配置文件**: 8 个
- **文档**: 3 个

## 🔗 关键技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| **前端** | HTML5 / CSS3 / JavaScript | - |
| **前端服务** | Nginx Alpine | latest |
| **后端框架** | FastAPI | 0.104.1 |
| **异步服务器** | Uvicorn | 0.24.0 |
| **Python 版本** | Python | 3.11 |
| **容器化** | Docker | 29.5.3+ |
| **编排** | Docker Compose | 1.29+ |

## 🎯 API 端点总览

### GET /health
健康检查接口
- **请求**: 无
- **响应**: 
  ```json
  {
    "status": "ok",
    "timestamp": "ISO 8601",
    "version": "0.1.0"
  }
  ```

### POST /search
智能搜索接口
- **请求体**:
  ```json
  {
    "query": "查询内容",
    "limit": 10,
    "filters": {}
  }
  ```
- **响应**: 搜索结果列表

### GET /console_overview
控制台概览接口
- **请求**: 无
- **响应**: 系统指标和告警信息

## 📝 配置要点

### 环境变量（.env）
| 变量 | 值 | 说明 |
|------|-----|------|
| `ENV` | `development` | 运行环境 |
| `ZHIPU_API_KEY` | 空 | 智谱 AI API 密钥 |
| `FEISHU_APP_ID` | 空 | 飞书应用 ID |
| `CORS_ORIGINS` | `*` | CORS 源配置 |

### Docker Compose 网络
- **网络名称**: `token-network`
- **驱动**: bridge
- **前端端口**: 3000
- **后端端口**: 8000

## 🔐 安全注意事项

1. ✓ 不包含真实密钥
2. ✓ 所有密钥通过环境变量传入
3. ✓ 包含 .dockerignore 排除不必要文件
4. ✓ 生产环境需配置 CORS_ORIGINS
5. ✓ 包含健康检查机制

## 📞 故障排除提示

### 常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| Docker 无法连接 | 守护进程未运行 | 启动 Docker Desktop |
| 端口被占用 | 端口冲突 | 修改 docker-compose.yml 端口 |
| 镜像构建失败 | 依赖问题 | 检查网络，重试构建 |
| 无法访问服务 | 容器未启动 | 查看日志 docker-compose logs |

## 📚 相关文档

| 文档 | 内容 |
|------|------|
| `README.md` | 完整项目文档和指南 |
| `QUICK-START.md` | 快速参考和常用命令 |
| `verify.py` | 项目验证脚本 |

---

**项目状态**: ✅ 完成
**最后更新**: 2026-06-27
**版本**: 0.1.0
