// ===========================
// HEADER SCROLL EFFECT
// ===========================
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===========================
// MENU HAMBURGUER MOBILE
// ===========================
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);

    // Trava o scroll do body enquanto o menu está aberto
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Fecha o menu ao clicar em um link
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    });
});

// Fecha o menu ao pressionar ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
});

// ===========================
// PREVIEW DE PROJETOS (iframe)
// ===========================
function abrirPreview(url, nome) {
    const modal = document.getElementById('previewModal');
    const frame = document.getElementById('previewFrame');
    const title = document.getElementById('previewTitle');
    const openLink = document.getElementById('previewOpenLink');

    frame.src = url;
    title.textContent = nome;
    openLink.href = url;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Fecha ao clicar fora
    modal.addEventListener('click', function handler(e) {
        if (e.target === modal) {
            fecharPreview();
            modal.removeEventListener('click', handler);
        }
    });

    // Fecha com ESC
    document.addEventListener('keydown', fecharPreviewEsc);
}

function fecharPreview() {
    const modal = document.getElementById('previewModal');
    const frame = document.getElementById('previewFrame');

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Pequeno delay para animar antes de limpar o iframe
    setTimeout(() => { frame.src = ''; }, 300);
    document.removeEventListener('keydown', fecharPreviewEsc);
}

function fecharPreviewEsc(e) {
    if (e.key === 'Escape') fecharPreview();
}