#!/usr/bin/env python3
"""
Inject consistent SEO meta tags (canonical, Open Graph, Twitter) across all HTML pages.
This script reads each .html file, derives the title/description already declared
and appends an enriched meta block so crawlers receive consistent information.
"""
from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "https://xrpbrasil.com.br"
SOCIAL_IMAGE = f"{BASE_URL}/assets/logo.png"
TWITTER_HANDLE = "@Brasil_Xrp"
EXCLUDED = {"404.html"}

META_BLOCK_RE = re.compile(r"\s*<!-- SEO meta -->.*?<!-- /SEO meta -->\s*", re.DOTALL)
CANONICAL_RE = re.compile(r'\s*<link\s+rel="canonical"[^>]*>\s*', re.IGNORECASE)
DESC_RE = re.compile(r'<meta\s+name="description"\s+content="[^"]*"\s*/?>', re.IGNORECASE)
TITLE_RE = re.compile(r"<title>(.*?)</title>", re.IGNORECASE | re.DOTALL)


def canonical_from_path(path: Path) -> str:
    rel = path.relative_to(ROOT)
    if rel.name == "index.html":
        if rel.parent == Path("."):
            return f"{BASE_URL}/"
        return f"{BASE_URL}/{rel.parent.as_posix().strip('/')}/"
    return f"{BASE_URL}/{rel.as_posix()}"


def determine_og_type(path: Path) -> str:
    rel = path.relative_to(ROOT)
    if "artigos" in rel.parts and rel.name != "index.html":
        return "article"
    return "website"


def build_keywords(title: str) -> str:
    base = ["XRP", "XRPL", "Ripple", "XRP Ledger", "Pagamentos em tempo real"]
    extras = []
    for chunk in re.split(r"[|–—\-:]+", title):
        chunk = chunk.strip()
        if chunk:
            extras.append(chunk)
    keywords = []
    for word in base + extras:
        cleaned = word.strip()
        if cleaned and cleaned not in keywords:
            keywords.append(cleaned)
    return ", ".join(keywords)


def inject_meta_block(path: Path) -> bool:
    if path.name in EXCLUDED:
        return False

    text = path.read_text(encoding="utf-8")
    title_match = TITLE_RE.search(text)
    desc_match = DESC_RE.search(text)
    if not title_match or not desc_match:
        return False

    title = html.escape(title_match.group(1).strip(), quote=True)
    description = html.escape(
        re.search(r'content="([^"]*)"', desc_match.group(0), re.IGNORECASE).group(1).strip(),
        quote=True,
    )
    canonical = html.escape(canonical_from_path(path), quote=True)
    keywords = html.escape(build_keywords(html.unescape(title_match.group(1).strip())), quote=True)
    og_type = determine_og_type(path)

    block = f"""
    <!-- SEO meta -->
    <meta name="robots" content="index,follow" />
    <meta name="author" content="XRP BRASIL" />
    <meta name="application-name" content="XRP BRASIL" />
    <meta name="theme-color" content="#030712" />
    <meta name="color-scheme" content="dark light" />
    <link rel="canonical" href="{canonical}" />
    <link rel="alternate" href="{canonical}" hreflang="pt-br" />
    <meta name="keywords" content="{keywords}" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:type" content="{og_type}" />
    <meta property="og:site_name" content="XRP BRASIL" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{description}" />
    <meta property="og:url" content="{canonical}" />
    <meta property="og:image" content="{SOCIAL_IMAGE}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="{TWITTER_HANDLE}" />
    <meta name="twitter:creator" content="{TWITTER_HANDLE}" />
    <meta name="twitter:title" content="{title}" />
    <meta name="twitter:description" content="{description}" />
    <meta name="twitter:image" content="{SOCIAL_IMAGE}" />
    <!-- /SEO meta -->
""".rstrip()

    updated = META_BLOCK_RE.sub("\n", text)
    updated = CANONICAL_RE.sub("\n", updated)

    desc_match = DESC_RE.search(updated)
    if not desc_match:
        return False

    insert_pos = desc_match.end()
    updated = updated[:insert_pos] + "\n" + block + updated[insert_pos:]

    if updated != text:
        path.write_text(updated, encoding="utf-8")
        return True
    return False


def main() -> None:
    changed = []
    for html_path in sorted(ROOT.rglob("*.html")):
        if html_path.is_file():
            if inject_meta_block(html_path):
                changed.append(html_path.relative_to(ROOT))
    if changed:
        print("SEO meta updated for:")
        for rel in changed:
            print(f"  - {rel}")
    else:
        print("No SEO meta changes required.")


if __name__ == "__main__":
    main()
