#!/usr/bin/env pwsh
<#
Token 母体 - Docker 一键启动脚本
#>

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Token 母体 - 机房智能运维 AI Agent 系统" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Docker 是否已启动
Write-Host "检查 Docker 状态..." -ForegroundColor Yellow
$dockerRunning = $false
try {
    docker ps > $null 2>&1
    $dockerRunning = $?
} catch {
    $dockerRunning = $false
}

if (-not $dockerRunning) {
    Write-Host ""
    Write-Host "❌ Docker 未运行，正在启动 Docker Desktop..." -ForegroundColor Red
    Write-Host ""
    
    $dockerPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    if (Test-Path $dockerPath) {
        Start-Process $dockerPath -WindowStyle Hidden
        Write-Host "请等待 Docker 启动..." -ForegroundColor Yellow
        Start-Sleep -Seconds 15
    } else {
        Write-Host "❌ 无法找到 Docker Desktop，请手动启动" -ForegroundColor Red
        Read-Host "按 Enter 键退出"
        exit 1
    }
}

# 验证项目文件
Write-Host "✓ 验证项目文件..." -ForegroundColor Green
$verifyResult = python verify.py
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ 项目文件验证失败！" -ForegroundColor Red
    Read-Host "按 Enter 键退出"
    exit 1
}

# 构建镜像
Write-Host ""
Write-Host "📦 构建 Docker 镜像..." -ForegroundColor Yellow
docker-compose build
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Docker 镜像构建失败！" -ForegroundColor Red
    Read-Host "按 Enter 键退出"
    exit 1
}

# 启动服务
Write-Host ""
Write-Host "🚀 启动容器服务..." -ForegroundColor Green
Write-Host ""

docker-compose up

Write-Host ""
Write-Host "如需停止服务，请按 Ctrl+C" -ForegroundColor Yellow
