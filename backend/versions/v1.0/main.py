"""Token 母体 - 机房智能运维 AI Agent 后端服务"""

from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

app = FastAPI(
    title="Token 母体 API",
    description="机房智能运维 AI Agent 系统",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AgentChatRequest(BaseModel):
    agent: str
    message: str
    context: Optional[Dict[str, Any]] = None


class AgentChatResponse(BaseModel):
    agent: str
    reply: str
    timestamp: str


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "version": "0.2.0",
    }


@app.get("/console", response_class=HTMLResponse, tags=["Console"])
async def console():
    """控制台页面 - 白色浅蓝数据中心仪表盘"""
    console_path = Path(__file__).with_name("console.html")
    return HTMLResponse(content=console_path.read_text(encoding="utf-8"))


@app.post("/agent/chat", response_model=AgentChatResponse, tags=["Agent"])
async def agent_chat(request: AgentChatRequest):
    agent_facts = {
        "token母体-总览": "6 大子系统整体可用率 99.95%，当前 P0 告警 1 条、P1 告警 2 条。",
        "token母体-动环": "CRAC 1# 出风温度偏高，F3 存储区热通道 32.6℃，UPS-B 负载 85%。",
        "token母体-消防": "烟感 128/128 在线，喷淋压力 4.2bar，消防主机无火警。",
        "token母体-CCTV": "48 路视频中 46 路在线，12# 与 27# 摄像头离线，AI 行为识别正常。",
        "token母体-安防": "今日门禁 156 条，非工作时段刷卡 1 次，已完成审批留痕。",
        "token母体-openClaw": "当前待派 3 单、进行中 15 单、今日完成 89 单，平均派单 47 秒。",
        "token母体-工单": "工单系统待办 12、超时 0、平均处理 24 分钟，P0 工单 #20266 处理中。",
    }
    fact = agent_facts.get(request.agent, "当前页面上下文已接入 Token 母体。")
    return AgentChatResponse(
        agent=request.agent,
        reply=f"我是 {request.agent}。{fact} 针对你的问题『{request.message}』，建议先查看告警、关联楼层和工单闭环记录。",
        timestamp=datetime.now().isoformat(),
    )


@app.get("/", tags=["Info"])
async def root():
    return {
        "name": "Token 母体 API",
        "version": "0.2.0",
        "console": "/console",
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
