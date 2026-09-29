/**
 * VIRASYA MARKETPLACE — INTERACTION CONTROLLER
 * Handles carousel navigation, wishlist state, cart operations,
 * category filtering, country selector, and interactive feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. STATE MANAGEMENT
    // -------------------------------------------------------------------------
    const state = {
        // Starts empty and is restored from storage on load, so a cart the
        // visitor emptied stays empty after a refresh.
        cart: [],
        wishlist: new Set(),
        currentCurrency: 'INR',
        currencySymbol: '₹',
        currencyRate: 1
    };

    // Cart persistence. Guarded because the site is often opened over file://,
    // where some browsers refuse localStorage.
    const CART_KEY = 'virasya.cart';

    function saveCart() {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
        } catch (e) { /* storage unavailable - cart just won't survive reload */ }
    }

    function loadCart() {
        try {
            const raw = localStorage.getItem(CART_KEY);
            if (!raw) return;
            const saved = JSON.parse(raw);
            if (Array.isArray(saved)) {
                // Drop anything malformed so one bad record can't break the cart.
                state.cart = saved.filter(item =>
                    item && typeof item.id === 'number' && item.name &&
                    typeof item.price === 'number' && Number(item.qty) > 0
                ).map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    img: item.img || '',
                    qty: Number(item.qty)
                }));
            }
        } catch (e) { /* ignore unreadable storage and start empty */ }
    }

    // DOM Elements
    const cartBadge = document.getElementById('cart-badge');
    const btnCart = document.getElementById('btn-cart');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartDrawerItems = document.getElementById('cart-drawer-items');
    const cartDrawerCount = document.getElementById('cart-drawer-count');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const checkoutBtn = document.getElementById('checkout-btn');

    const productsTrack = document.getElementById('products-track');
    const prodPrevBtn = document.getElementById('prod-prev');
    const prodNextBtn = document.getElementById('prod-next');

    const reviewsTrack = document.getElementById('reviews-track');
    const reviewPrevBtn = document.getElementById('review-prev');
    const reviewNextBtn = document.getElementById('review-next');

    const toastContainer = document.getElementById('toast-container');
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterEmail = document.getElementById('newsletter-email');

    const countryBtn = document.getElementById('country-picker-btn');
    const countryDropdown = document.getElementById('country-dropdown');
    const categoryButtons = document.querySelectorAll('.cat-item');

    // Auth wiring. Browsing and adding to the cart are deliberately open to
    // anyone; only the actual purchase is gated. Paths are passed in because
    // auth.js lives in js/ and cannot know this page's folder on its own.
    const auth = window.VirasyaAuth;
    const LOGIN_PAGE = '../login.html';
    const RETURN_TO = 'newproto/newmarketplace.html';

    // -------------------------------------------------------------------------
    // 2. TOAST NOTIFICATION HELPER
    // -------------------------------------------------------------------------
    function showToast(message, icon = '✨') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span style="font-size:16px">${icon}</span> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }

    // -------------------------------------------------------------------------
    // 3. CART SYSTEM
    // -------------------------------------------------------------------------
    let lastRenderedCount = null;

    function updateCartUI() {
        const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
        cartBadge.textContent = totalItems;
        cartDrawerCount.textContent = totalItems;

        // Animate the badge only when the count actually changed, so restoring
        // a saved cart on page load doesn't make it pulse.
        if (lastRenderedCount !== null && lastRenderedCount !== totalItems) {
            cartBadge.classList.add('pop');
            setTimeout(() => cartBadge.classList.remove('pop'), 250);
        }
        lastRenderedCount = totalItems;

        // Render Cart Items
        cartDrawerItems.innerHTML = '';
        let subtotal = 0;

        if (state.cart.length === 0) {
            cartDrawerItems.innerHTML = `
                <div style="text-align: center; padding: 40px 10px; color: #a89482;">
                    <div style="font-size: 32px; margin-bottom: 10px;">🛍️</div>
                    <p style="font-weight: 500;">Your Virasya cart is empty.</p>
                    <p style="font-size: 13px; margin-top: 6px;">Explore our handcrafted treasures to add items!</p>
                </div>
            `;
        } else {
            state.cart.forEach(item => {
                const itemTotal = item.price * item.qty;
                subtotal += itemTotal;

                const row = document.createElement('div');
                row.className = 'cart-item-row';
                row.dataset.id = item.id;
                row.innerHTML = `
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${state.currencySymbol} ${(item.price * state.currencyRate).toLocaleString('en-IN')}</div>
                        <div class="cart-qty-control">
                            <button class="qty-btn minus" data-id="${item.id}" aria-label="Decrease quantity">-</button>
                            <span class="qty-val">${item.qty}</span>
                            <button class="qty-btn plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
                        </div>
                    </div>
                `;
                cartDrawerItems.appendChild(row);
            });
        }

        cartSubtotal.textContent = `${state.currencySymbol} ${(subtotal * state.currencyRate).toLocaleString('en-IN')}`;

        // Every cart change goes through this function, so persisting here
        // covers add, remove and quantity changes in one place.
        saveCart();
    }

    function openCart() {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Restore the previous cart, then paint it. Must run before the first
    // updateCartUI() so the badge and totals reflect what was actually saved.
    loadCart();
    updateCartUI();

    btnCart.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
            countryDropdown.classList.remove('show');
        }
    });

    // Add To Cart Button Handler
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const name = btn.dataset.name;
            const price = parseInt(btn.dataset.price);
            const card = btn.closest('.product-card');
            const img = card ? card.querySelector('.card-img').src : '../assets/images/brass%20diya%20lamp.png';

            const existing = state.cart.find(item => item.id === id);
            if (existing) {
                existing.qty += 1;
            } else {
                state.cart.push({ id, name, price, qty: 1, img });
            }

            updateCartUI();
            showToast(`Added "${name}" to your cart!`, '🛍️');

            // Button micro-animation
            btn.style.transform = 'scale(1.25) rotate(10deg)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
        });
    });

    // Cart Quantity Increment / Decrement
    cartDrawerItems.addEventListener('click', (e) => {
        const plusBtn = e.target.closest('.qty-btn.plus');
        const minusBtn = e.target.closest('.qty-btn.minus');

        if (plusBtn) {
            const id = parseInt(plusBtn.dataset.id);
            const item = state.cart.find(it => it.id === id);
            if (item) {
                item.qty += 1;
                updateCartUI();
            }
        } else if (minusBtn) {
            const id = parseInt(minusBtn.dataset.id);
            const itemIndex = state.cart.findIndex(it => it.id === id);
            if (itemIndex > -1) {
                if (state.cart[itemIndex].qty > 1) {
                    state.cart[itemIndex].qty -= 1;
                } else {
                    const removedName = state.cart[itemIndex].name;
                    state.cart.splice(itemIndex, 1);
                    showToast(`Removed "${removedName}" from cart.`, '🗑️');
                }
                updateCartUI();
            }
        }
    });

    // Checkout Button — the one action that requires an account
    checkoutBtn.addEventListener('click', () => {
        if (state.cart.length === 0) {
            showToast('Your cart is empty. Please add items first.', '⚠️');
            return;
        }
        if (auth && !auth.requireLogin(LOGIN_PAGE, RETURN_TO)) {
            showToast('Please sign in to complete your purchase.', '🔒');
            return;
        }
        showToast('Initiating secure encrypted checkout with Virasya...', '🔒');
        setTimeout(() => {
            closeCart();
            showToast('Order demonstration placed successfully! Thank you.', '🎉');
        }, 1200);
    });

    // -------------------------------------------------------------------------
    // 4. WISHLIST TOGGLE
    // -------------------------------------------------------------------------
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const product = btn.dataset.product || 'Item';
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                state.wishlist.delete(product);
                showToast(`Removed "${product}" from wishlist.`, '🤍');
            } else {
                btn.classList.add('active');
                state.wishlist.add(product);
                showToast(`Added "${product}" to wishlist!`, '❤️');
            }
        });
    });

    // -------------------------------------------------------------------------
    // 5. CAROUSEL CONTROLS (PRODUCTS & TESTIMONIALS)
    // -------------------------------------------------------------------------
    if (prodNextBtn && prodPrevBtn && productsTrack) {
        prodNextBtn.addEventListener('click', () => {
            productsTrack.scrollBy({ left: 320, behavior: 'smooth' });
        });
        prodPrevBtn.addEventListener('click', () => {
            productsTrack.scrollBy({ left: -320, behavior: 'smooth' });
        });
    }

    if (reviewNextBtn && reviewPrevBtn && reviewsTrack) {
        reviewNextBtn.addEventListener('click', () => {
            reviewsTrack.scrollBy({ left: 360, behavior: 'smooth' });
        });
        reviewPrevBtn.addEventListener('click', () => {
            reviewsTrack.scrollBy({ left: -360, behavior: 'smooth' });
        });
    }

    // -------------------------------------------------------------------------
    // 6. CATEGORY FILTER & SELECTION
    // -------------------------------------------------------------------------
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const catName = btn.querySelector('.cat-name').textContent;
            showToast(`Browsing category: ${catName}`, '🏷️');

            // Scroll gently towards featured section
            const featuredSection = document.getElementById('featured-products');
            if (featuredSection) {
                featuredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // View All Categories Button
    const btnViewAllCats = document.getElementById('btn-view-all-cats');
    if (btnViewAllCats) {
        btnViewAllCats.addEventListener('click', () => {
            showToast('Viewing all 36 Indian heritage craft categories.', '🏛️');
        });
    }

    // -------------------------------------------------------------------------
    // 7. NEWSLETTER SUBSCRIPTION
    // -------------------------------------------------------------------------
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterEmail.value.trim();
            if (email) {
                showToast(`Subscribed ${email}! Welcome to the Virasya family.`, '💌');
                newsletterEmail.value = '';
            }
        });
    }

    // -------------------------------------------------------------------------
    // 8. COUNTRY & CURRENCY PICKER
    // -------------------------------------------------------------------------
    if (countryBtn && countryDropdown) {
        countryBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            countryDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!countryBtn.contains(e.target) && !countryDropdown.contains(e.target)) {
                countryDropdown.classList.remove('show');
            }
        });

        countryDropdown.querySelectorAll('.country-option').forEach(opt => {
            opt.addEventListener('click', () => {
                countryDropdown.querySelectorAll('.country-option').forEach(o => o.classList.remove('active'));
                opt.classList.add('active');

                const country = opt.dataset.country;
                const currency = opt.dataset.currency;
                const flag = opt.textContent.split(' ')[0];

                countryBtn.querySelector('.flag-icon').textContent = flag;
                countryBtn.querySelector('.country-name').textContent = country;
                countryDropdown.classList.remove('show');

                showToast(`Preferences updated to ${country} (${currency})`, '🌐');
            });
        });
    }

    // -------------------------------------------------------------------------
    // 9. HEADER SEARCH & ACCOUNT ACTIONS
    // -------------------------------------------------------------------------
    const btnSearch = document.getElementById('btn-search');
    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            const query = prompt('Search Virasya Marketplace (e.g. Diya, Silk, Terracotta, Elephant):', '');
            if (query && query.trim()) {
                showToast(`Searching for "${query.trim()}" across Indian crafts...`, '🔍');
            }
        });
    }

    const btnAccount = document.getElementById('btn-account');
    if (btnAccount) {
        // Reflects the session: signed out offers sign-in, signed in shows who
        // you are and offers sign-out.
        const paintAccountButton = () => {
            const signedIn = auth && auth.isLoggedIn();
            btnAccount.setAttribute('aria-label', signedIn ? `Signed in as ${auth.name()}` : 'Sign in to your account');
            btnAccount.dataset.signedIn = signedIn ? 'true' : 'false';
        };

        paintAccountButton();

        btnAccount.addEventListener('click', () => {
            if (auth && auth.isLoggedIn()) {
                const name = auth.name();
                if (confirm(`Sign out of Virasya?\n\nCurrently signed in as ${name}.`)) {
                    auth.signOut();
                    paintAccountButton();
                    showToast(`Signed out. See you soon, ${name}.`, '👋');
                }
                return;
            }
            location.href = auth ? auth.loginUrl(LOGIN_PAGE, RETURN_TO) : LOGIN_PAGE;
        });
    }

    // Make the gate visible before the click: signed-out visitors are told up
    // front that checkout needs an account.
    const signinNote = document.getElementById('checkout-signin-note');
    if (auth && !auth.isLoggedIn()) {
        if (checkoutBtn) {
            checkoutBtn.dataset.signedOut = 'true';
            checkoutBtn.title = 'Sign in to complete your purchase';
        }
        if (signinNote) { signinNote.hidden = false; }
    }

    // -------------------------------------------------------------------------
    // 10. PRODUCT DETAIL MODAL
    // -------------------------------------------------------------------------
    const productModal = document.getElementById('product-modal');
    const productModalOverlay = document.getElementById('product-modal-overlay');
    const productModalClose = document.getElementById('product-modal-close');
    const modalProductImg = document.getElementById('modal-product-img');
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductTag = document.getElementById('modal-product-tag');
    const modalProductRating = document.getElementById('modal-product-rating');
    const modalProductReviewCount = document.getElementById('modal-product-review-count');
    const modalProductPrice = document.getElementById('modal-product-price');
    const modalProductLocation = document.getElementById('modal-product-location');
    const modalProductDescription = document.getElementById('modal-product-description');
    const modalAddToCart = document.getElementById('modal-add-to-cart');
    const modalAddWishlist = document.getElementById('modal-add-wishlist');

    // Track which product is currently shown in the modal
    let currentModalProductId = 0;

    // Product descriptions for the modal
    const productDescriptions = {
        1: "Handcrafted by skilled artisans of Madhya Pradesh, this brass diya lamp brings a warm, traditional glow to your home. Each piece is meticulously shaped and polished, reflecting centuries of metalworking heritage. Perfect for festivals, daily rituals, or as a decorative accent.",
        2: "Woven with pure silk and adorned with intricate golden zari work, this Banarasi saree is a masterpiece of Uttar Pradesh's legendary weaving tradition. Each saree takes weeks to complete on traditional handlooms, making it a timeless treasure for special occasions.",
        3: "Shaped by hand on the potter's wheel by Rajasthani artisans, this terracotta pot set showcases earthy elegance. The natural clay is fired using age-old techniques, resulting in durable, breathable planters perfect for indoor and outdoor gardens.",
        4: "Carved from sustainably sourced wood by Karnataka's master craftsmen, this elephant sculpture captures the grace and majesty of the beloved animal. Every detail — from the curved trunk to the textured skin — is chiseled by hand with remarkable precision.",
        5: "Painted in the ancient Madhubani style of Bihar, this artwork uses natural dyes and intricate patterns depicting nature, mythology, and folklore. Each brushstroke carries forward a 2,500-year-old artistic tradition passed down through generations of women artists.",
        6: "Handcrafted by Gujarat's tribal silversmiths, this jewellery piece features bold, geometric designs inspired by nature and tribal motifs. Each piece is individually worked, making it a unique adornment that celebrates India's rich tribal metalcraft heritage."
    };

    function openProductModal(productId) {
        const card = document.querySelector(`.product-card[data-id="${productId}"]`);
        if (!card) return;

        currentModalProductId = productId;

        const img = card.querySelector('.card-img');
        const name = card.querySelector('.card-title').textContent;
        const rating = card.querySelector('.rating-score').textContent;
        const reviewCount = card.querySelector('.rating-count').textContent;
        const price = card.querySelector('.card-price').textContent;
        const location = card.querySelector('.card-location').textContent.trim();
        const tag = card.querySelector('.card-tag').textContent;

        modalProductImg.src = img.src;
        modalProductImg.alt = name;
        modalProductName.textContent = name;
        modalProductTag.textContent = tag;
        modalProductRating.textContent = rating;
        modalProductReviewCount.textContent = reviewCount;
        modalProductPrice.textContent = price;
        modalProductLocation.textContent = location;
        modalProductDescription.textContent = productDescriptions[productId] || "A handcrafted treasure from India's skilled artisans.";

        productModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeProductModal() {
        productModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Click on product card to open modal
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open modal if clicking wishlist or add-to-cart buttons
            if (e.target.closest('.wishlist-btn') || e.target.closest('.add-to-cart-btn')) return;
            const productId = parseInt(card.dataset.id);
            openProductModal(productId);
        });
    });

    // Close modal handlers
    productModalClose.addEventListener('click', closeProductModal);
    productModalOverlay.addEventListener('click', (e) => {
        if (e.target === productModalOverlay) closeProductModal();
    });

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && productModalOverlay.classList.contains('active')) {
            closeProductModal();
        }
    });

    // Modal Add to Cart button
    modalAddToCart.addEventListener('click', () => {
        if (currentModalProductId) {
            const name = modalProductName.textContent;
            const priceText = modalProductPrice.textContent.replace(/[^0-9]/g, '');
            const price = parseInt(priceText) || 0;

            const existing = state.cart.find(item => item.id === currentModalProductId);
            if (existing) {
                existing.qty += 1;
            } else {
                const card = document.querySelector(`.product-card[data-id="${currentModalProductId}"]`);
                const img = card ? card.querySelector('.card-img').src : '../assets/images/brass%20diya%20lamp.png';
                state.cart.push({ id: currentModalProductId, name, price, qty: 1, img });
            }
            updateCartUI();
            showToast(`Added "${name}" to your cart!`, '🛍️');
        }

        closeProductModal();
    });

    // Modal Wishlist button
    modalAddWishlist.addEventListener('click', () => {
        const name = modalProductName.textContent;
        if (state.wishlist.has(name)) {
            state.wishlist.delete(name);
            showToast(`Removed "${name}" from wishlist.`, '🤍');
        } else {
            state.wishlist.add(name);
            showToast(`Added "${name}" to wishlist!`, '❤️');
        }
    });

    // Initialize UI
    updateCartUI();
});
