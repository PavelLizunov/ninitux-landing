#!/usr/bin/env python3
"""Renders the frames of the step-by-step guides from the real VPNRouter UI.

The frames are headless renders made by the VPNRouter UI renderer (the
`vpnrouter-ui-mcp` binary, a CI artifact of the VPNRouter repository) from
fixture data: no real server, account or desktop is involved. For every frame
the script also asks the renderer where the control to click is and stores that
rectangle, so the site can draw the highlight and the cursor in the right place.

usage (--server comes last, the rest of the line is the command):
  guide_frames.py [--only GUIDE] --server /path/to/vpnrouter-ui-mcp
  guide_frames.py --server ssh tester@host 'C:\\path\\vpnrouter-ui-mcp.exe'

Writes public/guide/<lang>/<guide>-<frame>.webp and lib/guide-frames.json.
Needs ImageMagick (`magick`) for cropping. See "Guide frames" in README.md.
"""
import argparse
import base64
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WIDTH = 440
CROP_HEIGHT = 560
SAMPLE_LINK = "https://example.com/sub/my-vpn"
LANGS = ("ru", "en")


def L(ru, en):
    return {"ru": ru, "en": en}


# A spot is a list of (control type, label) pairs; the highlight is the box around all of them.
CONNECT = [("Button", L("Подключить", "Connect"))]
ADVANCED = [("Button", L("Расширенные настройки", "Advanced settings"))]

GUIDES = {
    "first-run": [
        dict(id="paste", surface="window-simple", scenario="default", height=980, crop="top",
             spot=[("TextBox", None)]),
        dict(id="press", surface="window-simple", scenario="default", height=980, crop="top",
             state={"SmpInput": SAMPLE_LINK}, spot=CONNECT),
        dict(id="wait", surface="window-simple", scenario="connecting", height=800, crop="top", spot=None),
        dict(id="done", surface="window-simple", scenario="connected", height=800, crop="top",
             spot=[("TextBlock", L("Подключено", "Connected"))], pad=14),
    ],
    "apps": [
        dict(id="mode", surface="window-simple", scenario="connected", height=800, crop="top",
             spot=[("RadioButton", L("Приложения", "Selected apps")), ("RadioButton", L("Весь трафик", "All traffic"))]),
        dict(id="advanced", surface="window-simple", scenario="connected", height=800, crop="bottom", spot=ADVANCED),
        dict(id="tab", surface="window-advanced", scenario="connected", height=800, crop="top",
             steps=L(["Приложения"], ["Applications"]),
             spot=[("ListBoxItem", L("Приложения", "Applications"))]),
        dict(id="pick", surface="window-advanced", scenario="connected", height=800, crop="top",
             steps=L(["Приложения", "Браузеры"], ["Applications", "Browsers"]),
             spot=[("CheckBox", "#1"), ("CheckBox", "#5")], pad=10, grow_right=250),
        dict(id="add", surface="window-advanced", scenario="connected", height=800, crop="bottom",
             steps=L(["Приложения", "Браузеры"], ["Applications", "Browsers"]),
             spot=[("Button", L("Обзор...", "Browse...")), ("Button", L("Запущенные", "Running"))]),
    ],
    "free": [
        dict(id="advanced", surface="window-simple", scenario="default", height=980, crop="bottom", spot=ADVANCED),
        dict(id="tab", surface="window-advanced", scenario="default", height=800, crop="top",
             steps=L(["Публичные"], ["Public"]), spot=[("ListBoxItem", L("Публичные", "Public"))]),
        dict(id="find", surface="window-advanced", scenario="default", height=800, crop="top",
             steps=L(["Публичные"], ["Public"]),
             spot=[("Button", L("Найти рабочие конфиги", "Find working configs"))]),
        dict(id="connect", surface="window-advanced", scenario="default", height=800, crop="bottom",
             steps=L(["Публичные"], ["Public"]), spot=CONNECT),
    ],
}

LINE = re.compile(r'^\s*(\S+?)(?:\s+"(.*?)")?\s+\[(-?\d+),(-?\d+) (\d+)x(\d+)\]')


class Renderer:
    def __init__(self, command):
        self.proc = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                     stderr=subprocess.DEVNULL, text=True, bufsize=1, encoding="utf-8")
        self.ident = 0
        self.rpc("initialize", {"protocolVersion": "2024-11-05", "capabilities": {},
                                "clientInfo": {"name": "guide_frames", "version": "1"}})
        self.proc.stdin.write(json.dumps({"jsonrpc": "2.0", "method": "notifications/initialized"}) + "\n")
        self.proc.stdin.flush()

    def rpc(self, method, params):
        self.ident += 1
        self.proc.stdin.write(json.dumps({"jsonrpc": "2.0", "id": self.ident, "method": method, "params": params}) + "\n")
        self.proc.stdin.flush()
        while True:
            line = self.proc.stdout.readline()
            if not line:
                sys.exit("the renderer closed the pipe")
            try:
                message = json.loads(line)
            except ValueError:
                continue
            if message.get("id") == self.ident:
                if "error" in message:
                    sys.exit(f"renderer error: {message['error']}")
                return message["result"]

    def call(self, tool, arguments):
        result = self.rpc("tools/call", {"name": tool, "arguments": arguments})
        if result.get("isError"):
            sys.exit(f"{tool} failed: {result['content']}")
        return result["content"]

    def close(self):
        self.proc.stdin.close()
        self.proc.wait(timeout=20)


def controls(tree_text):
    found = []
    for line in tree_text.splitlines():
        match = LINE.match(line)
        if match:
            kind, label, x, y, w, h = match.groups()
            found.append((kind.split("#")[0], (label or "").strip(), int(x), int(y), int(w), int(h)))
    return found


def find(found, kind, label, lang, frame_id):
    same_kind = [c for c in found if c[0] == kind]
    if label is None:
        matches = same_kind
    elif isinstance(label, str) and label.startswith("#"):
        index = int(label[1:]) - 1
        matches = same_kind[index:index + 1]
    else:
        matches = [c for c in same_kind if c[1] == label[lang]]
    if not matches:
        sys.exit(f"{frame_id}/{lang}: no {kind} {label!r} in the control tree")
    return matches[0]


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--theme", default="light", choices=("light", "dark"))
    parser.add_argument("--only", help="render only this guide")
    parser.add_argument("--server", nargs=argparse.REMAINDER, required=True,
                        help="command that starts the renderer; must be the last option")
    opts = parser.parse_args()

    renderer = Renderer(opts.server)
    spots_path = ROOT / "lib" / "guide-frames.json"
    spots = json.loads(spots_path.read_text(encoding="utf-8")) if spots_path.exists() else {}
    with tempfile.TemporaryDirectory() as tmp:
        for guide, frames in GUIDES.items():
            if opts.only and guide != opts.only:
                continue
            spots[guide] = {}
            for frame in frames:
                spots[guide][frame["id"]] = {}
                for lang in LANGS:
                    name = f"{guide}-{frame['id']}"
                    height = frame["height"]
                    arguments = {"surface": frame["surface"], "scenario": frame["scenario"], "theme": opts.theme,
                                 "language": lang, "width": WIDTH, "height": height}
                    if frame.get("state"):
                        arguments["state"] = frame["state"]
                    if frame.get("steps"):
                        arguments["steps"] = frame["steps"][lang]
                    image = next(c for c in renderer.call("ui_render", arguments) if c["type"] == "image")
                    raw = Path(tmp) / f"{name}-{lang}.png"
                    raw.write_bytes(base64.b64decode(image["data"]))

                    top = 0 if frame["crop"] == "top" else height - CROP_HEIGHT
                    out = ROOT / "public" / "guide" / lang / f"{name}.webp"
                    out.parent.mkdir(parents=True, exist_ok=True)
                    subprocess.run(["magick", str(raw), "-crop", f"{WIDTH}x{CROP_HEIGHT}+0+{top}", "+repage", "-strip",
                                    "-define", "webp:lossless=true", "-define", "webp:method=6", str(out)], check=True)

                    box = None
                    if frame.get("spot"):
                        tree = "\n".join(c["text"] for c in renderer.call("ui_tree", {**arguments, "max_lines": 900})
                                         if c["type"] == "text")
                        found = controls(tree)
                        parts = [find(found, kind, label, lang, name) for kind, label in frame["spot"]]
                        pad = frame.get("pad", 6)
                        x0 = min(p[2] for p in parts) - pad
                        y0 = min(p[3] for p in parts) - pad
                        x1 = max(p[2] + p[4] for p in parts) + pad + frame.get("grow_right", 0)
                        y1 = max(p[3] + p[5] for p in parts) + pad
                        x0, x1 = max(x0, 4), min(x1, WIDTH - 4)
                        y0, y1 = max(y0 - top, 4), min(y1 - top, CROP_HEIGHT - 4)
                        if y1 - y0 < 12:
                            sys.exit(f"{name}/{lang}: the spot is outside the crop")
                        box = {"x": round(x0 / WIDTH, 4), "y": round(y0 / CROP_HEIGHT, 4),
                               "w": round((x1 - x0) / WIDTH, 4), "h": round((y1 - y0) / CROP_HEIGHT, 4)}
                    spots[guide][frame["id"]][lang] = box
                    print(f"{lang}/{name}.webp  {out.stat().st_size // 1024} KB  spot={box}")
    renderer.close()
    spots_path.write_text(json.dumps({"width": WIDTH, "height": CROP_HEIGHT,
                                      **{k: v for k, v in spots.items() if k not in ("width", "height")}},
                                     ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {spots_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
