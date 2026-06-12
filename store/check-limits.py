#!/usr/bin/env python3
"""Verify App Store copy in app-store-copy.md against Apple's character limits."""
import re, sys, pathlib

md = (pathlib.Path(__file__).parent / 'app-store-copy.md').read_text()

# field name -> (heading regex, limit)
FIELDS = {
    'App Name':         (r'## App Name.*?```\n(.*?)\n```', 30),
    'Subtitle':         (r'## Subtitle.*?```\n(.*?)\n```', 30),
    'Promotional Text': (r'## Promotional Text.*?```\n(.*?)\n```', 170),
    'Description':      (r'## Description.*?```\n(.*?)\n```', 4000),
    'Keywords':         (r'## Keywords.*?```\n(.*?)\n```', 100),
    "What's New":       (r"## What's New.*?```\n(.*?)\n```", 4000),
}

fail = False
for name, (pattern, limit) in FIELDS.items():
    m = re.search(pattern, md, re.S)
    if not m:
        print(f'  ✗ {name}: NOT FOUND'); fail = True; continue
    n = len(m.group(1))
    ok = n <= limit
    print(f"  {'✓' if ok else '✗'} {name}: {n}/{limit}")
    if not ok: fail = True

sys.exit(1 if fail else 0)
