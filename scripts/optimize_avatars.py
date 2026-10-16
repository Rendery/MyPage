"""Genera versiones WebP livianas de mis fotos y la imagen para redes sociales (og.jpg).

Uso (desde la raíz del repo):
    python scripts/optimize_avatars.py

Vuelve a correrlo cada vez que reemplaces un PNG en public/images/avatar/.
La web carga primero el .webp y, si no existe, el .png original.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
AVATAR = ROOT / "public" / "images" / "avatar"

# Alto máximo en píxeles de cada imagen (suficiente para pantallas retina).
SIZES = {"hero": 1536, "pointing": 1536, "celebrate": 1536, "coding": 1000, "badge-photo": 480}

BG = (10, 12, 16)
LIME = (200, 240, 49)
TEXT = (238, 241, 246)
MUTED = (141, 150, 169)


def font(names: list[str], size: int) -> ImageFont.ImageFont:
    for name in names:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default(size)


def optimize() -> None:
    for name, max_h in SIZES.items():
        src = AVATAR / f"{name}.png"
        if not src.exists():
            print(f"- falta {src.name}, se omite")
            continue
        im = Image.open(src)
        im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
        if im.height > max_h:
            im = im.resize((round(im.width * max_h / im.height), max_h), Image.LANCZOS)
        out = src.with_suffix(".webp")
        im.save(out, "WEBP", quality=82, method=6)
        print(f"ok {out.name}: {src.stat().st_size // 1024} KB -> {out.stat().st_size // 1024} KB")


def og_image() -> None:
    hero = AVATAR / "hero.png"
    if not hero.exists():
        print("- falta hero.png, no se genera og.jpg")
        return

    W, H = 1200, 630
    og = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(og)

    for x in range(0, W, 48):
        draw.line([(x, 0), (x, H)], fill=(20, 23, 30))
    for y in range(0, H, 48):
        draw.line([(0, y), (W, y)], fill=(20, 23, 30))

    person = Image.open(hero).convert("RGBA")
    box = person.getchannel("A").getbbox()
    if box:
        person = person.crop(box)
    ph = H - 30
    person = person.resize((round(person.width * ph / person.height), ph), Image.LANCZOS)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse([W - 560, 60, W - 60, 560], fill=(200, 240, 49, 28))
    og.paste(glow, (0, 0), glow)
    og.paste(person, (W - person.width - 70, H - ph), person)

    display = ["seguibl.ttf", "ariblk.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"]
    body = ["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"]
    mono = ["consola.ttf", "cour.ttf", "DejaVuSansMono.ttf"]

    draw.rounded_rectangle([64, 92, 82, 110], radius=9, fill=LIME)
    draw.text((96, 86), "DISPONIBLE · LIMA, PERÚ", font=font(mono, 22), fill=MUTED)
    draw.text((60, 140), "Edery", font=font(display, 120), fill=TEXT)
    draw.text((60, 270), "Abanto", font=font(display, 120), fill=LIME)
    draw.text((64, 420), "Software Engineer · Full Stack · IA", font=font(body, 34), fill=TEXT)
    draw.text((64, 474), "Mira cómo me vería con el fotocheck de tu empresa →", font=font(body, 26), fill=MUTED)

    out = AVATAR / "og.jpg"
    og.save(out, "JPEG", quality=86, optimize=True, progressive=True)
    print(f"ok {out.name}: {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    optimize()
    og_image()
