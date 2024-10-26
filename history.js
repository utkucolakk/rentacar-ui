const jwtToken = localStorage.getItem('jwtToken');
const customerId = localStorage.getItem('customerId');
const BASE_PATH = "http://localhost:8080/";

// Tarihi yyyy-mm-dd formatına çevirme
function formatDate(dateString) {
    if (!dateString) return 'N/A';  // Eğer tarih null veya boşsa, 'N/A' göster
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ay 0-11 arasında olduğu için 1 eklenir
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Kullanıcının kiralama geçmişini al
async function fetchRentalHistory() {
    try {
        const response = await fetch(`${BASE_PATH}car-rental/history/${customerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch rental history');
        }

        const rentalHistory = await response.json();
        displayRentalHistory(rentalHistory);
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching rental history.');
    }
}

// Kiralama geçmişini tabloya ekle
function displayRentalHistory(history) {
    const rentalHistoryBody = document.getElementById('rentalHistoryBody');
    rentalHistoryBody.innerHTML = '';

    history.forEach(rental => {
        const formattedStartTime = formatDate(rental.rentalStartTime);
        const formattedEndTime = formatDate(rental.rentalEndTime);

        const row = `
            <tr>
                <td>${rental.carName}</td>
                <td>${formattedStartTime}</td>
                <td>${formattedEndTime}</td>
                <td>${rental.rentalCost}₺</td>
            </tr>
        `;
        rentalHistoryBody.innerHTML += row;
    });
}

// Sayfa yüklendiğinde kiralama geçmişini getir
document.addEventListener('DOMContentLoaded', fetchRentalHistory);
