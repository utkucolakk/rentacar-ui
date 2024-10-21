const jwtToken = localStorage.getItem('jwtToken');
const BASE_PATH = "http://localhost:8080/"

function getAllBrand() {
    fetch(BASE_PATH + "brand", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + jwtToken
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("Failed to get brands, response status: " + response.status);
        }
        return response.json();
    }).then(brands => {
        displayBrands(brands);
    }).catch(error => {
        console.error('Error:', error);
    });
}

function displayBrands(brands) {
    const brandTableBody = document.getElementById('brandTableBody');
    brandTableBody.innerHTML = '';
    brands.forEach(brand => {
        const row = brandTableBody.insertRow();
        row.innerHTML = `
            <td>${brand.id}</td>
            <td>${brand.name}</td>
            <td>
                <button class="btn btn-warning" onclick="updateBrand(${brand.id})">Update</button>
                <button class="btn btn-danger" onclick="deleteBrand(${brand.id})">Delete</button>
            </td>
        `;
    })
}

document.addEventListener("DOMContentLoaded", async () => {
    await getAllBrand();

    //brand add, form listener
    document.getElementById('addBrandBtn').addEventListener('click', function () {
        //form verilerini al
        const brandName = document.getElementById('brandName').value;
        fetch(BASE_PATH + "brand/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            },
            body: JSON.stringify({
                name: brandName
            })
        }).then(response => {
            if (!response.ok) {
                throw new Error("Failed to create brand, response status: " + response.status);
            }
            return response.json();
        }).then(brand => {
            getAllBrand();
        }).catch(error => {
            console.error('Error:', error);
        })
    })
});
