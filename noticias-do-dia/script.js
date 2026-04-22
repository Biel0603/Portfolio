/* ══════════════════════════════════════════
   DiárioHoje — script.js
   ══════════════════════════════════════════ */

/* ── 1. TEMA CLARO / ESCURO ── */
(function initTheme() {
  const saved = localStorage.getItem('dh-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

function toggleTheme() {
  const root = document.documentElement;
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('dh-theme', next);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
}


/* ── 2. NAVEGAÇÃO ATIVA ── */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    const categoria = link.textContent.trim().toLowerCase();
    filtrarPorCategoria(categoria);
  });
});


/* ── 3. FILTRO DE NOTÍCIAS (GRID) ── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filtro = btn.textContent.trim().toLowerCase();
    filtrarGrid(filtro);
  });
});

function filtrarGrid(filtro) {
  const items = document.querySelectorAll('.news-item');
  items.forEach(item => {
    const categoria = item.querySelector('.news-category')?.textContent.trim().toLowerCase() || '';
    const mostrar =
      filtro === 'todas' ||
      (filtro === 'brasil' && ['política', 'economia', 'esportes'].includes(categoria)) ||
      (filtro === 'mundo' && ['mundo', 'ciência'].includes(categoria));

    if (mostrar) {
      item.style.display = '';
      item.style.animation = 'fade-in-up 0.35s ease both';
    } else {
      item.style.display = 'none';
    }
  });
}

function filtrarPorCategoria(categoria) {
  const items = document.querySelectorAll('.news-item, .featured-card');
  const mapCategoria = {
    'política': 'política',
    'economia': 'economia',
    'tecnologia': 'tecnologia',
    'mundo': 'mundo',
    'ciência': 'ciência',
    'esportes': 'esportes',
  };
  const cat = mapCategoria[categoria];

  items.forEach(item => {
    const itemCat = item.querySelector('.news-category')?.textContent.trim().toLowerCase() || '';
    if (!cat || cat === 'inicial' || itemCat === cat) {
      item.style.display = '';
      item.style.animation = 'fade-in-up 0.35s ease both';
    } else {
      item.style.display = 'none';
    }
  });

  if (categoria === 'inicial') {
    items.forEach(item => { item.style.display = ''; });
  }
}


/* ── 4. BUSCA DE NOTÍCIAS ── */
const searchInput = document.querySelector('.search-input');
const searchBtn   = document.querySelector('.search-btn');

function executarBusca() {
  const termo = searchInput?.value.trim().toLowerCase();
  if (!termo) return resetarBusca();

  const items = document.querySelectorAll('.news-item, .featured-card');
  let encontrou = false;

  items.forEach(item => {
    const titulo  = item.querySelector('h3, h4')?.textContent.toLowerCase() || '';
    const descr   = item.querySelector('p')?.textContent.toLowerCase()      || '';
    if (titulo.includes(termo) || descr.includes(termo)) {
      item.style.display = '';
      item.style.animation = 'fade-in-up 0.3s ease both';
      encontrou = true;
    } else {
      item.style.display = 'none';
    }
  });

  mostrarMensagemBusca(termo, encontrou);
}

function resetarBusca() {
  document.querySelectorAll('.news-item, .featured-card').forEach(item => {
    item.style.display = '';
  });
  removerMensagemBusca();
}

function mostrarMensagemBusca(termo, encontrou) {
  removerMensagemBusca();
  const msg = document.createElement('p');
  msg.id = 'search-msg';
  msg.style.cssText = 'padding:16px 0;color:var(--ink-muted);font-size:14px;';
  msg.textContent = encontrou
    ? `Resultados para "${termo}"`
    : `Nenhum resultado para "${termo}"`;
  const section = document.querySelector('.news-grid-section');
  if (section) section.prepend(msg);
}

function removerMensagemBusca() {
  document.getElementById('search-msg')?.remove();
}

searchBtn?.addEventListener('click', executarBusca);
searchInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter') executarBusca();
  if (e.key === 'Escape') {
    searchInput.value = '';
    resetarBusca();
  }
});


/* ── 5. NEWSLETTER ── */
const newsletterForm = document.querySelector('.newsletter-form');

newsletterForm?.addEventListener('submit', e => {
  e.preventDefault();
  const input = newsletterForm.querySelector('input[type="email"]');
  const email = input?.value.trim();

  if (!email || !email.includes('@')) {
    mostrarFeedback(newsletterForm, 'Por favor, insira um email válido.', 'erro');
    return;
  }

  mostrarFeedback(newsletterForm, `✓ Obrigado! Você receberá nossas notícias em ${email}`, 'sucesso');
  input.value = '';
});

function mostrarFeedback(form, mensagem, tipo) {
  document.getElementById('newsletter-feedback')?.remove();
  const msg = document.createElement('p');
  msg.id = 'newsletter-feedback';
  msg.textContent = mensagem;
  msg.style.cssText = `
    margin-top: 12px;
    font-size: 13px;
    color: ${tipo === 'sucesso' ? 'var(--gold-light)' : '#e07070'};
    text-align: center;
    animation: fade-in 0.3s ease both;
  `;
  form.after(msg);
  if (tipo === 'sucesso') setTimeout(() => msg.remove(), 5000);
}


/* ── 6. HEADER SHRINK NO SCROLL ── */
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (!header) return;
  if (window.scrollY > 60) {
    header.style.boxShadow = '0 2px 16px rgba(0,0,0,0.10)';
  } else {
    header.style.boxShadow = 'none';
  }
}, { passive: true });


/* ── 7. BOTÃO "LER MAIS" NO HERO ── */
const heroBtn = document.querySelector('.hero-btn');

heroBtn?.addEventListener('click', () => {
  const featured = document.querySelector('.featured-section');
  if (featured) {
    featured.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});


/* ── 8. CARDS CLICÁVEIS (abre modal) ── */
document.querySelectorAll('.news-item, .featured-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const titulo = card.querySelector('h3, h4')?.textContent || '';
    const descr  = card.querySelector('p')?.textContent || '';
    const cat    = card.querySelector('.news-category')?.textContent || '';
    const tempo  = card.querySelector('.news-time')?.textContent || '';
    abrirModal(titulo, descr, cat, tempo);
  });
});

function abrirModal(titulo, descr, cat, tempo) {
  fecharModal();

  const overlay = document.createElement('div');
  overlay.id = 'dh-modal';
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    background:rgba(0,0,0,0.65);
    display:flex;align-items:center;justify-content:center;
    padding:24px;
    animation:fade-in 0.2s ease both;
  `;

  overlay.innerHTML = `
    <div style="
      background:var(--cream);
      border-radius:8px;
      max-width:560px;width:100%;
      padding:36px 40px;
      position:relative;
      animation:fade-in-up 0.3s ease both;
    ">
      <button id="dh-modal-close" style="
        position:absolute;top:16px;right:16px;
        background:none;border:none;cursor:pointer;
        font-size:20px;color:var(--ink-muted);
      ">✕</button>
      <span style="
        font-family:var(--font-mono);font-size:10px;letter-spacing:.1em;
        text-transform:uppercase;background:rgba(0,0,0,.07);
        padding:3px 9px;border-radius:2px;
      ">${cat}</span>
      <h2 style="
        font-family:var(--font-display);font-size:26px;font-weight:700;
        line-height:1.2;margin:14px 0 12px;color:var(--ink);
      ">${titulo}</h2>
      <p style="font-size:15px;color:var(--ink-muted);line-height:1.7;">${descr}</p>
      <p style="
        font-family:var(--font-mono);font-size:11px;
        color:var(--ink-muted);margin-top:20px;
      ">${tempo}</p>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  overlay.addEventListener('click', e => {
    if (e.target === overlay) fecharModal();
  });
  document.getElementById('dh-modal-close')?.addEventListener('click', fecharModal);
  document.addEventListener('keydown', fecharComEsc);
}

function fecharModal() {
  const modal = document.getElementById('dh-modal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', fecharComEsc);
  }
}

function fecharComEsc(e) {
  if (e.key === 'Escape') fecharModal();
}


/* ── 9. ANIMAÇÃO DE ENTRADA (Intersection Observer) ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fade-in-up 0.5s ease both';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.news-item, .featured-card').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});


/* ── 10. RELÓGIO NO TICKER ── */
function atualizarRelogio() {
  const el = document.getElementById('dh-clock');
  if (!el) return;
  const agora = new Date();
  el.textContent = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

(function injetarRelogio() {
  const ticker = document.querySelector('.ticker-container');
  if (!ticker) return;
  const clock = document.createElement('div');
  clock.id = 'dh-clock';
  clock.style.cssText = `
    flex-shrink:0;
    font-family:var(--font-mono);
    font-size:11px;
    color:rgba(255,255,255,.55);
    padding:0 16px;
    border-left:1px solid rgba(255,255,255,.12);
    margin-left:auto;
  `;
  ticker.appendChild(clock);
  atualizarRelogio();
  setInterval(atualizarRelogio, 1000);
})();


/* ── 11. BOTÃO VOLTAR AO TOPO ── */
(function criarBotaoTopo() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.textContent = '↑';
  btn.title = 'Voltar ao topo';
  btn.style.cssText = `
    position:fixed;bottom:32px;right:32px;
    width:44px;height:44px;border-radius:50%;
    background:var(--ink);color:#fff;
    border:none;font-size:18px;cursor:pointer;
    opacity:0;pointer-events:none;
    transition:opacity 0.3s ease, transform 0.2s ease;
    z-index:800;
  `;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    const visivel = window.scrollY > 400;
    btn.style.opacity = visivel ? '1' : '0';
    btn.style.pointerEvents = visivel ? 'auto' : 'none';
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-3px)');
  btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0)');
})();
