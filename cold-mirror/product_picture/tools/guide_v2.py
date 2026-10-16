"""v2 guide: the whole panel front is one mirror (display behind one-way glass), with only a thin black edge.
Reuses guide.py geometry and cameras; writes work_v2/guide_<shot>.png/json.

usage: python guide_v2.py 01
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import guide  # noqa: E402

EDGE = 8                                   # thin satin-black frame lip around the glass (mm)
guide.OUT = Path(__file__).resolve().parent.parent / "work_v2"
guide.DISP_W, guide.DISP_H, guide.DISP_TOP = guide.PW - 2 * EDGE, guide.PH - 2 * EDGE, guide.PT - EDGE

if __name__ == "__main__":
    guide.render(sys.argv[1] if len(sys.argv) > 1 else "01")
