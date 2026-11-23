"""Gera images/work/ + projects.json a partir da pasta de portfólio do Desktop.

Uso:  python tools/build_portfolio.py
Para adicionar um projeto: crie a pasta em 03 - Portfólio e uma linha em PROJECTS.
Se houver subpasta "Editadas", a versão editada (arquivo maior) substitui a original.
"""
import json, os, shutil, subprocess, sys
from pathlib import Path
from PIL import Image, ImageOps

Image.MAX_IMAGE_PIXELS = None
SRC = Path(os.path.expanduser(r"~\OneDrive\Desktop\Arquivos\01 - CarmoViz\03 - Portfólio"))
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "images" / "work"
IMG_EXT = {".jpg", ".jpeg", ".png", ".webp"}
FULL, THUMB = 2200, 900
# arquivos que não entram (print de SketchUp e duplicatas)
EXCLUDE = {"1me.png", "living_room_photorealistic_archi…_2k_202608052007.jpeg", "render 1.jpeg"}

# pasta, slug, título pt/en, local pt/en, categoria, subpastas extras
PROJECTS = [
    ("1 - Casa em Trancoso - Brasil", "casa-trancoso", "Casa em Trancoso", "Trancoso House", "Trancoso, Bahia", "Trancoso, Brazil", "residencial"),
    ("2 - Casa em Biscayne Bay - Miami - EUA", "biscayne-bay", "Casa em Biscayne Bay", "Biscayne Bay House", "Miami, EUA", "Miami, USA", "residencial"),
    ("3 - Residencial - Porto Seguro - Brasil", "residencial-porto-seguro", "Residencial Porto Seguro", "Porto Seguro Residences", "Porto Seguro, Bahia", "Porto Seguro, Brazil", "empreendimento"),
    ("4 - Casa Toscana - Italia", "casa-toscana", "Casa Toscana", "Tuscan House", "Toscana, Itália", "Tuscany, Italy", "residencial"),
    ("5 - Casa Branca - Pensilvânia - EUA", "casa-branca", "Casa Branca", "White House", "Pensilvânia, EUA", "Pennsylvania, USA", "residencial"),
    ("6 - Casa na Mata - Costa Rica", "casa-na-mata", "Casa na Mata", "Forest House", "Costa Rica", "Costa Rica", "residencial"),
    ("7 - Café em New York", "cafe-new-york", "Café em Nova York", "New York Café", "Nova York, EUA", "New York, USA", "comercial"),
    ("8 - Residência Aurora - São Paulo - Brasil", "residencia-aurora", "Residência Aurora", "Aurora Residence", "São Paulo, Brasil", "São Paulo, Brazil", "residencial"),
    ("9 - Casa em Alphaville - São Paulo - Brasil", "alphaville-sp-i", "Casa em Alphaville I", "Alphaville House I", "São Paulo, Brasil", "São Paulo, Brazil", "residencial"),
    ("10 - Casa em Alphaville - Salvador - Brasil", "alphaville-salvador", "Casa em Alphaville", "Alphaville House", "Salvador, Bahia", "Salvador, Brazil", "residencial"),
    ("11 - Casa em Alphaville - São Paulo - Brasil", "alphaville-sp-ii", "Casa em Alphaville II", "Alphaville House II", "São Paulo, Brasil", "São Paulo, Brazil", "residencial"),
    ("12 - Piscina - Salvador - Brasil", "piscina-salvador", "Área de Lazer", "Pool & Leisure", "Salvador, Bahia", "Salvador, Brazil", "residencial"),
    ("13 - Holanda", "holanda", "Edifício na Holanda", "Netherlands Building", "Holanda", "Netherlands", "empreendimento"),
    ("14 - Studios - Porto Seguro - Brasil", "studios-porto-seguro", "Studios Porto Seguro", "Porto Seguro Studios", "Porto Seguro, Bahia", "Porto Seguro, Brazil", "empreendimento"),
    ("15 - Vista Mar - Austrália", "vista-mar", "Casa Vista Mar", "Ocean View House", "Austrália", "Australia", "residencial"),
    ("16 - Casa em Fortaleza - Brasil", "casa-fortaleza", "Casa em Fortaleza", "Fortaleza House", "Fortaleza, Ceará", "Fortaleza, Brazil", "residencial"),
    ("17 - Casa em Arraial - Brasil", "casa-arraial", "Casa em Arraial", "Arraial House", "Arraial d'Ajuda, Bahia", "Arraial d'Ajuda, Brazil", "residencial"),
    ("0 - Imagens de Estudo", "estudos", "Estudos de Luz e Material", "Light & Material Studies", "Estúdio CarmoViz", "CarmoViz Studio", "estudo"),
]


def pick_images(folder: Path) -> list[Path]:
    """Imagens da pasta (+ subpastas, para estudos); por nome, fica o arquivo maior (Editadas/PNG)."""
    best: dict[tuple, Path] = {}
    for p in sorted(folder.rglob("*")):
        if p.suffix.lower() not in IMG_EXT or not p.is_file() or p.name.lower() in EXCLUDE:
            continue
        rel = p.relative_to(folder).parts[:-1]
        if any(part.lower() in {"video construção", "take"} for part in rel):
            continue
        group = tuple(x for x in rel if x.lower() != "editadas")
        key = (group, p.stem.lower())
        if key not in best or p.stat().st_size > best[key].stat().st_size:
            best[key] = p
    return [best[k] for k in sorted(best, key=lambda k: (k[0], natural(k[1])))]


def natural(s: str):
    import re
    return [int(t) if t.isdigit() else t for t in re.split(r"(\d+)", s)]


def save_webp(im: Image.Image, size: int, dst: Path, q: int):
    im = im.copy()
    im.thumbnail((size, size), Image.LANCZOS)
    im.save(dst, "WEBP", quality=q, method=6)


def convert_video(src: Path, dst: Path, poster: Path):
    vf = "scale='min(1920,iw)':-2"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-vf", vf, "-c:v", "libx264",
                    "-preset", "slow", "-crf", "26", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", str(dst)], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", "1", "-i", str(dst), "-frames:v", "1",
                    "-vf", "scale='min(1600,iw)':-2", str(poster)], check=True)


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    data = []
    for folder, slug, tpt, ten, lpt, len_, cat in PROJECTS:
        src = SRC / folder
        if not src.is_dir():
            print(f"!! pasta não encontrada: {folder}", file=sys.stderr)
            continue
        dst = OUT / slug
        dst.mkdir(parents=True)
        images = []
        for i, p in enumerate(pick_images(src), 1):
            with Image.open(p) as im:  # abrir baixa o arquivo do OneDrive
                im = ImageOps.exif_transpose(im).convert("RGB")
                save_webp(im, FULL, dst / f"{i:02d}.webp", 82)
                save_webp(im, THUMB, dst / f"{i:02d}-t.webp", 76)
                w, h = im.size
            images.append({"src": f"images/work/{slug}/{i:02d}.webp", "thumb": f"images/work/{slug}/{i:02d}-t.webp",
                           "w": w, "h": h})
            print(f"  {slug}/{i:02d}  <- {p.relative_to(SRC)}")
        videos = []
        for j, v in enumerate(sorted(src.glob("*.mp4")), 1):
            convert_video(v, dst / f"v{j}.mp4", dst / f"v{j}.webp")
            videos.append({"src": f"images/work/{slug}/v{j}.mp4", "poster": f"images/work/{slug}/v{j}.webp"})
            print(f"  {slug}/v{j}.mp4 <- {v.name}")
        data.append({"slug": slug, "category": cat, "title": {"pt": tpt, "en": ten},
                     "location": {"pt": lpt, "en": len_}, "images": images, "videos": videos})
    (ROOT / "projects.json").write_text(json.dumps({"projects": data}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK: {len(data)} projetos, {sum(len(d['images']) for d in data)} imagens")


if __name__ == "__main__":
    main()
