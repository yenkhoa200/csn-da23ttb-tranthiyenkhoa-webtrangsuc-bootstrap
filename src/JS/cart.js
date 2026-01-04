

document.addEventListener("DOMContentLoaded", renderCart);

function renderCart() {
    const cartBody = document.getElementById("cart-body");
    const totalPriceEl = document.getElementById("total-price");
    const totalItemEl = document.getElementById("cart-total-item");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    cartBody.innerHTML = "";
    totalItemEl.innerText = cart.length;

    if (cart.length === 0) {
        cartBody.innerHTML = `
            <p class="text-center text-muted">
                Giỏ hàng trống
            </p>
        `;
        totalPriceEl.innerText = "0 VND";
        return;
    }

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartBody.innerHTML += `
            <div class="card mb-4 border-0 border-bottom pb-3">
                <div class="row align-items-center">

                    <!-- ẢNH -->
                    <div class="col-md-2 text-center">
                        <img src="${item.image}" class="img-fluid" style="max-height:120px">
                    </div>

                    <!-- THÔNG TIN -->
                    <div class="col-md-6">
                        <h6 class="fw-bold mb-1">${item.name}</h6>
                        <p class="mb-1">Chất liệu: ${item.material || "Đang cập nhật"}</p>
                        <p class="mb-1">Kích thước: ${item.size || "54"}</p>

                        <div class="mt-2 d-flex gap-3 text-muted small">
                            <!-- ❤️ YÊU THÍCH -->
                            <span role="button" onclick="removeItem(${index})">
                                <i class="fa-regular fa-trash-can"></i> Xóa
                            </span>
                        </div>
                    </div>

                    <!-- GIÁ + SỐ LƯỢNG -->
                    <div class="col-md-4 text-end">
                        <div class="fw-bold fs-5 text-dark mb-2">
                            ${item.price.toLocaleString()}đ
                        </div>

                        <div class="d-inline-flex align-items-center border rounded">
                            <button class="btn btn-sm" onclick="changeQuantity(${index}, -1)">-</button>
                            <span class="px-3">${item.quantity}</span>
                            <button class="btn btn-sm" onclick="changeQuantity(${index}, 1)">+</button>
                        </div>
                    </div>

                </div>
            </div>
        `;
    });

    totalPriceEl.innerText = total.toLocaleString() + " VND";
}

function changeQuantity(index, delta) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].quantity += delta;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

//Xóa
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Xóa 1 sản phẩm theo vị trí
    cart.splice(index, 1);

    // Lưu lại
    localStorage.setItem("cart", JSON.stringify(cart));

    // Render lại giao diện
    renderCart();
}
//xóa toàn bộ
function clearCart() {
    localStorage.removeItem("cart");
    renderCart();
}
