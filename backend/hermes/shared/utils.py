"""Hermes 跨域共享工具"""
import json
from datetime import datetime
from pathlib import Path  # 修复 P2: 补上缺失的 Path import（load_md/save_md 引用了它）


def now_iso():
    return datetime.now().isoformat(timespec="seconds")


def load_md(p):
    return Path(p).read_text(encoding="utf-8")


def save_md(p, content, meta=None):
    p = Path(p)
    p.parent.mkdir(parents=True, exist_ok=True)
    if meta:
        text = "---\n" + json.dumps(meta, ensure_ascii=False) + "\n---\n\n" + content
    else:
        text = content
    p.write_text(text, encoding="utf-8")
