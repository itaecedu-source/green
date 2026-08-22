// ================================
// GreenCart Ordering System
// ================================

const products = [
    {
        id: 1,
        name: "Fresh Apples",
        category: "Fruits",
        price: 3.99,
        emoji: "🍎",
        description: "Crisp and naturally sweet."
    },
    {
        id: 2,
        name: "Bananas",
        category: "Fruits",
        price: 2.49,
        emoji: "🍌",
        description: "Fresh ripe bananas."
    },
    {
        id: 3,
        name: "Strawberries",
        category: "Fruits",
        price: 4.99,
        emoji: "🍓",
        description: "Sweet and freshly picked."
    },
    {
        id: 4,
        name: "Oranges",
        category: "Fruits",
        price: 3.49,
        emoji: "🍊",
        description: "Juicy and full of vitamin C."
    },
    {
        id: 5,
        name: "Broccoli",
        category: "Vegetables",
        price: 2.99,
        emoji: "🥦",
        description: "Fresh green broccoli."
    },
    {
        id: 6,
        name: "Carrots",
        category: "Vegetables",
        price: 1.99,
        emoji: "🥕",
        description: "Crunchy fresh carrots."
    },
    {
        id: 7,
        name: "Tomatoes",
        category: "Vegetables",
        price: 2.79,
        emoji: "🍅",
        description: "Fresh garden tomatoes."
    },
    {
        id: 8,
        name: "Avocado",
        category: "Vegetables",
        price: 4.49,
        emoji: "🥑",
        description: "Creamy ripe avocado."
    },
    {
        id: 9,
        name: "Fresh Milk",
        category: "Dairy",
        price: 3.29,
        emoji: "🥛",
        description: "1L fresh whole milk."
    },
    {
        id: 10,
        name: "Cheese",
        category: "Dairy",
        price: 5.49,
        emoji: "🧀",
        description: "Premium natural cheese."
    },
    {
        id: 11,
        name: "Yogurt",
        category: "Dairy",
        price: 2.99,
        emoji: "🥛",
        description: "Creamy natural yogurt."
    },
    {
        id: 12,
        name: "Fresh Bread",
        category: "Bakery",
        price: 2.49,
        emoji: "🍞",
        description: "Soft bread baked fresh."
    },
    {
        id: 13,
        name: "Croissant",
        category: "Bakery",
        price: 3.49,
        emoji: "🥐",
        description: "Buttery French croissant."
    },
    {
        id: 14,
        name: "Donuts",
        category: "Bakery",
        price: 4.99,
        emoji: "🍩",
        description: "Fresh glazed donuts."
    },
    {
        id: 15,
        name: "Orange Juice",
        category: "Drinks",
        price: 4.49,
        emoji: "🧃",
        description: "Fresh orange juice."
    },
    {
        id: 16,
        name: "Mineral Water",
        category: "Drinks",
        price: 1.49,
        emoji: "💧",
        description: "Pure mineral water."
    }
];

let cart = JSON.parse(localStorage.getItem("greencart")) || [];
let currentCategory = "All";

// ================================
// Display Products
// ================================

function displayProducts(list = products) {

    const container = document.getElementById("products");

    if (list.length === 0) {

        container.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:60px;">
                <h3>No products found</h3>
                <p style="color:#6d766f;margin-top:8px;">
                    Try another search or category.
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML = list.map(product => `

        <div class="product-card">

            <div class="product-image">
                ${product.emoji}
            </div>

            <div class="product-info">

                <div class="product-category">
                    ${product.category}
                </div>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-bottom">

                    <div class="price">
                        $${product.price.toFixed(2)}
                    </div>

                    <button
                        class="add-button"
                        onclick="addToCart(${product.id})"
                        title="Add to cart"
                    >
                        +
                    </button>

                </div>

            </div>

        </div>

    `).join("");
}

// ================================
// Add Product
// ================================

function addToCart(productId) {

    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity++;
    } else {

        const product = products.find(p => p.id === productId);

        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCart();

    openCart();
}

// ================================
// Update Cart
// ================================

function updateCart() {

    const container = document.getElementById("cartItems");
    const emptyCart = document.getElementById("emptyCart");

    if (cart.length === 0) {

        container.innerHTML = "";
        emptyCart.style.display = "block";

    } else {

        emptyCart.style.display = "none";

        container.innerHTML = cart.map(item => `

            <div class="cart-item">

                <div class="cart-item-image">
                    ${item.emoji}
                </div>

                <div class="cart-item-info">

                    <h4>${item.name}</h4>

                    <p>$${item.price.toFixed(2)} each</p>

                    <div class="quantity-controls">

                        <button onclick="changeQuantity(${item.id}, -1)">
                            −
                        </button>

                        <strong>${item.quantity}</strong>

                        <button onclick="changeQuantity(${item.id}, 1)">
                            +
                        </button>

                        <button
                            class="remove-item"
                            onclick="removeFromCart(${item.id})"
                        >
                            Remove
                        </button>

                    </div>

                </div>

                <strong>
                    $${(item.price * item.quantity).toFixed(2)}
                </strong>

            </div>

        `).join("");
    }

    calculateTotals();

    const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    document.getElementById("cartCount").textContent = count;
}

// ================================
// Quantity
// ================================

function changeQuantity(productId, amount) {

    const item = cart.find(item => item.id === productId);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }

    saveCart();
    updateCart();
}

// ================================
// Remove
// ================================

function removeFromCart(productId) {

    cart = cart.filter(item => item.id !== productId);

    saveCart();
    updateCart();
}

// ================================
// Totals
// ================================

function calculateTotals() {

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // Free delivery over $50
    const delivery = subtotal === 0
        ? 0
        : subtotal >= 50
            ? 0
            : 4.99;

    const total = subtotal + delivery;

    document.getElementById("subtotal").textContent =
        `$${subtotal.toFixed(2)}`;

    document.getElementById("delivery").textContent =
        delivery === 0 && subtotal > 0
            ? "FREE"
            : `$${delivery.toFixed(2)}`;

    document.getElementById("total").textContent =
        `$${total.toFixed(2)}`;

    document.getElementById("checkoutTotal").textContent =
        `$${total.toFixed(2)}`;
}

// ================================
// Save Cart
// ================================

function saveCart() {

    localStorage.setItem(
        "greencart",
        JSON.stringify(cart)
    );
}

// ================================
// Open Cart
// ================================

function openCart() {

    document.getElementById("cart").classList.add("open");
    document.getElementById("cartOverlay").style.display = "block";

}

// ================================
// Close Cart
// ================================

function closeCart() {

    document.getElementById("cart").classList.remove("open");
    document.getElementById("cartOverlay").style.display = "none";

}

// ================================
// Checkout
// ================================

function openCheckout() {

    if (cart.length === 0) {

        alert("Your cart is empty. Please add some products first.");

        return;
    }

    closeCart();

    document.getElementById("checkoutModal").style.display = "flex";
}

function closeCheckout() {

    document.getElementById("checkoutModal").style.display = "none";

}

// ================================
// Place Order
// ================================

document
    .getElementById("checkoutForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const customerName =
            document.getElementById("customerName").value;

        const customerPhone =
            document.getElementById("customerPhone").value;

        const customerEmail =
            document.getElementById("customerEmail").value;

        const customerAddress =
            document.getElementById("customerAddress").value;

        const paymentMethod =
            document.getElementById("paymentMethod").value;

        const subtotal = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const delivery =
            subtotal >= 50 ? 0 : 4.99;

        const total = subtotal + delivery;

        const order = {

            orderNumber:
                "GC-" +
                Date.now().toString().slice(-8),

            customer: {
                name: customerName,
                phone: customerPhone,
                email: customerEmail,
                address: customerAddress
            },

            paymentMethod: paymentMethod,

            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),

            subtotal: subtotal,
            delivery: delivery,
            total: total,

            date: new Date().toISOString()

        };

        // Save order locally
        const previousOrders =
            JSON.parse(
                localStorage.getItem("greencartOrders")
            ) || [];

        previousOrders.push(order);

        localStorage.setItem(
            "greencartOrders",
            JSON.stringify(previousOrders)
        );

        // Show success
        document.getElementById("orderNumber").textContent =
            order.orderNumber;

        closeCheckout();

        document.getElementById("successModal").style.display =
            "flex";

        // Clear cart
        cart = [];

        saveCart();
        updateCart();

        this.reset();

    });

// ================================
// Success
// ================================

function closeSuccess() {

    document.getElementById("successModal").style.display =
        "none";
}

// ================================
// Search
// ================================

function searchProducts() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();

    let filtered = products;

    if (currentCategory !== "All") {

        filtered = filtered.filter(
            product =>
                product.category === currentCategory
        );
    }

    if (search !== "") {

        filtered = filtered.filter(product =>
            product.name
                .toLowerCase()
                .includes(search)
            ||
            product.description
                .toLowerCase()
                .includes(search)
        );
    }

    displayProducts(filtered);
}

// ================================
// Category Filter
// ================================

function filterCategory(category, button) {

    currentCategory = category;

    document
        .querySelectorAll(".category")
        .forEach(btn =>
            btn.classList.remove("active")
        );

    button.classList.add("active");

    searchProducts();
}

// ================================
// Scroll
// ================================

function scrollToProducts() {

    document
        .getElementById("productsSection")
        .scrollIntoView({
            behavior: "smooth"
        });
}

// ================================
// Initial Load
// ================================

displayProducts();
updateCart();
