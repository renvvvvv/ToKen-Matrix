"""能耗趋势预测 v3.1 - eval"""
import asyncio
import importlib.util
from pathlib import Path

_py = Path(__file__).parent.parent / f"v3.1.py"
_spec = importlib.util.spec_from_file_location("predict_v3.1", _py)
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)


def test_basic():
    r = asyncio.run(_mod.run({}))
    assert r["status"] == "ok", r
    assert r["skill"] == "predict", r
    print(f"✓ 能耗趋势预测 v3.1 passed")


if __name__ == "__main__":
    test_basic()
