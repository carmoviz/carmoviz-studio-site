/* ============================================================
   CARMOVIZ STUDIO — v2 (rework com motion: GSAP + ScrollTrigger + Lenis)
   ============================================================ */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
                set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };

const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE   = matchMedia('(hover: hover) and (pointer: fine)').matches;

let lang = store.get('cv-lang') === 'en' ? 'en' : 'pt';
let projects = [];
let lenis = null;

/* Projetos em destaque (hero + vitrine horizontal), pela ordem */
const HERO_SLUGS = ['casa-trancoso', 'holanda', 'casa-toscana', 'casa-na-mata', 'estudos'];  // usa a 1ª imagem horizontal
const FEATURE = [['casa-trancoso', 0], ['biscayne-bay', 0], ['holanda', 0], ['casa-branca', 1], ['vista-mar', 0],
                 ['casa-na-mata', 0], ['studios-porto-seguro', 2], ['piscina-salvador', 0]];             // [projeto, nº da imagem]

const PROCESS = [
  { name: ['Briefing & intake', 'Briefing & intake'], dur: ['1–3 dias', '1–3 days'],
    desc: ['Coleta completa de arquivos, referências e objetivos. O prazo de produção começa com todo o material em mãos.',
           'Complete collection of files, references and goals. Production starts once every material is in hand.'] },
  { name: ['Modelagem 3D', '3D modeling'], dur: ['3–7 dias', '3–7 days'],
    desc: ['Geometria fiel ao projeto em 3ds Max — do estrutural às esquadrias, com precisão milimétrica.',
           'Geometry faithful to the project in 3ds Max — from structure to window frames, with millimetric precision.'] },
  { name: ['Aprovação de ângulos', 'Angle approval'], dur: ['1–2 dias', '1–2 days'],
    desc: ['Prévias em clay render para validar a composição antes de qualquer material ou luz.',
           'Clay render previews to validate composition before any material or light.'] },
  { name: ['Setup de cena', 'Scene setup'], dur: ['2–4 dias', '2–4 days'],
    desc: ['Materiais PBR, iluminação cinematográfica (Corona Sun/Sky/HDRI) e enquadramento final.',
           'PBR materials, cinematic lighting (Corona Sun/Sky/HDRI) and final framing.'] },
  { name: ['Renderização', 'Rendering'], dur: ['por ângulo', 'per angle'],
    desc: ['Render final em Corona, saída 4K EXR 32 bits com render elements para a pós-produção.',
           'Final Corona render, 4K 32-bit EXR output with render elements for post-production.'] },
  { name: ['Pós-produção & IA', 'Post-production & AI'], dur: ['2–6 h/img', '2–6 h/img'],
    desc: ['Color grading cinematográfico, composição 2D e AI Enhancement — onde o render vira obra de arte.',
           'Cinematic color grading, 2D compositing and AI Enhancement — where the render becomes art.'] },
];

const SERVICES = [
  { slug: 'casa-trancoso', name: ['Renders estáticos', 'Static renders'],
    desc: ['Imagens fotorrealistas 4K de exteriores e interiores — atmosferas diurnas, golden hour, blue hour e noturnas.',
           'Photorealistic 4K exterior and interior images — daytime, golden hour, blue hour and night atmospheres.'],
    specs: [['Resolução 4K (3840×2160 px)', 'Entrega em TIFF 16 bits + JPEG', 'Múltiplas atmosferas', 'AI Enhancement incluso'],
            ['4K resolution (3840×2160 px)', '16-bit TIFF + JPEG delivery', 'Multiple atmospheres', 'AI Enhancement included']] },
  { slug: 'holanda', name: ['Animação arquitetônica', 'Architectural animation'],
    desc: ['Vídeos cinematográficos em Full HD ou 4K — walkthroughs, fly-throughs e filmes imobiliários com trilha e motion graphics.',
           'Cinematic Full HD or 4K films — walkthroughs, fly-throughs and real-estate films with soundtrack and motion graphics.'],
    specs: [['Full HD a 4K, 25–30 fps', 'Walkthrough · fly-over · fly-through', 'Trilha royalty-free inclusa', 'MP4 H.264/H.265'],
            ['Full HD to 4K, 25–30 fps', 'Walkthrough · fly-over · fly-through', 'Royalty-free soundtrack', 'MP4 H.264/H.265']] },
  { slug: 'casa-fortaleza', name: ['Tour virtual 360°', 'Virtual tour 360°'],
    desc: ['Experiência imersiva por link em qualquer dispositivo, com hotspots, identidade visual própria e suporte a VR.',
           'Immersive experience via link on any device, with hotspots, custom branding and VR support.'],
    specs: [['Renders 360° em 8K', 'Navegação por hotspots', 'Desktop, mobile e VR', 'Hospedagem por 12 meses'],
            ['8K 360° renders', 'Hotspot navigation', 'Desktop, mobile and VR', '12 months of hosting']] },
  { slug: 'studios-porto-seguro', name: ['Modelagem 3D', '3D modeling'],
    desc: ['Modelo tridimensional fiel ao projeto em 3ds Max, pronto para render, BIM ou impressão 3D.',
           'Three-dimensional model faithful to the project in 3ds Max, ready for rendering, BIM or 3D printing.'],
    specs: [['Modelagem em 3ds Max', 'Fidelidade milimétrica', 'Otimizada para render/BIM', 'FBX · OBJ · MAX'],
            ['3ds Max modeling', 'Millimetric fidelity', 'Optimized for render/BIM', 'FBX · OBJ · MAX']] },
  { slug: 'residencial-porto-seguro', name: ['Landing page imobiliária', 'Real-estate landing page'],
    desc: ['Página de vendas do empreendimento com os renders, captação de leads e desempenho pronto para tráfego pago.',
           'Sales page for the development with the renders, lead capture and performance ready for paid traffic.'],
    specs: [['Design mobile-first', 'Captação de leads integrada', 'Galeria e tour 360°', 'Pronta para Google/Meta Ads'],
            ['Mobile-first design', 'Built-in lead capture', 'Gallery and 360° tour', 'Ready for Google/Meta Ads']] },
  { slug: 'casa-arraial', name: ['Projeto arquitetônico', 'Architectural design'],
    desc: ['Concepção e desenvolvimento do projeto — estudo volumétrico, plantas e detalhamento — integrado ao render.',
           'Design and development — massing study, plans and detailing — integrated with the render.'],
    specs: [['Estudo preliminar e volumetria', 'Plantas e cortes técnicos', 'Pronto para aprovação legal', 'Integração direta com o render'],
            ['Preliminary study and massing', 'Technical plans and sections', 'Ready for permit approval', 'Direct link to the render']] },
];

const COUNTRIES = [
  ['BR','55','Brasil','Brazil'], ['US','1','Estados Unidos','United States'], ['PT','351','Portugal','Portugal'],
  ['AR','54','Argentina','Argentina'], ['UY','598','Uruguai','Uruguay'], ['PY','595','Paraguai','Paraguay'],
  ['CL','56','Chile','Chile'], ['BO','591','Bolívia','Bolivia'], ['PE','51','Peru','Peru'], ['CO','57','Colômbia','Colombia'],
  ['VE','58','Venezuela','Venezuela'], ['EC','593','Equador','Ecuador'], ['MX','52','México','Mexico'], ['CA','1','Canadá','Canada'],
  ['GB','44','Reino Unido','United Kingdom'], ['IE','353','Irlanda','Ireland'], ['FR','33','França','France'], ['ES','34','Espanha','Spain'],
  ['DE','49','Alemanha','Germany'], ['IT','39','Itália','Italy'], ['NL','31','Países Baixos','Netherlands'], ['BE','32','Bélgica','Belgium'],
  ['LU','352','Luxemburgo','Luxembourg'], ['CH','41','Suíça','Switzerland'], ['AT','43','Áustria','Austria'], ['PL','48','Polônia','Poland'],
  ['CZ','420','República Tcheca','Czech Republic'], ['SE','46','Suécia','Sweden'], ['NO','47','Noruega','Norway'], ['DK','45','Dinamarca','Denmark'],
  ['FI','358','Finlândia','Finland'], ['IS','354','Islândia','Iceland'], ['GR','30','Grécia','Greece'], ['TR','90','Turquia','Turkey'],
  ['RU','7','Rússia','Russia'], ['UA','380','Ucrânia','Ukraine'], ['RO','40','Romênia','Romania'], ['HU','36','Hungria','Hungary'],
  ['HR','385','Croácia','Croatia'], ['RS','381','Sérvia','Serbia'], ['AE','971','Emirados Árabes Unidos','United Arab Emirates'],
  ['SA','966','Arábia Saudita','Saudi Arabia'], ['QA','974','Catar','Qatar'], ['KW','965','Kuwait','Kuwait'], ['IL','972','Israel','Israel'],
  ['EG','20','Egito','Egypt'], ['ZA','27','África do Sul','South Africa'], ['NG','234','Nigéria','Nigeria'], ['KE','254','Quênia','Kenya'],
  ['MA','212','Marrocos','Morocco'], ['AO','244','Angola','Angola'], ['MZ','258','Moçambique','Mozambique'], ['CV','238','Cabo Verde','Cape Verde'],
  ['IN','91','Índia','India'], ['CN','86','China','China'], ['JP','81','Japão','Japan'], ['KR','82','Coreia do Sul','South Korea'],
  ['SG','65','Cingapura','Singapore'], ['HK','852','Hong Kong','Hong Kong'], ['TW','886','Taiwan','Taiwan'], ['TH','66','Tailândia','Thailand'],
  ['VN','84','Vietnã','Vietnam'], ['MY','60','Malásia','Malaysia'], ['ID','62','Indonésia','Indonesia'], ['PH','63','Filipinas','Philippines'],
  ['PK','92','Paquistão','Pakistan'], ['AU','61','Austrália','Australia'], ['NZ','64','Nova Zelândia','New Zealand'],
].map(([iso2, dial, pt, en]) => ({ iso2, dial, pt, en }));
const flag = (iso2) => String.fromCodePoint(...[...iso2].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
let country = COUNTRIES[0];

const CAT = { residencial: ['Residência', 'Residence'], empreendimento: ['Empreendimento', 'Development'],
              comercial: ['Comercial', 'Commercial'], estudo: ['Estudo', 'Study'] };

/* bilíngue: atributos + texto no idioma atual */
const bi = (pt, en) => `data-pt="${esc(pt)}" data-en="${esc(en)}">${esc(lang === 'en' ? en : pt)}`;
const bySlug = (slug) => projects.find(p => p.slug === slug);

/* ── BOOT ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  gsap.registerPlugin(ScrollTrigger);
  if (!REDUCE) {
    lenis = window.lenis = new Lenis({ lerp: 0.09 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  try { projects = (await (await fetch('projects.json', { cache: 'no-cache' })).json()).projects; }
  catch { projects = []; }

  const ARCHIVE = document.body.dataset.page === 'projects';
  if (ARCHIVE) renderArchive();
  else { renderHero(); renderFeature(); renderGrid(); renderSteps(); renderServices(); }
  applyLang(lang);

  initNav();
  initMenu();
  initCursor();
  initViewer();
  initFilters();
  if (ARCHIVE) {
    document.body.classList.add('is-ready');
    if (lenis) lenis.start();
    initArchiveMotion();
    return;
  }
  initCountry();
  initForm();

  await intro();
  initMotion();
  startHero();
  if (location.hash) setTimeout(() => goTo(location.hash), 100);
});

/* ── IDIOMA ────────────────────────────────────────────── */
function applyLang(l) {
  lang = l;
  store.set('cv-lang', l);
  document.documentElement.lang = l === 'en' ? 'en' : 'pt-BR';
  $$('[data-pt]').forEach(el => { el.textContent = el.dataset[l]; });
  $$('[data-ph-pt]').forEach(el => { el.placeholder = el.dataset[l === 'en' ? 'phEn' : 'phPt']; });
  $$('[data-aria-pt]').forEach(el => el.setAttribute('aria-label', el.dataset[l === 'en' ? 'ariaEn' : 'ariaPt']));
  $$('.lang-btn').forEach(b => b.classList.toggle('is-active', b.dataset.lang === l));
  splitWords();
  updateHeroNow();
  if ($('#country-select')?.classList.contains('open')) renderCountries($('#country-search').value);
  if (window.ScrollTrigger) ScrollTrigger.refresh();
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('.lang-btn');
  if (b && b.dataset.lang !== lang) applyLang(b.dataset.lang);
});

/* ── RENDER ────────────────────────────────────────────── */
function renderHero() {
  const slides = HERO_SLUGS.map(bySlug).filter(Boolean);
  $('#hero-media').innerHTML = slides.map((p, i) =>
    `<div class="hero-slide${i === 0 ? ' is-active' : ''}" data-slug="${p.slug}">
       <img src="${(p.images.find(m => m.w > m.h) || p.images[0]).src}" alt="" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
     </div>`).join('');
  $('#hero-bars').innerHTML = slides.map((p, i) =>
    `<button type="button" class="hero-bar" data-i="${i}" aria-label="${esc(p.title.pt)}"><i></i></button>`).join('');
}

function renderFeature() {
  const list = FEATURE.map(([slug, n]) => [bySlug(slug), n]).filter(([p]) => p);
  $('#feature-track').innerHTML = list.map(([p, n], i) => {
    const img = p.images[n] || p.images[0];
    return `<article class="fcard" data-slug="${p.slug}" data-cursor tabindex="0">
      <span class="fcard-idx">${String(i + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}</span>
      <div class="fcard-media" style="aspect-ratio:${img.w} / ${img.h}"><img src="${img.src}" alt="${esc(p.title.pt)}" loading="lazy"></div>
      <div class="fcard-meta"><h3 class="fcard-title" ${bi(p.title.pt, p.title.en)}</h3><span class="fcard-loc" ${bi(p.location.pt, p.location.en)}</span></div>
    </article>`;
  }).join('');
}

function renderGrid() {
  $('#grid').innerHTML = projects.map(p => {
    const n = p.images.length + p.videos.length;
    const cat = CAT[p.category] || ['', ''];
    return `<article class="card" data-slug="${p.slug}" data-cat="${p.category}" data-cursor tabindex="0">
      <div class="card-media">
        <img src="${p.images[0].thumb}" alt="${esc(p.title.pt)}" loading="lazy">
        <span class="card-badge">${n} ${p.videos.length ? '▶ ' : ''}<span ${bi(n > 1 ? 'imagens' : 'imagem', n > 1 ? 'images' : 'image')}</span></span>
      </div>
      <div class="card-meta">
        <h3 class="card-title" ${bi(p.title.pt, p.title.en)}</h3>
        <span class="card-loc"><span ${bi(p.location.pt, p.location.en)}</span> · <span ${bi(cat[0], cat[1])}</span></span>
      </div>
    </article>`;
  }).join('');
  layoutGrid();
}

/* página "Todos os projetos": cada projeto com todas as imagens */
function renderArchive() {
  const total = projects.reduce((n, p) => n + p.images.length + p.videos.length, 0);
  $('#archive-count').innerHTML = `${projects.length} <span ${bi('projetos', 'projects')}</span> · ${total} <span ${bi('imagens', 'images')}</span>`;
  $('#archive').innerHTML = projects.map((p, k) => {
    const cat = CAT[p.category] || ['', ''];
    const items = [...p.images.map(m => ({ thumb: m.thumb, r: m.w / m.h })),
                   ...p.videos.map(v => ({ thumb: v.poster, r: 16 / 9, video: true }))];
    return `<article class="proj" data-slug="${p.slug}" data-cat="${p.category}">
      <header class="proj-head">
        <span class="proj-num">${String(k + 1).padStart(2, '0')}</span>
        <h2 class="proj-title" ${bi(p.title.pt, p.title.en)}</h2>
        <span class="proj-loc" ${bi(p.location.pt, p.location.en)}</span>
        <span class="proj-cat" ${bi(cat[0], cat[1])}</span>
      </header>
      <div class="proj-imgs">${items.map((it, i) =>
        `<button type="button" class="proj-img${it.video ? ' is-video' : ''}" data-i="${i}" data-cursor style="--r:${it.r.toFixed(3)}" aria-label="${esc(p.title.pt)} — ${i + 1}"><img src="${it.thumb}" alt="" loading="lazy"></button>`).join('')}
      </div>
    </article>`;
  }).join('');
}

function initArchiveMotion() {
  if (REDUCE) return;
  gsap.from('.archive-head .ln > span', { yPercent: 110, duration: 1.2, stagger: 0.08, ease: 'expo.out' });
  gsap.from(['.archive-head .eyebrow', '#archive-count', '#filters'], { opacity: 0, y: 20, duration: 1, stagger: 0.08, ease: 'expo.out', delay: 0.2 });
  $$('.proj').forEach(p => {
    gsap.from($('.proj-head', p).children, { y: 30, opacity: 0, duration: 1, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 88%' } });
    gsap.from($$('.proj-img', p), { y: 50, opacity: 0, duration: 1, stagger: 0.04, ease: 'expo.out', scrollTrigger: { trigger: $('.proj-imgs', p), start: 'top 90%' } });
  });
}

/* linhas da grade: 7+5 · 4+4+4 · 5+7 (12 colunas); a última linha sempre fecha */
const ROWS = [[7, 5], [4, 4, 4], [5, 7]];
function layoutGrid() {
  const cards = $$('.card:not(.is-hidden)');
  for (let i = 0, r = 0; i < cards.length; r++) {
    const left = cards.length - i;
    let row = ROWS[r % 3];
    if (left < row.length) row = left === 1 ? [12] : [6, 6];
    row.forEach(span => {
      const c = cards[i++];
      c.style.setProperty('--span', span);
      c.classList.toggle('is-tall', span === 5);
    });
  }
}

function renderSteps() {
  $('#steps').innerHTML = '<i class="steps-line" id="steps-line"></i>' + PROCESS.map((s, i) => `
    <li class="step">
      <span class="step-num">${String(i + 1).padStart(2, '0')}</span>
      <div><h3 class="step-name" ${bi(s.name[0], s.name[1])}</h3><p class="step-desc" ${bi(s.desc[0], s.desc[1])}</p></div>
      <span class="step-dur" ${bi(s.dur[0], s.dur[1])}</span>
    </li>`).join('');
}

function renderServices() {
  $('#svc-list').innerHTML = SERVICES.map((s, i) => `
    <div class="svc" data-slug="${s.slug}">
      <button type="button" class="svc-head" aria-expanded="false" aria-controls="svc-${i}">
        <span class="svc-name" ${bi(s.name[0], s.name[1])}</span><i class="svc-plus" aria-hidden="true"></i>
      </button>
      <div class="svc-body" id="svc-${i}"><div><div class="svc-inner">
        <p class="svc-desc" ${bi(s.desc[0], s.desc[1])}</p>
        <ul class="svc-specs">${s.specs[0].map((sp, j) => `<li ${bi(sp, s.specs[1][j])}</li>`).join('')}</ul>
      </div></div></div>
    </div>`).join('');
  $('#form-service').innerHTML = `<option value="" ${bi('Selecione um serviço', 'Select a service')}</option>` +
    SERVICES.map(s => `<option value="${esc(s.name[0])}" ${bi(s.name[0], s.name[1])}</option>`).join('');
}

/* palavras do texto do estúdio (refeito a cada troca de idioma) */
let wordsTween = null;
function splitWords() {
  const el = $('.reveal-words');
  if (!el) return;
  el.innerHTML = el.textContent.split(/\s+/).filter(Boolean).map(w => `<span class="w">${esc(w)}</span>`).join(' ');
  if (wordsTween) { wordsTween.scrollTrigger.kill(); wordsTween.kill(); wordsTween = null; }
  if (REDUCE || !window.ScrollTrigger || !document.body.classList.contains('is-ready')) return;
  wordsTween = gsap.to($$('.w', el), { opacity: 1, stagger: 0.12, ease: 'none',
    scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: true } });
}

/* ── INTRO ─────────────────────────────────────────────── */
function intro() {
  const loader = $('#loader');
  const done = () => {
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
    loader.remove();
    if (lenis) lenis.start();
  };
  const firstImg = $('.hero-slide img');
  const imgReady = new Promise(res => {
    if (!firstImg || firstImg.complete) return res();
    firstImg.addEventListener('load', res, { once: true });
    firstImg.addEventListener('error', res, { once: true });
    setTimeout(res, 4000);
  });

  if (REDUCE) return imgReady.then(done);

  const seen = sessionStorage.getItem('cv-intro');
  sessionStorage.setItem('cv-intro', '1');
  const k = seen ? 0.35 : 1;
  const count = { v: 0 };

  return new Promise(resolve => {
    const tl = gsap.timeline();
    tl.to('.loader-hex polygon', { strokeDashoffset: 0, duration: 1.5 * k, ease: 'power2.inOut' })
      .to(count, { v: 100, duration: 1.5 * k, ease: 'power2.inOut',
                   onUpdate: () => { $('#loader-count').textContent = Math.round(count.v); } }, 0)
      .to('.loader-brand', { opacity: 1, duration: 0.6 * k }, 0.3 * k)
      .to('.loader-hex polygon', { fill: 'rgba(197,160,89,1)', duration: 0.4 * k }, '-=0.2');
    imgReady.then(() => tl.then(() => {
      gsap.timeline({ onComplete: () => { done(); resolve(); } })
        .to('.loader-curtain', { scaleY: 1, duration: 0.6, ease: 'expo.inOut' })
        .set(['.loader-hex', '.loader-brand', '.loader-count'], { opacity: 0 })
        .to(loader, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' })
        .from('.hero-slide.is-active img', { scale: 1.35, duration: 1.8, ease: 'expo.out' }, '<')
        .from('.hero-title .ln > span', { yPercent: 110, duration: 1.2, stagger: 0.09, ease: 'expo.out' }, '-=1.2')
        .from(['.hero-eyebrow', '.hero-ctas', '.hero-meta', '.nav'], { opacity: 0, y: 20, duration: 0.9, stagger: 0.07, ease: 'expo.out' }, '-=0.9');
    }));
  });
}

/* ── HERO SLIDESHOW ────────────────────────────────────── */
let heroIndex = 0, heroTl = null;
const HERO_DUR = 6;
function updateHeroNow() {
  const slide = $$('.hero-slide')[heroIndex];
  const p = slide && bySlug(slide.dataset.slug);
  if (!p) return;
  $('#hero-now-title').textContent = p.title[lang];
  $('#hero-now-loc').textContent = p.location[lang];
}
function startHero() {
  const slides = $$('.hero-slide');
  const bars = $$('.hero-bar');
  if (!slides.length) return;
  updateHeroNow();
  const go = (i) => {
    const prev = slides[heroIndex];
    heroIndex = (i + slides.length) % slides.length;
    const next = slides[heroIndex];
    if (prev !== next) {
      gsap.set(next, { zIndex: 2 }); gsap.set(prev, { zIndex: 1 });
      gsap.fromTo(next, { opacity: 0 }, { opacity: 1, duration: REDUCE ? 0 : 1.4, ease: 'power2.inOut',
        onComplete: () => { prev.classList.remove('is-active'); gsap.set(prev, { opacity: 0 }); } });
      next.classList.add('is-active');
      if (!REDUCE) gsap.fromTo('#hero-now-title, #hero-now-loc', { yPercent: 60, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: 'expo.out' });
    }
    updateHeroNow();
    if (!REDUCE) gsap.fromTo($('img', next), { scale: 1.14 }, { scale: 1, duration: HERO_DUR + 1.5, ease: 'none', overwrite: true });
    bars.forEach((b, j) => b.style.setProperty('--p', j < heroIndex ? 1 : 0));
    if (heroTl) heroTl.kill();
    heroTl = gsap.fromTo(bars[heroIndex], { '--p': 0 }, { '--p': 1, duration: HERO_DUR, ease: 'none', onComplete: () => go(heroIndex + 1) });
  };
  bars.forEach(b => b.addEventListener('click', () => go(+b.dataset.i)));
  go(0);
  ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top',
    onToggle: (self) => heroTl && (self.isActive ? heroTl.resume() : heroTl.pause()) });
}

/* ── SCROLL MOTION ─────────────────────────────────────── */
function initMotion() {
  splitWords();
  if (REDUCE) { countStats(); return; }

  // hero: imagem afunda, texto sobe
  gsap.to('.hero-media', { yPercent: 16, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-inner', { y: -90, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } });

  // faixa infinita que acelera com a rolagem
  const track = $('#marquee');
  track.innerHTML += track.innerHTML;
  const loop = gsap.to(track, { xPercent: -50, duration: 32, ease: 'none', repeat: -1 });
  ScrollTrigger.create({ onUpdate: (self) => {
    const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 300);
    gsap.to(loop, { timeScale: (self.direction || 1) * (1 + Math.abs(v)), duration: 0.4, overwrite: true });
  } });

  // títulos e rótulos
  $$('.section-title, .contact-title').forEach(t => gsap.from($$('.ln > span', t), {
    yPercent: 110, duration: 1.2, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 85%' } }));
  $$('main .eyebrow:not(.hero-eyebrow)').forEach(e => gsap.from(e, {
    opacity: 0, x: -24, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: e, start: 'top 90%' } }));

  // números
  ScrollTrigger.create({ trigger: '.stats', start: 'top 85%', once: true, onEnter: countStats });
  gsap.from('.stat', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.stats', start: 'top 85%' } });

  // showreel: card cresce até tela cheia
  const video = $('#reel-frame video');
  gsap.timeline({ scrollTrigger: { trigger: '.reel', start: 'top top', end: '+=120%', pin: true, scrub: true,
      onToggle: (s) => s.isActive ? video.play().catch(() => {}) : video.pause() } })
    .to('#reel-frame', { clipPath: 'inset(0% 0% round 0px)', ease: 'none' })
    .to(video, { scale: 1, ease: 'none' }, 0);

  // vitrine horizontal fixa (desktop) / rolagem livre (mobile)
  const mm = gsap.matchMedia();
  mm.add('(min-width: 761px)', () => {
    const tr = $('#feature-track');
    const dist = () => tr.scrollWidth - innerWidth;
    const h = gsap.to(tr, { x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '#feature', start: 'center center', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true } });
    $$('.fcard').forEach(c => gsap.fromTo($('img', c), { xPercent: -7 }, { xPercent: 7, ease: 'none',
      scrollTrigger: { trigger: c, containerAnimation: h, start: 'left right', end: 'right left', scrub: true } }));
  });
  mm.add('(max-width: 760px)', () => {
    const f = $('#feature');
    f.style.overflowX = 'auto';
    f.style.scrollSnapType = 'x mandatory';
    $$('.fcard').forEach(c => { c.style.scrollSnapAlign = 'center'; gsap.set($('img', c), { scale: 1 }); });
    return () => { f.style.overflowX = ''; f.style.scrollSnapType = ''; };
  });

  // grade de projetos
  gsap.set('.card', { opacity: 0, y: 60 });
  ScrollTrigger.batch('.card', { start: 'top 90%', once: true,
    onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out' }) });

  // processo: linha desenha e passos acendem
  gsap.to('#steps-line', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#steps', start: 'top 65%', end: 'bottom 65%', scrub: true } });
  $$('.step').forEach(s => {
    ScrollTrigger.create({ trigger: s, start: 'top 65%', end: 'bottom 65%', toggleClass: 'is-on' });
    gsap.from(s.children, { y: 40, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 85%' } });
  });

  // serviços
  gsap.from('.svc', { y: 50, opacity: 0, duration: 1, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: '#svc-list', start: 'top 85%' } });

  // contato
  gsap.to('.contact-hex', { rotate: 30, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.cf-row, .cf-submit', { y: 30, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.cform', start: 'top 85%' } });
}

function countStats() {
  $$('.stat-num[data-count]').forEach(el => {
    const n = { v: 0 }, target = +el.dataset.count;
    if (REDUCE) { el.textContent = target; return; }
    gsap.to(n, { v: target, duration: 1.8, ease: 'expo.out', onUpdate: () => { el.textContent = Math.round(n.v); } });
  });
}

/* ── NAV / MENU / ÂNCORAS ──────────────────────────────── */
function goTo(hash) {
  const el = hash && hash !== '#' && document.querySelector(hash);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6 }); else el.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth' });
}
function initNav() {
  const nav = $('#nav');
  let last = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('is-solid', y > 80);
    nav.classList.toggle('is-hidden', y > last && y > 500 && !document.body.classList.contains('menu-open'));
    last = y;
  }, { passive: true });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    closeMenu();
    goTo(a.getAttribute('href'));
  });
}

let menuTl = null;
function closeMenu() { if (document.body.classList.contains('menu-open')) toggleMenu(false); }
function toggleMenu(open) {
  const menu = $('#menu'), btn = $('#burger');
  document.body.classList.toggle('menu-open', open);
  btn.setAttribute('aria-expanded', open);
  menu.setAttribute('aria-hidden', !open);
  if (lenis) open ? lenis.stop() : lenis.start();
  if (menuTl) menuTl.kill();
  menuTl = gsap.timeline();
  if (open) {
    menuTl.set(menu, { visibility: 'visible' })
      .to(menu, { clipPath: 'inset(0 0 0% 0)', duration: REDUCE ? 0 : 0.8, ease: 'expo.inOut' })
      .from('.menu-links a span', { yPercent: 110, duration: 0.9, stagger: 0.06, ease: 'expo.out' }, '-=0.35');
  } else {
    menuTl.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: REDUCE ? 0 : 0.7, ease: 'expo.inOut' }).set(menu, { visibility: 'hidden' });
  }
}
function initMenu() {
  $('#burger').addEventListener('click', () => toggleMenu(!document.body.classList.contains('menu-open')));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
}

/* ── CURSOR + PRÉVIA DOS SERVIÇOS ──────────────────────── */
function initCursor() {
  // acordeão dos serviços funciona em qualquer dispositivo
  $('#svc-list')?.addEventListener('click', (e) => {
    const head = e.target.closest('.svc-head');
    if (!head) return;
    const svc = head.parentElement, open = !svc.classList.contains('is-open');
    svc.classList.toggle('is-open', open);
    head.setAttribute('aria-expanded', open);
    setTimeout(() => ScrollTrigger.refresh(), 650);
  });
  if (!FINE) return;

  const cur = $('#cursor'), label = $('#cursor-label');
  const xTo = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
  const prev = $('#svc-preview') || document.createElement('div');
  const pxTo = gsap.quickTo(prev, 'x', { duration: 0.6, ease: 'power3' });
  const pyTo = gsap.quickTo(prev, 'y', { duration: 0.6, ease: 'power3' });
  addEventListener('pointermove', (e) => {
    cur.classList.add('is-on');
    xTo(e.clientX); yTo(e.clientY);
    pxTo(e.clientX + 30); pyTo(e.clientY - 110);
  });
  document.addEventListener('pointerover', (e) => {
    const big = e.target.closest('[data-cursor]');
    cur.classList.toggle('is-big', !!big);
    label.textContent = lang === 'en' ? 'View' : 'Ver';
    const head = e.target.closest('.svc-head');
    const p = head && bySlug(head.parentElement.dataset.slug);
    if (p) {
      if (prev.dataset.slug !== p.slug) {
        prev.dataset.slug = p.slug;
        prev.innerHTML = `<img src="${p.images[0].thumb}" alt="">`;
      }
      gsap.to(prev, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
    } else {
      gsap.to(prev, { opacity: 0, scale: 0.85, duration: 0.4, ease: 'expo.out' });
    }
  });
  document.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
}

/* ── FILTROS ───────────────────────────────────────────── */
function initFilters() {
  $('#filters')?.addEventListener('click', (e) => {
    const b = e.target.closest('.filter');
    if (!b) return;
    $$('.filter').forEach(f => f.classList.toggle('is-active', f === b));
    const f = b.dataset.filter;
    const shown = $$('.card, .proj').filter(c => {
      const on = f === 'all' || c.dataset.cat === f;
      c.classList.toggle('is-hidden', !on);
      return on;
    });
    if ($('#grid')) layoutGrid();
    if (!REDUCE) gsap.fromTo(shown, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out', overwrite: true });
    ScrollTrigger.refresh();
  });
}

/* ── GALERIA ───────────────────────────────────────────── */
let vItems = [], vIndex = 0, vProject = null, vReturn = null;
function initViewer() {
  const open = (e) => {
    const card = e.target.closest('.card, .fcard, .proj-img');
    if (!card || (e.type === 'keydown' && e.key !== 'Enter')) return;
    const slug = card.dataset.slug || card.closest('.proj').dataset.slug;
    openViewer(bySlug(slug), card, +(card.dataset.i || 0));
  };
  ['#grid', '#feature-track', '#archive'].map(s => $(s)).filter(Boolean)
    .forEach(el => { el.addEventListener('click', open); el.addEventListener('keydown', open); });
  $('#viewer-close').addEventListener('click', closeViewer);
  $('#viewer-prev').addEventListener('click', () => showItem(vIndex - 1));
  $('#viewer-next').addEventListener('click', () => showItem(vIndex + 1));
  $('#viewer-thumbs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) showItem(+b.dataset.i); });
  document.addEventListener('keydown', (e) => {
    if (!$('#viewer').classList.contains('is-open')) return;
    if (e.key === 'Escape') closeViewer();
    if (e.key === 'ArrowLeft') showItem(vIndex - 1);
    if (e.key === 'ArrowRight') showItem(vIndex + 1);
  });
  let x0 = null;
  const stage = $('#viewer-stage');
  stage.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
  stage.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) showItem(vIndex + (dx < 0 ? 1 : -1));
  });
}
function openViewer(p, from, start = 0) {
  if (!p) return;
  vProject = p; vReturn = from;
  vItems = [...p.images.map(i => ({ type: 'img', ...i })), ...p.videos.map(v => ({ type: 'video', ...v, thumb: v.poster }))];
  $('#viewer-title').textContent = p.title[lang];
  $('#viewer-loc').textContent = p.location[lang];
  $('#viewer-thumbs').innerHTML = vItems.map((it, i) =>
    `<button type="button" data-i="${i}" aria-label="${i + 1}"><img src="${it.thumb}" alt="" loading="lazy"></button>`).join('');
  const v = $('#viewer');
  v.classList.add('is-open');
  v.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-locked');
  if (lenis) lenis.stop();
  gsap.to(v, { opacity: 1, duration: REDUCE ? 0 : 0.5, ease: 'power2.out' });
  vIndex = start;
  showItem(start, true);
  $('#viewer-close').focus();
}
function closeViewer() {
  const v = $('#viewer');
  gsap.to(v, { opacity: 0, duration: REDUCE ? 0 : 0.4, ease: 'power2.in', onComplete: () => {
    v.classList.remove('is-open');
    v.setAttribute('aria-hidden', 'true');
    $('#viewer-stage').innerHTML = '';
  } });
  document.body.classList.remove('is-locked');
  if (lenis) lenis.start();
  if (vReturn) vReturn.focus({ preventScroll: true });
}
function showItem(i, first) {
  if (!vItems.length) return;
  const dir = i > vIndex ? 1 : -1;
  vIndex = (i + vItems.length) % vItems.length;
  const it = vItems[vIndex];
  const stage = $('#viewer-stage');
  const el = document.createElement(it.type === 'img' ? 'img' : 'video');
  el.src = it.src;
  if (it.type === 'img') el.alt = `${vProject.title[lang]} — ${vIndex + 1}`;
  else Object.assign(el, { poster: it.poster, controls: true, autoplay: true, muted: true, loop: true, playsInline: true });
  const old = [...stage.children];
  stage.appendChild(el);
  if (!REDUCE && !first) {
    gsap.fromTo(el, { opacity: 0, xPercent: 6 * dir }, { opacity: 1, xPercent: 0, duration: 0.7, ease: 'expo.out' });
    old.forEach(o => gsap.to(o, { opacity: 0, xPercent: -6 * dir, duration: 0.5, ease: 'expo.out', onComplete: () => o.remove() }));
  } else old.forEach(o => o.remove());
  $('#viewer-count').textContent = `${String(vIndex + 1).padStart(2, '0')} / ${String(vItems.length).padStart(2, '0')}`;
  $$('#viewer-thumbs button').forEach((b, j) => b.classList.toggle('is-active', j === vIndex));
  const t = $(`#viewer-thumbs button[data-i="${vIndex}"]`);
  if (t) t.scrollIntoView({ block: 'nearest', inline: 'center' });
  const nxt = vItems[(vIndex + 1) % vItems.length];
  if (nxt && nxt.type === 'img') new Image().src = nxt.src;
}

/* ── PAÍS DO TELEFONE ──────────────────────────────────── */
function setCountry(c) {
  country = c;
  $('#country-flag').textContent = flag(c.iso2);
  $('#country-code').textContent = `+${c.dial}`;
}
function renderCountries(q = '') {
  const s = q.trim().toLowerCase();
  const list = COUNTRIES.filter(c => !s || c.pt.toLowerCase().includes(s) || c.en.toLowerCase().includes(s) || c.dial.includes(s.replace('+', '')));
  $('#country-list').innerHTML = list.length
    ? list.map(c => `<button type="button" role="option" class="cf-opt${c === country ? ' is-active' : ''}" data-iso="${c.iso2}">
        <span>${flag(c.iso2)}</span><span>${c[lang]}</span><span>+${c.dial}</span></button>`).join('')
    : `<div class="cf-empty">${lang === 'en' ? 'No country found' : 'Nenhum país encontrado'}</div>`;
}
function initCountry() {
  const wrap = $('#country-select'), trig = $('#country-trigger'), search = $('#country-search');
  const close = () => { wrap.classList.remove('open'); trig.setAttribute('aria-expanded', 'false'); };
  trig.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = wrap.classList.toggle('open');
    trig.setAttribute('aria-expanded', open);
    if (open) { search.value = ''; renderCountries(); setTimeout(() => search.focus(), 0); }
  });
  search.addEventListener('input', () => renderCountries(search.value));
  $('#country-list').addEventListener('click', (e) => {
    const b = e.target.closest('.cf-opt');
    if (!b) return;
    setCountry(COUNTRIES.find(c => c.iso2 === b.dataset.iso));
    close();
    $('#form-phone').focus();
  });
  $('#country-dropdown').addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  setCountry(country);
}

/* ── FORMULÁRIO ────────────────────────────────────────── */
function initForm() {
  const form = $('#cform');
  form.addEventListener('input', (e) => e.target.classList.remove('is-invalid'));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const en = lang === 'en';
    const val = (id) => $(id).value.trim();
    const company = val('#form-name'), email = val('#form-email'), phoneLocal = val('#form-phone');
    const bad = [[!company, '#form-name'], [!/^\S+@\S+\.\S+$/.test(email), '#form-email'], [phoneLocal.replace(/\D/g, '').length < 6, '#form-phone']]
      .filter(([b]) => b).map(([, id]) => id);
    bad.forEach(id => $(id).classList.add('is-invalid'));
    if (bad.length) {
      $(bad[0]).focus();
      alert(en ? 'Please fill in company name, a valid e-mail and phone.' : 'Preencha nome da empresa, um e-mail válido e o telefone.');
      return;
    }

    const btn = $('#form-submit'), label = $('span', btn), original = label.textContent;
    btn.disabled = true;
    label.textContent = en ? 'Sending…' : 'Enviando…';

    const svc = $('#form-service');
    const payload = {
      'Nome da Empresa / Company Name': company,
      'E-mail': email,
      'Telefone / Phone': `+${country.dial} ${phoneLocal}`,
      'Serviço / Service': svc.value ? svc.value : 'Nenhum / None',
      'Tipo de projeto / Project Type': val('#form-type') || 'Não informado / Not specified',
      'Mensagem / Message': val('#form-msg') || 'Sem mensagem / No message',
    };

    // Lead também vai para o CarmoViz OS (funil "Novo Lead"); falha aqui não afeta o envio principal.
    fetch('https://app.carmoviz.com/api/leads/c1a6481d76403a7a04f1d7db352bb0c7f7a87863b5dcecd7', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true,
    }).catch(() => {});

    try {
      const r = await fetch('https://formsubmit.co/ajax/contato@carmoviz.com', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error('Server error');
      alert(en ? 'Thank you! Your request was sent. We will get in touch soon.' : 'Obrigado! Sua solicitação foi enviada. Entraremos em contato em breve.');
      form.reset();
      setCountry(COUNTRIES[0]);
    } catch {
      alert(en ? 'Something went wrong. Please try again or write to contato@carmoviz.com.'
               : 'Ocorreu um erro ao enviar. Tente novamente ou escreva para contato@carmoviz.com.');
    } finally {
      btn.disabled = false;
      label.textContent = original;
    }
  });
}
