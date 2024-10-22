const BASE_PATH = "http://localhost:8080/"
const BASE_IMAGE_PATH = "/Users/utii/Documents/GitHub/rentacar/";
const jwtToken = localStorage.getItem('jwtToken');

var currentId = 0;
let carList = [];

async function addCar() {
    const fileInput = document.getElementById('carImage');
    const carBrandId = document.getElementById('carBrandId').value;
    const carName = document.getElementById('carName').value;
    const carColor = document.getElementById('carColor').value;
    const carDailyPrice = document.getElementById('carDailyPrice').value;
    const carStock = document.getElementById('carAvailableStock').value;
    const carKm = document.getElementById('carKm').value;
    const carTransmissionType = document.getElementById('carTransmissionType').value;  // Dropdown'dan değer alınıyor
    const carFuelType = document.getElementById('carFuelType').value;  // Dropdown'dan değer alınıyor
    const carActive = document.getElementById('carActive').checked;  // Checkbox durumunu kontrol ediyoruz

    const formData = new FormData();
    console.log("formData")
    formData.append('file', fileInput.files[0]);

    const carData = {
        brandId: carBrandId,
        name: carName,
        color: carColor,
        dailyPrice: carDailyPrice,
        availableCount: carStock,
        km: carKm,
        transmissionType: carTransmissionType,  // Enum değerleri gönderiliyor
        fuelType: carFuelType,  // Enum değerleri gönderiliyor
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
        console.error("error: ", error);
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
    currentId = carId
    const deleteCarModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteCarModal'));
    deleteCarModal.show();
}

function hideModal(modalId) {
    const deleteCarModal = bootstrap.Modal.getOrCreateInstance(document.getElementById(modalId));
    deleteCarModal.hide();
}

function clearModalValues() {
    document.getElementById('carImage').value = '';
    document.getElementById('carBrandId').value = '';
    document.getElementById('carName').value = '';
    document.getElementById('carColor').value = '';
    document.getElementById('carDailyPrice').value = '';
    document.getElementById('carAvailableStock').value = '';
    document.getElementById('carKm').value = '';
    document.getElementById('carTransmissionType').value = '';  // Dropdown'dan değer alınıyor
    document.getElementById('carFuelType').value = '';  // Dropdown'dan değer alınıyor
    document.getElementById('carActive').checked = '';  // Checkbox durumunu kontrol ediyoruz

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
            document.getElementById('updateCarTransmissionType').value = car.transmissionType;  // Dropdown'danROTO alınıyor
            document.getElementById('updateCarFuelType').value = car.fuelType;  // Dropdown'danROTO alınıyor
            document.getElementById('updateCarActive').checked = car.active;
            const updateCarModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('updateCarModal'));
            updateCarModal.show();
        }).catch(error => {
            console.error('Error:', error);
        });
    }

    function saveUpdateCar() {
        const updateCarId = document.getElementById('updateCarId').value
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
            transmissionType: updateCarTransmissionType,  // Enum değerleri gönderiliyor
            fuelType: updateCarFuelType,  // Enum değerleri gönderiliyor
            active: updateCarActive
        };

        const formData = new FormData();
        formData.append('file', feditedSelectedImage = updateCarImage.files[0]);
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

    async function closeUpdateCarModal() {
        console.log("modal close")
        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('updateCarModal'));
        modal.hide();

    }

    document.addEventListener("DOMContentLoaded", async () => {
        await getAllCar();
    });