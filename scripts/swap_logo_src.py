#!/usr/bin/env python3
"""Swap default logo assets from PNG to SVG to reduce payload."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = 'src="/assets/logo.png"'
REPLACEMENT = 'src="/assets/logo.svg"'
ONERROR_OLD = "this.src='/assets/logo.svg';"
ONERROR_NEW = "this.src='/assets/logo.png';"


def main() -> None:
    changed = []
    for html_path in sorted(ROOT.rglob("*.html")):
        text = html_path.read_text(encoding="utf-8")
        new_text = text.replace(TARGET, REPLACEMENT).replace(ONERROR_OLD, ONERROR_NEW)
        if new_text != text:
            html_path.write_text(new_text, encoding="utf-8")
            changed.append(html_path.relative_to(ROOT))
    if changed:
        print("Updated logo references in:")
        for rel in changed:
            print(f"  - {rel}")
    else:
        print("No logo references required updates.")


if __name__ == "__main__":
    main()
