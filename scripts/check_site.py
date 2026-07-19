#!/usr/bin/env python3
"""Check local assets and required navigation in index.html."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]


class SiteParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.assets: set[str] = set()
        self.ids: dict[str, str] = {}
        self.skip_targets: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        element_id = attributes.get("id")
        if element_id:
            self.ids[element_id] = tag

        classes = (attributes.get("class") or "").split()
        if tag == "a" and "skip-link" in classes:
            href = attributes.get("href") or ""
            parsed = urlsplit(href)
            if not parsed.scheme and not parsed.netloc and not parsed.path and parsed.fragment:
                self.skip_targets.append(unquote(parsed.fragment))

        for name, value in attrs:
            if name not in {"href", "src"} or not value:
                continue
            parsed = urlsplit(value)
            if parsed.scheme or parsed.netloc or value.startswith(("#", "/")):
                continue
            self.assets.add(unquote(parsed.path))


def main() -> None:
    parser = SiteParser()
    parser.feed((ROOT / "index.html").read_text(encoding="utf-8"))
    missing = sorted(asset for asset in parser.assets if not (ROOT / asset).is_file())
    if missing:
        raise SystemExit("Missing local assets: " + ", ".join(missing))

    if not parser.skip_targets:
        raise SystemExit("Missing skip link with a local fragment target")
    missing_targets = sorted(target for target in parser.skip_targets if target not in parser.ids)
    if missing_targets:
        raise SystemExit("Missing skip link targets: " + ", ".join(missing_targets))
    non_main_targets = sorted(target for target in parser.skip_targets if parser.ids[target] != "main")
    if non_main_targets:
        raise SystemExit("Skip link targets must be main elements: " + ", ".join(non_main_targets))

    print(f"site check passed ({len(parser.assets)} local assets)")


if __name__ == "__main__":
    main()
