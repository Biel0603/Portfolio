/* ─── CURSOR CUSTOMIZADO ─────────────────────── */
document.addEventListener('mousemove', e => {
  document.body.style.setProperty('--cx', e.clientX + 'px');
  document.body.style.setProperty('--cy', e.clientY + 'px');
});

/* ─── HAMBURGER / MOBILE MENU ────────────────── */
const hamburger  = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

/* ─── FECHAR MENU COM ESC ────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    if (document.getElementById('previewModal').classList.contains('open')) {
      fecharPreview();
    }
  }
});

/* ─── SCROLL ATIVO NO NAV ────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === '#' + entry.target.id
          ? 'var(--text)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

/* ─── ANIMAÇÃO AO ENTRAR NA TELA ─────────────── */
const fadeEls = document.querySelectorAll('.project-card, .contact-inner');

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = `fadeUp 0.5s ${i * 0.08}s ease both`;
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => {
  el.style.opacity = '0';
  fadeObserver.observe(el);
});

/* ─── PREVIEW MODAL ──────────────────────────── */
function abrirPreview(src, titulo) {
  const modal = document.getElementById('previewModal');
  document.getElementById('previewTitle').textContent  = titulo;
  document.getElementById('previewFrame').src          = src;
  document.getElementById('previewOpenLink').href      = src;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function fecharPreview() {
  const modal = document.getElementById('previewModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.getElementById('previewFrame').src = '';
  document.body.style.overflow = '';
}

document.getElementById('previewModal').addEventListener('click', e => {
  if (e.target === document.getElementById('previewModal')) fecharPreview();
});