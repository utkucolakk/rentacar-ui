const BASE_PATH = "http://localhost:8080/"
const BASE_IMAGE_PATH = "/Users/utii/Documents/GitHub/rentacar/";
const jwtToken = localStorage.getItem('jwtToken');

var currentId = 0;
let carList = [];

// Brand dropdown'larını doldurur
async function getAllBrands() {
    try {
        const response = await fetch(BASE_PATH + "brand", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            }
        });

        if (!response.ok) {
            throw new Error("Failed to get brands, response status: " + response.status);
        }

        const brands = await response.json();
        populateBrandDropdowns(brands);
    } catch (error) {
        console.error("Error fetching brands:", error);
    }
}

// Dropdown'ları doldurur
function populateBrandDropdowns(brands) {
    const carBrandSelect = document.getElementById('carBrandId');
    const updateCarBrandSelect = document.getElementById('updateCarBrandId');

    // Dropdown'ları temizler
    carBrandSelect.innerHTML = '';
    updateCarBrandSelect.innerHTML = '';

    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand.id;
        option.textContent = brand.name;

        carBrandSelect.appendChild(option.cloneNode(true));
        updateCarBrandSelect.appendChild(option.cloneNode(true));
    });
}

async function addCar() {
    const fileInput = document.getElementById('carImage');
    const carBrandId = document.getElementById('carBrandId').value;
    const carName = document.getElementById('carName').value;
    const carColor = document.getElementById('carColor').value;
    const carDailyPrice = document.getElementById('carDailyPrice').value;
    const carStock = document.getElementById('carAvailableStock').value;
    const carKm = document.getElementById('carKm').value;
    const carTransmissionType = document.getElementById('carTransmissionType').value;
    const carFuelType = document.getElementById('carFuelType').value;
    const carActive = document.getElementById('carActive').checked;

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const carData = {
        brandId: carBrandId,
        name: carName,
        color: carColor,
        dailyPrice: carDailyPrice,
        availableCount: carStock,
        km: carKm,
        transmissionType: carTransmissionType,
        fuelType: carFuelType,
        active: carActive
    };

    formData.append('car', new Blob([JSON.stringify(carData)], { type: 'application/json' }));

    await fetch(BASE_PATH + "car/create", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + jwtToken
        },
        body: formData
    }).then(response => {
        if (!response.ok) {
            throw new Error("Failed to add car, response status: " + response.status);
        }
        hideModal('addCarModal');
        clearModalValues();
        getAllCar();
    }).then(data => {
        console.log(data);
    }).catch(error => {
        console.error("Error adding car: ", error);
    });
}

async function getAllCar() {
    try {
        const response = await fetch(BASE_PATH + "car/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            }
        });
        if (!response.ok) {
            throw new Error("Failed to get cars, response status: " + response.status);
        }
        const carList = await response.json();
        console.log("carList: ", carList);
        await renderCarTable(carList);
    } catch (error) {
        console.error("Error fetching cars:", error);
    }
}

async function renderCarTable(carList) {
    const carTableBody = document.getElementById('carTableBody');
    carTableBody.innerHTML = '';

    carList.forEach(car => {
        const row = carTableBody.insertRow();
        row.innerHTML = `
            <td>${car.brandId}</td>
            <td>${car.name}</td>
            <td>${car.color}</td>
            <td>${car.dailyPrice}</td>  
            <td>${car.availableCount}</td>
            <td>${car.km}</td>
            <td>${car.transmissionType}</td>
            <td>${car.fuelType}</td>
            <td><img src="${BASE_IMAGE_PATH}${car.image}" alt="${car.name}" width="100"></td>
            <td>${car.active ? "Active" : "Inactive"}</td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-warning" onclick="updateCar(${car.id})">Update</button>
                    <button class="btn btn-danger" onclick="showDeleteCarModal(${car.id})">Delete</button>
                </div>
            </td>
        `;
    });
}

function showDeleteCarModal(carId) {
    currentId = carId;
    const deleteCarModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteCarModal'));
    deleteCarModal.show();
}

function hideModal(modalId) {
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(modalId));
    modal.hide();
}

function clearModalValues() {
    document.getElementById('carImage').value = '';
    document.getElementById('carBrandId').value = '';
    document.getElementById('carName').value = '';
    document.getElementById('carColor').value = '';
    document.getElementById('carDailyPrice').value = '';
    document.getElementById('carAvailableStock').value = '';
    document.getElementById('carKm').value = '';
    document.getElementById('carTransmissionType').value = '';
    document.getElementById('carFuelType').value = '';
    document.getElementById('carActive').checked = false;
}

function deleteCar() {
    if (currentId !== 0) {
        fetch(BASE_PATH + "car/" + currentId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete car, response status: " + response.status);
            }
            hideModal('deleteCarModal');
            getAllCar();
        }).catch(error => {
            console.error('Error:', error);
        });
    }
}

function updateCar(carId) {
    fetch(BASE_PATH + "car/" + carId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + jwtToken
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("Failed to get car, response status: " + response.status);
        }
        return response.json();
    }).then(car => {
        document.getElementById('updateCarId').value = car.id;
        document.getElementById('updateCarBrandId').value = car.brandId;
        document.getElementById('updateCarName').value = car.name;
        document.getElementById('updateCarColor').value = car.color;
        document.getElementById('updateCarDailyPrice').value = car.dailyPrice;
        document.getElementById('updateCarAvailableStock').value = car.availableCount;
        document.getElementById('updateCarKm').value = car.km;
        document.getElementById('updateCarTransmissionType').value = car.transmissionType;
        document.getElementById('updateCarFuelType').value = car.fuelType;
        document.getElementById('updateCarActive').checked = car.active;
        const updateCarModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('updateCarModal'));
        updateCarModal.show();
    }).catch(error => {
        console.error('Error:', error);
    });
}

function saveUpdateCar() {
    const updateCarId = document.getElementById('updateCarId').value;
    const updateCarBrandId = document.getElementById('updateCarBrandId').value;
    const updateCarName = document.getElementById('updateCarName').value;
    const updateCarColor = document.getElementById('updateCarColor').value;
    const updateCarDailyPrice = document.getElementById('updateCarDailyPrice').value;
    const updateCarAvailableStock = document.getElementById('updateCarAvailableStock').value;
    const updateCarKm = document.getElementById('updateCarKm').value;
    const updateCarTransmissionType = document.getElementById('updateCarTransmissionType').value;
    const updateCarFuelType = document.getElementById('updateCarFuelType').value;
    const updateCarActive = document.getElementById('updateCarActive').checked;

    const updateCarImage = document.getElementById('updateCarImage');
    const carData = {
        id: updateCarId,
        brandId: updateCarBrandId,
        name: updateCarName,
        color: updateCarColor,
        dailyPrice: updateCarDailyPrice,
        availableCount: updateCarAvailableStock,
        km: updateCarKm,
        transmissionType: updateCarTransmissionType,
        fuelType: updateCarFuelType,
        active: updateCarActive
    };

    const formData = new FormData();
    formData.append('file', updateCarImage.files[0]);
    formData.append('car', new Blob([JSON.stringify(carData)], { type: 'application/json' }));

    fetch(BASE_PATH + "car/update", {
        method: "PUT",
        body: formData,
        headers: {
            "Authorization": "Bearer " + jwtToken
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("Failed to update car, response status: " + response.status);
        }
        getAllCar();
        closeUpdateCarModal();
    }).catch(error => {
        console.error('Error:', error);
    });
}

function closeUpdateCarModal() {
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('updateCarModal'));
    modal.hide();
}

document.addEventListener("DOMContentLoaded", async () => {
    await getAllBrands(); // Brand dropdown'larını doldurur
    await getAllCar(); // Araç listesini getirir
});
