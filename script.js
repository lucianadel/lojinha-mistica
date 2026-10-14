'use strict';

// ================= CONFIGURAR LINKS FINAIS =================
// KIWIFY: cole a URL HTTPS do checkout de cada e-book entre as aspas.
// Uma configuração atualiza os CTAs da vitrine, do modal e da landing page.
// Se estiver vazia, mantém o href do HTML. Substitua SEU_LINK_AQUI antes de publicar.
const CHECKOUT_URLS = Object.freeze({
    'sonhos': '',
    'baralho-7dias': '',
    'curso-baralho': '',
    'banhos-7dias': '',
    'rituais-umbanda': '',
    'protecao-diaria': ''
});
// WHATSAPP MARIAH: país + DDD + número, somente dígitos (ex.: 55DDDNÚMERO).
const WHATSAPP_NUMBER = '';
// ===========================================================

const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
const searchInput = document.getElementById('searchInput');
const filterButtons = [...document.querySelectorAll('.filter-btn')];
const productCards = [...document.querySelectorAll('.product-card')];
const resultsCount = document.getElementById('resultsCount');
const emptyResults = document.getElementById('emptyResults');
let selectedCategory = 'todos';
const searchableProducts = productCards.map((card) => ({
    card,
    categories: card.dataset.category.split(/\s+/),
    text: normalize(`${card.dataset.title} ${card.dataset.category} ${card.querySelector('h3').textContent} ${card.querySelector('.card-body p').textContent}`)
}));

function filterProducts() {
    if (!searchInput || !resultsCount || !emptyResults) return;
    const terms = normalize(searchInput.value).split(/\s+/).filter(Boolean);
    let visible = 0;
    searchableProducts.forEach(({ card, categories, text }) => {
        const matches = (selectedCategory === 'todos' || categories.includes(selectedCategory)) && terms.every((term) => text.includes(term));
        card.hidden = !matches;
        if (matches) visible += 1;
    });
    resultsCount.textContent = `${visible} ${visible === 1 ? 'e-book encontrado' : 'e-books encontrados'}.`;
    emptyResults.hidden = visible !== 0;
}

searchInput?.addEventListener('input', filterProducts);
filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        selectedCategory = button.dataset.category;
        filterButtons.forEach((filter) => {
            const active = filter === button;
            filter.classList.toggle('active', active);
            filter.setAttribute('aria-pressed', String(active));
        });
        filterProducts();
    });
});

function configureLink(link, url) {
    link.href = url;
    link.removeAttribute('aria-disabled');
    link.removeAttribute('title');
}

document.querySelectorAll('[data-checkout]').forEach((link) => {
    const configured = CHECKOUT_URLS[link.dataset.checkout];
    if (!configured) return;
    try {
        const url = new URL(configured);
        if (url.protocol === 'https:') configureLink(link, url.href);
    } catch {
        // Uma configuração inválida preserva o href definido no HTML.
    }
});
if (document.getElementById('whatsappLink') && /^55[1-9]\d{9,10}$/.test(WHATSAPP_NUMBER)) {
    const message = 'Olá, vim através da Lojinha Mística e gostaria de saber mais sobre as consultas.';
    configureLink(document.getElementById('whatsappLink'), `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
}

// Não encaminha visitantes para números ou checkouts fictícios.
// O title também identifica o estado antes da configuração dos links.
document.querySelectorAll('a[aria-disabled="true"]').forEach((link) => {
    link.addEventListener('click', (event) => event.preventDefault());
});

// <dialog> gerencia o foco, bloqueia o fundo e permite fechar com Escape.
let previousOverflow = '';
let opener = null;
document.querySelectorAll('[data-modal]').forEach((button) => {
    button.addEventListener('click', () => {
        const modal = document.getElementById(button.dataset.modal);
        if (!modal || modal.open) return;
        opener = button;
        previousOverflow = document.body.style.overflow;
        modal.showModal();
        document.body.style.overflow = 'hidden';
    });
});
document.querySelectorAll('dialog.modal').forEach((modal) => {
    modal.querySelector('.close-modal').addEventListener('click', () => modal.close());
    modal.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab') return;
        const controls = [...modal.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]')];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
    let pointerStartedOutside = false;
    const isOutside = (event) => {
        const rect = modal.getBoundingClientRect();
        return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    };
    modal.addEventListener('pointerdown', (event) => {
        pointerStartedOutside = event.target === modal && isOutside(event);
    });
    modal.addEventListener('click', (event) => {
        if (pointerStartedOutside && event.target === modal && isOutside(event)) modal.close();
        pointerStartedOutside = false;
    });
    modal.addEventListener('close', () => {
        document.body.style.overflow = previousOverflow;
        if (opener?.isConnected) opener.focus();
        opener = null;
    });
});
filterProducts();
