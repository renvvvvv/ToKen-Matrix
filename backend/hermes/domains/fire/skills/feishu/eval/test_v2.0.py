"""火警飞书推送 v2.0 - eval"""
import asyncio
import importlib.util
from pathlib import Path

_py = Path(__file__).parent.parent / f"v2.0.py"
_spec = importlib.util.spec_from_file_location("feishu_v2.0", _py)
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)


def test_basic():
    r = asyncio.run(_mod.run({}))
    assert r["status"] == "ok", r
    assert r["skill"] == "feishu", r
    print(f"✓ 火警飞书推送 v2.0 passed")


if __name__ == "__main__":
    test_basic()
