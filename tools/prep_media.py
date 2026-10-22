"""Prepare site media from the project's review sheets and paintings.

Run with the chimera-ml venv (has Pillow):
  ~/.venvs/chimera-ml/bin/python tools/prep_media.py
Writes JPEGs into src/assets/media/. Re-run after new review runs.
"""
from pathlib import Path
from PIL import Image

ROOT = Path.home() / "Desktop/chimera"
FG = ROOT / "fresh-game"
OUT = Path(__file__).resolve().parent.parent / "src/assets/media"
OUT.mkdir(parents=True, exist_ok=True)
MAXW = 2400


def save(img, name, maxw=MAXW, q=86):
    img = img.convert("RGB")
    if img.width > maxw:
        img = img.resize((maxw, round(img.height * maxw / img.width)), Image.LANCZOS)
    img.save(OUT / f"{name}.jpg", quality=q, optimize=True, progressive=True)
    print(f"{name}.jpg {img.width}x{img.height}")


def segments(mask_fn, length, min_len=30, min_gap=4):
    """Runs of indices where mask_fn(i) is true."""
    runs, start = [], None
    for i in range(length):
        on = mask_fn(i)
        if on and start is None:
            start = i
        elif not on and start is not None:
            if i - start >= min_len:
                runs.append((start, i))
            start = None
    if start is not None and length - start >= min_len:
        runs.append((start, length))
    # merge runs separated by tiny gaps
    merged = []
    for r in runs:
        if merged and r[0] - merged[-1][1] <= min_gap:
            merged[-1] = (merged[-1][0], r[1])
        else:
            merged.append(r)
    return merged


def grid_frames(img, dark=60):
    """Find bright frames on a dark sheet. Returns (cols, rows) as pixel runs."""
    g = img.convert("L")
    w, h = g.size
    px = g.load()
    col_bright = [sum(px[x, y] > dark for y in range(0, h, 4)) for x in range(w)]
    row_bright = [sum(px[x, y] > dark for x in range(0, w, 4)) for y in range(h)]
    cols = segments(lambda x: col_bright[x] > (h / 4) * 0.5, w, min_len=100)
    rows = segments(lambda y: row_bright[y] > (w / 4) * 0.5, h, min_len=100)
    return cols, rows


# 1. Frames from the Unreal build (street run of 22 Oct, figure run of 22 Oct)
street = FG / "review/20261022-091756-street2"
save(Image.open(street / "01-arrival.png"), "street-arrival")
save(Image.open(street / "02-gate-from-plaza.png"), "street-gate")
save(Image.open(street / "04-street-centre.png"), "street-centre")
save(Image.open(street / "03-lane-into-street.png"), "street-lane")
save(Image.open(street / "05-street-looking-back.png"), "street-looking-back")
gen5 = FG / "review/20261022-072048-gen5"
save(Image.open(gen5 / "05-courtyard.png"), "courtyard-kai-cape")

# 2. Character frames from the figure run of 22 Oct (full resolution), plus the before/after composite
names = {"shopkeeper": "shopkeeper", "old-man": "old_man", "child": "child", "fisherman": "fisherman", "well-woman": "well_woman"}
for name, key in names.items():
    for label in ("full", "face", "with-kai"):
        f = next(gen5.glob(f"*-{key}_gen-{label}.png"))
        save(Image.open(f), f"{name}-{label}", maxw=1800)
save(Image.open(gen5 / "today-vs-drawn-five.png"), "townsfolk-today-vs-drawn", maxw=2400)
save(Image.open(gen5 / "06-kai-hero.png"), "kai-hero")
save(Image.open(gen5 / "02-shop-corner.png"), "shop-corner")
save(Image.open(gen5 / "07-shop-front-wide.png"), "shop-front-wide")

# 3. Lineup drawing: whole, then one crop per figure (light background)
lineup = ROOT / "studies/painted-slice/art/townsfolk/kaiba/lineup-b.png"
li = Image.open(lineup).convert("RGB")
save(li, "lineup-drawing", maxw=2000, q=90)
w, h = li.size
# Hand-placed boxes (fractions of width); the figures overlap in a column scan because of Kai's cape.
boxes = {"kai": (0.0, 0.30), "well-woman": (0.268, 0.435), "shopkeeper": (0.42, 0.575),
         "old-man": (0.57, 0.725), "child": (0.73, 0.84), "fisherman": (0.835, 1.0)}
for name, (f0, f1) in boxes.items():
    save(li.crop((round(w * f0), 0, round(w * f1), h)), f"{name}-drawing", maxw=1200, q=90)

# 4. Kai: in-game frame and hair turnaround from the reference sheet
kr = Image.open(ROOT / "studies/painted-slice/world-design/cast/images/kai-current-reference.png").convert("RGB")
kw, kh = kr.size
save(kr.crop((round(kw * .207), round(kh * .33), round(kw * .793), kh)), "kai-in-game", maxw=1400)
save(kr.crop((0, round(kh * .025), kw, round(kh * .30))), "kai-hair-turnaround", maxw=1800)

# 5. Paintings and concept art (the places the town will grow into)
PS = ROOT / "studies/painted-slice"
save(Image.open(PS / "art/townsfolk/kaiba/courtyard-b.png"), "painting-courtyard-concept", q=90)
save(Image.open(ROOT / "studies/kai-b-playable/art/background.png"), "painting-courtyard", q=90)
save(Image.open(PS / "art/scene2/painting.png"), "painting-seaside-lane", q=90)
save(Image.open(PS / "art/scene3/painting.png"), "painting-harbour", q=90)
save(Image.open(PS / "art/scene4/painting.png"), "painting-church-square", q=90)
save(Image.open(PS / "art/scene5/painting.png"), "painting-shop", q=90)
save(Image.open(PS / "art/scene6/painting.png"), "painting-hill-village", q=90)
save(Image.open(PS / "art/scene7/painting.png"), "painting-chapel", q=90)
save(Image.open(PS / "world-design/town/rusted-cog.png"), "painting-rusted-cog", q=90)
save(Image.open(PS / "world-design/town/dyers-steps.png"), "painting-dyers-steps", q=90)
save(Image.open(PS / "world-design/town/lumina-garden.png"), "painting-lumina-garden", q=90)

# 6. Look bake-off: the sheet, and the three looks of the shop corner cropped from it
bo = FG / "review/bakeoff-20261020"
sheet = Image.open(bo / "sheet.png")
save(sheet, "bakeoff-sheet", maxw=2000, q=84)
cols, rows = grid_frames(sheet)
print("bakeoff grid", len(cols), len(rows))
if len(cols) == 3 and len(rows) >= 2:
    y0, y1 = rows[1]  # 02-shop-corner
    for label, ci in (("baseline", 0), ("ink", 1), ("painted", 2)):
        x0, x1 = cols[ci]
        save(sheet.crop((x0, y0, x1, y1)), f"bakeoff-{label}", maxw=1600)
    y0, y1 = rows[5]  # 06-kai-hero
    for label, ci in (("baseline", 0), ("painted", 2)):
        x0, x1 = cols[ci]
        save(sheet.crop((x0, y0, x1, y1)), f"bakeoff-kai-{label}", maxw=1600)

# 7. Lineage: the browser game (2025) and the Godot 3D attempt (Sept 2026)
old = Path("/tmp/pc-inspect/site/site/assets/images/backgrounds/havenwood_square.png")
if old.exists():
    save(Image.open(old), "lineage-browser-2025", maxw=1600)
godot = Path.home() / "Desktop/projects/perfect-portfolio/content/newsletter/2026-W36/img/chimera-havenwood.png"
if godot.exists():
    save(Image.open(godot), "lineage-godot-2026", maxw=1600)

# 8. Walkers and menu
wk = FG / "review/20261021-095308-walkers1"
save(Image.open(wk / "04-fisherman-close.png"), "walker-fisherman")
save(Image.open(wk / "05-child-close.png"), "walker-child")
