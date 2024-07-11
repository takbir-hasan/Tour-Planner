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
