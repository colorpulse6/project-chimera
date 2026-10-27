"""Prepare site media from the project's review sheets and paintings.

Run with the chimera-ml venv (has Pillow):
  ~/.venvs/chimera-ml/bin/python tools/prep_media.py
Writes JPEGs into src/assets/media/. Re-run after new review runs.
One section alone:  ... prep_media.py --batch-2-3  (or --batch-4-10, --batch-11-longroad, --longroad-2-6)
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


def batch_2_3():
    """Batches 1 to 3 of the scale-up (22 to 24 Oct): lane, harbour, church square,
    hill village, sea walls, and the six residents from the second lineup drawing."""
    R = FG / "review"
    picks = {
        "20261022-152156-lane2": {"01-arrival-from-courtyard": "lane-arrival", "05-looking-back-up": "lane-looking-back", "06-kai-in-lane": "lane-kai"},
        "20261022-151724-harbour2": {"02-quay-along": "harbour-quay", "03-boat": "harbour-boat", "06-kai-on-quay": "harbour-kai"},
        "20261024-043105-church3": {"01-arrival-from-path": "church-arrival", "02-painting": "church-painting", "03-chapel-door": "church-chapel-door", "04-lookout-headland": "church-headland", "06-kai-on-terrace": "church-kai"},
        "20261024-043149-village3": {"01-arrival-from-terrace": "village-stairs", "03-anna-at-the-basin": "village-anna", "04-doorstep": "village-doorstep", "06-kai-in-village": "village-kai"},
        "20261024-043023-walls1": {"01-quay-to-coast-path": "sea-quay-path", "02-bay-to-path-and-terrace": "sea-bay", "04-north-wall-from-sea": "sea-north-wall", "06-village-from-sea": "sea-village"},
    }
    for run, frames in picks.items():
        for src, name in frames.items():
            save(Image.open(R / run / f"{src}.png"), name)
    save(Image.open(R / "batch3-walls/walls-before-after.png"), "sea-walls-before-after", maxw=2000)
    save(Image.open(FG / "briefs/2026-10-22-scale-up/lineup-2/lineup-2-c.png"), "lineup-2-drawing", maxw=2000, q=90)
    # The six new residents side by side, full figure, from the figure run of 22 Oct
    gen6 = R / "20261022-183648-gen6"
    figs = [Image.open(next(gen6.glob(f"*-{k}_gen-full.png"))).convert("RGB") for k in ("sal", "rowan", "frida", "tom", "anna", "edith")]
    # the frames are landscape with the figure in the middle: keep the central 40 %
    figs = [f.crop((round(f.width * .30), 0, round(f.width * .70), f.height)) for f in figs]
    h = 900
    figs = [f.resize((round(f.width * h / f.height), h), Image.LANCZOS) for f in figs]
    gap = 12
    row = Image.new("RGB", (sum(f.width for f in figs) + gap * (len(figs) - 1), h), (18, 15, 22))
    x = 0
    for f in figs:
        row.paste(f, (x, 0)); x += f.width + gap
    save(row, "townsfolk-second-lineup", maxw=2400)
    # One drawing crop, one in-game figure and one face per new resident
    li2 = Image.open(FG / "briefs/2026-10-22-scale-up/lineup-2/lineup-2-c.png").convert("RGB")
    w2, h2 = li2.size
    boxes2 = {"sal": (0.02, 0.205), "rowan": (0.2, 0.365), "frida": (0.36, 0.515), "tom": (0.52, 0.67),
              "anna": (0.665, 0.825), "edith": (0.82, 0.985)}
    for key, (f0, f1) in boxes2.items():
        save(li2.crop((round(w2 * f0), 0, round(w2 * f1), h2)), f"{key}-drawing", maxw=1200, q=90)
        full = Image.open(next(gen6.glob(f"*-{key}_gen-full.png")))
        save(full, f"{key}-full", maxw=1800)
        save(Image.open(next(gen6.glob(f"*-{key}_gen-face.png"))), f"{key}-face", maxw=1800)


def batch_4_10():
    """Batches 4 to 10b (24 to 26 Oct): the chapel and its door, Dyers' Steps, the shop,
    Swaps, the garden, the Rusted Cog, the estate approach, lineup 3 and Greta, Kai's
    movement, and the Opening Desert slice."""
    R = FG / "review"
    B = FG / "briefs/2026-10-22-scale-up"
    picks = {
        "20261024-185310-chapel11": {"01-painting": "chapel-room", "04-benches-side": "chapel-benches", "06-kai-inside": "chapel-kai"},
        "20261024-185641-door8": {"01-outside-prompt": "chapel-door-prompt", "02-mid-fade": "chapel-door-fade", "03-inside": "chapel-door-inside"},
        "20261024-185818-dyers6": {"01-concept-framing": "dyers-court", "04-vats-and-loom": "dyers-vats", "07-from-the-church-terrace": "dyers-from-terrace", "08-kai-in-the-court": "dyers-kai"},
        "20261024-185345-shop8": {"01-painting": "shop-room", "05-outside-door": "shop-door", "06-kai-inside": "shop-kai"},
        "20261024-185435-barter4": {"02-aldric-panel": "swaps-aldric", "04-frida-gift": "swaps-frida", "08-harbour-bottle-prompt": "swaps-bottle"},
        "20261025-092240-garden11": {"01-concept-framing": "garden-fountain", "03-view-out": "garden-view", "06-rooftops": "garden-ladder", "07-street-to-the-rose-door": "garden-rose-door", "08-kai-in-the-garden": "garden-kai"},
        "20261024-223041-cog5greta": {"01-painting": "cog-room", "03-hearth-cog": "cog-hearth", "04-bar": "cog-greta", "07-kai-inside": "cog-kai"},
        "20261025-140251-pkg8-estate": {"01-painting-A": "estate-road", "02-from-the-foot": "estate-foot", "03-painting-B": "estate-view-back", "05-kai-at-the-gate": "estate-gate-kai"},
        "20261025-093606-shut2": {"02-gate-line": "estate-gate-line"},
        "20261025-140158-pkg8-silas": {"01-silas_gen-full": "silas-full", "02-silas_gen-face": "silas-face", "03-silas_gen-with-kai": "silas-with-kai"},
        "20261025-140125-pkg8-figs": {"01-ferris_gen-full": "ferris-full", "02-ferris_gen-face": "ferris-face", "04-stranger_gen-full": "stranger-full", "05-stranger_gen-face": "stranger-face"},
        "20261025-121259-residents-r3": {"23-greta_gen-full": "greta-full", "24-greta_gen-face": "greta-face"},
        "20261026-002154-pkg-batch10b-desert": {"01-painting-view": "desert-arrival", "02b-kai-at-arrival": "desert-kai", "03-rocks": "desert-rocks"},
    }
    for run, frames in picks.items():
        for src, name in frames.items():
            save(Image.open(R / run / f"{src}.png"), name)
    # Paintings and drawings Nic picked or accepted
    save(Image.open(B / "estate/estate-approach-a.png"), "painting-estate-approach", maxw=2000, q=90)
    li3 = Image.open(B / "lineup-3/lineup-3-a.png").convert("RGB")
    save(li3, "lineup-3-drawing", maxw=2000, q=90)
    w3, h3 = li3.size
    for key, (f0, f1) in {"silas": (0.06, 0.34), "ferris": (0.35, 0.665), "stranger": (0.67, 0.95)}.items():
        save(li3.crop((round(w3 * f0), 0, round(w3 * f1), h3)), f"{key}-drawing", maxw=1200, q=90)
    greta = Image.open(B / "greta/greta-draft-a.png").convert("RGB")
    save(greta.crop((round(greta.width * 0.3), 0, round(greta.width * 0.65), greta.height)), "greta-drawing", maxw=1200, q=90)
    # Lineup 3 in the game, side by side, as for the second lineup
    figs = [Image.open(R / run / f"{src}.png").convert("RGB") for run, src in (
        ("20261025-140158-pkg8-silas", "01-silas_gen-full"), ("20261025-140125-pkg8-figs", "01-ferris_gen-full"),
        ("20261025-140125-pkg8-figs", "04-stranger_gen-full"))]
    figs = [f.crop((round(f.width * .30), 0, round(f.width * .70), f.height)) for f in figs]
    h = 900
    figs = [f.resize((round(f.width * h / f.height), h), Image.LANCZOS) for f in figs]
    gap = 12
    row = Image.new("RGB", (sum(f.width for f in figs) + gap * (len(figs) - 1), h), (18, 15, 22))
    x = 0
    for f in figs:
        row.paste(f, (x, 0)); x += f.width + gap
    save(row, "townsfolk-third-lineup", maxw=2400)
    # Kai's movement, batch 9: the walk row and the jump row of the strip board
    board = Image.open(R / "batch9/pkg9-motion.png")
    save(board.crop((0, 473, 1863, 893)), "kai-walk-strip", maxw=2400)
    save(board.crop((0, 2256, 2330, 2676)), "kai-jump-strip", maxw=2400)


def batch_11_longroad():
    """26 Oct: packaged batch 11b and the accepted Long Road blockout.

    Gates: BATCH-11-REPORT.md 06:53; Long Road MILESTONE-2.md accepted
    baseline and 17:40 performance sample. No milestone 2 scenery frames.
    """
    import os
    R = FG / "review"
    picks = {
        "20261026-065217-pkg-batch11b-stranger": {
            "04-stranger_gen-full": "stranger-b11-full",
            "05-stranger_gen-face": "stranger-b11-face",
            "06-stranger_gen-with-kai": "stranger-b11-kai",
        },
        "20261026-065053-pkg-batch11b-motion": {
            "06-kai-in-street": "kai-b11-street",
        },
    }
    # The first Long Road package review is retained with its handoff evidence,
    # outside the timestamped review tree. Require that source explicitly.
    longroad = Path(os.environ["LONGROAD_REVIEW_SOURCE"])
    for run, frames in picks.items():
        for src, name in frames.items():
            save(Image.open(R / run / f"{src}.png"), name)
    save(Image.open(longroad / "01-arrival-road-and-arc.png"), "longroad1-arrival")


def longroad_2_6():
    """27 Oct: Long Road 2–6, using only the final packaged game frames.

    Gate: design-parity REPORT.md, Coordinator 02:16 on 27 Oct, with clean
    launch and complete packaged sheets. Human acceptance remains pending.
    These named package-check runs are game captures, not Blender mock-ups.
    """
    run = FG / "review/longroad/package-check-longroad6/parity"
    picks = {
        "P1-arrival-master": "longroad6-arrival",
        "P2-river-crossing": "longroad6-river",
        "P3-hidden-hollow": "longroad6-hollow",
        "P5-roadside-repair": "longroad6-repair",
    }
    for src, name in picks.items():
        save(Image.open(run / f"{src}.png"), name)


def originals():
    """The first concepts, from Nic's Drive (May 2025), the first 3D Kai (30 May 2025)
    and the browser game's art (February 2026), for the timeline page."""
    drive = next(Path.home().glob("Library/CloudStorage/GoogleDrive-*/My Drive/Chimera/Visuals & Assets"))
    cast = {"kai": ("kai-illustration", "kai-sprite"), "rex": ("rex-illustration", "rex-sprite"),
            "seraph": ("seraph-illustration", "seraph-sprite-2"), "zenith": ("zenith-illustration", "zenith-sprite"),
            "valerian": ("valarien-illustration", "valarien-sprite-2"), "lyra": ("lyra-illustration", "lyra-sprite"),
            "cora": ("cora-illustration", "cora-sprite"), "kaelen": ("kaelen-illustration", "kaelen-sprite"),
            "aris": ("Aris-illustration", "aris-sprite"), "valerius": ("valerius-illustration", "valerius-sprite"),
            "king-greyon": ("king-greyon-illustration", "king-greyon-sprite")}
    for key, (ill, spr) in cast.items():
        save(Image.open(drive / f"{ill}.jpeg"), f"orig-{key}-illustration", maxw=900, q=84)
        save(Image.open(drive / f"{spr}.jpeg"), f"orig-{key}-sprite", maxw=900, q=84)
    save(Image.open(drive / "chimera-world-map.jpeg"), "orig-world-map", maxw=2000, q=88)
    tpose = Image.open(ROOT / "source-assets (from Documents)/Kai-t-pose.jpeg")
    save(tpose.crop((round(tpose.width * .18), 0, round(tpose.width * .82), tpose.height)), "orig-kai-t-pose", maxw=900, q=86)
    ch = ROOT / "characters"
    save(Image.open(ch / "kai_sprite_sheet.png").crop((190, 190, 540, 670)), "orig-browser-kai", maxw=900, q=90)
    save(Image.open(ch / "kai_passed_out.png"), "orig-browser-kai-fainted", maxw=1200, q=86)
    save(Image.open(ch / "desert_plateau.png"), "orig-browser-desert", maxw=900, q=84)
    save(Image.open(ch / "hooded_stranger_walk.png"), "orig-browser-strangers", maxw=900, q=84)


def timeline_kai():
    # Kai in the engine for the timeline scrubber: batch 11b packaged build, cropped 4:5 to the stage.
    im = Image.open(FG / "review/20261026-065053-pkg-batch11b-motion/06-kai-in-street.png")
    save(im.crop((948, 550, 1948, 1800)), "kai-engine", maxw=1000, q=88)


def world1():
    # Open-world blockout (package world1, 27 Oct): two vista frames and the v3 paintings they aim at.
    canon = ROOT / "canon"
    save(Image.open(canon / "long-road/ingame/world1-V2-road-valley.png"), "world1-road-valley", maxw=1672, q=88)
    save(Image.open(canon / "havenwood-town/ingame/world1-V1-town-east.png"), "world1-town-east", maxw=1672, q=88)
    save(Image.open(canon / "long-road/art/long-road-v3.png"), "painting-long-road-v3", maxw=1280, q=88)
    save(Image.open(canon / "havenwood-town/art/havenwood-town-v3.png"), "painting-havenwood-v3", maxw=1280, q=88)


import sys
if "--longroad-2-6" in sys.argv:
    longroad_2_6()
    sys.exit(0)
if "--batch-11-longroad" in sys.argv:
    batch_11_longroad()
    sys.exit(0)
if "--batch-2-3" in sys.argv:
    batch_2_3()
    sys.exit(0)
if "--world1" in sys.argv:
    world1()
    sys.exit(0)
if "--timeline-kai" in sys.argv:
    timeline_kai()
    sys.exit(0)
if "--originals" in sys.argv:
    originals()
    sys.exit(0)
if "--batch-4-10" in sys.argv:
    batch_4_10()
    sys.exit(0)

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
