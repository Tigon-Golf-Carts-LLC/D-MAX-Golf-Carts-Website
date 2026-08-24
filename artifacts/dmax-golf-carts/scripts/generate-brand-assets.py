#!/usr/bin/env python3
"""Regenerate every favicon, app icon and social preview image from one source.

The source of truth is brand/dmax-mark.svg. Nothing here is generated at build
time -- the outputs are committed static files in public/, because they change
only when the branding changes. Run this by hand after editing the mark:

    pip install Pillow cairosvg
    python3 scripts/generate-brand-assets.py

Run it from artifacts/dmax-golf-carts.
"""

from __future__ import annotations

import io
from pathlib import Path

import cairosvg
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
MARK = ROOT / "brand" / "dmax-mark.svg"
PUBLIC = ROOT / "public"

BLACK = (0, 0, 0)
WHITE = (255, 255, 255)

# Picked for the social card: a geometric sans, closest in spirit to the D-MAX
# wordmark. It is NOT the brand typeface -- see the note in brand/dmax-mark.svg.
FONT_DIR = Path("/mnt/skills/examples/canvas-design/canvas-fonts")
FONT_BOLD = FONT_DIR / "Outfit-Bold.ttf"


def render_mark(height: int, color: str = "black") -> Image.Image:
    """Rasterise the mark to RGBA at the given height, preserving aspect."""
    svg = MARK.read_text().replace("currentColor", color)
    width = round(height * 570 / 485)
    png = cairosvg.svg2png(
        bytestring=svg.encode(), output_width=width, output_height=height
    )
    return Image.open(io.BytesIO(png)).convert("RGBA")


def tile(size: int, pad_ratio: float, bg: tuple[int, int, int] | None) -> Image.Image:
    """A square icon: the mark centred on `bg`, inset by `pad_ratio` each side."""
    canvas = Image.new("RGBA", (size, size), (*bg, 255) if bg else (0, 0, 0, 0))
    mark = render_mark(
        max(1, round(size * (1 - 2 * pad_ratio) * 485 / 570)),
        "black" if bg else "black",
    )
    canvas.alpha_composite(
        mark, ((size - mark.width) // 2, (size - mark.height) // 2)
    )
    return canvas


def write(img: Image.Image, name: str, **kw) -> None:
    path = PUBLIC / name
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, **kw)
    print(f"  {name:32} {path.stat().st_size / 1024:7.1f} KB  {img.size[0]}x{img.size[1]}")


def build_icons() -> None:
    print("icons:")

    # Scalable tab icon. A white rounded square keeps the black mark legible on
    # both light and dark browser chrome; a bare transparent mark disappears
    # against a dark tab strip.
    svg_path = MARK.read_text().split('d="', 1)[1].split('"', 1)[0]
    (PUBLIC / "favicon.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" '
        'width="180" height="180">\n'
        '  <rect width="180" height="180" rx="34" fill="#fff"/>\n'
        '  <g transform="translate(28 43.5) scale(0.2175)">\n'
        f'    <path fill="#000" fill-rule="evenodd" d="{svg_path}"/>\n'
        "  </g>\n"
        "</svg>\n"
    )
    print(f"  {'favicon.svg':32} {(PUBLIC / 'favicon.svg').stat().st_size / 1024:7.1f} KB")

    # Multi-resolution .ico for legacy browsers and bookmark bars.
    ico = tile(64, 0.11, WHITE).convert("RGB")
    ico.save(PUBLIC / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"  {'favicon.ico':32} {(PUBLIC / 'favicon.ico').stat().st_size / 1024:7.1f} KB  16/32/48")

    write(tile(16, 0.09, WHITE), "favicon-16x16.png")
    write(tile(32, 0.09, WHITE), "favicon-32x32.png")

    # iOS clips its own rounded corners, so the icon ships square and padded.
    write(tile(180, 0.13, WHITE), "apple-touch-icon.png")

    write(tile(192, 0.12, WHITE), "icon-192.png")
    write(tile(512, 0.12, WHITE), "icon-512.png")
    # Maskable icons get cropped to a circle on some launchers: keep the mark
    # inside the 80% safe zone.
    write(tile(512, 0.22, WHITE), "icon-512-maskable.png")


def build_og() -> None:
    """1200x630 social card: the whole cart on the right, brand block on the left."""
    print("social:")
    W, H = 1200, 630
    PANEL = (5, 8, 14)

    card = Image.new("RGBA", (W, H), (*PANEL, 255))

    # The source photo is square and contains the entire vehicle. Cropping it to
    # a 1.9:1 band would cut the roof and wheels off, so instead scale the whole
    # square to the card height and seat it on the right.
    photo = Image.open(PUBLIC / "models" / "xt4.jpg").convert("RGB")
    photo = photo.resize((H, H), Image.LANCZOS).convert("RGBA")

    # Feather the photo's left edge so it dissolves into the panel instead of
    # ending on a hard vertical seam.
    fade = Image.new("L", (H, 1), 255)
    blend = int(H * 0.42)
    for x in range(blend):
        fade.putpixel((x, 0), int(255 * (x / blend) ** 1.6))
    photo.putalpha(fade.resize((H, H)))
    card.alpha_composite(photo, (W - H, 0))

    mark = render_mark(92, "white")
    card.alpha_composite(mark, (72, 128))

    draw = ImageDraw.Draw(card)
    wordmark = ImageFont.truetype(str(FONT_BOLD), 112)
    sub = ImageFont.truetype(str(FONT_BOLD), 32)
    models = ImageFont.truetype(str(FONT_BOLD), 26)

    draw.text((70, 250), "D-MAX", font=wordmark, fill=WHITE)
    draw.text((76, 378), "GOLF CARTS", font=sub, fill=(236, 240, 248))
    draw.text((76, 438), "GT4  \u00b7  GT6  \u00b7  XT4  \u00b7  XT6", font=models,
              fill=(126, 186, 255))
    draw.text((76, 492), "1-844-844-1920", font=models, fill=(196, 204, 218))

    write(card.convert("RGB"), "og-image.jpg", quality=88, optimize=True)


if __name__ == "__main__":
    if not MARK.exists():
        raise SystemExit(f"missing source mark: {MARK}")
    build_icons()
    build_og()
    print("done")
