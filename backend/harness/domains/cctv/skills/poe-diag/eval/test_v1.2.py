"""PoE 端口诊断 v1.2 - eval"""
import asyncio
import importlib.util
from pathlib import Path

_py = Path(__file__).parent.parent / f"v1.2.py"
_spec = importlib.util.spec_from_file_location("poe-diag_v1.2", _py)
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)


def test_basic():
    r = asyncio.run(_mod.run({}))
    assert r["status"] == "ok", r
    assert r["skill"] == "poe-diag", r
    print(f"✓ PoE 端口诊断 v1.2 passed")


if __name__ == "__main__":
    test_basic()
