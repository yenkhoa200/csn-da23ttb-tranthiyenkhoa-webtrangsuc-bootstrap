// KHAI BÁO ĐƯỜNG DẪN JSON SERVER 
const API_URL = "http://localhost:3000/products";

//  HÀM LẤY DỮ LIỆU SẢN PHẨM 
async function fetchProducts() {
    try {
        const res = await fetch(API_URL);
        return await res.json();
    } catch (error) {
        console.error("API không lấy được dữ liệu", error);
    }
}

// HIỂN THỊ LIST SẢN PHẨM 
function renderProductList(products) {
    const productList = document.getElementById("product-list");
    if (!productList) return;

    productList.innerHTML = products.map(item => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card h-100 shadow-sm border-0">
                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                <div class="card-body text-center">
                    <h6 class="card-title text-dark">${item.name}</h6>
                    <p class="text-danger fw-bold">${item.price.toLocaleString()} VND</p>
                    <a href="./detail.html?id=${item.id}" class="btn btn-outline-primary btn-sm">
                        <i class="fa-solid fa-eye"></i> Xem chi tiết
                    </a>
                </div>
            </div>
        </div>
    `).join("");
}

//  HIỂN THỊ SẢN PHẨM TRONG SLIDER (INDEX) 
function renderFeatureSlider(products) {
    const slider = document.getElementById("product-slider");
    if (!slider) return; // chỉ chạy trên index

    const chunkSize = 4;
    let slides = [];

    // Tách mảng thành từng nhóm 4 SP
    for (let i = 0; i < products.length; i += chunkSize) {
        //slice(i, i + chunkSize))-> cắt mảng thành 4sp và push vào slides 
        slides.push(products.slice(i, i + chunkSize));
    }

    // Render từng slide (mỗi slide 4 SP)
    slider.innerHTML = slides.map((group, index) => `
        <div class="carousel-item ${index === 0 ? "active" : ""}">
            <div class="row justify-content-center py-4">
                ${group.map(item => `
                    <div class="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div class="card shadow-sm border-0 h-100">
                            <img src="${item.image}" class="card-img-top" alt="${item.name}">
                            <div class="card-body text-center">
                                <h6 class="card-title text-dark">${item.name}</h6>
                                <p class="text-danger fw-bold">${item.price.toLocaleString()} VND</p>
                                <a href="./pages/detail.html?id=${item.id}" class="btn btn-outline-warning btn-sm">
                                    <i class="fa-solid fa-eye"></i> Xem chi tiết
                                </a>
                            </div>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `).join("");
}


// HIỂN THỊ CHI TIẾT SẢN PHẨM (detail.html)
function renderProductDetail(product) {
    const detailContainer = document.getElementById("product-detail");
    if (!detailContainer) return; // chỉ chạy trên trang chi tiết

    detailContainer.innerHTML = `
        <div class="row">
            <div class="col-md-5">
                <img src="${product.image}" class="img-fluid rounded shadow" alt="${product.name}">
            </div>
            <div class="col-md-7">
                <h3 class="fw-bold">${product.name}</h3>
                <p class="text-danger fs-4 fw-bold">${product.price.toLocaleString()} VND</p>
                <h5 class="mt-3">Thông tin sản phẩm:</h5>
                <ul class="list-group">
                    ${Object.entries(product.description).map(([key, value]) => `
                        <li class="list-group-item"><strong>${key}: </strong> ${value}</li>
                    `).join("")}
                </ul>
                <button class="btn btn-primary mt-4"><i class="fa-solid fa-cart-shopping"></i> Thêm vào giỏ</button>
            </div>
        </div>
    `;
}

//  HÀM KHỞI CHẠY CHUNG 
async function init() {
    const products = await fetchProducts(); 

    // product.html & index.html đều có product-list
    renderProductList(products);

    // chỉ chạy slider trên index.html
    renderFeatureSlider(products.filter(p => p.featured));  //Hiển thị danh sách + chỉ render slider với sản phẩm có featured=true.

    // detail.html
    const params = new URLSearchParams(window.location.search);
    //Nếu URL có ?id=..., thì vào trang chi tiết
    if (params.has("id")) {
        const id = params.get("id");
        const product = products.find(p => p.id == id);
        if (product) renderProductDetail(product);
    }
}

//  CHẠY 
document.addEventListener("DOMContentLoaded", init);

