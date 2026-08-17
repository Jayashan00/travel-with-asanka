"""Generates the starter artwork (layered SVG scenes) shipped with the site.

Every image can be replaced from the admin panel with a real photo; these exist so a
fresh clone looks finished on first run without depending on any external CDN.
"""
import math
import os
import random

OUT = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "images")
os.makedirs(OUT, exist_ok=True)

W, H = 1600, 1000


def hill(y, amp, seed, x0=0, x1=W):
    rnd = random.Random(seed)
    pts = []
    n = 6
    for i in range(n + 1):
        x = x0 + (x1 - x0) * i / n
        yy = y + math.sin(i * 1.3 + seed) * amp + rnd.uniform(-amp * 0.35, amp * 0.35)
        pts.append((x, yy))
    d = f"M {x0-40},{H+40} L {pts[0][0]-40},{pts[0][1]:.0f} "
    for i in range(1, len(pts)):
        px, py = pts[i - 1]
        cx, cy = pts[i]
        mx = (px + cx) / 2
        d += f"Q {px:.0f},{py:.0f} {mx:.0f},{(py+cy)/2:.0f} "
    d += f"T {x1+40},{pts[-1][1]:.0f} L {x1+40},{H+40} Z"
    return d


def sky(stops, name):
    body = "".join(
        f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops
    )
    return f'<linearGradient id="{name}" x1="0" y1="0" x2="0" y2="1">{body}</linearGradient>'


def sun(cx, cy, r, color, glow="#ffffff"):
    return (
        f'<circle cx="{cx}" cy="{cy}" r="{r*2.6}" fill="{color}" opacity="0.10"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{r*1.7}" fill="{color}" opacity="0.16"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{glow}" opacity="0.92"/>'
    )


def birds(seed, y=180, n=6):
    rnd = random.Random(seed)
    out = []
    for _ in range(n):
        x = rnd.uniform(120, W - 200)
        yy = y + rnd.uniform(-70, 90)
        s = rnd.uniform(9, 18)
        out.append(
            f'<path d="M{x:.0f},{yy:.0f} q{s:.0f},{-s*0.7:.0f} {s*2:.0f},0 M{x+s*2:.0f},{yy:.0f} '
            f'q{s:.0f},{-s*0.7:.0f} {s*2:.0f},0" fill="none" stroke="#123524" '
            f'stroke-opacity="0.35" stroke-width="2.4" stroke-linecap="round"/>'
        )
    return "".join(out)


def palm(x, ground, scale=1.0, color="#0e2c1d", flip=False):
    s = scale
    lean = -1 if flip else 1
    top_x, top_y = x + 10 * s * lean, ground - 215 * s
    trunk = (
        f'<path d="M{x-13*s:.0f},{ground} C{x-6*s:.0f},{ground-80*s:.0f} '
        f'{top_x-16*s:.0f},{ground-150*s:.0f} {top_x-9*s:.0f},{top_y:.0f} '
        f'L{top_x+9*s:.0f},{top_y+6*s:.0f} C{top_x+6*s:.0f},{ground-150*s:.0f} '
        f'{x+14*s:.0f},{ground-80*s:.0f} {x+19*s:.0f},{ground} Z" fill="{color}"/>'
    )
    fronds = []
    for i, ang in enumerate((-172, -140, -108, -74, -40, -8)):
        a = math.radians(ang)
        ln = 132 * s * (0.72 + 0.28 * math.sin(i * 1.7 + 1))
        ex = top_x + math.cos(a) * ln * lean
        ey = top_y + math.sin(a) * ln * 0.72
        mx = top_x + math.cos(a) * ln * 0.55 * lean
        my = top_y + math.sin(a) * ln * 0.5 - 30 * s
        fronds.append(
            f'<path d="M{top_x:.0f},{top_y:.0f} Q{mx:.0f},{my-26*s:.0f} {ex:.0f},{ey:.0f} '
            f'Q{mx:.0f},{my+30*s:.0f} {top_x:.0f},{top_y+14*s:.0f} Z" fill="{color}"/>'
        )
    nuts = "".join(
        f'<circle cx="{top_x + dx*s:.0f}" cy="{top_y + 16*s:.0f}" r="{7*s:.0f}" fill="{color}"/>'
        for dx in (-13, 0, 13)
    )
    return trunk + "".join(fronds) + nuts


ELEPHANT = (
    "M12,96 C8,74 14,52 30,40 C46,28 74,24 96,28 C112,31 122,40 128,52 "
    "C134,50 140,52 143,58 C147,66 144,78 138,84 C140,96 138,104 134,110 "
    "L128,110 L126,92 L104,96 L102,112 L94,112 L92,96 L52,96 L50,112 L42,112 "
    "L40,94 C28,92 18,88 12,96 Z"
)


def elephant(x, y, scale, color, opacity=1.0):
    """Side-on elephant built from primitives so the silhouette always reads clearly."""
    s = scale
    g = [f'<g transform="translate({x},{y}) scale({s})" opacity="{opacity}">']
    # legs
    for lx, lw, lh in ((62, 26, 62), (96, 24, 58), (150, 25, 58), (178, 26, 62)):
        g.append(f'<rect x="{lx}" y="66" width="{lw}" height="{lh}" rx="10" fill="{color}"/>')
    # body + head
    g.append(f'<ellipse cx="140" cy="52" rx="72" ry="50" fill="{color}"/>')
    g.append(f'<path d="M196,18 C214,26 220,44 214,58 C222,64 226,76 220,86 '
             f'C214,94 204,92 200,84 Z" fill="{color}"/>')
    g.append(f'<ellipse cx="58" cy="46" rx="42" ry="40" fill="{color}"/>')
    # ear
    g.append(f'<path d="M64,16 C92,12 104,34 98,58 C94,78 76,88 62,80 '
             f'C52,74 48,44 64,16 Z" fill="{color}"/>')
    g.append(f'<path d="M66,22 C88,20 96,38 91,56 C88,70 76,78 66,72 Z" fill="#ffffff" opacity="0.10"/>')
    # trunk (tapered)
    g.append(f'<path d="M22,50 C4,66 2,96 10,120 C13,130 25,132 28,122 '
             f'C22,100 24,78 40,64 Z" fill="{color}"/>')
    # tusk + tail
    g.append(f'<path d="M26,62 C16,70 12,82 14,92 L22,88 C20,78 24,70 32,66 Z" fill="#f4f1e6" opacity="0.85"/>')
    g.append(f'<path d="M208,30 C222,40 226,60 220,76" stroke="{color}" stroke-width="7" '
             f'fill="none" stroke-linecap="round"/>')
    g.append("</g>")
    return "".join(g)


def sigiriya(x, base, scale, rock="#1c3f2b", light="#2c5a3c"):
    s = scale
    g = [f'<g transform="translate({x},{base}) scale({s})">']
    g.append(f'<path d="M-250,0 C-200,-40 -150,-56 -60,-62 L80,-62 C170,-58 220,-40 260,0 Z" '
             f'fill="{rock}" opacity="0.55"/>')
    g.append(f'<path d="M-170,0 L-142,-232 C-138,-266 -112,-288 -72,-292 L88,-296 '
             f'C132,-298 162,-276 168,-240 L200,0 Z" fill="{rock}"/>')
    g.append(f'<path d="M-142,-232 C-70,-262 110,-266 168,-240 L162,-268 '
             f'C104,-292 -66,-288 -138,-258 Z" fill="#ffffff" opacity="0.16"/>')
    g.append(f'<path d="M20,0 L52,-262 C64,-290 96,-296 130,-292 L200,0 Z" fill="#000000" opacity="0.13"/>')
    for i, (px, w) in enumerate(((-104, 26), (-52, 20), (16, 24), (86, 18))):
        g.append(f'<path d="M{px},-286 q{w/2},-26 {w},0 z" fill="{light}"/>')
    g.append(f'<rect x="-96" y="-306" width="184" height="16" rx="8" fill="{light}"/>')
    for gx in (-120, -60, 40, 110):
        g.append(f'<path d="M{gx},-60 q14,-42 28,0 z" fill="{light}" opacity="0.8"/>')
    g.append("</g>")
    return "".join(g)


def write(name, inner, defs=""):
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
        f'preserveAspectRatio="xMidYMid slice"><defs>{defs}</defs>{inner}</svg>'
    )
    with open(os.path.join(OUT, name), "w") as f:
        f.write(svg)


def grain(op=0.05):
    return (
        f'<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3"/>'
        f'<feColorMatrix type="saturate" values="0"/></filter>'
        f'<rect width="{W}" height="{H}" filter="url(#g)" opacity="{op}"/>'
    )


# ---------------------------------------------------------------- scenes
def scene_rock(name, palette, with_sun=True):
    a, b, c, d, e = palette
    defs = sky([("0", a), ("0.55", b), ("1", c)], "sk")
    body = [f'<rect width="{W}" height="{H}" fill="url(#sk)"/>']
    if with_sun:
        body.append(sun(1230, 280, 92, "#ffd166"))
    body.append(birds(7))
    body.append(f'<path d="{hill(600, 40, 3)}" fill="{d}" opacity="0.45"/>')
    body.append(sigiriya(760, 760, 1.05, "#1d4630", "#2f6b45"))
    body.append(f'<path d="{hill(770, 40, 11)}" fill="{d}"/>')
    body.append(f'<path d="{hill(880, 30, 5)}" fill="{e}" opacity="0.95"/>')
    body.append(palm(200, 1010, 1.2, "#0d2a1c"))
    body.append(palm(1440, 1010, 1.0, "#0d2a1c", flip=True))
    body.append(grain())
    write(name, "".join(body), defs)


def scene_hills(name, palette, tea=True):
    a, b, c, d, e = palette
    defs = sky([("0", a), ("0.5", b), ("1", c)], "sk")
    body = [f'<rect width="{W}" height="{H}" fill="url(#sk)"/>', sun(420, 260, 76, "#fff2c2")]
    body.append(birds(3, 200, 5))
    for i, (y, col, op) in enumerate(
        [(470, d, 0.35), (560, d, 0.55), (660, e, 0.8), (780, e, 1.0)]
    ):
        body.append(f'<path d="{hill(y, 48, i*3+2)}" fill="{col}" opacity="{op}"/>')
    if tea:
        rnd = random.Random(9)
        rows = []
        for r in range(7):
            y = 800 + r * 30
            for x in range(-40, W + 60, 44):
                off = rnd.uniform(-6, 6)
                rows.append(
                    f'<ellipse cx="{x+off:.0f}" cy="{y:.0f}" rx="26" ry="13" fill="#164d2c" opacity="{0.5+r*0.06:.2f}"/>'
                )
        body.append("".join(rows))
    body.append(f'<path d="M0,930 Q400,900 820,934 T1600,916 L1600,1000 L0,1000 Z" fill="#0d2a1c"/>')
    body.append(grain())
    write(name, "".join(body), defs)


def scene_safari(name, palette):
    a, b, c, d, e = palette
    defs = sky([("0", a), ("0.5", b), ("1", c)], "sk")
    body = [f'<rect width="{W}" height="{H}" fill="url(#sk)"/>', sun(1220, 240, 110, "#ffd08a")]
    body.append(birds(21, 200, 7))
    body.append(f'<path d="{hill(520, 30, 4)}" fill="{d}" opacity="0.45"/>')
    body.append(f'<path d="{hill(636, 26, 8)}" fill="{d}" opacity="0.7"/>')
    body.append(f'<rect x="0" y="676" width="{W}" height="150" fill="#2f7f80" opacity="0.6"/>')
    for i in range(7):
        y = 692 + i * 18
        body.append(
            f'<path d="M{60+i*50},{y} q70,-9 140,0 t140,0 t140,0" fill="none" stroke="#dff2ec" '
            f'stroke-opacity="0.28" stroke-width="3" stroke-linecap="round"/>'
        )
    body.append(f'<path d="{hill(846, 20, 13)}" fill="{e}"/>')
    body.append(elephant(1010, 690, 0.85, "#1b5133", 0.9))
    body.append(elephant(430, 700, 1.55, "#123a26"))
    body.append(elephant(800, 744, 1.15, "#16452c"))
    body.append(elephant(1096, 792, 0.62, "#123a26"))
    body.append(palm(150, 1010, 1.05, "#0d2a1c"))
    body.append(grain())
    write(name, "".join(body), defs)


def scene_beach(name, palette):
    a, b, c, d, e = palette
    defs = (
        sky([("0", a), ("0.55", b), ("1", c)], "sk")
        + sky([("0", "#1f7f92"), ("0.6", "#2ea3a0"), ("1", "#63c7b4")], "sea")
    )
    body = [f'<rect width="{W}" height="{H}" fill="url(#sk)"/>', sun(1140, 300, 96, "#ffe3a3")]
    body.append(birds(33, 200, 6))
    body.append(f'<path d="{hill(560, 22, 9)}" fill="{d}" opacity="0.35"/>')
    body.append(f'<rect x="0" y="596" width="{W}" height="250" fill="url(#sea)"/>')
    body.append('<rect x="0" y="596" width="1600" height="10" fill="#ffffff" opacity="0.35"/>')
    for i in range(9):
        y = 636 + i * 24
        body.append(
            f'<path d="M{-80+i*40},{y} q90,-12 180,0 t180,0 t180,0 t180,0 t180,0 t180,0 t180,0 t180,0" '
            f'fill="none" stroke="#eafaf4" stroke-opacity="{0.34-i*0.03:.2f}" stroke-width="4" stroke-linecap="round"/>'
        )
    body.append('<path d="M0,832 Q380,796 800,832 T1600,816 L1600,1000 L0,1000 Z" fill="#f2e0bb"/>')
    body.append('<path d="M0,832 Q380,796 800,832 T1600,816 L1600,856 Q800,884 0,868 Z" fill="#ffffff" opacity="0.6"/>')
    body.append(palm(240, 916, 1.35, "#123524"))
    body.append(palm(1390, 952, 1.1, "#123524", flip=True))
    body.append(grain())
    write(name, "".join(body), defs)


def scene_train(name, palette):
    a, b, c, d, e = palette
    defs = sky([("0", a), ("0.5", b), ("1", c)], "sk")
    body = [f'<rect width="{W}" height="{H}" fill="url(#sk)"/>', sun(340, 240, 80, "#fff3cc")]
    for i, (y, op) in enumerate([(470, 0.35), (580, 0.6), (700, 0.9)]):
        body.append(f'<path d="{hill(y, 44, i*5+1)}" fill="{d}" opacity="{op}"/>')
    # viaduct arches
    body.append('<rect x="120" y="742" width="1360" height="34" fill="#e8e2d4"/>')
    for x in range(160, 1440, 190):
        body.append(
            f'<path d="M{x},1000 L{x},840 Q{x+70},760 {x+140},840 L{x+140},1000 Z" fill="#e8e2d4" opacity="0.95"/>'
        )
    body.append('<rect x="120" y="716" width="1360" height="28" fill="#f6f2e8"/>')
    # train
    body.append('<g transform="translate(430,626)">')
    body.append('<rect x="0" y="0" width="150" height="88" rx="12" fill="#1f6b3a"/>')
    for i in range(3):
        body.append(f'<rect x="{170+i*140}" y="10" width="126" height="78" rx="10" fill="#2f8b4c"/>')
        body.append(f'<rect x="{184+i*140}" y="26" width="96" height="34" rx="6" fill="#dff3e4" opacity="0.9"/>')
    body.append('<rect x="16" y="16" width="60" height="34" rx="6" fill="#dff3e4" opacity="0.9"/>')
    body.append("</g>")
    body.append(f'<path d="{hill(900, 26, 17)}" fill="{e}"/>')
    body.append(grain())
    write(name, "".join(body), defs)


def scene_temple(name, palette):
    a, b, c, d, e = palette
    defs = sky([("0", a), ("0.5", b), ("1", c)], "sk")
    body = [f'<rect width="{W}" height="{H}" fill="url(#sk)"/>', sun(1220, 240, 84, "#ffeec2")]
    body.append(f'<path d="{hill(520, 36, 6)}" fill="{d}" opacity="0.5"/>')
    body.append('<rect x="0" y="700" width="1600" height="300" fill="#2f6f6b" opacity="0.45"/>')
    # stupa / temple
    body.append(
        '<g transform="translate(700,330)">'
        '<path d="M0,370 L60,370 L60,300 L-60,300 L-60,370 Z" fill="#f4efe2"/>'
        '<path d="M-120,300 C-120,190 -70,120 0,120 C70,120 120,190 120,300 Z" fill="#faf6ec"/>'
        '<rect x="-16" y="60" width="32" height="70" fill="#e8dfc8"/>'
        '<path d="M0,10 L18,64 L-18,64 Z" fill="#ffc247"/>'
        "</g>"
    )
    body.append('<g opacity="0.30" transform="translate(700,700) scale(1,-0.45)">'
                '<path d="M-120,-300 C-120,-190 -70,-120 0,-120 C70,-120 120,-190 120,-300 Z" fill="#ffffff"/></g>')
    body.append(f'<path d="{hill(880, 24, 23)}" fill="{e}"/>')
    body.append(palm(1420, 1000, 1.1, "#0d2a1c", flip=True))
    body.append(palm(150, 990, 0.9, "#0d2a1c"))
    body.append(grain())
    write(name, "".join(body), defs)


def scene_falls(name, palette):
    a, b, c, d, e = palette
    defs = sky([("0", a), ("0.5", b), ("1", c)], "sk")
    body = [f'<rect width="{W}" height="{H}" fill="url(#sk)"/>']
    body.append(f'<path d="{hill(420, 40, 2)}" fill="{d}" opacity="0.55"/>')
    body.append('<path d="M420,1000 L520,300 L760,300 L820,1000 Z" fill="#16452c"/>')
    body.append('<path d="M1020,1000 L1080,300 L1320,300 L1400,1000 Z" fill="#16452c"/>')
    body.append('<path d="M820,330 L1020,330 L1080,860 L760,860 Z" fill="#eef8f4" opacity="0.9"/>')
    for i in range(7):
        x = 840 + i * 28
        body.append(f'<path d="M{x},340 L{x-14+i*4},850" stroke="#ffffff" stroke-opacity="0.7" stroke-width="6"/>')
    body.append('<ellipse cx="920" cy="880" rx="260" ry="60" fill="#cfe9e2" opacity="0.75"/>')
    body.append(f'<path d="{hill(940, 20, 31)}" fill="{e}"/>')
    body.append(grain())
    write(name, "".join(body), defs)


# palettes: (sky top, sky mid, sky low, mid hill, near hill)
SUNRISE = ("#ffd9a0", "#ffc36b", "#f4a261", "#2c6a45", "#173d2a")
DAY = ("#bfe6f5", "#e4f4f7", "#f6fbf7", "#3f8f5c", "#1d5636")
DUSK = ("#f9c6a3", "#f6a97f", "#e98a6b", "#35604a", "#1a3b2c")
MIST = ("#dff0ea", "#eef7f2", "#f8fcf9", "#4a9a6b", "#22603f")


def vehicle(name, body_color, shape="hatch"):
    w, h = 1200, 720
    ground = 520
    accent = "#0f2f1f"
    if shape == "van":
        car = (
            f'<path d="M150,{ground} L150,270 Q150,232 196,228 L560,206 Q640,200 700,214 '
            f'L980,286 Q1046,304 1050,352 L1050,{ground} Z" fill="{body_color}"/>'
            f'<path d="M212,262 L212,352 L520,352 L520,246 Z" fill="#dff1f6" opacity="0.95"/>'
            f'<path d="M552,244 L552,352 L860,352 L780,270 Z" fill="#dff1f6" opacity="0.9"/>'
        )
        wheels = [(320, ground), (880, ground)]
    elif shape == "sedan":
        car = (
            f'<path d="M120,{ground} L128,392 Q140,346 210,336 L340,330 L470,244 Q510,214 570,214 '
            f'L760,214 Q816,216 852,252 L946,336 L1046,352 Q1082,362 1082,404 L1082,{ground} Z" fill="{body_color}"/>'
            f'<path d="M394,326 L500,252 L596,252 L596,326 Z" fill="#dff1f6" opacity="0.95"/>'
            f'<path d="M628,252 L748,252 Q788,254 812,278 L862,326 L628,326 Z" fill="#dff1f6" opacity="0.9"/>'
        )
        wheels = [(320, ground), (872, ground)]
    else:
        car = (
            f'<path d="M170,{ground} L172,382 Q180,336 250,326 L340,320 L448,232 Q484,206 540,206 '
            f'L742,206 Q800,208 830,246 L906,326 L1002,340 Q1040,350 1040,394 L1040,{ground} Z" fill="{body_color}"/>'
            f'<path d="M386,316 L472,240 L568,240 L568,316 Z" fill="#dff1f6" opacity="0.95"/>'
            f'<path d="M600,240 L730,240 Q766,242 786,266 L830,316 L600,316 Z" fill="#dff1f6" opacity="0.9"/>'
        )
        wheels = [(340, ground), (880, ground)]

    wheel_svg = "".join(
        f'<circle cx="{x}" cy="{y}" r="76" fill="{accent}"/>'
        f'<circle cx="{x}" cy="{y}" r="38" fill="#e9eef0"/>'
        f'<circle cx="{x}" cy="{y}" r="14" fill="#b9c4c7"/>'
        for x, y in wheels
    )
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
        f'<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">'
        f'<stop offset="0" stop-color="#f7fbf6"/><stop offset="1" stop-color="#e6f1e6"/></linearGradient></defs>'
        f'<rect width="{w}" height="{h}" fill="url(#bg)"/>'
        f'<circle cx="600" cy="420" r="300" fill="#ffc247" opacity="0.18"/>'
        f'<ellipse cx="600" cy="{ground+82}" rx="470" ry="26" fill="#0f2f1f" opacity="0.12"/>'
        f"{car}{wheel_svg}"
        f'<rect x="150" y="{ground-8}" width="900" height="10" rx="5" fill="#0f2f1f" opacity="0.15"/>'
        f"</svg>"
    )
    with open(os.path.join(OUT, name), "w") as f:
        f.write(svg)


if __name__ == "__main__":
    scene_rock("hero-sigiriya.svg", SUNRISE)
    scene_hills("hero-tea-country.svg", MIST)
    scene_beach("hero-south-coast.svg", DAY)
    scene_safari("hero-safari.svg", DUSK)

    scene_rock("loc-sigiriya.svg", DAY)
    scene_safari("loc-kaudulla.svg", DUSK)
    scene_safari("loc-wilpattu.svg", MIST)
    scene_train("loc-ella.svg", MIST)
    scene_temple("loc-kandy.svg", SUNRISE)
    scene_beach("loc-mirissa.svg", DAY)
    scene_hills("loc-nuwara-eliya.svg", DAY)
    scene_falls("loc-ravana.svg", MIST)

    scene_hills("about-team.svg", SUNRISE, tea=False)
    scene_train("about-together.svg", DAY)
    scene_hills("ceylon.svg", DUSK)
    scene_temple("contact-hero.svg", DAY)

    gallery = [
        ("gallery-1.svg", scene_rock, SUNRISE),
        ("gallery-2.svg", scene_safari, DAY),
        ("gallery-3.svg", scene_beach, DUSK),
        ("gallery-4.svg", scene_hills, MIST),
        ("gallery-5.svg", scene_train, SUNRISE),
        ("gallery-6.svg", scene_temple, MIST),
        ("gallery-7.svg", scene_falls, DAY),
        ("gallery-8.svg", scene_beach, MIST),
        ("gallery-9.svg", scene_safari, SUNRISE),
        ("gallery-10.svg", scene_hills, DUSK),
        ("gallery-11.svg", scene_rock, MIST),
        ("gallery-12.svg", scene_train, DUSK),
    ]
    for fname, fn, pal in gallery:
        fn(fname, pal)

    vehicle("car-alto.svg", "#8bc34a", "hatch")
    vehicle("car-wagonr.svg", "#c9d6dd", "hatch")
    vehicle("car-fit.svg", "#e14b3b", "hatch")
    vehicle("car-prius.svg", "#25303a", "sedan")
    vehicle("car-hiace.svg", "#2f5f8f", "van")
    vehicle("car-kdh-highroof.svg", "#f2f4f5", "van")
    vehicle("car-axio.svg", "#f0f2f3", "sedan")

    print("generated", len(os.listdir(OUT)), "files in", os.path.abspath(OUT))
