#!/usr/bin/env python3
"""Check that index.html references only existing local assets."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]


class AssetParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.assets: set[str] = set()

    def handle_starttag(self, _tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if name not in {"href", "src"} or not value:
                continue
            parsed = urlsplit(value)
            if parsed.scheme or parsed.netloc or value.startswith(("#", "/")):
                continue
            self.assets.add(unquote(parsed.path))


def main() -> None:
    parser = AssetParser()
    parser.feed((ROOT / "index.html").read_text(encoding="utf-8"))
    missing = sorted(asset for asset in parser.assets if not (ROOT / asset).is_file())
    if missing:
        raise SystemExit("Missing local assets: " + ", ".join(missing))
    print(f"site check passed ({len(parser.assets)} local assets)")


if __name__ == "__main__":
    main()
