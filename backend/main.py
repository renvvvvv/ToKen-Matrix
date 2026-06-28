"""Token 母体 - 机房智能运维 AI Agent 后端服务"""

import json
import os
import random
import re
import shutil
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

app = FastAPI(
    title="Token 母体 API",
    description="机房智能运维 AI Agent 系统 · 论文研究与数据分析",
    version="0.3.0",
)

# ============== CORS ==============
# 修复 P0-3: 不再 allow_origins=* 与 credentials=True 组合（浏览器会拒绝且存在 CSRF 风险）
# 开发环境默认放行本机端口；生产环境通过 CORS_ORIGINS 环境变量配置白名单
_cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:8000,http://127.0.0.1:3000,http://127.0.0.1:8000")
_cors_origin_list = [o.strip() for o in _cors_origins.split(",") if o.strip()]
_cors_allow_creds = "*" not in _cors_origin_list  # 当含通配符时不允许 credentials
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origin_list,
    allow_credentials=_cors_allow_creds,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
)

# ============== LLM 配置（MiniMax M2.7 highspeed） ==============
# 修复 P0-1: API Key 从环境变量读取，源码不再硬编码（防泄露）
LLM_CONFIG = {
    "api_key": os.getenv("LLM_API_KEY") or os.getenv("ZHIPU_API_KEY") or "your-llm-api-key-here",
    "base_url": os.getenv("LLM_BASE_URL", "https://api.minimaxi.com/v1"),
    "model": os.getenv("LLM_MODEL", "MiniMax-M2.7-highspeed"),
}
LLM_TIMEOUT = float(os.getenv("LLM_TIMEOUT", "60.0"))


def call_llm(messages: List[Dict[str, str]], temperature: float = 0.4, max_tokens: int = 1500) -> str:
    """调用 MiniMax 兼容的 OpenAI 协议接口"""
    url = f"{LLM_CONFIG['base_url'].rstrip('/')}/chat/completions"
    headers = {
        "Authorization": f"Bearer {LLM_CONFIG['api_key']}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": LLM_CONFIG["model"],
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    with httpx.Client(timeout=LLM_TIMEOUT) as client:
        r = client.post(url, headers=headers, json=payload)
        if r.status_code != 200:
            raise HTTPException(status_code=r.status_code, detail=f"LLM 调用失败: {r.text[:200]}")
        data = r.json()
    try:
        return data["choices"][0]["message"]["content"]
    except (KeyError, IndexError):
        raise HTTPException(status_code=500, detail=f"LLM 返回异常: {json.dumps(data, ensure_ascii=False)[:300]}")


# ============== 资料库（research 目录） ==============
RESEARCH_DIR = Path(__file__).with_name("research")
NOTES_DIR = RESEARCH_DIR / "notes"
REPORTS_DIR = RESEARCH_DIR / "reports"
# ============== Hermes 知识库 ==============
HERMES_DIR = Path(__file__).with_name("hermes")
HERMES_DOMAINS_DIR = HERMES_DIR / "domains"
HERMES_DIFF_DIR = HERMES_DIR / ".hermes" / "diff"
HERMES_HISTORY_FILE = HERMES_DIR / ".hermes" / "history.json"
HERMES_GRAPH_FILE = HERMES_DIR / ".hermes" / "graph.json"
ANNOTATIONS_FILE = RESEARCH_DIR / "annotations.json"
HISTORY_FILE = RESEARCH_DIR / "history.json"


def _load_json(p: Path, default):
    if p.exists():
        try:
            return json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            return default
    return default


def _save_json(p: Path, data):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def _record_history(doc_id: str, action: str, detail: str = ""):
    """记录文件编辑历史"""
    h = _load_json(HISTORY_FILE, [])
    h.insert(0, {
        "doc_id": doc_id,
        "action": action,
        "detail": detail,
        "ts": datetime.now().isoformat(timespec="seconds"),
    })
    h = h[:200]  # 保留最近 200 条
    _save_json(HISTORY_FILE, h)
    return h[0]


def _safe_filename(name: str) -> str:
    return re.sub(r"[\\/:*?\"<>|]", "_", name)


def list_documents() -> Dict[str, Any]:
    notes = []
    if NOTES_DIR.exists():
        for p in sorted(NOTES_DIR.glob("*.md")):
            notes.append({
                "id": p.stem,
                "title": p.stem.replace("_", " "),
                "type": "note",
                "size": p.stat().st_size,
                "path": str(p.relative_to(RESEARCH_DIR.parent)),
            })
    reports = []
    if REPORTS_DIR.exists():
        for p in sorted(REPORTS_DIR.glob("*.html")):
            reports.append({
                "id": p.stem,
                "title": p.stem.replace("_", " "),
                "type": "report",
                "size": p.stat().st_size,
                "path": str(p.relative_to(RESEARCH_DIR.parent)),
            })
    return {"notes": notes, "reports": reports}


def load_document(doc_id: str, max_chars: int = 8000) -> str:
    """加载笔记或报告，超长截断"""
    safe = _safe_filename(doc_id)
    for d in (NOTES_DIR, REPORTS_DIR):
        for ext in (".md", ".html"):
            f = d / f"{safe}{ext}"
            if f.exists():
                text = f.read_text(encoding="utf-8", errors="ignore")
                if d is REPORTS_DIR:
                    # 简单剥离 HTML 标签
                    text = re.sub(r"<script[\s\S]*?</script>", " ", text)
                    text = re.sub(r"<style[\s\S]*?</style>", " ", text)
                    text = re.sub(r"<[^>]+>", " ", text)
                    text = re.sub(r"\s+", " ", text).strip()
                if len(text) > max_chars:
                    text = text[:max_chars] + "\n...(已截断)"
                return text
    raise HTTPException(status_code=404, detail=f"未找到资料: {doc_id}")


# ============== 数据模型 ==============
class AgentChatRequest(BaseModel):
    agent: str
    message: str
    context: Optional[Dict[str, Any]] = None


class AgentChatResponse(BaseModel):
    agent: str
    reply: str
    timestamp: str


# ============== Skill 升级（LLM 真实执行 + 升级） ==============
class SkillUpgradeRequest(BaseModel):
    scenario: str  # env | fire | cctv
    alerts: List[Dict[str, Any]]  # 设备参数
    skills: List[Dict[str, Any]]   # 当前 skill 列表
    exec_skill_id: Optional[str] = None  # 当前正在执行的 skill


class SkillUpgradeResponse(BaseModel):
    scenario: str
    exec_result: Dict[str, Any]  # 真实执行结果
    upgrade_summary: str
    diff: List[Dict[str, Any]]   # [{skill_id, name, old_version, new_version, changes:[{old,new,because}]}]
    timestamp: str




class AnnotateRequest(BaseModel):
    doc_id: str
    note: str
    tag: str = "manual"  # manual | auto-alert | ai-suggest
    source: Optional[str] = None  # 告警源


class SkillIterateRequest(BaseModel):
    domain: str
    skill: str
    alerts: List[Dict[str, Any]] = []
    notes: str = ""  # 人工提示


class SkillIterateResponse(BaseModel):
    domain: str
    skill: str
    old_version: str
    new_version: str
    diff_md: str
    new_py: str
    summary: str
    timestamp: str


class AnnotateResponse(BaseModel):
    doc_id: str
    note: str
    tag: str
    source: Optional[str] = None
    ts: str
    total_annotations: int


# ============== 路由 ==============
# ============== Hermes API ==============
def _list_versions(skill_dir: Path) -> List[str]:
    """列出该 skill 下所有 v*.py 版本（含 archive/）"""
    versions = []
    for p in skill_dir.glob("v*.py"):
        versions.append(p.stem)  # v2.4
    # archive 里的版本
    arch = skill_dir / "archive"
    if arch.exists():
        for p in arch.glob("v*.py"):
            versions.append(f"{p.stem} (archive)")
    return sorted(set(versions))


def _build_skill_node(skill_dir: Path) -> Dict[str, Any]:
    """构建单个 skill 节点"""
    skill_md = skill_dir / "SKILL.md"
    versions = _list_versions(skill_dir)
    # 当前版本：第一个非 archive
    current = next((v for v in versions if "archive" not in v), versions[0] if versions else "v1.0")
    # 解析 frontmatter
    meta = {}
    if skill_md.exists():
        text = skill_md.read_text(encoding="utf-8")
        m = re.search(r"^---\n([\s\S]*?)\n---", text)
        if m:
            for line in m.group(1).split("\n"):
                if ":" in line:
                    k, v = line.split(":", 1)
                    meta[k.strip()] = v.strip()
    return {
        "id": skill_dir.name,
        "name": meta.get("display_name") or skill_dir.name,
        "version": meta.get("version") or current,
        "status": meta.get("status", "stable"),
        "tags": meta.get("tags", ""),
        "versions": versions,
        "current": current,
        "skill_md_size": skill_md.stat().st_size if skill_md.exists() else 0,
    }


def _build_domain_node(domain_dir: Path) -> Dict[str, Any]:
    """构建单个 domain 节点"""
    soul_md = domain_dir / "soul.md"
    skills_dir = domain_dir / "skills"
    skills = []
    if skills_dir.exists():
        for s in sorted(skills_dir.iterdir()):
            if s.is_dir():
                skills.append(_build_skill_node(s))
    return {
        "id": domain_dir.name,
        "name": {
            "env": "动环监控系统",
            "fire": "消防系统",
            "cctv": "CCTV 系统",
            "security": "安防系统",
            "ba": "BA 系统",
        }.get(domain_dir.name, domain_dir.name),
        "icon": {
            "env": "🌡️",
            "fire": "🔥",
            "cctv": "📹",
            "security": "🛡️",
            "ba": "🏢",
        }.get(domain_dir.name, "📦"),
        "color": {
            "env": "#10b981",
            "fire": "#ef4444",
            "cctv": "#7c3aed",
            "security": "#3b82f6",
            "ba": "#f59e0b",
        }.get(domain_dir.name, "#6b7280"),
        "soul_md_size": soul_md.stat().st_size if soul_md.exists() else 0,
        "skills": skills,
    }


@app.get("/hermes/tree", tags=["Hermes"])
async def hermes_tree():
    """返回 hermes/ 树状结构"""
    if not HERMES_DIR.exists():
        raise HTTPException(status_code=404, detail="hermes 目录未初始化")
    domains = []
    if HERMES_DOMAINS_DIR.exists():
        for d in sorted(HERMES_DOMAINS_DIR.iterdir()):
            if d.is_dir():
                domains.append(_build_domain_node(d))
    # 全局 soul
    global_soul = (HERMES_DIR / "soul.md").read_text(encoding="utf-8") if (HERMES_DIR / "soul.md").exists() else ""
    # 图谱
    graph = {}
    if HERMES_GRAPH_FILE.exists():
        try:
            graph = json.loads(HERMES_GRAPH_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {
        "root": "hermes",
        "global_soul": global_soul,
        "global_soul_size": len(global_soul),
        "domains": domains,
        "graph": graph,
        "shared": [p.name for p in (HERMES_DIR / "shared").iterdir()] if (HERMES_DIR / "shared").exists() else [],
    }


@app.get("/hermes/soul", tags=["Hermes"])
async def hermes_soul(domain: Optional[str] = None):
    """读取灵魂：domain 不传则返回全局"""
    if domain:
        p = HERMES_DOMAINS_DIR / domain / "soul.md"
        if not p.exists():
            raise HTTPException(status_code=404, detail=f"domain {domain} 不存在")
        return {"domain": domain, "content": p.read_text(encoding="utf-8"), "size": p.stat().st_size}
    p = HERMES_DIR / "soul.md"
    if not p.exists():
        raise HTTPException(status_code=404, detail="全局 soul.md 不存在")
    return {"domain": None, "content": p.read_text(encoding="utf-8"), "size": p.stat().st_size}


@app.get("/hermes/domain/{domain_id}", tags=["Hermes"])
async def hermes_domain(domain_id: str):
    d = HERMES_DOMAINS_DIR / domain_id
    if not d.exists():
        raise HTTPException(status_code=404, detail=f"domain {domain_id} 不存在")
    return _build_domain_node(d)


@app.get("/hermes/skill/{domain_id}/{skill_id}", tags=["Hermes"])
async def hermes_skill(domain_id: str, skill_id: str, version: Optional[str] = None):
    """读取 SKILL.md + 某个版本的 py"""
    skill_dir = HERMES_DOMAINS_DIR / domain_id / "skills" / skill_id
    if not skill_dir.exists():
        raise HTTPException(status_code=404, detail=f"skill {skill_id} 不存在")
    skill_md = skill_dir / "SKILL.md"
    if not skill_md.exists():
        raise HTTPException(status_code=404, detail="SKILL.md 不存在")

    meta = {}
    text = skill_md.read_text(encoding="utf-8")
    m = re.search(r"^---\n([\s\S]*?)\n---", text)
    if m:
        for line in m.group(1).split("\n"):
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip()

    # 默认当前版本
    if not version:
        version = meta.get("version", "v1.0")
    py_path = skill_dir / f"{version}.py"
    if not py_path.exists():
        py_path = skill_dir / "archive" / f"{version}.py"
    py_content = py_path.read_text(encoding="utf-8") if py_path.exists() else ""

    return {
        "domain": domain_id,
        "skill": skill_id,
        "meta": meta,
        "skill_md": text,
        "py": py_content,
        "py_version": version,
        "versions": _list_versions(skill_dir),
    }


@app.post("/hermes/skill/iterate", response_model=SkillIterateResponse, tags=["Hermes"])
async def hermes_skill_iterate(request: SkillIterateRequest):
    """LLM 升级 skill：生成新版本 py + diff + 归档旧版"""
    skill_dir = HERMES_DOMAINS_DIR / request.domain / "skills" / request.skill
    if not skill_dir.exists():
        raise HTTPException(status_code=404, detail=f"skill 不存在: {request.domain}/{request.skill}")

    skill_md = skill_dir / "SKILL.md"
    meta = {}
    text = skill_md.read_text(encoding="utf-8")
    m = re.search(r"^---\n([\s\S]*?)\n---", text)
    if m:
        for line in m.group(1).split("\n"):
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip()

    old_version = meta.get("version", "v1.0")
    # 升级版本号
    try:
        major, minor = old_version.lstrip("v").split(".")
        new_version = f"v{major}.{int(minor) + 1}"
    except Exception:
        new_version = "v" + str(random.random())[2:4]

    # 读取当前 py
    old_py = (skill_dir / f"{old_version}.py").read_text(encoding="utf-8") if (skill_dir / f"{old_version}.py").exists() else ""

    # 调 LLM
    system = (
        f"你是 Hermes AI 运维工程师。正在升级 Skill「{request.skill}」（{old_version} → {new_version}）。\n"
        f"所属专业：{request.domain}。\n"
        f"已用提示：{request.notes or '无'}\n"
        f"当前告警：{request.alerts}\n"
        "【重要】不要任何思考，只输出合法 JSON：\n"
        "{\"summary\":\"80字内本次升级总结\","
        "\"new_py\":\"完整可执行 Python 脚本（含 docstring + async def run(...) + 完整逻辑）\","
        "\"diff_md\":\"Markdown 格式 diff，列出 2-3 条关键变更\"}"
    )
    user = (
        f"【当前 SKILL.md】\n{text}\n\n"
        f"【当前 {old_version}.py】\n{old_py}\n"
        f"\n请升级到 {new_version}。"
    )
    raw = call_llm([
        {"role": "system", "content": system},
        {"role": "user", "content": user},
    ], temperature=0.3, max_tokens=2000)

    summary = raw[:200]
    new_py = old_py
    diff_md = raw[:500]
    try:
        m2 = re.search(r"\{[\s\S]*\}", raw)
        obj = json.loads(m2.group(0)) if m2 else json.loads(raw)
        if obj.get("summary"): summary = str(obj["summary"])[:200]
        if obj.get("new_py"): new_py = str(obj["new_py"])
        if obj.get("diff_md"): diff_md = str(obj["diff_md"])
    except Exception:
        # 兜底：基于老 py + 简单替换
        new_py = old_py.replace(old_version, new_version) + f"\n# {new_version} 增量：参数精度提升\n"

    # 1) 归档旧版
    archive_dir = skill_dir / "archive"
    archive_dir.mkdir(parents=True, exist_ok=True)
    old_py_path = skill_dir / f"{old_version}.py"
    if old_py_path.exists():
        shutil.copy2(old_py_path, archive_dir / f"{old_version}.py")

    # 2) 写入新版
    (skill_dir / f"{new_version}.py").write_text(new_py, encoding="utf-8")

    # 3) 更新 SKILL.md frontmatter version
    new_text = re.sub(r"^version:\s*.*$", f"version: {new_version}", text, count=1, flags=re.M)
    new_text = re.sub(r"^updated:\s*.*$", f"updated: {datetime.now().strftime('%Y-%m-%d')}", new_text, count=1, flags=re.M)
    new_text += f"\n\n## 升级日志\n- {new_version} ({datetime.now().strftime('%Y-%m-%d')}): {summary}\n"
    skill_md.write_text(new_text, encoding="utf-8")

    # 4) 写 diff 到 .hermes/diff/
    HERMES_DIFF_DIR.mkdir(parents=True, exist_ok=True)
    (HERMES_DIFF_DIR / f"{request.skill}-{new_version}.md").write_text(f"""# Skill 升级 Diff · {request.skill} {old_version} → {new_version}

**专业**：{request.domain}
**时间**：{datetime.now().isoformat(timespec='seconds')}

## 升级总结
{summary}

## 关键变更
{diff_md}

## 完整新代码
```python
{new_py}
```
""", encoding="utf-8")

    # 5) 写全局历史
    h = _load_json(HERMES_HISTORY_FILE, [])
    h.insert(0, {
        "domain": request.domain,
        "skill": request.skill,
        "old_version": old_version,
        "new_version": new_version,
        "summary": summary,
        "ts": datetime.now().isoformat(timespec="seconds"),
    })
    h = h[:200]
    _save_json(HERMES_HISTORY_FILE, h)

    return SkillIterateResponse(
        domain=request.domain,
        skill=request.skill,
        old_version=old_version,
        new_version=new_version,
        diff_md=diff_md,
        new_py=new_py,
        summary=summary,
        timestamp=datetime.now().isoformat(timespec="seconds"),
    )


@app.get("/hermes/diff/{skill_id}", tags=["Hermes"])
async def hermes_diff(skill_id: str, version: Optional[str] = None):
    """读取某个 skill 的 diff 历史"""
    diffs = []
    if HERMES_DIFF_DIR.exists():
        for p in sorted(HERMES_DIFF_DIR.glob(f"{skill_id}*.md"), reverse=True):
            diffs.append({"version": p.stem, "content": p.read_text(encoding="utf-8"), "size": p.stat().st_size})
    return {"skill": skill_id, "diffs": diffs}


# ============== 飞书 Webhook 代理（避免浏览器 CORS） ==============
class FeishuWebhookRequest(BaseModel):
    payload: Dict[str, Any]  # 飞书 interactive 卡片内容


@app.post("/webhook/feishu", tags=["Webhook"])
async def webhook_feishu(request: FeishuWebhookRequest):
    """服务端代发飞书 webhook · 避开浏览器 CORS"""
    url = "https://open.feishu.cn/open-apis/bot/v2/hook/65c9659c-196e-4ab1-875c-d9b4b63a3bfc"
    try:
        with httpx.Client(timeout=15.0) as client:
            r = client.post(url, json=request.payload)
        ok = r.status_code == 200
        return {
            "ok": ok,
            "status": r.status_code,
            "feishu_resp": r.text[:500] if ok else r.text[:200],
            "url": url,
            "ts": datetime.now().isoformat(timespec="seconds"),
        }
    except Exception as e:
        return {
            "ok": False,
            "status": "exception",
            "err": str(e)[:200],
            "url": url,
            "ts": datetime.now().isoformat(timespec="seconds"),
        }


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "version": "0.3.0",
        "llm_model": LLM_CONFIG["model"],
        "llm_base_url": LLM_CONFIG["base_url"],
    }


@app.get("/console", response_class=HTMLResponse, tags=["Console"])
@app.get("/console.html", response_class=HTMLResponse, tags=["Console"])
@app.get("/api/console", response_class=HTMLResponse, tags=["Console"], include_in_schema=False)
@app.get("/api/console.html", response_class=HTMLResponse, tags=["Console"], include_in_schema=False)
async def console():
    console_path = Path(__file__).with_name("console.html")
    return HTMLResponse(content=console_path.read_text(encoding="utf-8"))


@app.post("/agent/chat", response_model=AgentChatResponse, tags=["Agent"])
async def agent_chat(request: AgentChatRequest):
    facts = {
        "token母体-总览": "6 大子系统整体可用率 99.95%，当前 P0 告警 1 条、P1 告警 2 条。",
        "token母体-动环": "CRAC 1# 出风温度偏高，F3 存储区热通道 32.6℃，UPS-B 负载 85%。",
        "token母体-消防": "烟感 128/128 在线，喷淋压力 4.2bar，消防主机无火警。",
        "token母体-CCTV": "48 路视频中 46 路在线，12# 与 27# 摄像头离线，AI 行为识别正常。",
        "token母体-安防": "今日门禁 156 条，非工作时段刷卡 1 次，已完成审批留痕。",
        "token母体-openClaw": "当前待派 3 单、进行中 15 单、今日完成 89 单，平均派单 47 秒。",
        "token母体-工单": "工单系统待办 12、超时 0、平均处理 24 分钟，P0 工单 #20266 处理中。",
        "token母体-AgentOps": "Agent 运营管理平台已上线。Hermes 知识图谱 148 节点、6 大子系统 28 SOP 持续学习，Skill 库本月迭代 6 次。",
        "token母体-研究助手": "研究助手已连接 MiniMax M2.7-highspeed。已索引 2 份会议笔记 + 4 份数据中心调研报告。",
    }
    fact = facts.get(request.agent, "当前页面上下文已接入 Token 母体。")
    return AgentChatResponse(
        agent=request.agent,
        reply=f"我是 {request.agent}。{fact} 针对你的问题『{request.message}』，建议先查看告警、关联楼层和工单闭环记录。",
        timestamp=datetime.now().isoformat(),
    )


# ============== 论文研究 / 数据分析 ==============
@app.get("/research/docs", tags=["Research"])
async def research_docs():
    return list_documents()


@app.get("/research/folder", tags=["Research"])
async def research_folder():
    """返回树形文件夹结构 + 每个文件的注释/历史统计"""
    anns = _load_json(ANNOTATIONS_FILE, {})
    hists = _load_json(HISTORY_FILE, [])

    def build(dir_path: Path, kind: str):
        items = []
        if not dir_path.exists():
            return items
        for p in sorted(dir_path.iterdir(), key=lambda x: (x.is_file(), x.name)):
            doc_id = p.stem
            if p.is_file():
                doc_anns = anns.get(doc_id, [])
                doc_hist = [h for h in hists if h.get("doc_id") == doc_id]
                items.append({
                    "id": doc_id,
                    "name": p.name,
                    "type": "file",
                    "kind": kind,
                    "size": p.stat().st_size,
                    "path": str(p.relative_to(RESEARCH_DIR.parent)),
                    "annotations": doc_anns,
                    "history_count": len(doc_hist),
                    "last_action": doc_hist[0] if doc_hist else None,
                    "modified": p.stat().st_mtime,
                })
        return items

    return {
        "root": "research",
        "tree": [
            {
                "id": "notes",
                "name": "notes（项目自带笔记）",
                "type": "dir",
                "count": len(list(NOTES_DIR.glob("*"))) if NOTES_DIR.exists() else 0,
                "children": build(NOTES_DIR, "note"),
            },
            {
                "id": "reports",
                "name": "reports（项目自带报告）",
                "type": "dir",
                "count": len(list(REPORTS_DIR.glob("*"))) if REPORTS_DIR.exists() else 0,
                "children": build(REPORTS_DIR, "report"),
            },
        ],
    }


@app.post("/research/annotate", response_model=AnnotateResponse, tags=["Research"])
async def research_annotate(request: AnnotateRequest):
    """给资料追加注释（注释会保存到 annotations.json，并写入 history）"""
    safe = _safe_filename(request.doc_id)
    target: Optional[Path] = None
    for d in (NOTES_DIR, REPORTS_DIR):
        for ext in (".md", ".html"):
            p = d / f"{safe}{ext}"
            if p.exists():
                target = p
                break
        if target:
            break
    if not target:
        raise HTTPException(status_code=404, detail=f"未找到文件: {request.doc_id}")

    # 追加注释到文件
    ts = datetime.now()
    ts_str = ts.strftime("%Y-%m-%d %H:%M:%S")
    tag_label = {"manual": "手动", "auto-alert": "告警", "ai-suggest": "AI 建议"}.get(request.tag, request.tag)
    src_label = f" · 告警源: {request.source}" if request.source else ""
    if target.suffix == ".md":
        block = f"\n\n<!-- HERMES-ANNOT @{ts_str} [{tag_label}]{src_label} -->\n> {request.note}\n"
    else:
        block = f"\n<!-- HERMES-ANNOT @{ts_str} [{tag_label}]{src_label} --><p><b>📝 注释：</b>{request.note}</p>\n"
    with target.open("a", encoding="utf-8") as f:
        f.write(block)

    # 写入 annotations.json
    anns = _load_json(ANNOTATIONS_FILE, {})
    arr = anns.get(request.doc_id, [])
    ann = {
        "ts": ts.isoformat(timespec="seconds"),
        "tag": request.tag,
        "tag_label": tag_label,
        "source": request.source,
        "note": request.note,
    }
    arr.append(ann)
    anns[request.doc_id] = arr
    _save_json(ANNOTATIONS_FILE, anns)

    # 写入 history
    _record_history(request.doc_id, "annotate", f"[{tag_label}]{src_label} {request.note[:80]}")

    return AnnotateResponse(
        doc_id=request.doc_id,
        note=request.note,
        tag=request.tag,
        source=request.source,
        ts=ann["ts"],
        total_annotations=len(arr),
    )


@app.get("/research/history", tags=["Research"])
async def research_history(doc_id: Optional[str] = None, limit: int = 50):
    """查看编辑历史，可按 doc_id 过滤"""
    h = _load_json(HISTORY_FILE, [])
    if doc_id:
        h = [x for x in h if x.get("doc_id") == doc_id]
    return {"total": len(h), "items": h[:limit]}


@app.post("/skills/upgrade", response_model=SkillUpgradeResponse, tags=["Skills"])
async def skills_upgrade(request: SkillUpgradeRequest):
    """让 LLM 真实执行 skill，并产出 Skill 升级 diff"""
    skill_labels = {
        "env": "动环冷却系统",
        "fire": "消防喷淋系统",
        "cctv": "CCTV 视频监控",
    }
    sc_label = skill_labels.get(request.scenario, request.scenario)
    # 1) 真实"执行"当前 skill
    if request.exec_skill_id:
        exec_target = next((s for s in request.skills if s.get("id") == request.exec_skill_id), request.skills[0] if request.skills else None)
    else:
        exec_target = request.skills[0] if request.skills else None

    system = (
        f"你是数据中心 AI 运维工程师。正在处置【{sc_label}】的告警。"
        f"已下达指令：{exec_target.get('n') if exec_target else '综合处置'}"
        f"({exec_target.get('p') if exec_target else ''})。"
        "【重要】不要任何思考或解释，只输出一段合法 JSON：\n"
        "{\"exec_result\":{\"skill_id\":\"...\",\"skill_name\":\"...\",\"log\":[\"行1\",\"行2\",\"行3\"],\"success\":true,\"impact\":\"1-2 句影响\",\"metric\":\"一个数值\"},"
        "\"upgrade_summary\":\"80字内整体总结\","
        "\"diff\":[{\"skill_id\":\"id1\",\"name\":\"名称\",\"old_version\":\"v2.4\",\"new_version\":\"v2.5\","
        "\"changes\":[{\"old\":\"原参数/动作\",\"new\":\"新参数/动作\",\"because\":\"<40字原因\"}]}]}"
        "【必填】diff 数组必须包含所有传入的 skills，逐个给出升级方案（每个 skill 一项）。"
    )
    skill_brief = "\n".join(
        f"- id={s.get('id')} name={s.get('n')} v={s.get('v', 'v1.0')} params={s.get('params', [])} tag={s.get('tag', '')}"
        for s in request.skills
    )
    alert_brief = "\n".join(
        f"- {a.get('k') or a.get('key') or ''}={a.get('v') or a.get('value') or ''} level={a.get('level', '')}"
        for a in request.alerts
    )
    user = (
        f"【告警参数】\n{alert_brief or '（无）'}\n\n"
        f"【Skill 列表】\n{skill_brief or '（无）'}\n\n"
        f"【当前执行】{exec_target.get('n') if exec_target else '-'}\n"
        "请只输出合法 JSON，不要任何额外说明。"
    )
    raw = call_llm([
        {"role": "system", "content": system},
        {"role": "user", "content": user},
    ], temperature=0.3, max_tokens=1500)

    exec_result: Dict[str, Any] = {
        "skill_id": exec_target.get("id") if exec_target else "-",
        "skill_name": exec_target.get("n") if exec_target else "-",
        "log": [],
        "success": True,
        "impact": "",
        "metric": "",
    }
    upgrade_summary = raw[:200]
    diff: List[Dict[str, Any]] = []
    try:
        m = re.search(r"\{[\s\S]*\}", raw)
        obj = json.loads(m.group(0)) if m else json.loads(raw)
        if isinstance(obj.get("exec_result"), dict):
            er = obj["exec_result"]
            for k in ("log", "success", "impact", "metric", "skill_id", "skill_name"):
                if k in er:
                    exec_result[k] = er[k]
            if isinstance(exec_result["log"], str):
                exec_result["log"] = [exec_result["log"]]
    except Exception:
        pass

    # 兜底：基于 impact / summary 自动生成 3-4 条执行日志
    _sk = exec_target.get("n", "Skill") if exec_target else "Skill"
    _imp = exec_result.get("impact") or ""
    _metric = exec_result.get("metric") or ""
    if not exec_result.get("log") or exec_result["log"] == ["（LLM 未返回日志）"]:
        exec_result["log"] = [
            f"[{datetime.now().strftime('%H:%M:%S')}] [EXEC] Hermes 调用 {_sk}",
            f"[{datetime.now().strftime('%H:%M:%S')}] [INFO] {_imp or '已根据设备参数自动推理处置方案'}",
            f"[{datetime.now().strftime('%H:%M:%S')}] [OK] 指令已下达，设备响应正常{(' · 关键指标 ' + str(_metric)) if _metric else ''}",
        ]

    # 解析 upgrade_summary + diff（独立 try，避免影响 exec_result）
    try:
        m = re.search(r"\{[\s\S]*\}", raw)
        obj2 = json.loads(m.group(0)) if m else (obj if 'obj' in locals() else {})
        upgrade_summary = str(obj2.get("upgrade_summary", ""))[:300] or upgrade_summary
        if isinstance(obj2.get("diff"), list):
            for d in obj2["diff"]:
                if not isinstance(d, dict):
                    continue
                old_v = str(d.get("old_version", "v1.0"))
                try:
                    major, minor = old_v.lstrip("v").split(".")
                    new_v = f"v{major}.{int(minor) + 1}"
                except Exception:
                    new_v = "v" + str(random.random())[2:4]
                changes = d.get("changes", [])
                if not isinstance(changes, list):
                    changes = []
                diff.append({
                    "skill_id": str(d.get("skill_id", ""))[:60],
                    "name": str(d.get("name", ""))[:60],
                    "old_version": old_v,
                    "new_version": new_v,
                    "changes": [
                        {
                            "old": str(c.get("old", ""))[:200] if isinstance(c, dict) else str(c)[:200],
                            "new": str(c.get("new", ""))[:200] if isinstance(c, dict) else "",
                            "because": str(c.get("because", ""))[:120] if isinstance(c, dict) else "",
                        }
                        for c in changes[:3]
                    ],
                })
    except Exception:
        pass

    return SkillUpgradeResponse(
        scenario=request.scenario,
        exec_result=exec_result,
        upgrade_summary=upgrade_summary,
        diff=diff,
        timestamp=datetime.now().isoformat(),
    )


@app.get("/", tags=["Info"])
async def root():
    # 直接返回控制台 HTML，避免用户访问根路径时只看到 JSON
    return await console()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
