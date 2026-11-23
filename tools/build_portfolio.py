"""Gera images/work/ + projects.json a partir da pasta de portfólio do Desktop.

Uso:  python tools/build_portfolio.py
Para adicionar um projeto: crie a pasta em 03 - Portfólio e uma linha em PROJECTS.
Se houver subpasta "Editadas", a versão editada (arquivo maior) substitui a original.
"""
import json, os, shutil, subprocess, sys
from pathlib import Path
import io
from PIL import Image, ImageCms, ImageOps
SRGB = ImageCms.createProfile("sRGB")

Image.MAX_IMAGE_PIXELS = None
SRC = Path(os.path.expanduser(r"~\OneDrive\Desktop\Arquivos\01 - CarmoViz\03 - Portfólio"))
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "images" / "work"
IMG_EXT = {".jpg", ".jpeg", ".png", ".webp"}
FULL, THUMB = 2200, 900
# arquivos que não entram (print de SketchUp e duplicatas)
EXCLUDE = {"1me.png", "living_room_photorealistic_archi…_2k_202608052007.jpeg", "render 1.jpeg"}

# pasta, slug, título pt/en, local pt/en, categoria[, arquivos]
# "arquivos" (opcional) escolhe só algumas imagens da pasta: "subpasta/nome" sem extensão; "*" no fim = prefixo
PROJECTS = [
    # ── projetos novos (pastas de clientes e construtoras) ──
    (r"..\01 - Clientes\08 - Projeto Roseane\IMAGENS", "casa-rosiane", "Casa Rosiane", "Rosiane House", "Porto Seguro, Bahia", "Porto Seguro, Brazil", "residencial",
     ['fachada dia', 'fachada', 'lateral', 'Piscina', 'Piscina 3', 'porta noite', 'Sala de Estar 1', 'Sala de jantar 3', 'cozinha 01', 'cinema (1)', 'Área gourmet', 'Sauna', 'Suite Master 1', 'Banheiro Suíte Master 2']),
    (r"..\01 - Clientes\12 - Projeto Leonardo\Imagens", "vista-da-mata", "Vista da Mata Residencial", "Vista da Mata Residences", "", "", "empreendimento",
     ['01', '03', '02', '08', '04', '09', 'Casa 07 3', 'Casa 07 2', 'Casa 05 2', 'Drone', 'Sala de estar casa 5, 6 e 7', 'Cozinha', 'Suíte 2 - 2']),
    (r"..\01 - Clientes\06 - Projeto Lucas Vidal\Material Final\Imagens", "residencia-vidal", "Residência Vidal", "Vidal Residence", "", "", "residencial",
     ['Lucas Vidal-14', 'Lucas Vidal-15', 'Lucas Vidal-13', 'Lucas Vidal-17', 'Lucas Vidal-21', 'Lucas Vidal-18', 'Lucas Vidal-10', 'Lucas Vidal-8', 'Lucas Vidal-19', 'Lucas Vidal-2']),
    (r"..\01 - Clientes\05 - Projeto Neto\Projeto Casa - Netto - Atualizado 2026\render neto\FINAL EXTERNA", "casa-neto", "Casa Neto", "Neto House", "", "", "residencial",
     ['Render - Netto-01', 'Render - Netto-02', 'Render - Netto-06', 'Render - Netto-08', 'Render - Netto-09', 'Render - Netto-12', 'Render - Netto-13', 'Render - Netto-14']),
    (r"..\02 - Construtoras\02 - Souza & Fagundes Construtora\Projeto - Residencial Caju\MATERIAL FINAL\IMAGENS", "residencial-caju", "Residencial Caju", "Caju Residences", "", "", "empreendimento",
     ['Render - R.CAJU-01', 'Render - R.CAJU-10', 'Render - R.CAJU-14', 'Render - R.CAJU-17', 'Render - R.CAJU-18', 'Render - R.CAJU-15', 'Render - R.CAJU-12', 'Render - R.CAJU-20', 'Render - R.CAJU-28', 'Render - R.CAJU-22', 'Render - R.CAJU-32', 'Render - R.CAJU-39']),
    (r"..\02 - Construtoras\03 - Max Construtora\Projeto - Porto Princesa\Render\Final", "porto-princesa", "Porto Princesa", "Porto Princesa", "Porto Seguro, Bahia", "Porto Seguro, Brazil", "empreendimento",
     ['Porto Princesa-11', 'Porto Princesa-12', 'Porto Princesa-18', 'Porto Princesa-20', 'Porto Princesa-23', 'Porto Princesa-24', 'Porto Princesa-14', 'Porto Princesa-16', 'Porto Princesa-17', 'Porto Princesa-19', 'Porto Princesa-22', 'Porto Princesa-5']),
    (r"..\02 - Construtoras\03 - Max Construtora\Projeto - Summer Ville\Render\FINAL FINAL", "summer-ville", "Summer Ville Residence", "Summer Ville Residence", "", "", "empreendimento",
     ['SVR - Render-20', 'SVR - Render-21', 'SVR - Render-16', 'SVR - Render-18', 'SVR - Render-30', 'SVR - Render-33', 'SVR - Render-35', 'SVR - Render-37', 'SVR - Render-41', 'SVR - Render-34', 'SVR - Render-45', 'SVR - Render-44']),
    (r"..\02 - Construtoras\03 - Max Construtora\Projeto - Reserva do Bosque\Render\Imagens", "reserva-do-bosque", "Reserva do Bosque", "Reserva do Bosque", "", "", "empreendimento",
     ['01', '08', '04', '17', '23', '18', '20', '21', '10', '14', '29', '40']),
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
    ("0 - Imagens de Estudo", "torre-residencial", "Torre Residencial", "Residential Tower", "", "", "empreendimento",
     ["Estudo/Estudo (3)", "Estudo/Estudo (8)"]),
    ("0 - Imagens de Estudo", "edificio-residencial", "Edifício Residencial", "Residential Building", "", "", "empreendimento",
     ["Estudo/Estudo (6)"]),
    ("0 - Imagens de Estudo", "casa-com-piscina", "Casa com Piscina", "Pool House", "", "", "residencial",
     ["Estudo 2/Convert*2001", "Estudo 2/Convert*1941", "Estudo 2/20260807_142736000_iOS", "Estudo 2/fachda"]),
    ("0 - Imagens de Estudo", "casa-pedra-madeira", "Casa Pedra e Madeira", "Stone & Timber House", "", "", "residencial",
     ["Estudo 2/Adding*", "Estudo 2/9999"]),
    ("0 - Imagens de Estudo", "casa-urbana", "Casa Urbana", "Urban House", "", "", "residencial",
     ["Estudo 2/House*"]),
    ("0 - Imagens de Estudo", "interiores-contemporaneos", "Interiores Contemporâneos", "Contemporary Interiors", "", "", "residencial",
     ["Estudo/Estudo (7)", "Estudo/Estudo (1)", "Estudo/Estudo (4)", "Estudo 2/3", "Estudo/Estudo (2)", "Estudo/Estudo (5)"]),
    ("0 - Imagens de Estudo", "cinema-adega-lavabo", "Cinema, Adega e Lavabo", "Cinema, Cellar & Powder Room", "", "", "residencial",
     ["Estudo 2/4555", "Estudo 2/52", "Estudo 2/6", "Estudo 2/9", "Estudo 2/988"]),
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


def select(found: list[Path], folder: Path, wanted: list[str]) -> list[Path]:
    """Filtra pela lista "subpasta/nome" (sem extensão; "*" = curinga), na ordem da lista."""
    import fnmatch
    def key(p):
        parts = [x for x in p.relative_to(folder).parts[:-1] if x.lower() != "editadas"]
        return "/".join(parts + [p.stem]).lower()
    out = []
    for w in wanted:
        hits = [p for p in found if fnmatch.fnmatchcase(key(p), w.lower())]
        if len(hits) != 1:
            raise SystemExit(f"!! '{w}' casou com {len(hits)} arquivos em {folder.name}")
        out.append(hits[0])
    return out


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
        shutil.rmtree(OUT)  # regenera tudo a partir da pasta do Desktop
    data = []
    for folder, slug, tpt, ten, lpt, len_, cat, *files in PROJECTS:
        src = SRC / folder
        if not src.is_dir():
            print(f"!! pasta não encontrada: {folder}", file=sys.stderr)
            continue
        dst = OUT / slug
        dst.mkdir(parents=True)
        images = []
        found = pick_images(src)
        if files:
            found = select(found, src, files[0])
        for i, p in enumerate(found, 1):
            with Image.open(p) as im:  # abrir baixa o arquivo do OneDrive
                icc = im.info.get("icc_profile")
                im = ImageOps.exif_transpose(im).convert("RGB")
                if icc:  # aplica o perfil embutido (ex.: HDR PQ do Lightroom), senão a imagem sai lavada
                    try:
                        im = ImageCms.profileToProfile(im, ImageCms.ImageCmsProfile(io.BytesIO(icc)), SRGB, outputMode="RGB")
                    except ImageCms.PyCMSError:
                        pass
                save_webp(im, FULL, dst / f"{i:02d}.webp", 82)
                save_webp(im, THUMB, dst / f"{i:02d}-t.webp", 76)
                w, h = im.size
            images.append({"src": f"images/work/{slug}/{i:02d}.webp", "thumb": f"images/work/{slug}/{i:02d}-t.webp",
                           "w": w, "h": h})
            print(f"  {slug}/{i:02d}  <- {p.relative_to(SRC)}")
        videos = []
        for j, v in enumerate([] if files else sorted(src.glob("*.mp4")), 1):
            convert_video(v, dst / f"v{j}.mp4", dst / f"v{j}.webp")
            videos.append({"src": f"images/work/{slug}/v{j}.mp4", "poster": f"images/work/{slug}/v{j}.webp"})
            print(f"  {slug}/v{j}.mp4 <- {v.name}")
        data.append({"slug": slug, "category": cat, "title": {"pt": tpt, "en": ten},
                     "location": {"pt": lpt, "en": len_}, "images": images, "videos": videos})
    (ROOT / "projects.json").write_text(json.dumps({"projects": data}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK: {len(data)} projetos, {sum(len(d['images']) for d in data)} imagens")


if __name__ == "__main__":
    main()
