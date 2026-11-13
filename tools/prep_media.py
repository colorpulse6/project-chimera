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


def regions():
    # World page: the v3 paintings of the six far regions (town and Long Road come from world1()).
    canon = ROOT / "canon"
    for rid in ("high-pass", "shadow-country", "salt-road", "archive-forest", "hanging-sea", "weeping-colossus"):
        save(Image.open(canon / rid / "art" / f"{rid}-v3.png"), f"painting-{rid}-v3", maxw=1280, q=88)


def b1_normal_play():
    """27 Oct: B1 packaged proof, public-demo REPORT.md Coordinator 12:58.

    A Development launch capture, not a public demo or a coast-road frame.
    The signed Shipping test has no matching gameplay capture here.
    """
    run = FG / "review/longroad/package-check-b1dev"
    save(Image.open(run / "launch-longroad.png"), "b1-longroad-arrival")


def coast_par2():
    """28 Oct: packaged par2 walk and jetty frames, Coordinator gate 04:09.

    These are package proof captures, not the later editor sea/door candidates.
    L1 coast-road gate: public-demo REPORT.md, 27 Oct 18:40.
    """
    run = FG / "tools/diag/coordinator/par2/package"
    picks = {
        "proofs/walk/W02-leg1-end-to-leg2-end.png": "par2-causeway",
        "proofs/walk/W07-landing-to-the.png": "par2-road-stance",
        "gapwalk/GAP-walk-east-through-the-gap-05.png": "par2-settlement-jetty",
    }
    for src, name in picks.items():
        save(Image.open(run / src), name)


def weather_par7():
    """28 Oct: par7 packaged proof frames; Coordinator gate 14:41.

    Sea and settlement look remain candidates for Nic, as the post states.
    No later par8 project candidates are included.
    """
    run = FG / "tools/diag/coordinator/par7/package"
    picks = {
        "proofs/continue-quay.png": "par7-harbour-sea",
        "proofs/walk/W08-the-to-upper-03.png": "par7-longroad-trees",
        "gapwalk/GAP-walk-east-through-the-gap-05.png": "par7-settlement-shore",
    }
    for src, name in picks.items():
        save(Image.open(run / src), name)


def hall_par9():
    """29 Oct: par8/par9 gates; par9 close 03:45, reviewer 03:42.

    Hall and river are package captures. S2 is the integrated par9 review
    suite, manually checked by the reviewer; no par10 candidates included.
    """
    run = FG / "tools/diag/coordinator/par9"
    picks = {
        "package/inside/E-enter-12.png": "par9-hall-inside",
        "package/water/P2-strip-08.png": "par9-river-wind",
        "suites/parity-fixed/S2-ridge-over-town.png": "par9-settlement-paths",
    }
    for src, name in picks.items():
        save(Image.open(run / src), name)


def household_par10():
    """29 Oct par10 package, clean launch gate 06:54 CDT; reviewer 06:57.

    Both frames come from the packaged household proof, exit 0. Nic has not
    accepted par10. Keepers' Cove is Nic's 30 Oct name, not this build's label.
    """
    run = FG / "tools/diag/coordinator/par10/package/household"
    picks = {
        "E-enter-facing-in.png": "par10-household-inside",
        "K-back-at-the-door.png": "par10-household-door",
    }
    for src, name in picks.items():
        save(Image.open(run / src), name)


def regions_par12():
    """30 Oct par11/par12 gates, including the 23:46 CET picker follow-up.

    All four picks are par12 packaged captures. High Pass and desert sheets
    are complete with exit 0; picker PASS 6/6. Nic's acceptance remains open.
    No later editor work or concept art is included.
    """
    run = FG / "tools/diag/coordinator/par12/package"
    picks = {
        "highpass/C0-painting.png": "par12-highpass-terrace",
        "highpass/D2-the-room.png": "par12-highpass-refuge",
        "desert/02b-kai-at-arrival.png": "par12-desert-arrival",
        "picker/shots/HighresScreenshot03780.png": "par12-highpass-picker",
    }
    for src, name in picks.items():
        save(Image.open(run / src), name)


def highpass_par13():
    """31 Oct par13 gate 04:58 CET, reviewer 05:13 and corrections 05:20.

    All picks are package captures: High Pass sheet exit 0 and picker PASS
    6/6. Wedge reduced, not removed; human acceptance remains open.
    """
    run = FG / "tools/diag/coordinator/par13/package"
    picks = {
        "highpass/W1-stair-and-arm.png": "par13-highpass-flowers",
        "highpass/C0-painting.png": "par13-highpass-terrace",
        "picker/shots/HighresScreenshot03974.png": "par13-highpass-arrival",
    }
    for src, name in picks.items():
        save(Image.open(run / src), name)


def par13_playtest():
    """Nic's 31 Oct par13 playtest, adopted by Coordinator at 16:43 CET.

    These are Nic's screenshots of the already gated par13 package, not
    par14 candidate frames. Preserve their framing and show the defects.
    """
    run = FG / "briefs/2026-10-27-parallel-world/nic-par13-picks"
    picks = {
        "01-highpass-arrival-lavender-slab.jpg": "par13-playtest-cliff",
        "03-highpass-flowers-chips.jpg": "par13-playtest-flowers",
    }
    for src, name in picks.items():
        save(Image.open(run / src), name)


def par14_package():
    """1 Nov: exact par14 Development package, clean launches/exits reviewed.

    Combined verdict at 02:33 CET retains the 1280 timing exception. Nic's
    later notes keep the flowers, not the whole vista. No par15 media.
    """
    run = FG / "tools/diag/coordinator/par14/package"
    picks = {
        "highpass/N1-walk-to-refuge.png": "par14-refuge-approach",
        "highpass/C0-painting.png": "par14-highpass-lake",
        "highpass/F2-petal-player-close.png": "par14-highpass-flowers",
        "systems-a1/lantern-on/H-inside-warm-pool.png": "par14-household-lantern",
        "par14-pkg-town-fixed-a1/C1-painting4.png": "par14-church-square",
    }
    for src, name in picks.items():
        save(Image.open(run / src), name)


def rex_par15():
    """Par15 A1 package, A2 independent review and bounded Root acceptance.

    Default spawn is ordinary startup. Catch-up follows diagnostic Kai relocation
    with Kai Ghost mode; these frames do not establish normal traversal or final art.
    Only remove the 32px OS title bar from the inspected 1280x752 captures.
    """
    run = Path("/Volumes/Agent Workspace/Chimera/ModelWork/Rex/package-runtime-a2")
    picks = {
        "default-spawn/frame-0020.jpg": "par15-rex-spawn",
        "clear-run-catch-up/frame-0020.jpg": "par15-rex-approach",
        "clear-run-catch-up/frame-0055.jpg": "par15-rex-near",
    }
    for src, name in picks.items():
        img = Image.open(run / src)
        assert img.size == (1280, 752), (src, img.size)
        save(img.crop((0, 32, img.width, img.height)), name)


def rex_returns_par15():
    """2 Nov packaged Rex checkpoints, reviewed A2 and Nic's later look verdict.

    A4-v21-a2 has separate clean launch/exit evidence; the a6 picture belongs
    to an interrupted, fully restored session, not a passed traversal case.
    A2 door and battle returns have their own bounded independent reviews.
    Crop only the OS title bar from each inspected original.
    """
    run = Path("/Volumes/Agent Workspace/Chimera/ModelWork/Rex")
    picks = {
        "rexcheck-town-stairs-slopes-a2-a6/09-south-approach.png": "par15-rex-church",
        "rexcheck-battle-a1/08-post-victory-rex.png": "par15-rex-battle-return",
        "rexcheck-camera-town-a1/leave-refuge/frame-0036.jpg": "par15-rex-refuge-return",
    }
    for src, name in picks.items():
        img = Image.open(run / src)
        assert img.size == (1280, 752), (src, img.size)
        save(img.crop((0, 32, img.width, img.height)), name)


def rex_wake_v22():
    """2 Nov Game22 package: mechanical wake passes, visual blackout stays open.

    Battle22 A2 review supports returned pair and flat-road resumption only.
    Retain the visible transition and failed town stairs; crop OS title bar only.
    No private face trials or prospective Source23 material is included.
    """
    run = Path("/Volumes/Agent Workspace/Chimera/ModelWork/Rex")
    picks = {
        "rexcheck-battle-v22-a2/ops-0420-battle-waking.jpg": "par15-v22-wake-return",
        "rexcheck-battle-v22-a2/ops-0417-battle-waking.jpg": "par15-v22-wake-transition",
        "rexcheck-town-v22-a1/20-upper-lookback.jpg": "par15-v22-stairs-lookback",
    }
    for src, name in picks.items():
        img = Image.open(run / src)
        assert img.size == (1280, 752), (src, img.size)
        save(img.crop((0, 32, img.width, img.height)), name)


def rex_high_pass_v23():
    """3 Nov clean Game23 High Pass pilot; no full-route acceptance.

    Two inspected originals from the independently reviewed A3 pilot.
    Remove only the 32px OS title bar; preserve the Development label.
    """
    run = Path("/Volumes/Agent Workspace/Chimera/ModelWork/Rex/rexcheck-high-pass-v23-a3")
    picks = {
        "ops-0032-hp-approach-00.jpg": "par15-v23-high-pass-approach",
        "ops-0101-hp-approach-02-lookback.jpg": "par15-v23-high-pass-lookback",
    }
    for src, name in picks.items():
        img = Image.open(run / src)
        assert img.size == (1280, 752), (src, img.size)
        save(img.crop((0, 32, img.width, img.height)), name)


def par16_battle_life_b2():
    """3 Nov packaged par16: B1 battle and B2 resident preview.

    Original PNG hashes match combined-screenshot-manifest.json.
    Both source sessions have reviewed normal exits and restored user state.
    Preserve the full game image and HUD; do not imply visible cleaning.
    """
    import hashlib
    run = Path("/Volumes/Agent Workspace/Chimera/ModelWork/Rex/Par16")
    picks = [
        ("combined-b1-runtime-a1/evidence/ScreenShot00005.png",
         "par16-b1-battle-ready", "266a673a63a8303f71fe9e618aee6b6c09fb7cd0b874fc1b3539ee9f50ff20cd"),
        ("combined-b2-runtime-a1/evidence/ScreenShot00014.png",
         "par16-b2-edith-and-tom", "8f1d2e76ecd6fb74433649b9dfd312d9a0faff516ebe908bc96ece83fa0636b8"),
    ]
    for src, name, digest in picks:
        original = run / src
        assert hashlib.sha256(original.read_bytes()).hexdigest() == digest
        img = Image.open(original)
        assert img.size == (1280, 720), (src, img.size)
        save(img, name)


def par16_evening_b5():
    """4 Nov gated B3/B4/B5 package originals, full frame and HUD retained.

    B3 lowered pose has obscured legs; B4 battle/street and B5 mending/return
    carry their own evidence limits. Verify every original against its manifest.
    """
    import hashlib
    import json
    run = Path("/Volumes/Agent Workspace/Chimera/ModelWork/Rex/Par16")
    picks = [
        ("b3-life-a2-packaged-runtime-a2", "ScreenShot00100.png", "par16-b3-kneeling"),
        ("b4-life-a2-packaged-runtime-a1", "ScreenShot00008.png", "par16-b4-dissolving"),
        ("b4-life-a2-packaged-runtime-a1", "ScreenShot00013.png", "par16-b4-street-conversation"),
        ("b5-life-a3-packaged-runtime-a1", "ScreenShot00003.png", "par16-b5-evening-mending"),
        ("b5-life-a3-packaged-runtime-a1", "ScreenShot00006.png", "par16-b5-well-return"),
    ]
    for folder, filename, name in picks:
        manifest = json.loads((run / folder / "screenshot-manifest.json").read_text())
        if "files" in manifest:
            records = {Path(row.get("file", row.get("retained", ""))).name: row for row in manifest["files"]}
        else:
            records = manifest
        original = run / folder / "evidence" / filename
        assert hashlib.sha256(original.read_bytes()).hexdigest() == records[filename]["sha256"]
        img = Image.open(original)
        assert img.size == (1280, 720), (filename, img.size)
        save(img, name)



def par16_close_b8():
    """Reviewed B6-B8 originals, complete frames and HUD retained.

    B6 A1 pictures remain valid visual evidence despite its isolation failure;
    clean exit/save checks belong to the separate A3 run. B7 A1 watchdog exit
    is not a normal menu quit. The post preserves both limits.
    """
    import hashlib
    import json
    run = Path("/Volumes/Agent Workspace/Chimera/ModelWork/Rex/Par16")
    picks = [
        ("b6-life-a4-packaged-runtime-a1", "evidence", "screenshot-manifest.json", None, "ScreenShot00024.png", "par16-b6-remaining-dirt", (1600, 900)),
        ("b6-life-a4-packaged-runtime-a1", "evidence", "screenshot-manifest.json", None, "ScreenShot00025.png", "par16-b6-swept", (1600, 900)),
        ("b7-life-a5-packaged-runtime-a1", "screenshots", "ROOT-CHECKS.json", "screenshots", "ScreenShot00011.png", "par16-b7-reed-net", (1280, 720)),
        ("b8-life-a5-packaged-runtime-a3", "screenshots", "ROOT-CHECKS.json", "native_screenshots", "ScreenShot00001.png", "par16-b8-charge", (1280, 720)),
        ("b8-life-a5-packaged-runtime-a3", "screenshots", "ROOT-CHECKS.json", "native_screenshots", "ScreenShot00002.png", "par16-b8-heavy-strike", (1280, 720)),
    ]
    for folder, subdir, manifest_name, key, filename, name, size in picks:
        manifest = json.loads((run / folder / manifest_name).read_text())
        rows = manifest[key] if key else manifest
        records = {Path(row.get("name", row.get("file", ""))).name: row for row in rows}
        original = run / folder / subdir / filename
        assert hashlib.sha256(original.read_bytes()).hexdigest() == records[filename]["sha256"]
        img = Image.open(original)
        assert img.size == size, (filename, img.size)
        save(img, name)


def salt_road_checkpoint1():
    """Nic: looks good for now, REPORT 5 Nov 21:20; CP1 only.

    Read the retained CP1 package outputs, not the changing CP2 package folder.
    Pin inspected originals; retain the full frame, including composition gaps.
    """
    import hashlib
    import json
    run = FG / "tools/diag/coordinator/round2/prev/2228"
    picks = [
        ("package-salt", "C1-kai-eye.png", "salt-road-cp1-arrival", "3d88ef0bc6b11f3d3518addfd2b79246f9a19a446ee3435e6218600844df50bd"),
        ("package-salt", "KP-mid.png", "salt-road-cp1-kesler-pi", "d0089fadef152734385528fe0218a518e5efb14014f2a060ffc02d7c87a31937"),
        ("package-walk", "W04-to-x+0.png", "salt-road-cp1-corridor", "287ba57487e71ed2ab7a077b6e1d8e2866370c524f2c637bc804e143263719e1"),
    ]
    for folder, filename, name, expected in picks:
        evidence = run / folder
        result = json.loads((evidence / "RESULT.json").read_text())
        manifest = json.loads((evidence / "manifest.json").read_text())
        assert result["complete"] and result["exit_code"] == 0
        assert result["original_user_files_equal"]
        assert manifest["complete"] and any(row["frame"] == filename for row in manifest["shots"])
        original = evidence / filename
        assert hashlib.sha256(original.read_bytes()).hexdigest() == expected
        img = Image.open(original)
        assert img.size == (1600, 900), (filename, img.size)
        save(img, name)


def salt_road_checkpoint2():
    """CP2 packaged checks complete; reviewer PASS-with-findings, Nic on hold.

    Full frames preserve the unfinished mouth and spur composition. Pin the
    inspected bytes because the coordinator package directory can later rotate.
    """
    import hashlib
    import json
    run = FG / "tools/diag/coordinator/round2/package"
    picks = [
        ("salt", "C1-kai-eye.png", "salt-road-cp2-arrival", "43f547c1e6af75f7370f9293455a117f76312702862f5e99f671697dd9bc4762"),
        ("salt", "KP-E3-threshold.png", "salt-road-cp2-threshold", "a1888d0818c9aaa7d084d52c53f719920fd222e9f81c796929e77e5d63333da6"),
        ("walk", "09-threshold-push-07.png", "salt-road-cp2-mouth", "a6d06f3e2203bd1e7d6e52ff768343f071196c39e2ac0fea4810816d7ff56fed"),
        ("walk", "10-threshold-end-back-view.png", "salt-road-cp2-spurs", "d0ae359fd78c14dee1acde6287f578fc1d41695382c270f7e6fe1b167febbccf"),
    ]
    for folder, filename, name, expected in picks:
        evidence = run / folder
        result = json.loads((evidence / "RESULT.json").read_text())
        manifest = json.loads((evidence / "manifest.json").read_text())
        assert result["complete"] and result["exit_code"] == 0
        assert result["original_user_files_equal"]
        frames = {row["frame"] for row in manifest["shots"]}
        frames.update(Path(f["file"]).name for row in manifest["shots"] for f in row.get("frames", []))
        assert manifest["complete"] and filename in frames
        original = evidence / filename
        assert hashlib.sha256(original.read_bytes()).hexdigest() == expected
        img = Image.open(original)
        assert img.size == (1600, 900), (filename, img.size)
        save(img, name)


def high_pass_hp1():
    """HP-1, 6 November: clean packaged launch; full walk review FAIL.

    REPORT 23:52 and reviewer 23:54:35 authorize only a limited terrace/art
    preview. Capture completion is not walk acceptance. Full frames retain the
    stair escape and obstructed lookout return; no crop hides either defect.
    """
    import hashlib
    import json
    run = FG / "tools/diag/coordinator/round3/package"
    picker = json.loads((run / "picker/RESULT.json").read_text())
    assert picker["exit_code"] == 0 and picker["original_user_files_equal"]
    picks = [
        ("hp", "C0-painting.png", "hp1-terrace", "c12d65f45a81644b8d1ed3c56dff2c9d8d70e32f666ad7271e484025177cbd1b"),
        ("walk", "32-stair-end-push-20s-04.png", "hp1-stair-escape", "0fddc3efda898a1dcc9de5d65a8fcb916028d016c0865b6f73a7179cf2101e8f"),
        ("walk", "21-lookout-push-20s-04.png", "hp1-lookout-drop", "9487f04647ad4fa8625bcb0c46b86c41202ee4764fa4946e11595476350e540a"),
    ]
    for folder, filename, name, expected in picks:
        evidence = run / folder
        result = json.loads((evidence / "RESULT.json").read_text())
        manifest = json.loads((evidence / "manifest.json").read_text())
        assert result["complete"] and result["exit_code"] == 0
        assert result["original_user_files_equal"]
        frames = {row["frame"] for row in manifest["shots"]}
        frames.update(Path(f["file"]).name for row in manifest["shots"] for f in row.get("frames", []))
        assert manifest["complete"] and filename in frames
        original = evidence / filename
        assert hashlib.sha256(original.read_bytes()).hexdigest() == expected
        img = Image.open(original)
        assert img.size == (1600, 900), (filename, img.size)
        save(img, name)


def hp1b_b9_rex_w1():
    """7 Nov: Nic accepted HP-1b/B9; W1 has a clean packaged launch.

    Gates: round-3 REPORT 08:58 and round-4 REPORT 11:32. HP frames are
    from the continuous 29-target walk, not the independently seeded sheet.
    B9 uses fixed-step scripted input; W1 does not prove Rex visible on return.
    Pin inspected bytes because coordinator directories can rotate.
    """
    import hashlib
    import json
    run = FG / "tools/diag/coordinator"
    picks = [
        ("round3/package/walk", "04-door-in-02.png", "hp1b-refuge-entry", "35a53ae9ca2dbf578c156de77c62e8f7e7377eadccc323f2c9b42d777a87d20a"),
        ("round3/package/walk", "21-lookout-push-20s-04.png", "hp1b-lookout-stop", "103446b264bdc81fcdb020dd13bfd3c57a6e1b63e862b2d39b05e841be17a4c3"),
        ("round3/package/walk", "32-stair-end-push-20s-02.png", "hp1b-stair-stop", "87c86810ef485ca9a6e54fd0f872d2a9f4635e0e196619fa71e6e5c2f6bcf21b"),
        ("round3/package-b9/normal-dense", "HighresScreenshot00212.png", "b9-next-kai-defend", "16f658a384c2309463e318a925329bf725f517a705f59a16f31558463051301a"),
        ("round4/package-w1/b9", "HighresScreenshot00000.png", "w1-rex-river", "5776de6f180a63ccc87d2327af3821374643c79c0a4c462e1e6738781f5f319b"),
    ]
    for folder, filename, name, expected in picks:
        evidence = run / folder
        result = json.loads((evidence / "RESULT.json").read_text())
        assert result["exit_code"] == 0 and result["original_user_files_equal"]
        if folder.endswith("/walk"):
            manifest = json.loads((evidence / "manifest.json").read_text())
            frames = {row["frame"] for row in manifest["shots"]}
            frames.update(Path(f["file"]).name for row in manifest["shots"] for f in row.get("frames", []))
            assert result["complete"] and manifest["complete"] and filename in frames
        original = evidence / filename
        assert hashlib.sha256(original.read_bytes()).hexdigest() == expected
        img = Image.open(original)
        assert img.size == (1600, 900), (filename, img.size)
        save(img, name)


def a2_withdrawn_run8():
    """7 Nov A2 run 8: packaged clean launches, then withdrawn, NOT accepted.

    COMMON.md coordinator 21:32:16 records the place circle claiming Havenwood
    and restoration of the previous project state. Publication gate is the
    retained clean package launch, not acceptance of the road or save labels.
    These are archived package-walk frames, never replacement-run evidence.
    """
    import hashlib
    import json
    run = FG / "tools/diag/coordinator/round4/prev-w2/run8-placecircle/package-w2"
    for folder in ("walk", "picker-High-Pass-road-1", "picker-High-Pass"):
        result = json.loads((run / folder / "RESULT.json").read_text())
        assert result["exit_code"] == 0 and result["original_user_files_equal"]
    evidence = run / "walk"
    manifest = json.loads((evidence / "manifest.json").read_text())
    assert manifest["complete"]
    frames = {row["frame"] for row in manifest["shots"]}
    picks = [
        ("020-out.png", "a2-run8-road", "a52e164d9a5ad07bffa37011783ebaf2e7cfd1d9aad0d3c064ae818f071eeeff"),
        ("038-out.png", "a2-run8-end", "d96afa7c51873c7a82e04df39aabb20afeb0546efd031f67db3d435a1ee25529"),
        ("076-return.png", "a2-run8-cove-return", "f343e0eb6082fd88ce6a4bbf8b60333be63a114fd5e8c33e81219adb51109bc2"),
    ]
    for filename, name, expected in picks:
        original = evidence / filename
        assert filename in frames
        assert hashlib.sha256(original.read_bytes()).hexdigest() == expected
        img = Image.open(original)
        assert img.size == (1600, 900), (filename, img.size)
        save(img, name)



def shadow_country_w4():
    """8 Nov W4 B4a: clean packaged walk/ferry checks, Nic acceptance unrecorded.

    REPORT 09:46; retained W4 RESULTs exit 0 and originals unchanged.
    These frames do not illustrate the separate W3 campaign Continue test.
    """
    import hashlib
    import json
    run = FG / "tools/diag/coordinator/round4/package-w4"
    picks = [
        ("ferry", "F00-outside-stand.png", "sc-w4-ferry-outside", "a408b4f952b52429cc6ffbbe9ba2a18fd14cd755e6c73fbd1644817887a07b8f"),
        ("reveal", "V-hint-pocket-eye.png", "sc-w4-water-hint", "4acc7999d6b00dc36c4f676eb2fc7867245a2b16c293d201e6a62e9bd3da7daf"),
        ("reveal", "V-wide-square-eye.png", "sc-w4-wide-water", "fb6713a7611523e919425368f67a1379283f888c57c0d805ef46912d0d8e9a33"),
        ("ferry", "F02-inside-settled.png", "sc-w4-ferry-across", "435510451f3515984e365bc3a5c855479459d436eb50ede40f53e9b4f58cc314"),
    ]
    for folder, filename, name, expected in picks:
        evidence = run / folder
        result = json.loads((evidence / "RESULT.json").read_text())
        manifest = json.loads((evidence / "manifest.json").read_text())
        assert result["exit_code"] == 0 and result["original_user_files_equal"]
        assert manifest["complete"]
        assert filename in {shot["frame"] for shot in manifest["shots"]}
        original = evidence / filename
        assert hashlib.sha256(original.read_bytes()).hexdigest() == expected
        img = Image.open(original)
        assert img.size == (1600, 900), (filename, img.size)
        save(img, name)



def a3_rex_passage():
    """8 Nov W5 run 2: packaged road 2 and real close passage, not following.

    REPORT 15:13. The friendly body overlap is an explicit visible tradeoff.
    Only retained W5 frames; no road-3 or uninstalled sky trial images.
    """
    import hashlib
    import json
    run = FG / "tools/diag/coordinator/round4/package-w5"
    picks = [
        ("pilot", "005a-passage-return-08.png", "a3-rex-overlap", "82d151e8f4efc8ef3f10a092e54b2582e4cf6c4095ae21a9ade9a6db22b5773a"),
        ("pilot", "005a-passage-return-16.png", "a3-rex-passed", "1450d57f70cb31127dacf2a4e61ac425ada2d0acb239d4439d84661b214f0583"),
        ("walk", "028-out.png", "a3-road-end", "b1ac6e68a85385cf4218bcf00e5228ad9c91a4a902cda20674144eb2fac4621a"),
    ]
    for folder, filename, name, expected in picks:
        evidence = run / folder
        result = json.loads((evidence / "RESULT.json").read_text())
        manifest = json.loads((evidence / "manifest.json").read_text())
        assert result["exit_code"] == 0 and result["original_user_files_equal"]
        assert manifest["complete"]
        frames = {shot.get("frame") for shot in manifest["shots"]}
        frames.update(Path(f["file"]).name for shot in manifest["shots"] for f in shot.get("frames", []))
        assert filename in frames
        original = evidence / filename
        assert hashlib.sha256(original.read_bytes()).hexdigest() == expected
        img = Image.open(original)
        assert img.size == (1600, 900), (filename, img.size)
        save(img, name)



def map_m1():
    """9 Nov M1 packaged map preview; function checks pass, cost gate fails.

    COMMON 10:01 and REPORT Systems 10:12 retain the performance limitation.
    Only completed F2 Courtyard / F3 Salt Road frames, never staged M r2 art.
    """
    import hashlib
    import json
    run = FG / "tools/diag/coordinator/round5/package-m1"
    picks = [
        ("f2-courtyard", "HighresScreenshot00010.png", "m1-full-map", "1987c387a166758e75838328143cf9239fdb765356aa6d8a3ffde4dac19856f1"),
        ("f2-courtyard", "HighresScreenshot00002.png", "m1-courtyard-mini", "507c4570a4bf92b5a15a63bc0c4cf078a950c4a54705378ca1e8e8e573b27c1e"),
        ("f3-Salt-Road", "HighresScreenshot00018.png", "m1-salt-mini", "ed0cbd5227d6ef7303a4085d62aa6cdb134a0fd6a7603880853bc9c78d430ca1"),
    ]
    for folder, filename, name, expected in picks:
        evidence = run / folder
        result = json.loads((evidence / "RESULT.json").read_text())
        assert result["exit_code"] == 0 and result["original_user_files_equal"]
        assert filename in result["shots"]
        original = evidence / filename
        assert hashlib.sha256(original.read_bytes()).hexdigest() == expected
        img = Image.open(original)
        assert img.size == (1600, 900), (filename, img.size)
        save(img, name)



def approach_run18():
    """12 Nov run18: clean packaged picker; editor walk passed, packaged walk unrun.

    COMMON 10:30 retains tool failure and documented camera05 exception.
    Editor frames are from this packaged checkpoint, labelled as editor proof.
    """
    import hashlib
    import json
    run = FG / "tools/diag/coordinator/round5/a2/runs/20261112-065628"
    receipt = json.loads((run / "package/picker/RESULT.json").read_text())
    assert receipt["exit_code"] == 0 and receipt["original_user_files_equal"]
    assert "HighresScreenshot00000.png" in receipt["shots"]
    picks = [
        ("evidence/spec-pilot-shore/00-shore-first80-return.png", "a2r18-shore", "224b56e5e554fc28415bc5d1419d45b1a0037b7ecf9ae1beb4b898a58d221e6b"),
        ("evidence/spec-pilot-stair/03-stair-cut-part-01-of-02.png", "a2r18-stair", "b545c7a9150d828b2d9a8eda54b7c9b180d0dfcff7e6b0bb491f5b04740fcaf8"),
        ("package/picker/HighresScreenshot00000.png", "a2r18-arrival", "a8647ba7ab791d53a0c6136707499599be1a54f67a5b8aef02872f14b2006779"),
    ]
    for relative, name, expected in picks:
        original = run / relative
        assert hashlib.sha256(original.read_bytes()).hexdigest() == expected
        img = Image.open(original)
        assert img.size == (1600, 900)
        save(img, name)


def mainland_r2():
    """R2 clean packaged launch, 13 Nov; Coordinator look FAIL, Nic art pending.
    Same-checkpoint editor harbour captures, not packaged harbour-walk proof.
    """
    import hashlib
    import json
    run = FG / "tools/diag/coordinator/round5/r2s/runs/20261112-234731"
    receipt = json.loads((run / "package/picker/RESULT.json").read_text())
    assert receipt["exit_code"] == 0 and receipt["original_user_files_equal"]
    for filename, name, expected in [
        ("02-quay-along.png", "r2s-quay", "516d5cd44ed01f812d4bf6567eccda8e2036f18cbc92c78ca00de4096ad88b0c"),
        ("04-water-wide.png", "r2s-water", "1ed580e3a5cc02b647632f219edcd1546ec19b2a95acdfbe23d8319fdc341e6e"),
    ]:
        original = run / "evidence/harbour" / filename
        assert hashlib.sha256(original.read_bytes()).hexdigest() == expected
        img = Image.open(original)
        assert img.size == (1600, 900)
        save(img, name)


import sys
if "--mainland-r2" in sys.argv:
    mainland_r2()
    sys.exit(0)
if "--approach-run18" in sys.argv:
    approach_run18()
    sys.exit(0)
if "--map-m1" in sys.argv:
    map_m1()
    sys.exit(0)
if "--a3-rex-passage" in sys.argv:
    a3_rex_passage()
    sys.exit(0)
if "--shadow-country-w4" in sys.argv:
    shadow_country_w4()
    sys.exit(0)
if "--a2-withdrawn-run8" in sys.argv:
    a2_withdrawn_run8()
    sys.exit(0)
if "--hp1b-b9-rex-w1" in sys.argv:
    hp1b_b9_rex_w1()
    sys.exit(0)
if "--high-pass-hp1" in sys.argv:
    high_pass_hp1()
    sys.exit(0)
if "--salt-road-checkpoint2" in sys.argv:
    salt_road_checkpoint2()
    sys.exit(0)
if "--salt-road-checkpoint1" in sys.argv:
    salt_road_checkpoint1()
    sys.exit(0)
if "--par16-close-b8" in sys.argv:
    par16_close_b8()
    sys.exit(0)
if "--par16-evening-b5" in sys.argv:
    par16_evening_b5()
    sys.exit(0)
if "--par16-battle-life-b2" in sys.argv:
    par16_battle_life_b2()
    sys.exit(0)
if "--rex-high-pass-v23" in sys.argv:
    rex_high_pass_v23()
    sys.exit(0)
if "--rex-wake-v22" in sys.argv:
    rex_wake_v22()
    sys.exit(0)
if "--rex-returns-par15" in sys.argv:
    rex_returns_par15()
    sys.exit(0)
if "--rex-par15" in sys.argv:
    rex_par15()
    sys.exit(0)
if "--par14-package" in sys.argv:
    par14_package()
    sys.exit(0)
if "--par13-playtest" in sys.argv:
    par13_playtest()
    sys.exit(0)
if "--highpass-par13" in sys.argv:
    highpass_par13()
    sys.exit(0)
if "--regions-par12" in sys.argv:
    regions_par12()
    sys.exit(0)
if "--household-par10" in sys.argv:
    household_par10()
    sys.exit(0)
if "--hall-par9" in sys.argv:
    hall_par9()
    sys.exit(0)
if "--weather-par7" in sys.argv:
    weather_par7()
    sys.exit(0)
if "--coast-par2" in sys.argv:
    coast_par2()
    sys.exit(0)
if "--b1-normal-play" in sys.argv:
    b1_normal_play()
    sys.exit(0)
if "--regions" in sys.argv:
    regions()
    sys.exit(0)
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
