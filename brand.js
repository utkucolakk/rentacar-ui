const jwtToken = localStorage.getItem('jwtToken');
const BASE_PATH = "http://localhost:8080/"

var currentBrandId = 0;
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
                <button class="btn btn-warning" onclick="getBrandAndShowModal(${brand.id})">Update</button>
                <button class="btn btn-danger" onclick="showDeleteBrandModal(${brand.id})">Delete</button>
            </td>
        `;
    })
}


function getBrandAndShowModal(brandId) {
    fetch(BASE_PATH + "brand/" + brandId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + jwtToken
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("Failed to get brand, response status: " + response.status);
        }
        return response.json();
    }).then(brand => {
        document.getElementById('updateBrandId').value = brand.id;
        document.getElementById('updateBrandName').value = brand.name;
        const updateBrandModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('updateBrandModal'));
        updateBrandModal.show();
    }).catch(error => {
        console.error('Error:', error);
    });
}

function updateBrand() {
    const brandId = document.getElementById('updateBrandId').value;
    const brandName = document.getElementById('updateBrandName').value;

    bodyData = JSON.stringify({
        id: brandId,
        name: brandName
    })

    fetch(BASE_PATH + "brand/update", {
        method: "PUT",
        body: bodyData,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + jwtToken
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("Failed to put brand, response status: " + response.status);
        }
        return response.json();
    }).then(brand => {
        hideModal('updateBrandModal');
        showSuccesAlert("Brand updated successfully");
        getAllBrand();
    }).catch(error => {
        console.error('Error:', error);
    });
}

function hideModal(modalId) {
    const deleteCarModal = bootstrap.Modal.getOrCreateInstance(document.getElementById(modalId));
    deleteCarModal.hide();
}

function showDeleteBrandModal(brandId) {
    currentBrandId = brandId
    const deleteCarModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteBrandModal'));
    deleteCarModal.show();
}

async function deleteBrand() {
    if (currentBrandId !== 0) {
        try {
            const response = await fetch(BASE_PATH + "brand/" + currentBrandId, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwtToken
                }
            });

            if (response.ok) {
                showSuccesAlert("Brand deleted successfully");
                getAllBrand();
            } else {
                const data = await response.json();
                if (data && data.message) {
                    showFailAlert(data.message);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            showFailAlert("Failed to delete the brand.");
        } finally {
            hideModal('deleteBrandModal');
        }
    }
}

                
           

function showSuccesAlert(message) {
    let alert = document.getElementById('success-alert');
    alert.style.display = 'block';
    alert.style.opacity = 1;
    
    let alertMessage = document.getElementById('succesAlertMessage');
    alertMessage.textContent = message;
    setTimeout(() => {
        let opacity = 1;
        let timer = setInterval(() => {
            if (opacity <= 0.1) {
                clearInterval(timer);
                alert.style.display = 'none';
            }
            alert.style.opacity = opacity;
            opacity -= opacity * 0.1;
        }, 50);
    }, 3000);
}

function showFailAlert(message) {
    let alert = document.getElementById('fail-alert');
    alert.style.display = 'block';
    alert.style.opacity = 1;
    
    let alertMessage = document.getElementById('failAlertMessage');
    alertMessage.textContent = message;
    setTimeout(() => {
        let opacity = 1;
        let timer = setInterval(() => {
            if (opacity <= 0.1) {
                clearInterval(timer);
                alert.style.display = 'none';
            }
            alert.style.opacity = opacity;
            opacity -= opacity * 0.1;
        }, 50);
    }, 3000);
}
   

document.addEventListener("DOMContentLoaded", async () => {
    await getAllBrand();

    //brand add, form listener
    document.getElementById('addBrandBtn').addEventListener('click', function () {
        // Form verilerini al
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
            getAllBrand();  // Tüm markaları yeniden yükle
            showSuccesAlert("Brand added successfully");  // Başarı mesajını göster
        }).catch(error => {
            console.error('Error:', error);
            showFailAlert("Failed to add brand");  // Hata mesajını göster
        });
    });
    

});
