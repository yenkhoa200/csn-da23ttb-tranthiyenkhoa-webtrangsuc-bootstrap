/* TẠO USER ẢO (CHẠY 1 LẦN)  */
if (!localStorage.getItem("users")) {
    const users = [
        {
            id: 1,
            name: "User Demo",
            email: "user@gmail.com",
            password: "123456"
        }
    ];
    localStorage.setItem("users", JSON.stringify(users));
}

/*  KIỂM TRA ĐĂNG NHẬP + ĐỔI ICON */
document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const accountIcon = document.getElementById("account-icon");
    const accountBox = document.getElementById("account-box");

    if (!accountIcon || !accountBox) return;

    // CHƯA ĐĂNG NHẬP
    if (!currentUser) return;

    // ĐÃ ĐĂNG NHẬP -> ĐỔI ICON
    accountIcon.innerHTML = `
        <i class="fa-solid fa-user-check text-success"></i>
    `;

    // ĐỔI BOX HOVER
    accountBox.innerHTML = `
        <p class="text-center fw-bold mb-2">
            ${currentUser.name || currentUser.email}
        </p>
        <button class="btn btn-dark w-100" onclick="logout()">
            ĐĂNG XUẤT
        </button>
    `;
});

/*  ĐĂNG XUẤT  */
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}
