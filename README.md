# Token 母体 - 机房智能运维 AI Agent 系统

## 📋 项目概述

Token 母体是一个面向数据中心和机房的智能运维 AI Agent 系统。通过集成智谱 AI、飞书工作台等多端接入，提供智能搜索、实时监控、任务编排等能力。

### 核心功能
- 🔍 **智能搜索** - 快速查询机房设备状态、告警信息
- 📊 **实时监控** - 控制台概览、关键指标监测
- 🔄 **任务编排** - Hermes 场景管理与自动化执行
- 🌐 **多端接入** - Web / 飞书 / 智谱 AI 集成
- 🤖 **AI 驱动** - 基于大语言模型的智能决策

## 🚀 快速开始

### 前置要求
- Docker >= 20.10
- Docker Compose >= 1.29
- 至少 2GB 可用内存

### 一键启动

```bash
# 进入项目目录
cd token-matrix

# 启动所有服务
docker-compose up
```

执行完成后，即可访问：
- **前端**: http://localhost:3000
- **后端 API**: http://localhost:8000
- **API 文档**: http://localhost:8000/docs

### 停止服务

```bash
docker-compose down
```

### 完整删除（含数据）

```bash
docker-compose down -v
```

## 📁 项目结构

```
token-matrix/
├── frontend/                    # 前端应用
│   ├── Dockerfile              # 前端容器构建配置
│   ├── index.html              # 主页面
│   ├── styles.css              # 样式文件
│   ├── script.js               # 交互脚本
│   └── public/                 # 静态资源
├── backend/                     # 后端应用
│   ├── Dockerfile              # 后端容器构建配置
│   ├── main.py                 # FastAPI 应用主文件
│   ├── requirements.txt         # Python 依赖
│   └── config/                 # 配置模块
│       └── settings.py         # 配置文件
├── hermes/                      # AI 任务编排
│   └── scenarios/              # 场景文件占位符
├── docker-compose.yml          # Docker Compose 编排
├── .env.example                # 环境变量示例
├── .dockerignore               # Docker 构建忽略文件
└── README.md                   # 本文件
```

## 🔧 配置说明

### 环境变量

复制 `.env.example` 为 `.env` 并根据需要修改：

```bash
cp .env.example .env
```

关键配置项：

| 变量名 | 说明 | 默认值 |
|------|------|--------|
| `ENV` | 运行环境 | `development` |
| `DEBUG` | 调试模式 | `false` |
| `ZHIPU_API_KEY` | 智谱 AI API 密钥 | 空 |
| `FEISHU_APP_ID` | 飞书应用 ID | 空 |
| `FEISHU_APP_SECRET` | 飞书应用密钥 | 空 |
| `DATABASE_URL` | 数据库连接串 | postgresql://... |

### 日志查看

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🧪 测试 API

### 1. 健康检查
```bash
curl http://localhost:8000/health
```

预期响应：
```json
{
  "status": "ok",
  "timestamp": "2026-06-27T10:30:00.000000",
  "version": "0.1.0"
}
```

### 2. 智能搜索
```bash
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{"query": "温度异常", "limit": 5}'
```

### 3. 控制台概览
```bash
curl http://localhost:8000/console_overview
```

### API 文档

访问 http://localhost:8000/docs 可看 Swagger UI 交互文档。

## 🐳 Docker 命令参考

### 构建镜像
```bash
# 构建前端镜像
docker build -t token-matrix-frontend ./frontend

# 构建后端镜像
docker build -t token-matrix-backend ./backend

# 使用 Docker Compose 构建
docker-compose build
```

### 查看镜像和容器
```bash
# 列出镜像
docker images | grep token-matrix

# 列出容器
docker ps -a | grep token-matrix
```

### 进入容器调试
```bash
# 进入后端容器
docker exec -it token-matrix-backend bash

# 进入前端容器
docker exec -it token-matrix-frontend sh

# 查看容器状态
docker inspect token-matrix-backend
```

### 清理资源
```bash
# 删除容器
docker-compose rm

# 删除镜像
docker rmi token-matrix-frontend token-matrix-backend

# 删除未使用的资源
docker system prune -a
```

## 📝 开发指南

### 后端开发

1. **修改代码**
   - 编辑 `backend/main.py` 或 `backend/config/*.py`

2. **本地测试**
   ```bash
   cd backend
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **重新构建容器**
   ```bash
   docker-compose build backend
   docker-compose up backend
   ```

### 前端开发

1. **修改代码**
   - 编辑 `frontend/index.html`, `frontend/styles.css`, `frontend/script.js`

2. **本地测试**
   - 使用任意 HTTP 服务器
   ```bash
   cd frontend
   python -m http.server 3000
   ```

3. **重新构建容器**
   ```bash
   docker-compose build frontend
   docker-compose up frontend
   ```

## 🔐 安全注意事项

- ⚠️ **绝不在代码中提交密钥** - 使用 `.env` 文件
- ⚠️ **生产环境禁用 CORS** - 配置 `CORS_ORIGINS`
- ⚠️ **定期更新依赖** - `pip list --outdated`
- ⚠️ **启用 DEBUG 仅用于开发** - 生产环境关闭

## 🛠️ 故障排除

### 容器启动失败

**现象**: `docker-compose up` 后服务无法正常启动

**解决**:
```bash
# 查看详细错误日志
docker-compose logs backend
docker-compose logs frontend

# 检查端口占用
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# 重新构建
docker-compose down
docker-compose up --build
```

### 前端无法连接后端

**现象**: 浏览器控制台 CORS 错误

**解决**:
- 检查 `docker-compose.yml` 中 `CORS_ORIGINS` 配置
- 确保后端服务正常运行: `curl http://localhost:8000/health`
- 检查网络连接: `docker network inspect token-network`

### 端口被占用

**现象**: `bind: address already in use`

**解决**:
```bash
# Windows 查找占用 3000 端口的进程
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# 修改 docker-compose.yml 中的端口映射
# 例如将 3000:3000 改为 3001:3000
```

## 📦 依赖管理

### 后端依赖
- **fastapi** - Web 框架
- **uvicorn** - ASGI 服务器
- **pydantic** - 数据验证

### 添加新依赖
```bash
# 本地添加
pip install package_name
pip freeze > backend/requirements.txt

# 重新构建容器
docker-compose build backend
```

## 🚢 部署到生产

### 环境变量设置
```bash
# 创建生产环境配置
cp .env.example .env.production
# 编辑 .env.production，设置实际的 API 密钥和数据库连接
```

### 启动生产环境
```bash
# 使用特定的 .env 文件
docker-compose --env-file .env.production up -d
```

### 监控和日志
```bash
# 查看实时日志
docker-compose logs -f

# 导出日志到文件
docker-compose logs > logs.txt

# 使用 ELK Stack 等日志系统进行集中管理
```

## 📞 支持和联系

- 📧 问题反馈：请提交 Issue
- 💬 讨论区：GitHub Discussions
- 📚 文档：https://docs.token-matrix.dev

## 📄 许可证

Token 母体 - 机房智能运维 AI Agent 系统

---

**最后更新**: 2026-06-27
**版本**: 0.1.0
