'use strict';

// ================= CADASTRAR OFERTAS HOTMART =================
// LINKS: preencha apenas com o checkout individual oficial de cada produto.
// Uma configuração atualiza vitrine, modais, landing page e carrinho.
const CHECKOUT_URLS = Object.freeze({
    'sonhos': 'https://pay.hotmart.com/U108029098A',
    'baralho-7dias': '',
    'curso-baralho': '',
    'banhos-7dias': '',
    'rituais-umbanda': '',
    'protecao-diaria': ''
});
// PREÇOS EM CENTAVOS: 12000 = R$ 120,00. null = preço ainda não definido.
// Para liberar uma oferta, cadastre preço e link nos dois objetos de configuração.
const PRODUCT_PRICES = Object.freeze({
    'sonhos': 12000,
    'baralho-7dias': null,
    'curso-baralho': null,
    'banhos-7dias': null,
    'rituais-umbanda': null,
    'protecao-diaria': null
});
// WHATSAPP MARIAH: país + DDD + número, somente dígitos (ex.: 55DDDNÚMERO).
const WHATSAPP_NUMBER = '5521990669549';
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

const formatPrice = (cents) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
function hasPrice(id) {
    return Number.isSafeInteger(PRODUCT_PRICES[id]) && PRODUCT_PRICES[id] > 0;
}
function isCheckoutReady(value) {
    try {
        const url = new URL(value);
        return url.protocol === 'https:' && url.hostname === 'pay.hotmart.com' && url.pathname !== '/' && !url.href.includes('SEU_LINK');
    } catch {
        return false;
    }
}
function isProductAvailable(id) {
    return hasPrice(id) && isCheckoutReady(CHECKOUT_URLS[id]);
}
document.querySelectorAll('[data-product-price]').forEach((price) => {
    const id = price.dataset.productPrice;
    price.classList.toggle('price-pending', !hasPrice(id));
    if (price.classList.contains('price-box') && hasPrice(id)) {
        const currency = document.createElement('span');
        currency.className = 'currency';
        currency.textContent = 'R$';
        const value = document.createElement('span');
        value.className = 'value';
        value.textContent = formatPrice(PRODUCT_PRICES[id]).replace(/^R\$\s*/, '');
        price.replaceChildren(currency, document.createTextNode(' '), value);
    } else {
        price.textContent = hasPrice(id) ? formatPrice(PRODUCT_PRICES[id]) : 'Preço em breve';
    }
});
document.querySelectorAll('[data-checkout]').forEach((link) => {
    const id = link.dataset.checkout;
    if (isProductAvailable(id)) {
        configureLink(link, CHECKOUT_URLS[id]);
        link.textContent = link.dataset.checkoutLabel || 'Comprar Agora';
    } else {
        link.removeAttribute('href');
        link.setAttribute('aria-disabled', 'true');
        link.title = 'Oferta em breve';
        link.textContent = 'Em breve';
    }
});
document.querySelectorAll('[data-add-to-cart]').forEach((button) => {
    button.disabled = !isProductAvailable(button.dataset.addToCart);
    if (button.disabled) button.textContent = 'Em breve';
});
if (document.getElementById('whatsappLink') && /^55[1-9]\d{9,10}$/.test(WHATSAPP_NUMBER)) {
    const message = 'Olá, Mariah! Vim pela Lojinha Mística e gostaria de saber mais sobre suas consultas de Baralho Cigano. 🔮';
    configureLink(document.getElementById('whatsappLink'), `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
}

// Não encaminha visitantes para números ou checkouts fictícios.
// O title também identifica o estado antes da configuração dos links.
document.querySelectorAll('a[aria-disabled="true"]').forEach((link) => {
    link.addEventListener('click', (event) => event.preventDefault());
});

// <dialog> gerencia o foco, bloqueia o fundo e permite fechar com Escape.
const dialogState = new WeakMap();
function openDialog(modal, trigger) {
    if (!modal || modal.open) return;
    dialogState.set(modal, { overflow: document.body.style.overflow, trigger });
    modal.showModal();
    document.body.style.overflow = 'hidden';
}
document.querySelectorAll('[data-modal]').forEach((button) => {
    button.addEventListener('click', () => {
        const modal = document.getElementById(button.dataset.modal);
        openDialog(modal, button);
    });
});
document.querySelectorAll('dialog.modal, dialog.cart-drawer').forEach((modal) => {
    modal.querySelectorAll('.close-modal, [data-close-dialog]').forEach((button) => {
        button.addEventListener('click', () => modal.close());
    });
    modal.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab') return;
        const controls = [...modal.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]')].filter((element) => element.getClientRects().length);
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
        const state = dialogState.get(modal);
        if (state) {
            document.body.style.overflow = state.overflow;
            if (state.trigger?.isConnected) state.trigger.focus();
            dialogState.delete(modal);
        }
    });
});
filterProducts();

// Valores em centavos. Os checkouts atuais recebem uma unidade por pagamento;
// quantidades maiores são apresentadas como compras individuais, sem parâmetros inventados.
function initializeCart() {
    const drawer = document.getElementById('cartDrawer');
    if (!drawer) return;
    const storageKey = 'lojinha-mistica.cart.v1';
    const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    const products = new Map(productCards.map((card) => {
        return [card.dataset.productId, {
            id: card.dataset.productId,
            title: card.querySelector('h3').textContent,
            price: PRODUCT_PRICES[card.dataset.productId],
            image: card.querySelector('img').getAttribute('src'),
            checkout: CHECKOUT_URLS[card.dataset.productId] || ''
        }];
    }));
    const toggle = document.getElementById('cartToggle');
    const list = document.getElementById('cartItems');
    const options = document.getElementById('cartCheckoutOptions');
    const checkoutLinks = document.getElementById('cartCheckoutLinks');
    const checkoutButton = document.getElementById('cartCheckout');
    const announcement = document.getElementById('cartAnnouncement');
    let cart = [];

    function validateCart(value) {
        if (!Array.isArray(value)) return [];
        const validated = new Map();
        for (const saved of value) {
            // Migra a sacola anterior, que guardava apenas os IDs.
            const id = typeof saved === 'string' ? saved : saved?.id;
            const quantity = typeof saved === 'string' ? 1 : saved?.quantity;
            if (products.has(id) && isProductAvailable(id) && Number.isInteger(quantity) && quantity > 0) {
                validated.set(id, { id, quantity: Math.min(quantity, 99) });
            }
        }
        return [...validated.values()];
    }
    try { cart = validateCart(JSON.parse(localStorage.getItem(storageKey) || '[]')); } catch { /* Armazenamento indisponível: mantém a sacola na sessão. */ }

    function save() {
        try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch { /* A compra continua disponível sem persistência. */ }
    }
    function element(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text) node.textContent = text;
        return node;
    }
    function render() {
        list.replaceChildren();
        checkoutLinks.replaceChildren();
        options.hidden = true;
        document.getElementById('cartEmpty').hidden = cart.length > 0;
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = totalQuantity;
        toggle.setAttribute('aria-label', `Abrir carrinho, ${totalQuantity} ${totalQuantity === 1 ? 'item' : 'itens'}`);
        let subtotal = 0;
        for (const { id, quantity } of cart) {
            const product = products.get(id);
            subtotal += product.price * quantity;
            const row = element('li', 'cart-item');
            row.dataset.cartId = id;
            const image = element('img', 'cart-item-image');
            image.src = product.image;
            image.alt = `Capa de ${product.title}`;
            image.width = 60;
            image.height = 84;
            image.loading = 'lazy';
            image.addEventListener('error', () => { image.hidden = true; }, { once: true });
            const info = element('div', 'cart-item-info');
            info.append(element('h3', '', product.title), element('p', 'cart-item-meta', `PDF · ${currency.format(product.price / 100)} por unidade`));
            const quantityControls = element('div', 'quantity-controls');
            quantityControls.setAttribute('role', 'group');
            quantityControls.setAttribute('aria-label', `Quantidade de ${product.title}`);
            for (const [action, label, symbol, disabled] of [
                ['decrease', 'Diminuir', '−', quantity === 1],
                ['increase', 'Aumentar', '+', quantity === 99]
            ]) {
                const control = element('button', 'quantity-button', symbol);
                control.type = 'button';
                control.dataset.quantityAction = action;
                control.dataset.productId = id;
                control.disabled = disabled;
                control.setAttribute('aria-label', `${label} quantidade de ${product.title}`);
                if (action === 'increase') quantityControls.append(element('span', 'quantity-value', String(quantity)));
                quantityControls.append(control);
            }
            info.append(quantityControls, element('strong', 'cart-item-price', currency.format(product.price * quantity / 100)));
            const remove = element('button', 'cart-remove', 'Remover item');
            remove.type = 'button';
            remove.dataset.removeFromCart = id;
            remove.setAttribute('aria-label', `Remover ${product.title} da sacola`);
            info.append(remove);
            row.append(image, info);
            list.append(row);

            const paymentRow = element('li');
            if (isCheckoutReady(product.checkout)) {
                paymentRow.append(element('p', 'checkout-unit-note', `${product.title} · ${quantity} ${quantity === 1 ? 'unidade' : 'unidades'}`));
                for (let unit = 1; unit <= quantity; unit += 1) {
                    const link = element('a', 'checkout-product-link', `Comprar unidade ${unit} · ${currency.format(product.price / 100)} ↗`);
                    link.href = product.checkout;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    paymentRow.append(link);
                }
            } else {
                paymentRow.append(element('p', 'checkout-pending', `${product.title} — checkout em breve`));
            }
            checkoutLinks.append(paymentRow);
        }
        document.getElementById('cartSubtotal').textContent = currency.format(subtotal / 100);
        const ready = cart.filter(({ id }) => isCheckoutReady(products.get(id).checkout));
        checkoutButton.disabled = ready.length === 0;
        document.getElementById('cartPaymentNote').textContent = !cart.length
            ? 'Escolha seus e-books e ajuste as quantidades.'
            : totalQuantity === 1 && ready.length === 1
                ? 'Pagamento individual: você será direcionada à Hotmart deste e-book.'
                : 'Cada e-book é pago separadamente na Hotmart, por unidade. O total da sacola não é cobrado de uma vez.';
        document.querySelectorAll('[data-add-to-cart]').forEach((button) => {
            const added = cart.some(({ id }) => id === button.dataset.addToCart);
            const available = isProductAvailable(button.dataset.addToCart);
            button.disabled = !available;
            button.textContent = !available ? 'Em breve' : added ? 'Na sacola · Ver sacola' : 'Adicionar à Sacola';
        });
    }

    toggle.addEventListener('click', () => openDialog(drawer, toggle));
    document.querySelectorAll('[data-add-to-cart]').forEach((button) => {
        button.addEventListener('click', () => {
            const id = button.dataset.addToCart;
            if (!products.has(id) || !isProductAvailable(id)) return;
            const added = cart.some((item) => item.id === id);
            if (!added) { cart.push({ id, quantity: 1 }); save(); render(); }
            announcement.textContent = added ? `${products.get(id).title} já está na sacola.` : `${products.get(id).title} adicionado à sacola.`;
            const modal = button.closest('dialog');
            if (modal?.open) {
                const returnTrigger = dialogState.get(modal)?.trigger || toggle;
                modal.addEventListener('close', () => openDialog(drawer, returnTrigger), { once: true });
                modal.close();
            } else {
                openDialog(drawer, button);
            }
        });
    });
    list.addEventListener('click', (event) => {
        const quantityButton = event.target.closest('[data-quantity-action]');
        if (quantityButton) {
            const item = cart.find(({ id }) => id === quantityButton.dataset.productId);
            if (!item) return;
            const action = quantityButton.dataset.quantityAction;
            item.quantity = Math.max(1, Math.min(99, item.quantity + (action === 'increase' ? 1 : -1)));
            save(); render();
            const controls = [...list.querySelectorAll('[data-quantity-action]')].filter((control) => control.dataset.productId === item.id);
            (controls.find((control) => control.dataset.quantityAction === action && !control.disabled) || controls.find((control) => !control.disabled)).focus();
            announcement.textContent = `Quantidade de ${products.get(item.id).title}: ${item.quantity}.`;
            return;
        }
        const button = event.target.closest('[data-remove-from-cart]');
        if (!button) return;
        const index = cart.findIndex(({ id }) => id === button.dataset.removeFromCart);
        if (index < 0) return;
        const title = products.get(cart[index].id).title;
        cart.splice(index, 1);
        save(); render();
        const remaining = list.querySelectorAll('[data-remove-from-cart]');
        (remaining[Math.min(index, remaining.length - 1)] || drawer.querySelector('[data-close-dialog]')).focus();
        announcement.textContent = `${title} removido da sacola.`;
    });
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 1 && cart[0].quantity === 1 && isCheckoutReady(products.get(cart[0].id).checkout)) {
            window.open(products.get(cart[0].id).checkout, '_blank', 'noopener,noreferrer');
        } else {
            options.hidden = false;
            document.getElementById('checkoutOptionsTitle').focus();
            options.scrollIntoView({ block: 'nearest' });
        }
    });
    // Compartilha alterações entre abas sem aceitar preços ou HTML do storage.
    window.addEventListener('storage', (event) => {
        if (event.key !== storageKey && event.key !== null) return;
        try { cart = validateCart(JSON.parse(event.newValue || '[]')); render(); } catch { /* Ignora dados inválidos. */ }
    });
    render();
    save(); // Remove do armazenamento ofertas antigas que ainda não estão disponíveis.
}
initializeCart();
