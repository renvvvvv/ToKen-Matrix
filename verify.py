#!/usr/bin/env python3
"""
Token 母体项目结构和内容验证脚本
验证所有必需文件是否存在且内容正确
"""

import os
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent

# 定义需要验证的文件结构
REQUIRED_FILES = {
    "docker-compose.yml": "version",
    "docker-compose.yml": "services",
    ".env.example": "ZHIPU_API_KEY",
    ".dockerignore": "node_modules",
    "README.md": "Token 母体",
    "backend/main.py": "FastAPI",
    "backend/requirements.txt": "fastapi",
    "backend/Dockerfile": "python:3.11",
    "backend/config/settings.py": "Config",
    "backend/config/__init__.py": "from .settings",
    "frontend/index.html": "<!DOCTYPE html",
    "frontend/styles.css": ":root",
    "frontend/script.js": "API_BASE_URL",
    "frontend/Dockerfile": "nginx:alpine",
    "hermes/scenarios/README.md": "Hermes",
}

def check_file_exists(file_path):
    """检查文件是否存在"""
    full_path = PROJECT_ROOT / file_path
    if not full_path.exists():
        return False, f"❌ 文件不存在: {file_path}"
    return True, f"✓ 文件存在: {file_path}"

def check_file_content(file_path, required_content):
    """检查文件内容是否包含所需的关键字"""
    full_path = PROJECT_ROOT / file_path
    try:
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
        if required_content in content:
            return True, f"✓ {file_path} 包含: {required_content}"
        else:
            return False, f"❌ {file_path} 缺少: {required_content}"
    except Exception as e:
        return False, f"❌ {file_path} 读取错误: {str(e)}"

def verify_directory_structure():
    """验证目录结构"""
    required_dirs = [
        "backend",
        "backend/config",
        "frontend",
        "hermes/scenarios",
    ]
    
    results = []
    for dir_path in required_dirs:
        full_path = PROJECT_ROOT / dir_path
        if full_path.is_dir():
            results.append((True, f"✓ 目录存在: {dir_path}"))
        else:
            results.append((False, f"❌ 目录不存在: {dir_path}"))
    
    return results

def main():
    """主验证函数"""
    print("=" * 60)
    print("Token 母体 - 项目结构验证")
    print("=" * 60)
    
    all_passed = True
    
    # 验证目录结构
    print("\n📁 目录结构验证:")
    print("-" * 60)
    dir_results = verify_directory_structure()
    for passed, message in dir_results:
        print(message)
        if not passed:
            all_passed = False
    
    # 验证文件内容
    print("\n📄 文件内容验证:")
    print("-" * 60)
    
    file_checks = {}
    for file_path, content in REQUIRED_FILES.items():
        # 避免重复检查同一文件
        if file_path not in file_checks:
            file_checks[file_path] = []
        file_checks[file_path].append(content)
    
    for file_path, contents in file_checks.items():
        # 先检查文件是否存在
        exists, msg = check_file_exists(file_path)
        print(msg)
        if not exists:
            all_passed = False
            continue
        
        # 检查文件内容
        for required_content in contents:
            passed, msg = check_file_content(file_path, required_content)
            print(msg)
            if not passed:
                all_passed = False
    
    # 打印总结
    print("\n" + "=" * 60)
    if all_passed:
        print("✅ 所有验证通过！项目结构完整。")
        print("=" * 60)
        print("\n🚀 下一步:")
        print("1. 确保 Docker Desktop 已启动")
        print("2. 运行: docker-compose build")
        print("3. 运行: docker-compose up")
        print("4. 访问前端: http://localhost:3000")
        print("5. 访问 API 文档: http://localhost:8000/docs")
        return 0
    else:
        print("❌ 验证失败！请检查上述错误。")
        print("=" * 60)
        return 1

if __name__ == "__main__":
    sys.exit(main())
