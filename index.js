const jwtToken = localStorage.getItem("jwtToken");
const customerId = localStorage.getItem("customerId");
const BASE_PATH = "http://localhost:8080/";
const BASE_IMAGE_PATH = "/Users/utii/Documents/GitHub/rentacar/"

let selectedCarDailyPrice = 0;
let selectedCarId = null;
let selectedBrandId = null;

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
    if (!carId) {
        alert("Araç seçilmedi.");
        return;
    }

    const rentalStartTime = document.getElementById('rentalStartTime').value;
    const rentalEndTime = document.getElementById('rentalEndTime').value;
    const vehiclePickupPoint = document.getElementById('vehiclePickupPoint').value;
    const vehicleDeliveryPoint = document.getElementById('vehicleDeliveryPoint').value;
    const rentalCost = document.getElementById('rentalCost').value;

    // rentalDetails'i swagger yapısına uygun şekilde hazırlıyoruz
    const rentalDetails = {
        customerId: customerId,  // Müşteri ID'si
        carRentalList: [         // carRentalList adında bir liste
            {
                customerId: customerId,  // Müşteri ID'si
                carId: carId,  // Seçilen carId'yi kullanıyoruz
                rentalStartTime: rentalStartTime,
                rentalEndTime: rentalEndTime,
                vehiclePickupPoint: vehiclePickupPoint,
                vehicleDeliveryPoint: vehicleDeliveryPoint,
                rentalCost: parseFloat(rentalCost.replace(/[₺,.]/g, "")),  // Fiyatı sayıya çeviriyoruz
                quantity: 1  // Kiralanan araç adeti (tek bir araç için 1)
            }
        ]
    };

    try {
        const response = await fetch(BASE_PATH + "car-rental", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            },
            body: JSON.stringify(rentalDetails)  // JSON yapısında body gönderiyoruz
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            alert("Hata: " + errorMessage);
            return;
        }

        // İşlem başarılıysa başarı modalını göster
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();

    } catch (error) {
        console.error("Araç kiralanırken hata oluştu: ", error);
        alert("Araç kiralanırken bir hata oluştu.");
    }
}








//--------------------------------------




// Markaları dropdown'a yükleme
function displayBrands(brands) {
    const brandSelect = document.getElementById("brandSelect");
    brandSelect.innerHTML = '<option value="" disabled selected>Select Brand</option>';

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
        // Sütun elemanı oluşturun
        const col = document.createElement("div");
        col.classList.add("col");

        // Kart elemanını oluşturun
        const card = document.createElement("div");
        card.classList.add("card", "h-100");

        // Araba resmi
        const carImage = document.createElement("img");
        carImage.src = BASE_IMAGE_PATH + car.image;
        carImage.alt = car.name;
        carImage.classList.add("card-img-top");
        carImage.style.height = "200px"; // Yükseklik ayarı
        carImage.style.objectFit = "contain"; // Oranı korur

        // Kart gövdesi
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        cardBody.innerHTML = `
            <h5 class="card-title">${car.name}</h5>
            <p><strong>Color:</strong> ${car.color}</p>
            <p><strong>Km:</strong> ${car.km}</p>
            <p><strong>Transmission Type:</strong> ${car.transmissionType}</p>
            <p><strong>Fuel Type:</strong> ${car.fuelType}</p>
            <p><strong>Daily Price:</strong> ${car.dailyPrice}</p>
        `;

        // Kirala butonu
        const rentButton = document.createElement("button");
        rentButton.classList.add("btn", "btn-primary");
        rentButton.textContent = "Rent Car";
        rentButton.onclick = () => openModal(car.id, car.name, car.dailyPrice);

        // Elemanları birleştir
        cardBody.appendChild(rentButton);
        card.appendChild(carImage);
        card.appendChild(cardBody);
        col.appendChild(card);
        carList.appendChild(col);
    });
}


// Modal açma fonksiyonu, seçilen araç bilgilerini modal'a yükler
function openModal(carId, carName, dailyPrice, ) {
    // Araç ismini başlık olarak ayarla
    document.getElementById("rentalModalTitle").innerText = carName;
    
    // Fiyatı modal içinde fiyat bilgisine yazdır
    document.getElementById("carDetails").innerText = `Daily Price: ${dailyPrice}₺`;
    
    // Seçilen aracın günlük fiyatını, ID'sini ve marka ID'sini global değişkenlere atama
    selectedCarDailyPrice = dailyPrice;
    selectedCarId = carId;
    

    // Modal'ı aç
    const rentalModal = new bootstrap.Modal(document.getElementById('rentalModal'));
    rentalModal.show();

    // Her modal açıldığında rentButton için event listener ekleyelim
    document.getElementById('rentButton').addEventListener('click', async function () {
        await rentCar(selectedCarId);  // Burada carId ve brandId'yi fonksiyona geçir
    });
}



// Fiyat hesaplama fonksiyonu
function calculatePrice() {
    // Tarihlerin boş olup olmadığını kontrol edelim
    const rentalStartTimeValue = document.getElementById('rentalStartTime').value;
    const rentalEndTimeValue = document.getElementById('rentalEndTime').value;

    if (!rentalStartTimeValue || !rentalEndTimeValue) {
        alert("Please enter both rental start and end times.");
        return;
    }

    // Tarihleri Date nesnesine çeviriyoruz
    const rentalStartTime = new Date(rentalStartTimeValue);
    const rentalEndTime = new Date(rentalEndTimeValue);

    // Tarihlerin geçerli olup olmadığını kontrol edelim
    if (rentalStartTime >= rentalEndTime) {
        alert("Rental end time must be after the start time.");
        return;
    }

    // Gün farkını hesaplayalım
    const diffTime = rentalEndTime - rentalStartTime;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));  // Gün farkını hesapla

    // Fiyatı hesapla ve göster
    if (selectedCarDailyPrice > 0) {  // selectedCarDailyPrice'ın geçerli bir sayı olduğundan emin olun
        const rentalCost = diffDays * selectedCarDailyPrice;
        document.getElementById('rentalCost').value = `${rentalCost}₺`;  // Fiyatı input alanına yazdır
    } else {
        alert("Invalid daily price for the selected car.");
    }
}


// Kiralama işlemi (simülasyon)


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

    // Fiyat hesaplama butonuna event listener ekle
    document.getElementById('calculatePriceBtn').addEventListener('click', function () {
        calculatePrice();  // calculatePrice fonksiyonu tetiklenecek
    });
});

