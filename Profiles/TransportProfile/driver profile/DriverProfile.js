// $(document).ready(function () {
//     const apiUrl = 'https://example.com/api'; // Replace with your actual API endpoint

//     // Function to fetch profile data
//     function fetchProfileData() {
//         $.ajax({
//             url: `${apiUrl}/profile`,
//             method: 'GET',
//             success: function (response) {
//                 displayProfile(response);
//             },
//             error: function (error) {
//                 console.error('Error fetching profile data:', error);
//             },
//         });
//     }

//     // Function to fetch booking data
//     function fetchBookingData() {
//         $.ajax({
//             url: `${apiUrl}/bookings`,
//             method: 'GET',
//             success: function (response) {
//                 displayBookings(response);
//             },
//             error: function (error) {
//                 console.error('Error fetching booking data:', error);
//             },
//         });
//     }

//     // Function to display profile data
//     function displayProfile(data) {
//         $('#name').text(data.name);
//         $('#hotel').html(`<i class="fas fa-hotel"></i> ${data.hotel}`);
//         $('#email').html(`<i class="fas fa-envelope"></i> ${data.email}`);
//         $('#phone').html(`<i class="fas fa-phone"></i> ${data.phone}`);
//         $('#address').html(`<i class="fas fa-map-marker-alt"></i> ${data.address}`);
//         $('#rating').html(`<i class="fas fa-star"></i> Rating: ${data.rating}`);
//         $('.profile-photo').attr('src', data.photo);
//     }

//     // Function to display booking data
//     function displayBookings(data) {
//         const today = new Date();
//         const bookingList = $('#booking-history');
//         bookingList.empty();

//         data.forEach(booking => {
//             const bookingDate = new Date(booking.date);
//             const status = bookingDate < today ? 'Completed' : 'Pending';
//             const statusClass = status === 'Completed' ? 'text-success' : 'text-warning';

//             const bookingItem = `
//                 <li class="list-group-item d-flex justify-content-between align-items-center">
//                     Booking Date: ${booking.date}, Customer Name: ${booking.customerName}, Phone: ${booking.phone}
//                     <div class="btn-group">
//                         <span class="${statusClass}">${status}</span>
//                     </div>
//                 </li>
//             `;
//             bookingList.append(bookingItem);
//         });
//     }

//     // Fetch data on page load
//     fetchProfileData();
//     fetchBookingData();
// });
document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/api/users';

    // Function to fetch profile data
    function fetchProfileData(username) {
        fetch(`${apiUrl}?username=${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayProfile(data);
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
            });
    }

    // Function to display profile data
    function displayProfile(data) {
        document.getElementById('name').textContent = data.fullname;
        document.getElementById('email').textContent = data.email;
        document.getElementById('email').innerHTML = `<i class="fas fa-envelope"></i> ${data.email}`;
        document.getElementById('phone').textContent = data.phoneNumber;
        document.getElementById('phone').innerHTML = `<i class="fas fa-phone"></i> ${data.phoneNumber}`;
        document.getElementById('address').textContent = data.address;
        document.getElementById('address').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.address}`;
        const profilePhoto = document.querySelector('.profile-photo');
        profilePhoto.setAttribute('src', data.photo);
    }

    function getUsernameFromStorage() {
        return localStorage.getItem('username');
    }

    function setUsernameInStorage(username) {
        localStorage.setItem('username', username);
    }

    const storedUsername = getUsernameFromStorage();
    if (storedUsername) {
        fetchProfileData(storedUsername);
    } else {
        console.error('Username not found in localStorage.');
    }


        
// function to show data of rating
function fetchData() {
    const username = localStorage.getItem('username');

    if (username) {
        fetch(`/alb?username=${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            Profile(data);
        })
        .catch(error => {
            console.error('Error fetching profile data:', error);
        });
    } else {
        console.error('Username not found in localStorage');
    }
}

function Profile(data) {
    //const hotelElement = document.getElementById('hotel');
    const ratingElement = document.getElementById('rating');

   // hotelElement.innerHTML = `<i class="fas fa-hotel"></i> ${data.name}`;
    ratingElement.innerHTML = `<i class="fas fa-star"></i> Rating: ${data.rating}`;
}

fetchData();

});

// Fetching DataBookingHistory

async function fetchBookingHistory(username) {
    try {
        const response = await fetch(`/api/TransportManagerInfo/${username}`);
        if (response.ok) {
            const bookings = await response.json();
            updateBookingStatus(bookings);
            displayBookingHistory(bookings);
        } else {
            console.error('Failed to fetch booking history:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
// Function to update booking status based on check-out date
function updateBookingStatus(bookings) {
    const currentDate = new Date();

    bookings.forEach(booking => {
        const checkOutDate = new Date(booking.date);
        if (checkOutDate < currentDate) {
            booking.status = "Completed";
        } else {
            booking.status = "Pending";
        }
    });
}

// Displaying DataBookingHistory
function displayBookingHistory(bookings) {
    const bookingHistory = document.getElementById('booking-history');
    if (!bookingHistory) {
        console.error('No element found with ID "booking-history"');
        return;
    }
    bookingHistory.innerHTML = ''; 

    if (Array.isArray(bookings) && bookings.length > 0) {
        bookings.forEach((booking, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

            const bookingText = document.createElement('span');
            bookingText.textContent = `Booking ${index + 1}: Date: ${booking.date}, Customer Name: ${booking.userInfo.fullname}, Phone Number: ${booking.userInfo.phoneNumber}`;

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'btn-group';

            if (booking.status === 'Completed') {
                const statusSpan = document.createElement('span');
                statusSpan.className = 'text-success';
                statusSpan.textContent = 'Completed';
                buttonGroup.appendChild(statusSpan);
            } else {
                const statusSpan = document.createElement('span');
                statusSpan.style.color = 'rgb(248, 198, 2)';
                statusSpan.textContent = 'Pending';
                buttonGroup.appendChild(statusSpan);
            }

            listItem.appendChild(bookingText);
            listItem.appendChild(buttonGroup);
            bookingHistory.appendChild(listItem);
        });
    } else {
        const noBookingMessage = document.createElement('p');
        noBookingMessage.textContent = 'No bookings found.';
        bookingHistory.appendChild(noBookingMessage);
    }
}

const storedUsername = localStorage.getItem('username');

if (storedUsername) {
  fetchBookingHistory(storedUsername);
} else {
  console.error('Username not found in localStorage');
}