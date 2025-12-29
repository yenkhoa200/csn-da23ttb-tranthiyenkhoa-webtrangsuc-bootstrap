// Khởi tạo favico
var favico = new Favico({
    animation: 'fade'
});

// Đặt icon kim cương làm favicon
favico.image('../images/lgo.png');


// ================== KHAI BÁO API ==================
const API_URL = "http://localhost:3000/products";
let allProduct = [];
let currentProduct = null; 

// ================== FETCH DATA ==================
async function fetchProducts() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        console.log("DATA API:", data);
        return data; // LẤY ĐÚNG MẢNG
    } catch (error) {
        console.error("Lỗi API:", error);
        return [];
    }
}

// ================== RENDER DANH SÁCH ==================
function renderProductList(products) {
    const productList = document.getElementById("product-list");
    if (!productList) return;

    if (products.length === 0) {
        productList.innerHTML = `
            <p class="text-center text-danger">
                Không có sản phẩm phù hợp
            </p>`;
        return;
    }

    productList.innerHTML = products.map(item => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card h-100 shadow-sm border-0 position-relative">

                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                <div class="card-body text-center">
                    <h6 class="card-title">${item.name}</h6>

                    ${item.original_price ? `
                        <p class="mb-1 text-muted text-decoration-line-through">
                            ${item.original_price.toLocaleString()} VND
                        </p>` : ""}

                    <p class="text-danger fw-bold">
                        ${item.price.toLocaleString()} VND
                    </p>

                    <a href="detail.html?id=${item.id}" 
                       class="btn btn-outline-warning btn-sm">
                        <i class="fa-solid fa-eye"></i> Xem chi tiết
                    </a>
                </div>
            </div>
        </div>
    `).join("");
}

// ================== REALTIME SEARCH ==================
function setupRealtimeSearch() {
    const input = document.getElementById("search-input");
    if (!input) return;

    input.addEventListener("input", () => {
        const keyword = input.value.trim().toLowerCase().trim();

        if (keyword === "") {
            renderProductList(allProduct);
            return;
        }

        const filtered = allProduct.filter(p =>
            p.name.toLowerCase().includes(keyword)
        );

        renderProductList(filtered);
    });
}

// ================== FILTER ==================
function setupFilter() {
    const price1 = document.getElementById("price1");
    const price2 = document.getElementById("price2");
    const price3 = document.getElementById("price3");

    const materials = document.querySelectorAll('input[name="material"]');


    function applyFilter() {
        let filtered = [...allProduct];
        // ===== GIÁ =====
        if (price1?.checked) {
            filtered = filtered.filter(p => p.price < 5000000);
        }
        if (price2?.checked) {
            filtered = filtered.filter(p => p.price >= 5000000 && p.price <= 30000000);
        }
        if (price3?.checked) {
            filtered = filtered.filter(p => p.price > 30000000);
        }

        // ===== VẬT LIỆU =====
        materials.forEach(radio => {
            if (radio.checked) {
                filtered = filtered.filter(p =>
                    p.material?.toLowerCase().trim() === radio.value.toLowerCase()
                );
            }
        });


        renderProductList(filtered);
    }

    [price1, price2, price3].forEach(cb => {
        cb?.addEventListener("change", applyFilter);
    });

    materials.forEach(radio => {
        radio.addEventListener("change", applyFilter);
    });
}

// ================== SLIDER TRANG CHỦ ==================
function renderFeatureSlider(products) {
    const slider = document.getElementById("product-slider");
    if (!slider) return;

    const chunk = 4;
    const slides = [];

    for (let i = 0; i < products.length; i += chunk) {
        slides.push(products.slice(i, i + chunk));
    }

    slider.innerHTML = slides.map((group, index) => `
        <div class="carousel-item ${index === 0 ? "active" : ""}">
            <div class="row justify-content-center py-4">
                ${group.map(item => `
                    <div class="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div class="card h-100 shadow-sm border-0">
                            <img src="${item.image}" class="card-img-top">
                            <div class="card-body text-center">
                                <h6>${item.name}</h6>

                                ${item.original_price ? `
                                    <p class="text-muted text-decoration-line-through">
                                        ${item.original_price.toLocaleString()} VND
                                    </p>` : ""}

                                <p class="text-danger fw-bold">
                                    ${item.price.toLocaleString()} VND
                                </p>

                                <a href="detail.html?id=${item.id}" 
                                   class="btn btn-outline-warning btn-sm">
                                    Xem chi tiết
                                </a>
                            </div>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `).join("");
}

// ================== DETAIL SẢN PHẨM ==================
function renderProductDetail(product) {
    const detail = document.getElementById("product-detail");
    currentProduct=product;

    if (!detail || !product) return;

    detail.innerHTML = `
        <div class="row">
            <div class="col-md-5">
                <img src="${product.image}" class="img-fluid rounded shadow">

                <!-- NÚT MUA -->
                <button id="btn-buy" class="btn btn-warning w-100 mt-3" data-bs-toggle="modal" data-bs-target="#addCartModal">
                    <i class="fa-solid fa-cart-plus"></i>Mua sản phẩm
                </button>

            </div>
            <div class="col-md-7">
                <h3>${product.name}</h3>

                ${product.original_price ? `
                    <p class="text-muted text-decoration-line-through">
                        ${product.original_price.toLocaleString()} VND
                    </p>` : ""}

                <p class="text-danger fs-4 fw-bold">
                    ${product.price.toLocaleString()} VND
                </p>

                <ul class="list-group mt-3">
                    ${Object.entries(product.description || {}).map(([k, v]) => `
                        <li class="list-group-item">
                            <strong>${k}:</strong> ${v}
                        </li>
                    `).join("")}
                </ul>
            </div>
        </div>
    `;
}

// ================== NAVBAR ACTIVE ==================
function setActiveNavbar() {
    const page = window.location.pathname.split("/").pop();
    const home = document.getElementById("nav-home");
    const product = document.getElementById("nav-product");

    home?.classList.remove("active");
    product?.classList.remove("active");

    if (page === "" || page === "index.html") {
        home?.classList.add("active");
    } else {
        product?.classList.add("active");
    }
}

// ================== CATEGORY MENU ==================
function setActiveCategoryMenu() {
    const page = window.location.pathname.split("/").pop();
    const map = {
        "product.html": "all",
        "ring.html": "ring",
        "earrings.html": "ear",
        "necklace.html": "neck",
        "bracelet.html": "bracelet",
        "spmoi.html": "new",
        "bstmoi.html": "bstnew"
    };

    Object.values(map).forEach(id =>
        document.getElementById(id)?.classList.remove("active")
    );

    document.getElementById(map[page])?.classList.add("active");
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exist = cart.find(item => item.id === product.id);

    if (exist) {
        exist.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            material: product.material,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}


//======HIỂN THỊ SỐ LƯỢNG GIỎ HÀNG
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = document.getElementById("cart-count");

    if (!cartCount) return;

    if (cart.length > 0) {
        cartCount.textContent = cart.length;
        cartCount.style.display = "inline-block";
    } else {
        cartCount.style.display = "none";
    }
}



// ================== INIT ==================
async function init() {
    allProduct = await fetchProducts();
    const page = window.location.pathname;

    setActiveNavbar();
    setActiveCategoryMenu();

    updateCartCount();
    setupRealtimeSearch();
    setupFilter();
    // ===== DETAIL =====
    if (page.includes("detail.html")) {
        const id = new URLSearchParams(window.location.search).get("id");
        const product = allProduct.find(p => p.id == id);
        renderProductDetail(product);
        return;
    }

    // ===== CATEGORY =====
    if (page.includes("ring.html")) {
        return renderProductList(allProduct.filter(p => p.category === "Nhẫn"));
    }
    if (page.includes("earrings.html")) {
        return renderProductList(allProduct.filter(p => p.category === "Hoa tai"));
    }
    if (page.includes("necklace.html")) {
        return renderProductList(allProduct.filter(p => p.category === "Vòng cổ"));
    }
    if (page.includes("bracelet.html")) {
        return renderProductList(allProduct.filter(p => p.category === "Vòng tay"));
    }
    if (page.includes("spmoi.html")) {
        return renderProductList(allProduct.filter(p => p.category === "spm"));
    }
    if (page.includes("bstmoi.html")) {
        return renderProductList(allProduct.filter(p => p.category === "bstm"));
    }
    // ===== PRODUCT =====
    if (page.includes("product.html")) {
        renderProductList(allProduct);
    }

    // ===== HOME =====
    if (page.includes("index.html") || page === "/" || page === "") {
        renderFeatureSlider(allProduct.filter(p => p.featured));
        renderProductList(allProduct.slice(0, 8));
    }
}

// ================== AUTO RUN ==================
document.addEventListener("DOMContentLoaded", init);

//======bắt sự kiện nút thêm vào giỏ hàng========
document.addEventListener("click", function (e) {

    // 👉 Nút thêm vào giỏ trong modal
    if (e.target.id === "confirmAddCart") {

        if (!currentProduct) {
            alert("Không tìm thấy sản phẩm!");
            return;
        }

        addToCart(currentProduct);

        alert("Đã thêm sản phẩm vào giỏ hàng!");

        // Đóng modal
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("addCartModal")
        );
        modal.hide();
    }

    // Nút MUA NGAY
    if (e.target.id === "buyCart") {

        if (!currentProduct) {
            alert("Không tìm thấy sản phẩm!");
            return;
        }

        addToCart(currentProduct);

        // Chuyển sang trang giỏ hàng
        window.location.href = "cart.html";
    }
});
