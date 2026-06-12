#!/usr/bin/env python3
"""Verify App Store + Play Store copy against each platform's character limits."""
import re, sys, pathlib

here = pathlib.Path(__file__).parent

def check(filename, fields):
    md = (here / filename).read_text()
    print(f"\n{filename}")
    ok_all = True
    for name, (pattern, limit) in fields.items():
        m = re.search(pattern, md, re.S)
        if not m:
            print(f"  ✗ {name}: NOT FOUND"); ok_all = False; continue
        n = len(m.group(1))
        ok = n <= limit
        print(f"  {'✓' if ok else '✗'} {name}: {n}/{limit}")
        if not ok: ok_all = False
    return ok_all

apple = check('app-store-copy.md', {
    'App Name':         (r'## App Name.*?```\n(.*?)\n```', 30),
    'Subtitle':         (r'## Subtitle.*?```\n(.*?)\n```', 30),
    'Promotional Text': (r'## Promotional Text.*?```\n(.*?)\n```', 170),
    'Description':      (r'## Description.*?```\n(.*?)\n```', 4000),
    'Keywords':         (r'## Keywords.*?```\n(.*?)\n```', 100),
    "What's New":       (r"## What's New.*?```\n(.*?)\n```", 4000),
})

play = check('play-store-copy.md', {
    'Title':             (r'## Title.*?```\n(.*?)\n```', 30),
    'Short description': (r'## Short description.*?```\n(.*?)\n```', 80),
    'Full description':  (r'## Full description.*?```\n(.*?)\n```', 4000),
    'Release notes':     (r'## Release notes.*?```\n(.*?)\n```', 500),
})

sys.exit(0 if (apple and play) else 1)
