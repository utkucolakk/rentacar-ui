const jwtToken = localStorage.getItem('jwtToken');
const BASE_PATH = "http://localhost:8080/"

let selectedRentalId = null; // Seçili rentalId'yi tutmak için

// Ongoing rentals'ı çekme fonksiyonu
async function fetchOngoingRentals() {
    const jwtToken = localStorage.getItem('jwtToken'); // Token'in tanımlı ve geçerli olduğundan emin olun
    
    try {
        const response = await fetch('http://localhost:8080/car-rental/admin/ongoing-rentals', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}` // JWT token'ini ekleyin
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch ongoing rentals');
        }

        const rentals = await response.json();
        displayOngoingRentals(rentals);
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching ongoing rentals.');
    }
}


// Ongoing rentals'ı tabloya ekleme fonksiyonu
function displayOngoingRentals(rentals) {
    const ongoingRentalsBody = document.getElementById('ongoingRentalsBody');
    ongoingRentalsBody.innerHTML = '';

    rentals.forEach(rental => {
        const row = `
            <tr>
                <td>${rental.carName}</td>
                <td>${rental.customerEmail}</td>
                <td>${rental.rentalStartTime}</td>
                <td>${rental.rentalEndTime}</td>
                <td>${rental.rentalCost}₺</td>
                <td>
                    <button class="btn btn-success" onclick="showConfirmModal(${rental.rentalId})">
                        Received
                    </button>
                </td>
            </tr>
        `;
        ongoingRentalsBody.innerHTML += row;
    });
}

// Modal'ı gösteren fonksiyon
function showConfirmModal(rentalId) {
    selectedRentalId = rentalId; // Seçili rentalId'yi kaydet
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    confirmModal.show();
}


// Teslim Alındı işlemi
async function receiveCar(rentalId) {
    const token = localStorage.getItem('jwtToken');
    try {
        const response = await fetch(`http://localhost:8080/car-rental/admin/receive-car/${rentalId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Backend error message:', errorMessage);
            throw new Error(`Failed to receive car. Status: ${response.status}`);
        }

        alert('Car received successfully!');
        fetchOngoingRentals(); // Listeyi güncelle
    } catch (error) {
        console.error('Error:', error);
        alert('Error receiving car.');
    }
}

// Confirm butonuna tıklanınca tetiklenecek fonksiyon
document.getElementById('confirmReceiveBtn').addEventListener('click', () => {
    if (selectedRentalId) {
        receiveCar(selectedRentalId);
        const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
        confirmModal.hide();
    }
});

// Sayfa yüklendiğinde ongoing rentals'ı çek
document.addEventListener('DOMContentLoaded', fetchOngoingRentals);