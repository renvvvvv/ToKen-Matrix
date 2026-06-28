"""车牌识别 v1.5 - eval"""
import asyncio
import importlib.util
from pathlib import Path

_py = Path(__file__).parent.parent / f"v1.5.py"
_spec = importlib.util.spec_from_file_location("plate-recog_v1.5", _py)
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)


def test_basic():
    r = asyncio.run(_mod.run({}))
    assert r["status"] == "ok", r
    assert r["skill"] == "plate-recog", r
    print(f"✓ 车牌识别 v1.5 passed")


if __name__ == "__main__":
    test_basic()
