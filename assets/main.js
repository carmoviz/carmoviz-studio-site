/* ============================================================
   CARMOVIZ STUDIO — Main JS
   ============================================================ */

let currentLang = 'pt';
let selectedCountry = null;
let projects = [];

/* Bandeira (emoji) a partir do código ISO 3166-1 alpha-2 */
function flagEmoji(iso2) {
  return String.fromCodePoint(...[...iso2.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
}

const COUNTRIES = [
  { iso2: 'BR', dial: '55',  pt: 'Brasil',                en: 'Brazil' },
  { iso2: 'US', dial: '1',   pt: 'Estados Unidos',        en: 'United States' },
  { iso2: 'PT', dial: '351', pt: 'Portugal',              en: 'Portugal' },
  { iso2: 'AR', dial: '54',  pt: 'Argentina',             en: 'Argentina' },
  { iso2: 'UY', dial: '598', pt: 'Uruguai',               en: 'Uruguay' },
  { iso2: 'PY', dial: '595', pt: 'Paraguai',              en: 'Paraguay' },
  { iso2: 'CL', dial: '56',  pt: 'Chile',                 en: 'Chile' },
  { iso2: 'BO', dial: '591', pt: 'Bolívia',               en: 'Bolivia' },
  { iso2: 'PE', dial: '51',  pt: 'Peru',                  en: 'Peru' },
  { iso2: 'CO', dial: '57',  pt: 'Colômbia',              en: 'Colombia' },
  { iso2: 'VE', dial: '58',  pt: 'Venezuela',             en: 'Venezuela' },
  { iso2: 'EC', dial: '593', pt: 'Equador',               en: 'Ecuador' },
  { iso2: 'MX', dial: '52',  pt: 'México',                en: 'Mexico' },
  { iso2: 'CA', dial: '1',   pt: 'Canadá',                en: 'Canada' },
  { iso2: 'GB', dial: '44',  pt: 'Reino Unido',           en: 'United Kingdom' },
  { iso2: 'IE', dial: '353', pt: 'Irlanda',               en: 'Ireland' },
  { iso2: 'FR', dial: '33',  pt: 'França',                en: 'France' },
  { iso2: 'ES', dial: '34',  pt: 'Espanha',               en: 'Spain' },
  { iso2: 'DE', dial: '49',  pt: 'Alemanha',              en: 'Germany' },
  { iso2: 'IT', dial: '39',  pt: 'Itália',                en: 'Italy' },
  { iso2: 'NL', dial: '31',  pt: 'Países Baixos',         en: 'Netherlands' },
  { iso2: 'BE', dial: '32',  pt: 'Bélgica',               en: 'Belgium' },
  { iso2: 'LU', dial: '352', pt: 'Luxemburgo',            en: 'Luxembourg' },
  { iso2: 'CH', dial: '41',  pt: 'Suíça',                 en: 'Switzerland' },
  { iso2: 'AT', dial: '43',  pt: 'Áustria',               en: 'Austria' },
  { iso2: 'PL', dial: '48',  pt: 'Polônia',               en: 'Poland' },
  { iso2: 'CZ', dial: '420', pt: 'República Tcheca',      en: 'Czech Republic' },
  { iso2: 'SE', dial: '46',  pt: 'Suécia',                en: 'Sweden' },
  { iso2: 'NO', dial: '47',  pt: 'Noruega',               en: 'Norway' },
  { iso2: 'DK', dial: '45',  pt: 'Dinamarca',             en: 'Denmark' },
  { iso2: 'FI', dial: '358', pt: 'Finlândia',             en: 'Finland' },
  { iso2: 'IS', dial: '354', pt: 'Islândia',              en: 'Iceland' },
  { iso2: 'GR', dial: '30',  pt: 'Grécia',                en: 'Greece' },
  { iso2: 'TR', dial: '90',  pt: 'Turquia',               en: 'Turkey' },
  { iso2: 'RU', dial: '7',   pt: 'Rússia',                en: 'Russia' },
  { iso2: 'UA', dial: '380', pt: 'Ucrânia',               en: 'Ukraine' },
  { iso2: 'RO', dial: '40',  pt: 'Romênia',               en: 'Romania' },
  { iso2: 'HU', dial: '36',  pt: 'Hungria',               en: 'Hungary' },
  { iso2: 'HR', dial: '385', pt: 'Croácia',               en: 'Croatia' },
  { iso2: 'RS', dial: '381', pt: 'Sérvia',                en: 'Serbia' },
  { iso2: 'AE', dial: '971', pt: 'Emirados Árabes Unidos', en: 'United Arab Emirates' },
  { iso2: 'SA', dial: '966', pt: 'Arábia Saudita',        en: 'Saudi Arabia' },
  { iso2: 'QA', dial: '974', pt: 'Catar',                 en: 'Qatar' },
  { iso2: 'KW', dial: '965', pt: 'Kuwait',                en: 'Kuwait' },
  { iso2: 'IL', dial: '972', pt: 'Israel',                en: 'Israel' },
  { iso2: 'EG', dial: '20',  pt: 'Egito',                 en: 'Egypt' },
  { iso2: 'ZA', dial: '27',  pt: 'África do Sul',         en: 'South Africa' },
  { iso2: 'NG', dial: '234', pt: 'Nigéria',               en: 'Nigeria' },
  { iso2: 'KE', dial: '254', pt: 'Quênia',                en: 'Kenya' },
  { iso2: 'MA', dial: '212', pt: 'Marrocos',              en: 'Morocco' },
  { iso2: 'AO', dial: '244', pt: 'Angola',                en: 'Angola' },
  { iso2: 'MZ', dial: '258', pt: 'Moçambique',            en: 'Mozambique' },
  { iso2: 'CV', dial: '238', pt: 'Cabo Verde',            en: 'Cape Verde' },
  { iso2: 'IN', dial: '91',  pt: 'Índia',                 en: 'India' },
  { iso2: 'CN', dial: '86',  pt: 'China',                 en: 'China' },
  { iso2: 'JP', dial: '81',  pt: 'Japão',                 en: 'Japan' },
  { iso2: 'KR', dial: '82',  pt: 'Coreia do Sul',         en: 'South Korea' },
  { iso2: 'SG', dial: '65',  pt: 'Cingapura',             en: 'Singapore' },
  { iso2: 'HK', dial: '852', pt: 'Hong Kong',             en: 'Hong Kong' },
  { iso2: 'TW', dial: '886', pt: 'Taiwan',                en: 'Taiwan' },
  { iso2: 'TH', dial: '66',  pt: 'Tailândia',             en: 'Thailand' },
  { iso2: 'VN', dial: '84',  pt: 'Vietnã',                en: 'Vietnam' },
  { iso2: 'MY', dial: '60',  pt: 'Malásia',               en: 'Malaysia' },
  { iso2: 'ID', dial: '62',  pt: 'Indonésia',             en: 'Indonesia' },
  { iso2: 'PH', dial: '63',  pt: 'Filipinas',             en: 'Philippines' },
  { iso2: 'PK', dial: '92',  pt: 'Paquistão',             en: 'Pakistan' },
  { iso2: 'AU', dial: '61',  pt: 'Austrália',             en: 'Australia' },
  { iso2: 'NZ', dial: '64',  pt: 'Nova Zelândia',         en: 'New Zealand' },
];
let modalProject = null;
let modalProjectIndex = 0;
let modalIndex = 0;
let modalItems = [];

/* Tema fixo escuro (o seletor de tema foi removido) */
document.documentElement.setAttribute('data-theme', 'dark');

/* ── I18N ────────────────────────────────────────────────── */

const i18n = {
  nav_portfolio:  { pt: 'Projetos',    en: 'Projects'   },
  nav_process:    { pt: 'Processo',    en: 'Process'    },
  nav_services:   { pt: 'Serviços',    en: 'Services'   },
  nav_about:      { pt: 'Sobre',       en: 'About'      },
  nav_contact:    { pt: 'Contato',     en: 'Contact'    },

  hero_tagline:   {
    pt: 'Visualização do amanhã,\nentregue hoje.',
    en: 'Tomorrow\'s visualization,\ndelivered today.'
  },
  hero_sub:       { pt: 'Archviz Premium · Renders Fotorrealistas · Brasil & Internacional', en: 'Premium Archviz · Photorealistic Renders · Brazil & International' },
  hero_cta1:      { pt: 'Ver Projetos',    en: 'View Projects'  },
  hero_cta2:      { pt: 'Fale Conosco',    en: 'Get in Touch'   },

  filter_all:     { pt: 'Todos',       en: 'All'        },
  filter_ext:     { pt: 'Exterior',    en: 'Exterior'   },
  filter_int:     { pt: 'Interior',    en: 'Interior'   },
  filter_anim:    { pt: 'Animação',    en: 'Animation'  },

  section_portfolio: { pt: 'Projetos',    en: 'Projects'   },
  section_process:   { pt: 'Processo',     en: 'Process'    },
  section_services:  { pt: 'Serviços',     en: 'Services'   },
  section_about:     { pt: 'Sobre',        en: 'About'      },
  section_contact:   { pt: 'Contato',      en: 'Contact'    },

  process_sub: {
    pt: 'Da concepção à entrega — cada fase executada com precisão.',
    en: 'From concept to delivery — every phase executed with precision.'
  },
  about_sub: {
    pt: 'Estúdio de Visualização Arquitetônica',
    en: 'Architectural Visualization Studio'
  },
  services_sub: {
    pt: 'Soluções visuais que elevam o valor percebido do seu projeto.',
    en: 'Visual solutions that elevate the perceived value of your project.'
  },
  contact_sub: {
    pt: 'Inicie seu projeto. Resposta em até 24h.',
    en: 'Start your project. Response within 24h.'
  },

  about_lead: {
    pt: 'Transformamos projetos em imagens que vendem antes mesmo da construção.',
    en: 'We transform projects into images that sell before construction even begins.'
  },
  about_body: {
    pt: [
      'A CarmoViz Studio cria visualizações fotorrealistas de alto padrão para arquitetos e incorporadoras. Com precisão técnica e impacto visual, entregamos projetos que comunicam sua essência com naturalidade e realismo.'
    ],
    en: [
      'CarmoViz Studio creates high-end photorealistic architectural visualizations for architects and developers. With technical precision and visual impact, we deliver projects that communicate their essence with natural feel and realism.'
    ]
  },
  about_cta: {
    pt: 'Conheça nosso processo',
    en: 'Explore our process'
  },

  form_name:    { pt: 'Nome',                         en: 'Name'              },
  form_email:   { pt: 'E-mail',                       en: 'E-mail'            },
  form_type:    { pt: 'Tipo de Projeto',              en: 'Project Type'      },
  form_msg:     { pt: 'Mensagem',                     en: 'Message'           },
  form_send:    { pt: 'Enviar Mensagem',              en: 'Send Message'      },
  form_ph_name: { pt: 'Seu nome',                     en: 'Your name'         },
  form_ph_email:{ pt: 'seu@email.com',                en: 'your@email.com'    },
  form_ph_msg:  { pt: 'Descreva seu projeto...',      en: 'Describe your project...' },
  opt_ext:      { pt: 'Render Exterior',              en: 'Exterior Render'   },
  opt_int:      { pt: 'Render Interior',              en: 'Interior Render'   },
  opt_anim:     { pt: 'Animação Arquitetônica',       en: 'Architectural Animation' },
  opt_tour:     { pt: 'Tour Virtual 360°',            en: 'Virtual Tour 360°' },
  opt_other:    { pt: 'Outro',                        en: 'Other'             },

  contact_email_label:   { pt: 'E-mail',       en: 'E-mail'     },
  contact_phone_label:   { pt: 'Telefone',     en: 'Phone'      },
  contact_addr_label:    { pt: 'Endereço',     en: 'Address'    },
  contact_social_label:  { pt: 'Redes Sociais', en: 'Social'    },

  footer_copy: {
    pt: '© 2026 CarmoViz Studio. Todos os direitos reservados.',
    en: '© 2026 CarmoViz Studio. All rights reserved.'
  },
  btt_label: { pt: 'INÍCIO', en: 'TOP' },
  footer_trust:    { pt: 'Centro Jurídico e de Confiança', en: 'Trust & Legal Center' },
  footer_terms:    { pt: 'Termos de Uso',                  en: 'Terms of Use'          },
  footer_privacy:  { pt: 'Política de Privacidade',        en: 'Privacy Policy'        },
  footer_cookies:  { pt: 'Política de Cookies',            en: 'Cookie Policy'         },
  footer_ip:       { pt: 'Propriedade intelectual',        en: 'Intellectual Property' },
  footer_conf:     { pt: 'Confidencialidade do cliente',    en: 'Client Confidentiality'},
  footer_access:   { pt: 'Acessibilidade',                en: 'Accessibility'         },
  footer_security: { pt: 'Segurança',                     en: 'Security'              },
  footer_contact:  { pt: 'Contato',                       en: 'Contact'               },

  process_steps: {
    pt: [
      { num:'01', name:'Briefing & Intake',       desc:'Coleta completa de arquivos, referências e objetivos. O prazo de produção só começa com todos os materiais em mãos.',      dur:'1–3 dias' },
      { num:'02', name:'Modelagem 3D',             desc:'Construção da geometria fiel ao projeto em 3ds Max. Do estrutural às esquadrias, tudo modelado com precisão milimétrica.', dur:'3–7 dias' },
      { num:'03', name:'Aprovação de Ângulos',     desc:'Prévias em "massagem branca" (clay render) para validação da composição antes de qualquer material ou iluminação.',       dur:'1–2 dias' },
      { num:'04', name:'Setup de Cena',            desc:'Aplicação de materiais PBR, configuração de iluminação cinematográfica (Corona Sun/Sky/HDRI) e posicionamento final.',    dur:'2–4 dias' },
      { num:'05', name:'Renderização',             desc:'Processamento final em alta qualidade com Corona Renderer. Output em 4K EXR 32bit com render elements para pós-produção.',dur:'por ângulo' },
      { num:'06', name:'Pós-Produção & AI',        desc:'Color grading cinematográfico, composição de elementos 2D e AI Enhancement — onde o render vira obra de arte.',           dur:'2–6h/img' }
    ],
    en: [
      { num:'01', name:'Briefing & Intake',        desc:'Complete collection of files, references and objectives. Production timeline only begins with all materials in hand.',      dur:'1–3 days' },
      { num:'02', name:'3D Modeling',              desc:'Building geometry faithful to the project in 3ds Max. From structure to window frames, all modeled with millimetric precision.', dur:'3–7 days' },
      { num:'03', name:'Angle Approval',           desc:'Clay render previews for composition validation before any materials or lighting are applied.',                             dur:'1–2 days' },
      { num:'04', name:'Scene Setup',              desc:'PBR material application, cinematic lighting configuration (Corona Sun/Sky/HDRI) and final positioning.',                  dur:'2–4 days' },
      { num:'05', name:'Rendering',                desc:'Final high-quality processing with Corona Renderer. 4K EXR 32-bit output with render elements for post-production.',       dur:'per angle' },
      { num:'06', name:'Post-Production & AI',     desc:'Cinematic color grading, 2D element compositing and AI Enhancement — where the render becomes a work of art.',            dur:'2–6h/img' }
    ]
  },

  services_data: {
    pt: [
      {
        name: 'Renders Estáticos',
        desc: 'Imagens fotorrealistas 4K de exteriores e interiores. Principal produto da CarmoViz — atmosferas diurnas, Golden Hour, Blue Hour e Night Shot.',
        specs: ['Resolução 4K (3840×2160px)', 'Entrega em TIFF 16bit + JPEG', 'Múltiplas atmosferas disponíveis', 'AI Enhancement incluso'],
      },
      {
        name: 'Animação Arquitetônica',
        desc: 'Vídeos cinematográficos em Full HD ou 4K — walkthroughs, fly-throughs e vídeos imobiliários completos com trilha sonora e motion graphics.',
        specs: ['Full HD a 4K, 25–30fps', 'Walkthrough · Fly-over · Fly-through', 'Trilha sonora royalty-free inclusa', 'Entrega em MP4 H.264/H.265'],
      },
      {
        name: 'Tour Virtual 360°',
        desc: 'Experiência imersiva e interativa acessível via link em qualquer dispositivo. Hotspots de navegação, identidade visual customizada e compatibilidade com VR.',
        specs: ['Renders 360° em 8K', 'Navegação por hotspots', 'Compatível desktop, mobile e VR', 'Hospedagem inclusa por 12 meses'],
      },
      {
        name: 'Modelagem 3D',
        desc: 'Modelagem tridimensional fiel ao projeto em 3ds Max — do estrutural às esquadrias, com precisão milimétrica, pronta para render ou impressão 3D.',
        specs: ['Modelagem em 3ds Max', 'Fidelidade milimétrica ao projeto', 'Otimizada para render/BIM', 'Entrega em FBX · OBJ · MAX'],
      },
      {
        name: 'Landing Page Imobiliária',
        desc: 'Página de vendas do empreendimento com os renders integrados, captação de leads e desempenho otimizado — pronta para campanhas de tráfego pago.',
        specs: ['Design responsivo (mobile-first)', 'Captação de leads integrada', 'Galeria de renders e tour 360°', 'Otimizada para Google/Meta Ads'],
      },
      {
        name: 'Projeto Arquitetônico',
        desc: 'Concepção e desenvolvimento do projeto arquitetônico — plantas, estudo volumétrico e detalhamento — em parceria para tirar a ideia do papel.',
        specs: ['Estudo preliminar e volumetria', 'Plantas e cortes técnicos', 'Compatível com aprovação legal', 'Integração direta com o render'],
      }
    ],
    en: [
      {
        name: 'Static Renders',
        desc: 'Photorealistic 4K images of exteriors and interiors. CarmoViz\'s flagship product — daytime, Golden Hour, Blue Hour and Night Shot atmospheres.',
        specs: ['4K Resolution (3840×2160px)', 'Delivery in 16-bit TIFF + JPEG', 'Multiple atmospheres available', 'AI Enhancement included'],
      },
      {
        name: 'Architectural Animation',
        desc: 'Cinematic videos in Full HD or 4K — walkthroughs, fly-throughs and complete real estate videos with soundtrack and motion graphics.',
        specs: ['Full HD to 4K, 25–30fps', 'Walkthrough · Fly-over · Fly-through', 'Royalty-free soundtrack included', 'Delivery in MP4 H.264/H.265'],
      },
      {
        name: 'Virtual Tour 360°',
        desc: 'Immersive interactive experience accessible via link on any device. Navigation hotspots, custom visual identity and VR compatibility.',
        specs: ['360° Renders in 8K', 'Hotspot navigation', 'Compatible desktop, mobile & VR', 'Hosting included for 12 months'],
      },
      {
        name: '3D Modeling',
        desc: 'Three-dimensional modeling faithful to the project in 3ds Max — from structure to window frames, with millimetric precision, ready for rendering or 3D printing.',
        specs: ['Modeling in 3ds Max', 'Millimetric fidelity to the project', 'Optimized for render/BIM', 'Delivery in FBX · OBJ · MAX'],
      },
      {
        name: 'Real Estate Landing Page',
        desc: 'Development sales page with integrated renders, lead capture and optimized performance — ready for paid traffic campaigns.',
        specs: ['Responsive design (mobile-first)', 'Integrated lead capture', 'Render gallery and 360° tour', 'Optimized for Google/Meta Ads'],
      },
      {
        name: 'Architectural Design',
        desc: 'Conception and development of the architectural project — floor plans, volumetric study and detailing — partnering to bring the idea to life.',
        specs: ['Preliminary study and massing', 'Technical plans and sections', 'Ready for legal approval', 'Direct integration with the render'],
      }
    ]
  }
};

function t(key) {
  return i18n[key] ? (i18n[key][currentLang] || i18n[key]['pt']) : key;
}

/* ── INIT ────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', async () => {
  // Forçar retorno ao topo ao recarregar a página
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  window.addEventListener('load', () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  });

  // Tema salvo (garante atributo + botão)
  initThemeToggle();

  // Cursor personalizado — ativo já na tela de entrada
  initCustomCursor();

  // Portal interativo de entrada + gráfico archviz do hero
  initEntryScreen();
  initHeroArchviz();
  initAmbientField();

  try {
    const res = await fetch('projects.json');
    projects = (await res.json()).projects;
  } catch(e) {
    projects = [];
  }

  buildNav();
  buildHero();
  buildPortfolio();
  buildProcess();
  buildServices();
  buildAbout();
  buildContact();
  buildFooter();
  initNav();
  initReveal();
  initContactGraphic();
  initMobileMenu();
  initCustomSelect();
  initServiceSelect();
  initCountrySelect();
  initContactForm();
});

/* ── NAVEGAÇÃO ───────────────────────────────────────────── */

function buildNav() {
  document.getElementById('nav-portfolio').textContent = t('nav_portfolio');
  document.getElementById('nav-process').textContent   = t('nav_process');
  document.getElementById('nav-services').textContent  = t('nav_services');
  document.getElementById('nav-about').textContent     = t('nav_about');
  document.getElementById('nav-contact').textContent   = t('nav_contact');
  document.getElementById('mob-portfolio').textContent = t('nav_portfolio');
  document.getElementById('mob-process').textContent   = t('nav_process');
  document.getElementById('mob-services').textContent  = t('nav_services');
  document.getElementById('mob-about').textContent     = t('nav_about');
  document.getElementById('mob-contact').textContent   = t('nav_contact');
}

function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  document.getElementById('lang-pt').addEventListener('click', () => setLang('pt'));
  document.getElementById('lang-en').addEventListener('click', () => setLang('en'));
}

function setLang(lang) {
  currentLang = lang;
  document.getElementById('lang-pt').classList.toggle('active', lang === 'pt');
  document.getElementById('lang-en').classList.toggle('active', lang === 'en');
  rebuildAll();
}

function rebuildAll() {
  buildNav();
  buildHero();
  buildPortfolio();
  buildProcess();
  buildServices();
  buildAbout();
  buildContact();
  buildFooter();
}

/* ── MOBILE MENU ─────────────────────────────────────────── */

function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  btn.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
}

/* ── HERO ────────────────────────────────────────────────── */

function buildHero() {
  const taglineEl = document.getElementById('hero-tagline');
  const lines = t('hero_tagline').split('\n');
  taglineEl.innerHTML = lines.map(l => `<span>${l}</span>`).join('<br>');
  document.getElementById('hero-sub').textContent  = t('hero_sub');
  document.getElementById('hero-cta1').textContent = t('hero_cta1');
  document.getElementById('hero-cta2').textContent = t('hero_cta2');
}

/* ── PORTFÓLIO ───────────────────────────────────────────── */

const PORTFOLIO_LIMIT = 10;
let portfolioAllRevealed = false;

function buildPortfolio() {
  const wrap     = document.getElementById('portfolio-wrap');
  const moreWrap = document.getElementById('portfolio-more-wrap');

  const pfTitle = document.getElementById('section-portfolio-title');
  if (pfTitle) pfTitle.textContent = t('section_portfolio');
  document.getElementById('filter-all').textContent  = t('filter_all');
  document.getElementById('filter-ext').textContent  = t('filter_ext');
  document.getElementById('filter-int').textContent  = t('filter_int');
  document.getElementById('filter-anim').textContent = t('filter_anim');

  if (!projects.length) { wrap.innerHTML = ''; return; }

  portfolioAllRevealed = false;

  // Card de vídeo em looping — abre a grade e entra com a animação de escala
  const videoCard = `
    <div class="portfolio-card portfolio-video reveal" data-cat="animation" aria-label="Showreel CarmoViz">
      <video src="assets/hero-bg.mp4" autoplay muted loop playsinline preload="auto"></video>
      <span class="pf-video-badge">${currentLang === 'en' ? 'Showreel' : 'Showreel'}</span>
    </div>`;

  wrap.innerHTML = videoCard + projects.map((p, i) => {
    const extra = i >= PORTFOLIO_LIMIT ? ' extra-card' : '';
    return `
    <div class="portfolio-card reveal${extra}" data-cat="${p.category}" data-id="${p.id}">
      <img src="${p.cover}" alt="" loading="lazy">
    </div>`;
  }).join('');

  wrap.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id));
  });

  if (moreWrap) {
    moreWrap.style.display = projects.length > PORTFOLIO_LIMIT ? '' : 'none';
  }

  initReveal();
  initFilters();
  initVerMais();
}

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      document.querySelectorAll('.portfolio-card').forEach(card => {
        if (card.classList.contains('extra-card')) return;
        card.classList.toggle('hidden', cat !== 'all' && card.dataset.cat !== cat);
      });
    });
  });
}

function initVerMais() {
  const btn      = document.getElementById('btn-ver-mais');
  const moreWrap = document.getElementById('portfolio-more-wrap');
  if (!btn) return;

  btn.replaceWith(btn.cloneNode(true));
  const freshBtn = document.getElementById('btn-ver-mais');

  freshBtn.addEventListener('click', () => {
    portfolioAllRevealed = true;
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    document.querySelectorAll('.portfolio-card.extra-card').forEach(card => {
      card.classList.remove('extra-card');
      if (activeFilter !== 'all' && card.dataset.cat !== activeFilter) {
        card.classList.add('hidden');
      }
    });
    if (moreWrap) moreWrap.style.display = 'none';
    initReveal();
  });
}

/* ── MODAL ───────────────────────────────────────────────── */

function openModal(id) {
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return;
  modalProjectIndex = idx;
  _loadModalContent();
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function _loadModalContent() {
  const p = projects[modalProjectIndex];
  modalProject = p;
  modalItems = [...p.images, ...(p.videos || [])];
  modalIndex = 0;

  const title = p[`title_${currentLang}`] || p.title_pt;
  const loc   = p[`location_${currentLang}`] || p.location_pt;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-loc').textContent   = loc;

  renderModalItem();
  renderModalDots();
}

function renderModalItem() {
  const src  = modalItems[modalIndex];
  const wrap = document.getElementById('modal-media');
  const isVideo = src && src.endsWith('.mp4');

  wrap.innerHTML = isVideo
    ? `<video src="${src}" controls autoplay muted style="max-width:100%;max-height:100%;"></video>`
    : `<img src="${src}" alt="">`;
}

function renderModalDots() {
  const footer = document.getElementById('modal-dots');
  footer.innerHTML = `<span class="modal-counter">${modalProjectIndex + 1} <span style="opacity:0.35">/ ${projects.length}</span></span>`;
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
  const v = document.querySelector('#modal-media video');
  if (v) v.pause();
}

function modalNext() {
  if (modalItems.length > 1) {
    modalIndex = (modalIndex + 1) % modalItems.length;
    renderModalItem();
  } else {
    modalProjectIndex = (modalProjectIndex + 1) % projects.length;
    _loadModalContent();
  }
}

function modalPrev() {
  if (modalItems.length > 1) {
    modalIndex = (modalIndex - 1 + modalItems.length) % modalItems.length;
    renderModalItem();
  } else {
    modalProjectIndex = (modalProjectIndex - 1 + projects.length) % projects.length;
    _loadModalContent();
  }
}

/* ── PROCESSO ────────────────────────────────────────────── */

function buildProcess() {
  document.getElementById('section-process-title').textContent = t('section_process');
  document.getElementById('section-process-sub').textContent   = t('process_sub');
  const hint = document.getElementById('process-hint');
  if (hint) hint.textContent = currentLang === 'en' ? 'keep scrolling' : 'continue rolando';

  const steps = t('process_steps');
  const track = document.getElementById('process-track');
  track.innerHTML = steps.map(s => `
    <article class="process-card">
      <div class="process-num">${s.num}<span class="process-num-dot"></span></div>
      <h3 class="process-name">${s.name}</h3>
      <p class="process-desc">${s.desc}</p>
      <div class="process-duration">${s.dur}</div>
    </article>`).join('');

  initProcessPin();
}

/* Processo preso: a rolagem VERTICAL da página controla o scroll HORIZONTAL */
function initProcessPin() {
  const section  = document.getElementById('process');
  const scroller = document.getElementById('process-scroller');
  const bar      = document.getElementById('process-progress-bar');
  if (!section || !scroller) return;

  function sync() {
    const rect  = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    let prog = total > 0 ? (-rect.top) / total : 0;
    prog = Math.max(0, Math.min(1, prog));
    const maxX = scroller.scrollWidth - scroller.clientWidth;
    scroller.scrollLeft = prog * maxX;
    if (bar) bar.style.transform = `scaleX(${Math.max(0.06, prog)})`;
  }

  if (!section._pinBound) {
    section._pinBound = true;
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
  }
  requestAnimationFrame(sync);
}



/* Gráfico interativo do Contato: malha hexagonal 3D que reage ao mouse */
function initContactGraphic() {
  const canvas = document.getElementById('contact-graphic');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0, H = 0, dpr = 1, mx = 0.5, my = 0.5, ry = 0, rx = 0.18;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sec = document.getElementById('contact');
    W = window.innerWidth;
    H = sec ? sec.clientHeight : window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);
  if (!reduce) window.addEventListener('mousemove', (e) => {
    const sec = document.getElementById('contact'); if (!sec) return;
    const r = sec.getBoundingClientRect();
    if (e.clientY > r.top && e.clientY < r.bottom) { mx = e.clientX / window.innerWidth; my = (e.clientY - r.top) / r.height; }
  });

  const ring = (rad, z, off) => Array.from({ length: 6 }, (_, i) => {
    const a = off + i * Math.PI / 3;
    return [Math.cos(a) * rad, Math.sin(a) * rad, z];
  });
  const outer = ring(1.0, 0, 0), inner = ring(0.55, 0.45, Math.PI / 6), back = ring(0.78, -0.5, Math.PI / 12);
  const verts = [...outer, ...inner, ...back, [0, 0, 0]];
  const O = 0, I = 6, B = 12, C = 18, edges = [];
  for (let i = 0; i < 6; i++) {
    edges.push([O + i, O + (i + 1) % 6]);
    edges.push([I + i, I + (i + 1) % 6]);
    edges.push([B + i, B + (i + 1) % 6]);
    edges.push([O + i, I + i]);
    edges.push([O + i, I + (i + 1) % 6]);
    edges.push([I + i, C]);
    edges.push([O + i, B + i]);
  }

  const F = 3.2, camDist = 4.2;
  function proj(v, cY, sY, cX, sX, cx, cy, scale) {
    const X = v[0]*cY - v[2]*sY;
    const Z = v[0]*sY + v[2]*cY;
    const Y2 = v[1]*cX - Z*sX;
    const Z2 = v[1]*sX + Z*cX;
    const zc = Z2 + camDist;
    const f = F / zc * scale;
    return [cx + X*f, cy + Y2*f];
  }
  function render(t) {
    const cY = Math.cos(ry), sY = Math.sin(ry), cX = Math.cos(rx), sX = Math.sin(rx);
    const cx = W * 0.5, cy = H * 0.5, scale = Math.min(W, H) * 0.62;
    ctx.clearRect(0, 0, W, H);
    const P = verts.map(v => proj(v, cY, sY, cX, sX, cx, cy, scale));
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(197,160,89,0.22)';
    for (const [a, b] of edges) { ctx.beginPath(); ctx.moveTo(P[a][0], P[a][1]); ctx.lineTo(P[b][0], P[b][1]); ctx.stroke(); }
    for (const p of P) { ctx.beginPath(); ctx.arc(p[0], p[1], 1.6, 0, Math.PI*2); ctx.fillStyle = 'rgba(197,160,89,0.5)'; ctx.fill(); }
  }
  function frame(t) {
    const tRy = (mx - 0.5) * 1.1 + t * 0.00004;
    const tRx = 0.15 + (my - 0.5) * 0.5;
    ry += (tRy - ry) * 0.05;
    rx += (tRx - rx) * 0.05;
    render(t);
    requestAnimationFrame(frame);
  }
  if (reduce) render(0); else requestAnimationFrame(frame);
}

/* ── SERVIÇOS ────────────────────────────────────────────── */

function buildServices() {
  document.getElementById('section-services-title').textContent = t('section_services');
  document.getElementById('section-services-sub').textContent   = t('services_sub');
  const data = t('services_data');
  const icons = [
    `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" class="service-icon"><rect x="4" y="12" width="56" height="36" rx="2"/><circle cx="32" cy="30" r="10"/><circle cx="32" cy="30" r="4"/><line x1="32" y1="12" x2="32" y2="20"/><line x1="32" y1="40" x2="32" y2="48"/><line x1="4" y1="30" x2="14" y2="30"/><line x1="50" y1="30" x2="60" y2="30"/></svg>`,
    `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" class="service-icon"><rect x="4" y="8" width="56" height="36" rx="2"/><polygon points="24,20 44,26 24,32" fill="currentColor" opacity="0.6"/><line x1="16" y1="52" x2="48" y2="52"/><line x1="24" y1="44" x2="24" y2="52"/><line x1="40" y1="44" x2="40" y2="52"/></svg>`,
    `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" class="service-icon"><circle cx="32" cy="32" r="24"/><ellipse cx="32" cy="32" rx="10" ry="24"/><line x1="8" y1="32" x2="56" y2="32"/><line x1="10" y1="20" x2="54" y2="20"/><line x1="10" y1="44" x2="54" y2="44"/></svg>`,
    /* Modelagem 3D — cubo/wireframe */
    `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" class="service-icon"><polygon points="32,6 56,20 56,44 32,58 8,44 8,20"/><line x1="32" y1="6" x2="32" y2="32"/><line x1="8" y1="20" x2="32" y2="32"/><line x1="56" y1="20" x2="32" y2="32"/><line x1="32" y1="32" x2="32" y2="58"/></svg>`,
    /* Landing Page — navegador */
    `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" class="service-icon"><rect x="6" y="10" width="52" height="44" rx="3"/><line x1="6" y1="22" x2="58" y2="22"/><circle cx="12" cy="16" r="1.4" fill="currentColor" stroke="none"/><circle cx="18" cy="16" r="1.4" fill="currentColor" stroke="none"/><rect x="14" y="30" width="24" height="16" rx="1.5"/><line x1="44" y1="30" x2="50" y2="30"/><line x1="44" y1="37" x2="50" y2="37"/><line x1="44" y1="44" x2="50" y2="44"/></svg>`,
    /* Projeto Arquitetônico — planta baixa */
    `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" class="service-icon"><rect x="8" y="8" width="48" height="48" rx="1.5"/><line x1="8" y1="30" x2="34" y2="30"/><line x1="34" y1="8" x2="34" y2="56"/><line x1="34" y1="40" x2="56" y2="40"/><path d="M8 20a6 6 0 0 0 6 6" /></svg>`
  ];
  const card = (s, i) => `
    <div class="service-card">
      ${icons[i % icons.length]}
      <div class="service-title">${s.name}</div>
      <div class="service-desc">${s.desc}</div>
      <div class="service-specs">
        ${s.specs.map(sp => `<div class="service-spec">${sp}</div>`).join('')}
      </div>
    </div>`;
  const cards = data.map(card).join('');
  // Vitrine infinita: duplica o conjunto para o loop ser contínuo
  document.getElementById('services-grid').innerHTML =
    `<div class="services-track">${cards}${cards}</div>`;
  initReveal();
}

/* ── SOBRE ───────────────────────────────────────────────── */

function buildAbout() {
  document.getElementById('section-about-title').textContent = t('section_about');
  document.getElementById('section-about-sub').textContent   = t('about_sub');

  const rawLead = t('about_lead');
  const leadEl  = document.getElementById('about-lead');
  const dashIdx = rawLead.indexOf('—');
  if (dashIdx !== -1) {
    leadEl.innerHTML =
      `<span class="about-lead-pre">${rawLead.slice(0, dashIdx + 1)}</span>` +
      `<span class="about-lead-main">${rawLead.slice(dashIdx + 1)}</span>`;
  } else {
    leadEl.textContent = rawLead;
  }

  const body  = t('about_body');
  const paras = Array.isArray(body) ? body : [body];
  document.getElementById('about-body').innerHTML = paras.map(p => `<p>${p}</p>`).join('');

  const ctaBtn = document.getElementById('about-cta-btn');
  if (ctaBtn) {
    const textSpan = ctaBtn.querySelector('span');
    if (textSpan) textSpan.textContent = t('about_cta');
  }

  const stats_pt = [
    { num:'112', label:'Projetos entregues', desc:'Residenciais, comerciais e incorporações.', count:true },
    { num:'6',   label:'Países',             desc:'Projetos para clientes internacionais.',   count:true },
    { num:'4K',  label:'Qualidade',          desc:'Renders de alta resolução.',               count:false },
    { num:'IA',  label:'Pós-produção',       desc:'Fluxo de trabalho com inteligência artificial.', count:false, icon:true }
  ];
  const stats_en = [
    { num:'112', label:'Projects delivered', desc:'Residential, commercial and developments.', count:true },
    { num:'6',   label:'Countries',          desc:'Projects for international clients.',       count:true },
    { num:'4K',  label:'Quality',            desc:'High resolution renders.',                  count:false },
    { num:'AI',  label:'Post-production',    desc:'Workflow with artificial intelligence.',    count:false, icon:true }
  ];
  const stats = currentLang === 'en' ? stats_en : stats_pt;
  document.getElementById('about-stats').innerHTML = stats.map(s => {
    let numContent = s.count ? '0' : s.num;
    let iconSvg = s.icon ? `
      <svg class="stat-chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="5" y="5" width="14" height="14" rx="2"/>
        <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4M9 9h6v6H9z"/>
      </svg>` : '';
    
    return `
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-num"${s.count ? ` data-count="${s.num}"` : ''}>${numContent}</div>
          ${iconSvg}
        </div>
        <div class="stat-label">${s.label}</div>
        <div class="stat-desc">${s.desc}</div>
      </div>`;
  }).join('');

  initStatsInteractive();
}

/* Contador rápido dos números + brilho dourado no hover */
function animateCount(el, target, dur) {
  const start = performance.now();
  (function tick(now) {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
  })(start);
}

function initStatsInteractive() {
  const grid = document.getElementById('about-stats');
  if (!grid) return;
  const nums = grid.querySelectorAll('.stat-num[data-count]');
  const run  = () => nums.forEach(el => animateCount(el, parseInt(el.dataset.count, 10), 1100));

  // Rebuilds (ex: troca de idioma) substituem os elementos — descarta
  // qualquer observer antigo, que ainda apontaria para nós órfãos.
  if (grid._countObs) { grid._countObs.disconnect(); grid._countObs = null; }

  const r = grid.getBoundingClientRect();
  const inView = r.top < window.innerHeight && r.bottom > 0;
  if (inView) {
    run();
  } else {
    grid._countObs = new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting) { run(); obs.disconnect(); grid._countObs = null; }
    }, { threshold: 0.3 });
    grid._countObs.observe(grid);
  }
}

/* ── CONTATO ─────────────────────────────────────────────── */

function buildContact() {
  const en = currentLang === 'en';
  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };

  set('contact-headline', en ? 'Ready to bring your vision to life?' : 'Vamos dar vida à sua visão?');

  const leadEl = document.getElementById('contact-lead');
  if (leadEl) {
    const gold = en ? 'Request a tailored proposal' : 'Solicite uma proposta personalizada';
    const rest = en ? ' for your next Archviz Premium project.' : ' para o seu próximo projeto de Archviz Premium.';
    leadEl.innerHTML = `<span class="cf-lead-gold">${gold}</span>${rest}`;
  }

  set('form-label-name',    en ? 'Company Name'     : 'Nome da Empresa');
  set('form-label-email',   en ? 'E-mail'           : 'E-mail');
  set('form-label-phone',   en ? 'Phone'            : 'Telefone');
  set('form-label-service', en ? 'Service type'     : 'Tipo de serviço');
  set('form-label-type',    en ? 'Project type'     : 'Tipo de projeto');
  set('form-hint-type',     en ? '(Residential, Commercial, etc.)' : '(Residencial, Comercial, etc.)');
  set('form-label-msg',     en ? 'Message / details' : 'Mensagem / detalhes');
  set('form-hint-msg',      en ? '(Optional)'       : '(Opcional)');
  set('form-submit',        en ? 'Send request'     : 'Enviar solicitação');
  set('form-note',          en ? 'Your information is safe and will be used only for this purpose.'
                               : 'Suas informações estão seguras e serão usadas apenas para este fim.');

  // Popula "Tipo de serviço" a partir da lista de serviços
  const svc = document.getElementById('form-service');
  if (svc) {
    const services = t('services_data').map((x) => x.name);
    const placeholder = en ? 'Select a service' : 'Selecione um serviço';
    svc.innerHTML =
      `<option value="">${placeholder}</option>` +
      services.map((name) => `<option value="${name}">${name}</option>`).join('');
    refreshServiceSelect();
  }

  const fPhone = document.getElementById('form-phone');
  if (fPhone) fPhone.placeholder = en ? '(00) 00000-0000' : '(00) 00000-0000';
  const fType = document.getElementById('form-type');
  if (fType) fType.placeholder = en ? 'e.g. Residential' : 'ex.: Residencial';
  const fMsg = document.getElementById('form-msg');
  if (fMsg) fMsg.placeholder = en ? 'Tell us about your project…' : 'Conte sobre o seu projeto…';

  const countryTrigger = document.getElementById('country-trigger');
  if (countryTrigger) countryTrigger.setAttribute('aria-label', en ? 'Country' : 'País');
  const countrySearch = document.getElementById('country-search');
  if (countrySearch) countrySearch.placeholder = en ? 'Search country…' : 'Buscar país…';
  const countryWrap = document.getElementById('country-select');
  if (countryWrap && countryWrap._ccRenderList) countryWrap._ccRenderList(countrySearch ? countrySearch.value : '');
}

/* Seletor de país (bandeira + DDI) do campo de telefone */
function initCountrySelect() {
  const wrap     = document.getElementById('country-select');
  const trigger  = document.getElementById('country-trigger');
  const flagEl   = document.getElementById('country-flag');
  const codeEl   = document.getElementById('country-code');
  const dropdown = document.getElementById('country-dropdown');
  const searchEl = document.getElementById('country-search');
  const listEl   = document.getElementById('country-list');
  if (!wrap || wrap._ccInit) return;
  wrap._ccInit = true;

  selectedCountry = COUNTRIES[0]; // Brasil por padrão

  const selectCountry = (c) => {
    selectedCountry = c;
    flagEl.textContent = flagEmoji(c.iso2);
    codeEl.textContent = `+${c.dial}`;
  };

  const renderList = (query) => {
    const en = currentLang === 'en';
    const q = (query || '').trim().toLowerCase();
    const filtered = COUNTRIES.filter(c => {
      const name = (en ? c.en : c.pt).toLowerCase();
      return !q || name.includes(q) || c.dial.includes(q);
    });
    listEl.innerHTML = filtered.length ? filtered.map(c => `
      <div class="cf-country-option${c === selectedCountry ? ' active' : ''}" data-iso2="${c.iso2}" role="option">
        <span class="cf-country-flag">${flagEmoji(c.iso2)}</span>
        <span class="cf-country-option-name">${en ? c.en : c.pt}</span>
        <span class="cf-country-option-dial">+${c.dial}</span>
      </div>`).join('') : `<div class="cf-country-empty">${en ? 'No country found' : 'Nenhum país encontrado'}</div>`;

    listEl.querySelectorAll('.cf-country-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const c = COUNTRIES.find(x => x.iso2 === opt.dataset.iso2);
        if (c) selectCountry(c);
        wrap.classList.remove('open');
      });
    });
  };

  trigger.addEventListener('click', e => {
    e.stopPropagation();
    const open = wrap.classList.toggle('open');
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      searchEl.value = '';
      renderList('');
      setTimeout(() => searchEl.focus(), 0);
    }
  });
  document.addEventListener('click', () => {
    wrap.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  });
  dropdown.addEventListener('click', e => e.stopPropagation());
  searchEl.addEventListener('input', () => renderList(searchEl.value));

  wrap._ccRenderList = renderList;
  wrap._ccReset = () => selectCountry(COUNTRIES[0]);
  selectCountry(selectedCountry);
}

function initContactForm() {
  const form = document.querySelector('.contact-form2');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('form-submit');
    const originalText = submitBtn.textContent;
    const en = currentLang === 'en';

    // Get input values
    const company = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const phoneLocal = document.getElementById('form-phone').value.trim();
    const phone = phoneLocal ? `+${selectedCountry.dial} ${phoneLocal}` : '';
    const service = document.getElementById('form-service').value;
    const projectType = document.getElementById('form-type').value.trim();
    const message = document.getElementById('form-msg').value.trim();

    // Basic Validation
    if (!company || !email || !phone) {
      alert(en ? 'Please fill in all required fields (Company Name, E-mail, Phone).' : 'Por favor, preencha todos os campos obrigatórios (Nome da Empresa, E-mail, Telefone).');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = en ? 'Sending...' : 'Enviando...';

    const payload = {
      "Nome da Empresa / Company Name": company,
      "E-mail": email,
      "Telefone / Phone": phone,
      "Serviço / Service": service || 'Nenhum / None',
      "Tipo de projeto / Project Type": projectType || 'Não informado / Not specified',
      "Mensagem / Message": message || 'Sem mensagem / No message'
    };

    try {
      const response = await fetch('https://formsubmit.co/ajax/contato@carmoviz.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(en ? 'Thank you! Your request has been sent successfully. We will get in touch soon.' : 'Obrigado! Sua solicitação foi enviada com sucesso. Entraremos em contato em breve.');
        form.reset();
        refreshCustomSelect();
        refreshServiceSelect();
        const countryWrap = document.getElementById('country-select');
        if (countryWrap && countryWrap._ccReset) countryWrap._ccReset();
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      alert(en ? 'An error occurred while sending. Please try again or contact us directly at contato@carmoviz.com.' : 'Ocorreu um erro ao enviar. Por favor, tente novamente ou fale diretamente conosco pelo email contato@carmoviz.com.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

/* Dropdown customizado do "Tipo de serviço" — substitui o <select> nativo
   (que herda o azul do navegador) por uma lista no estilo dourado/escuro. */
function initServiceSelect() {
  const select = document.getElementById('form-service');
  if (!select || select._svcInit) return;
  select._svcInit = true;
  select.style.display = 'none';
  select.setAttribute('tabindex', '-1');

  const wrap = document.createElement('div');
  wrap.className = 'svc-wrap';
  wrap.innerHTML = `
    <div class="svc-trigger" role="button" tabindex="0" aria-haspopup="listbox">
      <span class="svc-value placeholder"></span>
      <svg class="svc-arrow" viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="svc-menu" role="listbox"></div>`;
  select.insertAdjacentElement('afterend', wrap);

  const trigger = wrap.querySelector('.svc-trigger');
  select._svc = { wrap, menu: wrap.querySelector('.svc-menu'), valueEl: wrap.querySelector('.svc-value') };

  const toggle = (e) => { e.stopPropagation(); wrap.classList.toggle('open'); };
  trigger.addEventListener('click', toggle);
  trigger.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(e); } });
  document.addEventListener('click', () => wrap.classList.remove('open'));

  refreshServiceSelect();
}

function refreshServiceSelect() {
  const select = document.getElementById('form-service');
  if (!select || !select._svc) return;
  const { menu, valueEl, wrap } = select._svc;
  const opts = Array.from(select.options);
  const placeholder = opts[0] ? opts[0].textContent : '';

  const current = opts.find((o) => o.value === select.value) || opts[0];
  valueEl.textContent = current ? current.textContent : placeholder;
  valueEl.classList.toggle('placeholder', !select.value);

  menu.innerHTML = '';
  opts.forEach((opt, i) => {
    if (i === 0) return; // pula o placeholder
    const item = document.createElement('div');
    item.className = 'svc-option' + (select.value === opt.value ? ' active' : '');
    item.setAttribute('role', 'option');
    item.textContent = opt.textContent;
    item.addEventListener('click', () => {
      select.value = opt.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      valueEl.textContent = opt.textContent;
      valueEl.classList.remove('placeholder');
      menu.querySelectorAll('.svc-option').forEach((o) => o.classList.remove('active'));
      item.classList.add('active');
      wrap.classList.remove('open');
    });
    menu.appendChild(item);
  });
}

/* ── RODAPÉ ──────────────────────────────────────────────── */

function buildFooter() {
  const bttEl = document.getElementById('btt-label');
  if (bttEl) bttEl.textContent = t('btt_label');

  const copyEl = document.getElementById('footer-copy');
  if (copyEl) copyEl.textContent = t('footer_copy');

  const setLink = (id, key) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t(key);
  };
  setLink('footer-link-trust', 'footer_trust');
  setLink('footer-link-terms', 'footer_terms');
  setLink('footer-link-privacy', 'footer_privacy');
  setLink('footer-link-cookies', 'footer_cookies');
  setLink('footer-link-ip', 'footer_ip');
  setLink('footer-link-conf', 'footer_conf');
  setLink('footer-link-access', 'footer_access');
  setLink('footer-link-security', 'footer_security');
  setLink('footer-link-contact', 'footer_contact');
}

/* ── CUSTOM SELECT ───────────────────────────────────────── */

function initCustomSelect() {
  const select = document.getElementById('form-type');
  if (!select || select.tagName !== 'SELECT' || select._csInit) return;
  select._csInit = true;
  select.style.display = 'none';

  const cs = document.createElement('div');
  cs.className = 'cs-wrap';
  cs.innerHTML = `
    <div class="cs-trigger">
      <span class="cs-value"></span>
      <svg class="cs-arrow" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="1,1 5.5,6 10,1" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="cs-dropdown"></div>`;
  select.parentElement.appendChild(cs);

  const trigger  = cs.querySelector('.cs-trigger');
  const dropdown = cs.querySelector('.cs-dropdown');
  const valueEl  = cs.querySelector('.cs-value');

  select._cs = { cs, dropdown, valueEl };

  trigger.addEventListener('click', e => {
    e.stopPropagation();
    cs.classList.toggle('open');
  });
  document.addEventListener('click', () => cs.classList.remove('open'));

  // link label click to open custom select
  const label = document.getElementById('form-label-type');
  if (label) label.addEventListener('click', () => cs.classList.toggle('open'));

  refreshCustomSelect();
}

function refreshCustomSelect() {
  const select = document.getElementById('form-type');
  if (!select || !select._cs) return;
  const { cs, dropdown, valueEl } = select._cs;

  dropdown.innerHTML = '';
  Array.from(select.options).forEach((opt, i) => {
    if (i === 0) return;
    const div = document.createElement('div');
    div.className = 'cs-option' + (select.value === opt.value ? ' active' : '');
    div.textContent = opt.textContent;
    div.addEventListener('click', () => {
      select.value = opt.value;
      valueEl.textContent = opt.textContent;
      valueEl.classList.add('selected');
      dropdown.querySelectorAll('.cs-option').forEach(o => o.classList.remove('active'));
      div.classList.add('active');
      cs.classList.remove('open');
    });
    dropdown.appendChild(div);
  });

  // keep displayed value if already selected
  if (select.value) {
    const sel = Array.from(select.options).find(o => o.value === select.value);
    if (sel) { valueEl.textContent = sel.textContent; valueEl.classList.add('selected'); }
  }
}

/* ── CURSOR PERSONALIZADO ────────────────────────────────── */

function initCustomCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot  = document.createElement('div'); dot.className = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -200, my = -200, rx = -200, ry = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });
  document.addEventListener('mouseleave', () => { dot.classList.add('hidden'); ring.classList.add('hidden'); });
  document.addEventListener('mouseenter', () => { dot.classList.remove('hidden'); ring.classList.remove('hidden'); });

  (function tick() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  })();

  const hoverSel = 'a, button, .portfolio-card, .filter-btn, .modal-arrow, .modal-close, .social-icon-link, .back-to-top, .cs-option, .cs-trigger, label';
  function bindHover() {
    document.querySelectorAll(hoverSel).forEach(el => {
      if (el._cursorBound) return;
      el._cursorBound = true;
      el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
    });
  }
  bindHover();

  // Re-bind after dynamic content renders (portfolio cards)
  const origBuildPortfolio = window.buildPortfolio;
  setTimeout(bindHover, 500);
}

/* ── TEMA CLARO / ESCURO ─────────────────────────────────── */

function initThemeToggle() {
  const root = document.documentElement;
  if (!root.getAttribute('data-theme')) root.setAttribute('data-theme', 'dark');

  const apply = (theme) => {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('cv-theme', theme); } catch (e) {}
  };

  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    apply(next);
  });
}

/* ── PORTAL DE ENTRADA (canvas interativo) ───────────────── */

function initEntryScreen() {
  const screen = document.getElementById('entry-screen');
  if (!screen) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let entered = false;
  let running = true, exploding = false;
  let scrollEnabled = false;

  // Trava o scroll enquanto o portal está visível
  document.body.style.overflow = 'hidden';

  // Revela "CARMOVIZ STUDIO" + indicador de rolagem depois que o giro estabiliza
  function revealChrome() {
    const brand  = document.getElementById('entry-brand');
    const scroll = document.getElementById('entry-scroll');
    if (brand) brand.classList.add('show');
    setTimeout(() => {
      if (scroll) scroll.classList.add('show');
      scrollEnabled = true;
    }, 1000);
  }

  function enter() {
    if (entered || !scrollEnabled) return;
    entered = true;
    exploding = true;
    screen.classList.add('exiting');   // expande devagar e vai para a home

    // Revela o hero em cascata — MENOS o indicador de scroll (vem depois)
    document.querySelectorAll('.hero-enter').forEach((el, i) => {
      if (el.classList.contains('hero-scroll')) return;
      setTimeout(() => el.classList.add('visible'), i * 160);
    });

    // Expansão do C mais longa/visível antes de remover o portal
    setTimeout(() => { screen.classList.add('gone'); running = false; }, 2000);

    // Trava no topo da home por ~4s; então revela o indicador de rolagem suavemente
    setTimeout(() => {
      const hs = document.querySelector('.hero-scroll');
      if (hs) hs.classList.add('visible');
      document.body.style.overflow = '';
    }, 4000);
  }

  // Entrada por ROLAGEM (só funciona depois que o indicador aparece)
  window.addEventListener('wheel', (e) => { if (e.deltaY > 0) enter(); }, { passive: true });
  window.addEventListener('touchmove', () => enter(), { passive: true });
  document.addEventListener('keydown', (e) => {
    if (['ArrowDown','PageDown','Enter',' ','Spacebar'].includes(e.key)) enter();
  });
  screen.addEventListener('click', () => enter());

  // ── Sistema de partículas (malha da marca) ──
  const canvas = document.getElementById('entry-canvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  const HEX = [
    [3545.94,1114.27],[1999.47,221.42],[453,1114.27],[453,2899.99],
    [1999.47,3792.84],[3545.94,2899.99],[3112.93,2649.99],[1999.47,3292.84],
    [886.01,2649.99],[886.01,1364.27],[1999.47,721.42],[3112.93,1364.27]
  ];
  const CX = 1999.47, CY = 2007.13, NORM = 1785.7;
  const nHex = HEX.map(([x,y]) => [(x - CX) / NORM, (y - CY) / NORM]);

  let W = 0, H = 0, dpr = 1, radius = 0, cx = 0, cy = 0;
  let perim = [];   // partículas do contorno (conectadas)
  let amb = [];     // partículas ambientes
  const mouse = { x: -9999, y: -9999 };

  function buildParticles() {
    radius = Math.min(W, H) * (W < 640 ? 0.34 : 0.27);
    cx = W / 2;
    cy = H / 2;

    // Amostra o perímetro do polígono normalizado
    const pts = nHex.map(([nx, ny]) => [cx + nx * radius, cy + ny * radius]);
    const sampled = [];
    const SEG = 12; // pontos por aresta
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      for (let s = 0; s < SEG; s++) {
        const t = s / SEG;
        sampled.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      }
    }

    perim = sampled.map(([hx, hy]) => ({
      hx, hy, rx0: hx - cx, ry0: hy - cy,
      x: hx, y: hy, vx: 0, vy: 0, r: 1.1 + Math.random()*1.1, tw: Math.random()*Math.PI*2, sc: 1
    }));

    const AMB = W < 640 ? 46 : 78;
    amb = [];
    for (let i = 0; i < AMB; i++) {
      const ang = Math.random()*Math.PI*2;
      const rr = radius * (0.2 + Math.random()*1.25);
      const hx = cx + Math.cos(ang)*rr;
      const hy = cy + Math.sin(ang)*rr;
      amb.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0, r: 0.7 + Math.random()*1.0,
                 tw: Math.random()*Math.PI*2, dx: (Math.random()-0.5)*0.15, dy: (Math.random()-0.5)*0.15 });
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildParticles();
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseout', () => { mouse.x = -9999; mouse.y = -9999; });

  let alpha = 1;
  const REP = 140;

  // Giro 3D tipo planeta (5s, 2 voltas) que desacelera até estabilizar de frente
  const SPIN_MS = 5000, SPINS = 2;
  let spinStart = null;   // ancorado no 1º frame (mesmo relógio do rAF)
  let spinning = !reduce;

  function step(p, springK, drift) {
    // Repulsão do cursor
    const dx = p.x - mouse.x, dy = p.y - mouse.y;
    const d2 = dx*dx + dy*dy;
    if (d2 < REP*REP) {
      const d = Math.sqrt(d2) || 1;
      const f = (REP - d) / REP * 2.2;
      p.vx += (dx / d) * f;
      p.vy += (dy / d) * f;
    }
    if (exploding) {
      const ex = p.x - cx, ey = p.y - cy;
      const ed = Math.sqrt(ex*ex + ey*ey) || 1;
      p.vx += (ex / ed) * 0.8;
      p.vy += (ey / ed) * 0.8;
    } else {
      // Mola de volta para casa (+ deriva suave nas ambientes)
      if (drift) { p.hx += p.dx; p.hy += p.dy;
        if (p.hx < cx - radius*1.5 || p.hx > cx + radius*1.5) p.dx *= -1;
        if (p.hy < cy - radius*1.5 || p.hy > cy + radius*1.5) p.dy *= -1;
      }
      p.vx += (p.hx - p.x) * springK;
      p.vy += (p.hy - p.y) * springK;
    }
    p.vx *= 0.86; p.vy *= 0.86;
    p.x += p.vx; p.y += p.vy;
  }

  function frame(t) {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    if (exploding) alpha = Math.max(0, alpha - 0.011);
    ctx.globalAlpha = alpha;

    // Fase de giro 3D — posiciona o contorno por rotação em torno do eixo Y
    if (spinning) {
      if (spinStart === null) spinStart = t;
      const p = Math.min(1, (t - spinStart) / SPIN_MS);
      const eased = 1 - Math.pow(1 - p, 3);
      const theta = SPINS * 2 * Math.PI * (1 - eased);
      const cosT = Math.cos(theta), sinT = Math.sin(theta);
      const focal = radius * 2.6;
      for (const pt of perim) {
        const z  = pt.rx0 * sinT;
        const sc = focal / (focal - z);
        pt.x = cx + pt.rx0 * cosT * sc;
        pt.y = cy + pt.ry0 * sc;
        pt.sc = sc;
      }
      if (p >= 1) {
        spinning = false;
        for (const pt of perim) { pt.x = pt.hx; pt.y = pt.hy; pt.vx = 0; pt.vy = 0; pt.sc = 1; }
        if (!entered) revealChrome();
      }
    } else {
      for (const pt of perim) { step(pt, 0.05, false); pt.sc = 1; }
    }

    // Linhas do contorno
    ctx.beginPath();
    perim.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.strokeStyle = 'rgba(197,160,89,0.28)';
    ctx.lineWidth = 0.6;
    ctx.stroke();

    // Pontos do contorno (tamanho e brilho variam com a profundidade)
    for (const p of perim) {
      const tw = 0.55 + 0.45 * Math.sin(t*0.002 + p.tw);
      const sc = p.sc || 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.4, p.r * sc), 0, Math.PI*2);
      ctx.fillStyle = `rgba(197,160,89,${0.85 * tw * Math.min(1, sc)})`;
      ctx.fill();
    }

    // Partículas ambientes
    for (const p of amb) {
      step(p, 0.02, true);
      const tw = 0.4 + 0.6 * Math.sin(t*0.0015 + p.tw);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(210,190,150,${0.35*tw})`;
      ctx.fill();
    }

    requestAnimationFrame(frame);
  }

  if (reduce) {
    // Uma renderização estática
    ctx.clearRect(0, 0, W, H);
    ctx.beginPath();
    perim.forEach((p, i) => i === 0 ? ctx.moveTo(p.hx, p.hy) : ctx.lineTo(p.hx, p.hy));
    ctx.closePath();
    ctx.strokeStyle = 'rgba(197,160,89,0.35)'; ctx.lineWidth = 0.7; ctx.stroke();
    perim.forEach(p => { ctx.beginPath(); ctx.arc(p.hx, p.hy, p.r, 0, Math.PI*2); ctx.fillStyle = 'rgba(197,160,89,0.8)'; ctx.fill(); });
    revealChrome();
  } else {
    requestAnimationFrame(frame);
  }
}

/* ── MALHA GRÁFICA DO HERO (reativa ao scroll) ──────────── */

function initHeroGraphic() {
  const canvas = document.getElementById('hero-graphic');
  if (!canvas || !canvas.getContext) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0, dpr = 1;
  let lastScroll = window.scrollY, vel = 0, mouseX = 0.5;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height || 200;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    const hero = document.getElementById('hero');
    if (hero && e.clientY < hero.getBoundingClientRect().bottom) mouseX = e.clientX / window.innerWidth;
  });

  function draw(t) {
    const sy = window.scrollY;
    vel += ((sy - lastScroll) - vel) * 0.15;
    lastScroll = sy;

    // Só desenha enquanto o hero está visível
    if (sy > window.innerHeight) { requestAnimationFrame(draw); return; }

    ctx.clearRect(0, 0, W, H);

    const N = Math.max(24, Math.floor(W / 26));
    const baseY = H * 0.62;
    const scrollPhase = sy * 0.006;
    const amp = 10 + Math.min(26, Math.abs(vel) * 1.6);
    const fade = 1 - Math.min(1, sy / (window.innerHeight * 0.8));

    const wave = (i) => {
      const x = (i / (N - 1)) * W;
      const nx = i / (N - 1);
      const y = baseY
        + Math.sin(nx * 6.2 + t * 0.0011 + scrollPhase) * amp
        + Math.sin(nx * 13.0 - t * 0.0016 + scrollPhase * 1.7) * (amp * 0.35)
        + (mouseX - nx) * 14;
      return [x, y];
    };

    // Linha principal
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const [x, y] = wave(i);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(197,160,89,${0.42 * fade})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Nós + drop-lines
    for (let i = 0; i < N; i++) {
      const [x, y] = wave(i);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, H);
      ctx.strokeStyle = `rgba(197,160,89,${0.05 * fade})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      const pulse = 0.5 + 0.5 * Math.sin(t * 0.003 + i * 0.5);
      ctx.beginPath();
      ctx.arc(x, y, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(197,160,89,${(0.5 + 0.4 * pulse) * fade})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  if (reduce) { draw(0); } else { requestAnimationFrame(draw); }
}

/* ── HERO ARCHVIZ (wireframe 3D interativo com o mouse) ──── */

function initHeroArchviz() {
  const canvas = document.getElementById('hero-archviz');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0, H = 0, dpr = 1;
  let mx = 0.5, my = 0.5;
  let ry = 0, rx = 0.30;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const hero = document.getElementById('hero');
    W = window.innerWidth;
    H = hero ? hero.clientHeight : window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);
  if (!reduce) window.addEventListener('mousemove', (e) => { mx = e.clientX / window.innerWidth; my = e.clientY / window.innerHeight; });

  // Massa arquitetônica (volumes) — y para cima, base em y=0
  const boxes = [
    { x: -2.4, z: -0.4, w: 2.0, h: 3.6, d: 2.0 },
    { x:  0.1, z:  0.4, w: 2.8, h: 2.2, d: 2.6 },
    { x:  2.7, z: -0.2, w: 1.6, h: 4.6, d: 1.6 },
    { x:  0.7, z:  2.8, w: 3.4, h: 1.2, d: 1.5 }
  ];
  const segs = [];
  const tops = [];
  for (const b of boxes) {
    const x0=b.x-b.w/2, x1=b.x+b.w/2, z0=b.z-b.d/2, z1=b.z+b.d/2, y0=0, y1=b.h;
    const v = [[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]];
    const E = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    for (const [a,c] of E) segs.push([v[a][0],v[a][1],v[a][2], v[c][0],v[c][1],v[c][2]]);
    tops.push(v[4], v[5], v[6], v[7]);
  }
  const grid = [];
  const G = 8, span = 9;
  for (let i = -G; i <= G; i++) {
    const tt = i / G * span;
    grid.push([-span,0,tt, span,0,tt]);
    grid.push([tt,0,-span, tt,0,span]);
  }

  const F = 3.4, camDist = 9.5, yBase = 1.5;

  function project(x, y, z, cY, sY, cX, sX, cx, cy, scale) {
    const X = x*cY - z*sY;
    const Z = x*sY + z*cY;
    const Y = y - yBase;
    const Y2 = Y*cX - Z*sX;
    const Z2 = Y*sX + Z*cX;
    const zc = Z2 + camDist;
    const f = F / zc * scale;
    return [cx + X*f, cy - Y2*f];
  }

  function render(t) {
    const cY = Math.cos(ry), sY = Math.sin(ry), cX = Math.cos(rx), sX = Math.sin(rx);
    const cx = W * (W < 800 ? 0.5 : 0.62), cy = H * 0.5, scale = Math.min(W, H) * 0.52;
    ctx.clearRect(0, 0, W, H);
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    const gc = light ? '150,116,42' : '197,160,89';

    ctx.lineWidth = 0.5;
    ctx.strokeStyle = `rgba(${gc},0.055)`;
    for (const s of grid) {
      const a = project(s[0],s[1],s[2], cY,sY,cX,sX, cx,cy,scale);
      const b = project(s[3],s[4],s[5], cY,sY,cX,sX, cx,cy,scale);
      ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b[0],b[1]); ctx.stroke();
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(${gc},0.42)`;
    for (const s of segs) {
      const a = project(s[0],s[1],s[2], cY,sY,cX,sX, cx,cy,scale);
      const b = project(s[3],s[4],s[5], cY,sY,cX,sX, cx,cy,scale);
      ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b[0],b[1]); ctx.stroke();
    }
    for (const p of tops) {
      const q = project(p[0],p[1],p[2], cY,sY,cX,sX, cx,cy,scale);
      const tw = 0.6 + 0.4 * Math.sin(t*0.002 + p[0] + p[2]);
      ctx.beginPath(); ctx.arc(q[0], q[1], 1.7, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${gc},${0.75*tw})`; ctx.fill();
    }
  }

  function frame(t) {
    const targetRy = (mx - 0.5) * 0.95 + t * 0.00003;
    const targetRx = 0.30 + (my - 0.5) * 0.30;
    ry += (targetRy - ry) * 0.05;
    rx += (targetRx - rx) * 0.05;
    render(t);
    requestAnimationFrame(frame);
  }

  if (reduce) { render(0); } else { requestAnimationFrame(frame); }
}

/* ── CAMPO AMBIENTE (partículas sutis reativas ao mouse) ── */

function initAmbientField() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'ambient-field';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0, dpr = 1, parts = [];
  const mouse = { x: -9999, y: -9999 };

  function build() {
    const n = Math.round(Math.min(64, (W * H) / 30000));
    parts = [];
    for (let i = 0; i < n; i++) {
      parts.push({
        x: Math.random()*W, y: Math.random()*H,
        vx: (Math.random()-0.5)*0.10, vy: (Math.random()-0.5)*0.10,
        r: 0.6 + Math.random()*1.2, tw: Math.random()*Math.PI*2
      });
    }
  }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W*dpr; canvas.height = H*dpr;
    canvas.style.width = W+'px'; canvas.style.height = H+'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseout', () => { mouse.x = -9999; mouse.y = -9999; });

  function frame(t) {
    ctx.clearRect(0, 0, W, H);
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    const col = light ? '140,109,40' : '197,160,89';
    const baseA = light ? 0.18 : 0.14;

    for (const p of parts) {
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx*dx + dy*dy;
      if (d2 < 130*130) { const d = Math.sqrt(d2) || 1; const f = (130 - d) / 130 * 0.55; p.vx += (dx/d)*f; p.vy += (dy/d)*f; }
      p.vx *= 0.94; p.vy *= 0.94;
      p.x += p.vx; p.y += p.vy;
      if (p.x < -5) p.x = W+5; else if (p.x > W+5) p.x = -5;
      if (p.y < -5) p.y = H+5; else if (p.y > H+5) p.y = -5;

      const tw = 0.5 + 0.5*Math.sin(t*0.001 + p.tw);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${col},${baseA*tw})`;
      ctx.fill();

      const d = Math.hypot(dx, dy);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(${col},${0.14 * (1 - d/120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ── REVEAL ON SCROLL ────────────────────────────────────── */

function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
}

/* ── KEYBOARD NAV (MODAL) ───────────────────────────────── */

document.addEventListener('keydown', e => {
  if (!document.getElementById('modal').classList.contains('open')) return;
  if (e.key === 'Escape')     closeModal();
  if (e.key === 'ArrowRight') modalNext();
  if (e.key === 'ArrowLeft')  modalPrev();
});
