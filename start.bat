@echo off
REM Token 母体 - Docker 一键启动脚本

echo.
echo ========================================
echo  Token 母体 - 机房智能运维 AI Agent 系统
echo ========================================
echo.

REM 检查 Docker 是否已启动
echo 检查 Docker 状态...
docker ps >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ Docker 未运行，正在启动 Docker Desktop...
    echo.
    if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
        start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
        echo 请等待 Docker 启动...
        timeout /t 15 /nobreak
    ) else (
        echo ❌ 无法找到 Docker Desktop，请手动启动
        pause
        exit /b 1
    )
)

echo.
echo 📦 检查并构建镜像...
docker-compose build

echo.
echo 🚀 启动容器...
docker-compose up

echo.
echo 如需停止服务，按 Ctrl+C
