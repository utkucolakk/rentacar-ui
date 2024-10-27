const BASE_PATH = "http://localhost:8080/";
let selectedRentalId = null;

// Ongoing rentals'ı çekme fonksiyonu
async function fetchOngoingRentals() {
    const jwtToken = localStorage.getItem('jwtToken');

    try {
        const response = await fetch(`${BASE_PATH}car-rental/admin/ongoing-rentals`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
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
        const isCompleted = rental.status === 'COMPLETED';
        const row = `
            <tr>
                <td>${rental.carName}</td>
                <td>${rental.customerEmail}</td>
                <td>${rental.rentalStartTime}</td>
                <td>${rental.rentalEndTime}</td>
                <td>${rental.rentalCost}₺</td>
                <td>
                    <button class="btn ${isCompleted ? 'btn-secondary' : 'btn-success'}"
                            ${isCompleted ? 'disabled' : ''}
                            data-id="${rental.rentalId}"
                            onclick="${isCompleted ? '' : 'showConfirmModal(' + rental.rentalId + ')'}">
                        ${isCompleted ? 'Received' : 'Receive'}
                    </button>
                </td>
            </tr>
        `;
        ongoingRentalsBody.innerHTML += row;
    });
}

// Modal'ı gösteren fonksiyon
function showConfirmModal(rentalId) {
    selectedRentalId = rentalId;
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    confirmModal.show();
}

// Teslim Alındı işlemi
async function receiveCar(rentalId) {
    const jwtToken = localStorage.getItem('jwtToken');
    try {
        const response = await fetch(`${BASE_PATH}car-rental/admin/receive-car/${rentalId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to receive car');
        }

        // Statüyü frontend'de de güncelle
        const button = document.querySelector(`button[data-id='${rentalId}']`);
        if (button) {
            button.textContent = "Received";
            button.classList.remove('btn-success');
            button.classList.add('btn-secondary');
            button.setAttribute('disabled', true);
        }

        // Kiralama durumunu yeniden yükleyerek güncelle
        fetchOngoingRentals();
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
