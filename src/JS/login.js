function login(e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-pass").value.trim();

    if (!email || !password) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        alert("Sai email hoặc mật khẩu!");
        return;
    }

    // ✅ LƯU USER ĐÃ ĐĂNG NHẬP
    localStorage.setItem("currentUser", JSON.stringify(user));

    alert("Đăng nhập thành công!");

    //  VỀ TRANG CHỦ
    window.location.href = "index.html";
}
