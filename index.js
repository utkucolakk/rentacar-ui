const jwtToken = localStorage.getItem("jwtToken");
const BASE_PATH = "http://localhost:8080/";
const BASE_IMAGE_PATH = "/Users/utii/Documents/GitHub/rentacar/";

let selectedCarDailyPrice = 0;

// Pickup Locations'ları backend'den çekmek
async function fetchPickupLocations() {
    try {
        const response = await fetch(BASE_PATH + "car-rental/pickup-points", {  // Backend'de pickup-point endpoint'i
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            }
        });

        if (!response.ok) {
            throw new Error("Failed to get pickup locations, response status: " + response.status);
        }

        const locations = await response.json();
        displayPickupLocations(locations);  // Enum verilerini select kutusuna ekle
    } catch (error) {
        console.error("Error fetching pickup locations: ", error);
    }
}

// Delivery Locations'ları backend'den çekmek
async function fetchDeliveryLocations() {
    try {
        const response = await fetch(BASE_PATH + "car-rental/delivery-points", {  // Backend'de delivery-point endpoint'i
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            }
        });

        if (!response.ok) {
            throw new Error("Failed to get delivery locations, response status: " + response.status);
        }

        const locations = await response.json();
        displayDeliveryLocations(locations);  // Enum verilerini select kutusuna ekle
    } catch (error) {
        console.error("Error fetching delivery locations: ", error);
    }
}

// Pickup locations'ları select kutusuna ekleme
function displayPickupLocations(locations) {
    const pickupLocationSelect = document.getElementById("vehiclePickupPoint");
    pickupLocationSelect.innerHTML = ""; // Önceki seçenekleri temizle

    locations.forEach(location => {
        const option = document.createElement("option");
        option.value = location; // Enum değerini value olarak kullan
        option.text = location; // Enum değerini görünen metin olarak kullan
        pickupLocationSelect.appendChild(option); // Seçenekleri ekle
    });
}

// Delivery locations'ları select kutusuna ekleme
function displayDeliveryLocations(locations) {
    const deliveryLocationSelect = document.getElementById("vehicleDeliveryPoint");
    deliveryLocationSelect.innerHTML = ""; // Önceki seçenekleri temizle

    locations.forEach(location => {
        const option = document.createElement("option");
        option.value = location; // Enum değerini value olarak kullan
        option.text = location; // Enum değerini görünen metin olarak kullan
        deliveryLocationSelect.appendChild(option); // Seçenekleri ekle
    });
}

// Kategorileri backend'den çekmek, api-call
async function fetchBrands() {
    try {
        const response = await fetch(BASE_PATH + "brand", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            }
        });

        if (!response.ok) {
            console.error("response status : " + response.status);
            throw new Error("Failed to get brands, response status: " + response.status);
        }
        const data = await response.json();
        console.log(data);

        displayBrands(data);
    } catch (error) {
        console.error("Error fetching brands: ", error);
      // if (error.status === 403) { TODO status undefined geliyor
            window.location.href = "login.html";
      //  }
    }
}

// Seçilen kategoriye göre araçları backend'den çekmek, api-call
async function fetchCarByBrand(brandId) {
    const endPointUrl = BASE_PATH + "car/brand/" + brandId;

    try {
        const response = await fetch(endPointUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            }
        });

        if (!response.ok) {
            throw new Error("Failed to get cars by brand id, response status : " + response.status);
        }

        const data = await response.json();
        displayCars(data);
    } catch (error) {
        console.error("Error fetching cars: ", error);
        
    }
}

//--------------------------------------
async function rentCar(carId) {
    const rentalStartTime = document.getElementById('rentalStartTime').value;
    const rentalEndTime = document.getElementById('rentalEndTime').value;
    const vehiclePickupPoint = document.getElementById('vehiclePickupPoint').value;
    const vehicleDeliveryPoint = document.getElementById('vehicleDeliveryPoint').value;
    const rentalCost = document.getElementById('rentalCost').value;

    const rentalDetails = {
        carId: carId,
        rentalStartTime: rentalStartTime, // Tarih bilgileri DTO ile uyumlu olacak
        rentalEndTime: rentalEndTime,
        vehiclePickupPoint: vehiclePickupPoint, // Enum değerleri string olarak gönderiliyor
        vehicleDeliveryPoint: vehicleDeliveryPoint,
        rentalCost: rentalCost,
        quantity: 1 // Kiralama adedi (opsiyonel, şimdilik sabit verdim)
    };

    try {
        const response = await fetch(BASE_PATH + "car-rental/rent/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            },
            body: JSON.stringify(rentalDetails)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            alert("Error: " + errorMessage);
            return;
        }

        const successMessage = await response.text();
        alert(successMessage);  // Başarılı mesajı göster

    } catch (error) {
        console.error("Error renting car: ", error);
        alert("An error occurred while renting the car.");
    }
}

//--------------------------------------




// Markaları dropdown'a yükleme
function displayBrands(brands) {
    const brandSelect = document.getElementById("brandSelect");
    brandSelect.innerHTML = ""; // Önceki kategorileri temizle

    brands.forEach(brand => {
        const option = document.createElement("option");
        option.value = brand.id;
        option.text = brand.name;
        brandSelect.appendChild(option);
    });
}

// Araçları sayfada listeleme
function displayCars(cars) {
    const carList = document.getElementById("carList");
    carList.innerHTML = "";
    cars.forEach(car => {
        const carCard = document.createElement("div");
        carCard.classList.add("col-md-6", "mb-4");

        const carImage = document.createElement("img");
        carImage.src = BASE_IMAGE_PATH + car.image;
        carImage.alt = car.name;
        carImage.style.maxWidth = "300px";
        carImage.style.maxHeight = "300px";

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        cardBody.innerHTML = `
            <h5 class="card-title">${car.name}</h5>
            <p> </p>
            <p class="card-test">Color: ${car.color}</p>
            <p class="card-test">Km: ${car.km}</p>
            <p class="card-test">Transmission Type: ${car.transmissionType}</p>
            <p class="card-test">Fuel Type: ${car.fuelType}</p>
            <p class="card-text">Daily Price: ${car.dailyPrice}</p>
            <button class="btn btn-primary" onclick="openModal(${car.id}, '${car.name}', ${car.dailyPrice})">Rent Car</button>
        `;

        carCard.appendChild(carImage);
        carCard.appendChild(cardBody);

        carList.appendChild(carCard);
    });
}

// Modal açma fonksiyonu, seçilen araç bilgilerini modal'a yükler
function openModal(carId, carName, dailyPrice) {
    document.getElementById("rentalModalTitle").innerText = carName;
    document.getElementById("carDetails").innerText = `Daily Price: ${dailyPrice}`;
    selectedCarDailyPrice = dailyPrice;

    // Modal'ı aç
    const rentalModal = new bootstrap.Modal(document.getElementById('rentalModal'));
    rentalModal.show();
}

// Fiyat hesaplama fonksiyonu
function calculatePrice() {
    const rentalStartTime = new Date(document.getElementById('rentalStartTime').value);
    const rentalEndTime = new Date(document.getElementById('rentalEndTime').value);

    if (!rentalStartTime || !rentalEndTime || rentalStartTime >= rentalEndTime) {
        alert("Please select valid dates.");
        return;
    }

    const diffTime = Math.abs(rentalEndTime - rentalStartTime);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const rentalCost = diffDays * selectedCarDailyPrice;
    document.getElementById('rentalCost').value = `${rentalCost}₺`;
}

// Kiralama işlemi (simülasyon)
function rentCar() {
    alert("Car rented successfully!");
}

document.addEventListener("DOMContentLoaded", async function () {
    // Pickup ve Dropoff location'larını yükle
    await fetchPickupLocations();
    await fetchDeliveryLocations();

    // Kategorileri yükle
    await fetchBrands();

    // Kategori seçimini dinle ve araçları yükle
    const brandSelect = document.getElementById("brandSelect");
    brandSelect.addEventListener("change", async function () {
        await fetchCarByBrand(brandSelect.value);
    });
});
