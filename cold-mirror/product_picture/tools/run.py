"""Generate a shot, align every attempt to its guide, keep the best one that passes, finish it.

usage: python run.py <shot> [attempts=2] [--quality high]
Needs: work/guide_<shot>.png (guide.py), work/<shot>_prompt.txt (prompts.py), refs/drawing.png,
and final/png/01_*.png for shots that use the shot-01 render as material reference.
Nothing is deleted here: attempts stay in work/ until a failure is confirmed as a real spec failure
(not a measuring problem) and they are removed by hand. The best passing one is finished by finish.py.
"""
import json, subprocess, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from guide import SHOTS  # noqa: E402
from prompts import REFS  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
WORK, FINAL = ROOT / "work", ROOT / "final"
PY = sys.executable

# pass thresholds: pre = the raw render's own proportion error, post = after correction, iou = dark-silhouette overlap
LIMITS = {"front": dict(pre=0.01, post=0.003, iou=0.97), "window": dict(pre=0.01, post=0.003, iou=None),
          "bbox": dict(pre=0.03, post=0.003, iou=0.90), "lens": dict(pre=0.03, post=0.01, iou=0.90)}


def ref_path(r, shot):
    if r == "guide":
        return WORK / f"guide_{shot}.png"
    if r == "drawing":
        return ROOT / "refs" / "drawing.png"
    if r.startswith("final:"):
        return sorted((FINAL / "png").glob(f"{r.split(':')[1]}_*.png"))[0]
    if r.startswith("plate:"):
        p = r.split(":")[1]
        return WORK / f"{p}_{json.load(open(WORK / f'{p}_report.json'))['tag']}_aligned.png"
    raise ValueError(r)


def generate(shot, tag, quality):
    cfg = SHOTS[shot]
    cmd = ["higgsfield", "generate", "create", "gpt_image_2_5", "--prompt", (WORK / f"{shot}_prompt.txt").read_text()]
    for r in REFS[shot]:
        cmd += ["--image", str(ref_path(r, shot))]
    cmd += ["--aspect_ratio", cfg["aspect"], "--resolution", "4k", "--quality", quality, "--background", "opaque",
            "--wait", "--wait-timeout", "20m"]
    out = subprocess.run(cmd, capture_output=True, text=True)
    url = out.stdout.strip().splitlines()[-1] if out.stdout.strip() else ""
    if not url.startswith("http"):
        return tag, None, (out.stdout + out.stderr)[-400:]
    dst = WORK / f"{shot}_{tag}.png"
    urllib.request.urlretrieve(url, dst)
    return tag, dst, url


def check(shot, path):
    out = subprocess.run([PY, "-I", str(ROOT / "tools" / "align.py"), shot, str(path)], capture_output=True, text=True)
    if out.returncode:
        return None, out.stderr[-400:]
    rep = json.loads(out.stdout)
    lim = LIMITS[SHOTS[shot]["align"]]
    iou_ok = lim["iou"] is None or SHOTS[shot].get("scene") or rep["dark_iou"] >= lim["iou"]
    round_ok = "lens_roundness_final" not in rep or abs(rep["lens_roundness_final"] - 1) <= 0.03
    # after correction: relative limit, or a 6 px floor (the detector's own precision at the window bevel,
    # ~4-5 px in every shot), whichever is looser - small products in wide scenes would otherwise fail on noise
    post_ok = rep["post_error"] <= lim["post"] or rep["post_error_px"] <= 6.0
    if SHOTS[shot].get("scene"):          # scenes are delivered from their own framing: judge that image
        post_ok = rep["scene_post_error"] <= lim["post"] or rep["scene_post_error_px"] <= 6.0
    rep["pass"] = rep["pre_error"] <= lim["pre"] and post_ok and iou_ok and round_ok
    for f in ("aligned", "qa_overlay", "framed"):
        if (WORK / f"{shot}_{f}.png").exists():
            (WORK / f"{shot}_{f}.png").rename(WORK / f"{shot}_{path.stem.split('_')[-1]}_{f}.png")
    return rep, None


def main():
    shot = sys.argv[1]
    n = int(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2].isdigit() else 2
    quality = sys.argv[sys.argv.index("--quality") + 1] if "--quality" in sys.argv else "high"
    existing = len(list(WORK.glob(f"{shot}_try*.png")))
    tags = [f"try{existing + i + 1}" for i in range(n)]
    with ThreadPoolExecutor(n) as ex:
        res = list(ex.map(lambda t: generate(shot, t, quality), tags))
    results = []
    for tag, path, info in res:
        if path is None:
            print(json.dumps({"tag": tag, "error": info})); continue
        rep, err = check(shot, path)
        if rep is None:
            print(json.dumps({"tag": tag, "error": "align failed", "detail": err})); continue
        rep["url"] = info; rep["tag"] = tag
        (WORK / f"{shot}_{tag}.url").write_text(info)
        print(json.dumps({k: rep.get(k) for k in ("tag", "pre_error", "post_error", "post_error_px", "dark_iou", "lens_roundness_final", "pass")}))
        results.append((rep, path))
    good = sorted([r for r in results if r[0]["pass"]], key=lambda r: (r[0]["pre_error"], -r[0]["dark_iou"]))
    if not good:
        print(json.dumps({"shot": shot, "accepted": None})); sys.exit(1)
    rep, path = good[0]
    json.dump(rep, open(WORK / f"{shot}_report.json", "w"), indent=1)
    if not SHOTS[shot].get("intermediate"):
        subprocess.run([PY, "-I", str(ROOT / "tools" / "finish.py"), shot, str(WORK / f"{shot}_{rep['tag']}_aligned.png")], check=True)
    print(json.dumps({"shot": shot, "accepted": rep["tag"], "url": rep["url"]}))


if __name__ == "__main__":
    main()
