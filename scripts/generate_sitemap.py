#!/usr/bin/env python3
"""Generate sitemap.xml based on the current HTML files."""
from __future__ import annotations

from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "https://xrpbrasil.com.br"
EXCLUDED = {"404.html"}
SITEMAP_PATH = ROOT / "sitemap.xml"


def canonical_from_path(path: Path) -> str:
    rel = path.relative_to(ROOT)
    if rel.name == "index.html":
        if rel.parent == Path("."):
            return f"{BASE_URL}/"
        return f"{BASE_URL}/{rel.parent.as_posix().strip('/')}/"
    return f"{BASE_URL}/{rel.as_posix()}"


def gather_urls() -> list[tuple[str, str]]:
    urls: list[tuple[str, str]] = []
    for html_path in sorted(ROOT.rglob("*.html")):
        if html_path.name in EXCLUDED:
            continue
        if "assets" in html_path.parts:
            continue
        loc = canonical_from_path(html_path)
        lastmod = datetime.fromtimestamp(html_path.stat().st_mtime).date().isoformat()
        urls.append((loc, lastmod))
    return urls


def build_sitemap(urls: list[tuple[str, str]]) -> str:
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, lastmod in urls:
        lines.append("  <url>")
        lines.append(f"    <loc>{loc}</loc>")
        lines.append(f"    <lastmod>{lastmod}</lastmod>")
        lines.append("  </url>")
    lines.append("</urlset>")
    return "\n".join(lines) + "\n"


def main() -> None:
    urls = gather_urls()
    sitemap = build_sitemap(urls)
    SITEMAP_PATH.write_text(sitemap, encoding="utf-8")
    print(f"Generated sitemap with {len(urls)} entries at {SITEMAP_PATH}")


if __name__ == "__main__":
    main()
