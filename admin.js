const BASE_PATH = "http://localhost:8080/"

const jwtToken = localStorage.getItem('jwtToken');

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
        return response.json();
    }).then(data => {
        console.log(data);
        alert("Car added successfully!");
    }).catch(error => {
        console.error("Error adding car: ", error);
        alert("Error adding car.");
    });
}
