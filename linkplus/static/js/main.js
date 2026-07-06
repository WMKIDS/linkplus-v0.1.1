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
