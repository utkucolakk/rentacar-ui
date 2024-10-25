const BASE_PATH = "http://localhost:8080/";

function submitForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    fetch(BASE_PATH + "customer/login", {
        method: "POST",
        body: JSON.stringify({
            email: email,
            password: password
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("Email or password is incorrect. Try again.");
        }
        return response.json();
    }).then(data => {
        localStorage.setItem("jwtToken", data.token);
        localStorage.setItem("customerId", data.customerId);

        const role = parseJwt(data.token);

        if (role === "ROLE_ADMIN") {
            window.location.href = "admin.html";
        } else if (role === "ROLE_USER") {
            window.location.href = "index.html";
        }
    }).catch(error => {
        // Hata durumunda modal göster
        showErrorModal(error.message);
    });
}

function parseJwt(token) {
    if (!token) {
        return;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');

    const decodedData = JSON.parse(window.atob(base64));
    return decodedData.authorities[0].authority;
}

// Hata modalını göstermek için fonksiyon
function showErrorModal(message) {
    document.getElementById('errorModalMessage').textContent = message;
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    errorModal.show();
}
