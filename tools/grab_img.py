#!/usr/bin/env python3
"""Fetch an article's og:image, shrink it to <=800px wide JPEG, save to OUT.
Usage: python3 grab_img.py ARTICLE_URL OUT.jpg   -> prints OK <bytes> or SKIP <reason>; exit 0 either way."""
import html, io, re, subprocess, sys, urllib.parse

UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1"


def get(url, limit):
    r = subprocess.run(["curl", "-sSL", "--max-time", "20", "--max-filesize", str(limit), "-A", UA, url],
                       capture_output=True)
    return r.stdout if r.returncode == 0 else b""


def main(article, out):
    page = get(article, 4_000_000).decode("utf-8", "ignore")
    m = (re.search(r'<meta[^>]+(?:property|name)=["\'](?:og:image|twitter:image)(?::src)?["\'][^>]*content=["\']([^"\']+)', page, re.I)
         or re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]*(?:property|name)=["\'](?:og:image|twitter:image)', page, re.I))
    if not m:
        return print("SKIP no og:image")
    src = urllib.parse.urljoin(article, html.unescape(m.group(1).strip()))
    data = get(src, 15_000_000)
    if not data:
        return print("SKIP download failed")
    from PIL import Image
    try:
        im = Image.open(io.BytesIO(data))
        im = im.convert("RGB")
    except Exception as e:
        return print("SKIP not an image:", e)
    w, h = im.size
    if w < 400 or h < 200 or w / h > 3 or h / w > 2:
        return print(f"SKIP bad size {w}x{h} (likely a logo)")
    if w > 800:
        im = im.resize((800, round(h * 800 / w)))
    im.save(out, "JPEG", quality=72, optimize=True, progressive=True)
    import os
    print("OK", os.path.getsize(out))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
