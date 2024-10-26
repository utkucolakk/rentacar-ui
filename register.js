const BASE_PATH = "http://localhost:8080/"

document.getElementById('registerButton').addEventListener('click', (event) => {
    event.preventDefault(); // Sayfanın yenilenmesini engelle

    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: {
            country: document.getElementById('country').value,
            city: document.getElementById('city').value,
            district: document.getElementById('district').value,
            postCode: document.getElementById('postcode').value,
            addressLine: document.getElementById('address').value
        }
    };

    console.log("Form Data: ", formData);

    fetch(BASE_PATH + "customer/register", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("Registration failed, status code: " + response.status);
        }
        return response.json();
    }).then(data => {
        console.log(data);
        window.location.href = "login.html";
    }).catch(error => {
        console.error(error);
        alert("Registration failed: " + error.message);
    });
});
