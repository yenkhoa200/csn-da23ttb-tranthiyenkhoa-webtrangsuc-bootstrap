function register(e) {
    e.preventDefault();

    const name = document.getElementById("textName").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-pass").value.trim();

    if (!name || !email || !password) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.some(u => u.email === email);
    if (exists) {
        alert("Email đã tồn tại!");
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Đăng ký thành công! Vui lòng đăng nhập");

    window.location.href = "login.html";
}
