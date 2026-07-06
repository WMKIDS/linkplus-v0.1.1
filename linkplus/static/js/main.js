// --- View Switching Logic ---
function switchView(viewId) {
    // Hide all views
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));

    // Show selected view
    const view = document.getElementById(viewId);
    if(view) {
        view.classList.remove('hidden');
    }

    // Update Active Buttons styling
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('bg-brand-500', 'text-white', 'shadow-md');
        btn.classList.add('text-gray-500', 'dark:text-gray-400');
    });

    const activeBtn = document.getElementById('btn-' + viewId);
    if(activeBtn) {
        activeBtn.classList.remove('text-gray-500', 'dark:text-gray-400');
        activeBtn.classList.add('bg-brand-500', 'text-white', 'shadow-md');
    }

    // Specific layout adjustments
    if(viewId === 'merchant-view') {
        // Force dark mode look for POS for better contrast
        document.body.style.backgroundColor = '#111827';
    } else {
        document.body.style.backgroundColor = '';
    }
}

// --- Theme Toggle Logic ---
function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('theme-icon');

    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        if(icon) {
            icon.classList.remove('fa-moon', 'text-gray-300');
            icon.classList.add('fa-sun', 'text-amber-500');
        }
    } else {
        html.classList.add('dark');
        if(icon) {
            icon.classList.remove('fa-sun', 'text-amber-500');
            icon.classList.add('fa-moon', 'text-gray-300');
        }
    }
}

// --- POS Cart Logic (Simulation) ---
let cart = [];

function addToCart(name, price) {
    // Check if exists
    const existing = cart.find(item => item.name === name);
    if(existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    renderCart();

    // Play a subtle sound or visual cue (simulated with CSS pulse in real life)
}

function clearCart() {
    cart = [];
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    if(cart.length === 0) {
        if(container) {
            container.innerHTML = `
                <div class="text-center text-gray-500 mt-10">
                    <i class="fa-solid fa-cart-arrow-down text-4xl mb-3 opacity-20"></i>
                    <p>السلة فارغة، قم بسكان أو اختيار منتج.</p>
                </div>`;
        }
        if(subtotalEl) subtotalEl.innerText = '0 د.ج';
        if(totalEl) totalEl.innerText = '0 د.ج';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        html += `
            <div class="bg-gray-800 border border-gray-700 p-3 rounded-lg flex justify-between items-center animation-fade-in">
                <div class="flex-1">
                    <h5 class="text-white text-sm font-bold truncate pr-2">${item.name}</h5>
                    <div class="text-gray-400 text-xs mt-1">${item.price.toLocaleString()} د.ج</div>
                </div>
                <div class="flex items-center gap-3 bg-gray-900 rounded-lg p-1 border border-gray-700">
                    <button onclick="changeQty(${index}, -1)" class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white bg-gray-800 rounded"><i class="fa-solid fa-minus text-xs"></i></button>
                    <span class="text-white font-bold w-4 text-center">${item.qty}</span>
                    <button onclick="changeQty(${index}, 1)" class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white bg-gray-800 rounded"><i class="fa-solid fa-plus text-xs"></i></button>
                </div>
                <div class="w-20 text-left pl-2">
                    <span class="text-brand-400 font-bold text-sm block">${itemTotal.toLocaleString()}</span>
                </div>
            </div>
        `;
    });

    if(container) container.innerHTML = html;

    // Format numbers nicely
    const formattedTotal = total.toLocaleString() + ' د.ج';
    if(subtotalEl) subtotalEl.innerText = formattedTotal;
    if(totalEl) totalEl.innerText = formattedTotal;
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if(cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    renderCart();
}

// --- Toast Notification ---
let toastTimeout;
function showToast(message) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');

    if(msgEl) msgEl.innerText = message;

    if(toast) {
        toast.classList.remove('translate-y-20', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 3000);
    }

    // Empty cart if checkout clicked
    if(message.includes('الدفع') || message.includes('كريدي')) {
        if(cart.length > 0) clearCart();
    }
}

// --- Admin Interactivity ---
function filterMerchants() {
    const input = document.getElementById('merchant-search').value.toLowerCase();
    const rows = document.querySelectorAll('#merchants-table tbody tr');

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        if (text.includes(input)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function addMerchant(e) {
    e.preventDefault();
    const storeName = document.getElementById('new-store-name').value;
    const merchantName = document.getElementById('new-merchant-name').value;
    const plan = document.getElementById('new-plan').value;

    // Determine plan badge colors
    let planBadge = '';
    if (plan === 'Pro') planBadge = '<span class="px-2.5 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs font-bold">Pro</span>';
    else if (plan === 'Premium') planBadge = '<span class="px-2.5 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-xs font-bold">Premium</span>';
    else planBadge = '<span class="px-2.5 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full text-xs font-bold">Basic</span>';

    const newRow = `
        <tr class="border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
            <td class="px-6 py-4 font-bold text-brand-400">${storeName}</td>
            <td class="px-6 py-4">${merchantName}</td>
            <td class="px-6 py-4">${planBadge}</td>
            <td class="px-6 py-4">
                <span class="flex items-center text-green-500"><div class="h-2.5 w-2.5 rounded-full bg-green-500 ml-2"></div> نشط</span>
            </td>
            <td class="px-6 py-4 text-left">
                <button class="text-gray-400 hover:text-white bg-slate-700 p-2 rounded transition"><i class="fa-solid fa-pen"></i></button>
                <button class="text-red-400 hover:text-white bg-red-900/30 p-2 rounded transition mr-1"><i class="fa-solid fa-lock"></i></button>
            </td>
        </tr>
    `;

    document.querySelector('#merchants-table tbody').insertAdjacentHTML('afterbegin', newRow);
    document.getElementById('add-merchant-modal').classList.add('hidden');
    document.getElementById('add-merchant-form').reset();
    showToast('تمت إضافة التاجر الجديد بنجاح!');
}

// --- Merchant Interactivity ---
function switchMerchantTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.merchant-tab-content').forEach(el => el.classList.add('hidden'));
    // Remove active styles from sidebar buttons
    const sidebarBtns = ['pos', 'inventory', 'debts', 'stats'];
    sidebarBtns.forEach(id => {
        const btn = document.getElementById('tab-' + id);
        if(btn) {
            btn.classList.remove('bg-brand-500/20', 'text-brand-400', 'border-brand-500/50');
            btn.classList.add('text-gray-400', 'border-transparent');
        }
    });

    // Show active tab content
    document.getElementById('merchant-tab-' + tabId).classList.remove('hidden');
    // Set active style for sidebar button
    const activeBtn = document.getElementById('tab-' + tabId);
    activeBtn.classList.remove('text-gray-400', 'border-transparent');
    activeBtn.classList.add('bg-brand-500/20', 'text-brand-400', 'border-brand-500/50', 'border');
}

function filterPOS(category) {
    const items = document.querySelectorAll('.pos-item');
    const btns = document.querySelectorAll('.pos-cat-btn');

    // Update active button
    btns.forEach(btn => {
        if(btn.innerText.trim() === category) {
            btn.classList.add('bg-brand-500', 'text-white');
            btn.classList.remove('bg-gray-800', 'text-gray-300');
        } else {
            btn.classList.remove('bg-brand-500', 'text-white');
            btn.classList.add('bg-gray-800', 'text-gray-300');
        }
    });

    items.forEach(item => {
        if (category === 'الكل' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function searchPOS() {
    const query = document.getElementById('pos-search').value.toLowerCase();
    const items = document.querySelectorAll('.pos-item');

    items.forEach(item => {
        const title = item.querySelector('h4').innerText.toLowerCase();
        if (title.includes(query)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function checkoutPOS(type) {
    if (cart.length === 0) {
        showToast('السلة فارغة. يرجى إضافة منتجات أولاً.');
        return;
    }
    if (type === 'cash') {
        showToast('تم تسجيل الدفع نقداً وطباعة التذكرة بنجاح!');
    } else {
        showToast('تم تحويل الفاتورة إلى ديون الزبون (كريدي).');
    }
}

// --- Shop Interactivity (Customer) ---
let shopCart = [];

function addToShopCart(name, price) {
    const existing = shopCart.find(item => item.name === name);
    if(existing) {
        existing.qty += 1;
    } else {
        shopCart.push({ name, price, qty: 1 });
    }
    updateShopCartBadge();
    renderShopCart();
    showToast(`تم إضافة ${name} إلى السلة!`);
}

function updateShopCartBadge() {
    const badge = document.getElementById('shop-cart-badge');
    const totalItems = shopCart.reduce((sum, item) => sum + item.qty, 0);

    if (totalItems > 0) {
        badge.innerText = totalItems;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function renderShopCart() {
    const container = document.getElementById('shop-cart-items');
    const totalEl = document.getElementById('shop-cart-total-text');

    if(shopCart.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-500 mt-10">
                <i class="fa-solid fa-basket-shopping text-4xl mb-3 opacity-20"></i>
                <p>السلة فارغة حالياً.</p>
            </div>`;
        totalEl.innerText = '0 د.ج';
        return;
    }

    let html = '';
    let total = 0;

    shopCart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        html += `
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-dark-border">
                <div class="flex-1 pr-2">
                    <h5 class="text-sm font-bold text-gray-900 dark:text-white truncate">${item.name}</h5>
                    <p class="text-xs text-brand-500 font-bold mt-1">${item.price.toLocaleString()} د.ج</p>
                </div>
                <div class="flex flex-col items-end gap-2">
                    <div class="flex items-center gap-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded px-2 py-1">
                        <button onclick="changeShopQty(${index}, -1)" class="text-gray-500 hover:text-brand-500 transition"><i class="fa-solid fa-minus text-xs"></i></button>
                        <span class="text-sm font-bold w-4 text-center">${item.qty}</span>
                        <button onclick="changeShopQty(${index}, 1)" class="text-gray-500 hover:text-brand-500 transition"><i class="fa-solid fa-plus text-xs"></i></button>
                    </div>
                    <span class="text-sm font-bold text-gray-900 dark:text-white">${itemTotal.toLocaleString()} د.ج</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    totalEl.innerText = total.toLocaleString() + ' د.ج';
}

function changeShopQty(index, delta) {
    shopCart[index].qty += delta;
    if(shopCart[index].qty <= 0) {
        shopCart.splice(index, 1);
    }
    updateShopCartBadge();
    renderShopCart();
}

function toggleShopCart() {
    const sidebar = document.getElementById('shop-cart-sidebar');
    const overlay = document.getElementById('shop-cart-overlay');

    if (sidebar.classList.contains('translate-x-full')) {
        // Open
        sidebar.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        // Force reflow
        void overlay.offsetWidth;
        overlay.classList.add('opacity-100');
    } else {
        // Close
        sidebar.classList.add('translate-x-full');
        overlay.classList.remove('opacity-100');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}

function checkoutShopCart() {
    if (shopCart.length === 0) {
        showToast('السلة فارغة.');
        return;
    }
    showToast('تم استلام طلبك! سيتم التواصل معك قريباً.');
    shopCart = [];
    updateShopCartBadge();
    renderShopCart();
    toggleShopCart();
}

function filterShop(category) {
    const items = document.querySelectorAll('.shop-item');
    const links = document.querySelectorAll('.shop-nav-link');
    const title = document.getElementById('shop-section-title');

    // Update Links
    links.forEach(link => {
        if(link.innerText.trim() === category || (category === 'الكل' && link.innerText.trim() === 'الرئيسية')) {
            link.classList.add('text-brand-500');
            link.classList.remove('text-gray-500', 'dark:text-gray-400');
        } else {
            link.classList.remove('text-brand-500');
            link.classList.add('text-gray-500', 'dark:text-gray-400');
        }
    });

    // Update Title
    title.innerText = category === 'الكل' ? 'وصل حديثاً' : category;

    // Filter Items
    items.forEach(item => {
        if (category === 'الكل' || item.dataset.category === category || (category === 'تخفيضات' && item.classList.contains('تخفيضات'))) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}
