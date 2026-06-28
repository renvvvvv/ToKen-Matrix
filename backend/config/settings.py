"""
后端配置模块 - 配置占位符
"""

import os
from typing import Optional

class Config:
    """基础配置"""
    
    # 应用设置
    APP_NAME = "Token 母体 API"
    APP_VERSION = "0.1.0"
    DEBUG = os.getenv("DEBUG", "false").lower() == "true"
    
    # 服务器设置
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    
    # 数据库设置（占位）
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost/tokenmatrix")
    
    # API 密钥（占位）
    API_KEY = os.getenv("API_KEY", "dev-key-123")
    
    # Zhipu AI 配置（占位）
    ZHIPU_API_KEY = os.getenv("ZHIPU_API_KEY", "")
    
    # 飞书配置（占位）
    FEISHU_APP_ID = os.getenv("FEISHU_APP_ID", "")
    FEISHU_APP_SECRET = os.getenv("FEISHU_APP_SECRET", "")
    
    # Hermes 配置（占位）
    HERMES_SCENARIO_PATH = os.getenv("HERMES_SCENARIO_PATH", "/app/hermes/scenarios")
    
    # CORS 设置
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
    
    @classmethod
    def get_config(cls):
        """获取配置实例"""
        return cls()

# 开发环境配置
class DevelopmentConfig(Config):
    """开发环境配置"""
    DEBUG = True

# 生产环境配置
class ProductionConfig(Config):
    """生产环境配置"""
    DEBUG = False

def get_config() -> Config:
    """根据环境获取配置"""
    env = os.getenv("ENV", "development")
    if env == "production":
        return ProductionConfig()
    return DevelopmentConfig()
