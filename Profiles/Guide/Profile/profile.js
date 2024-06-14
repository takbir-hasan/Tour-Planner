$(document).ready(function () {
    const apiUrl = 'https://example.com/api'; // Replace with your actual API endpoint

    // Function to fetch profile data
    function fetchProfileData() {
        $.ajax({
            url: `${apiUrl}/profile`,
            method: 'GET',
            success: function (response) {
                displayProfile(response);
            },
            error: function (error) {
                console.error('Error fetching profile data:', error);
            },
        });
    }

    // Function to fetch booking data
    function fetchBookingData() {
        $.ajax({
            url: `${apiUrl}/bookings`,
            method: 'GET',
            success: function (response) {
                displayBookings(response);
            },
            error: function (error) {
                console.error('Error fetching booking data:', error);
            },
        });
    }

    // Function to display profile data
    function displayProfile(data) {
        $('#name').text(data.name);
        $('#hotel').html(`<i class="fas fa-hotel"></i> ${data.hotel}`);
        $('#email').html(`<i class="fas fa-envelope"></i> ${data.email}`);
        $('#phone').html(`<i class="fas fa-phone"></i> ${data.phone}`);
        $('#address').html(`<i class="fas fa-map-marker-alt"></i> ${data.address}`);
        $('#rating').html(`<i class="fas fa-star"></i> Rating: ${data.rating}`);
        $('.profile-photo').attr('src', data.photo);
    }

    // Function to display booking data
    function displayBookings(data) {
        const today = new Date();
        const bookingList = $('#booking-history');
        bookingList.empty();

        data.forEach(booking => {
            const bookingDate = new Date(booking.date);
            const status = bookingDate < today ? 'Completed' : 'Pending';
            const statusClass = status === 'Completed' ? 'text-success' : 'text-warning';

            const bookingItem = `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    Booking Date: ${booking.date}, Customer Name: ${booking.customerName}, Phone: ${booking.phone}
                    <div class="btn-group">
                        <span class="${statusClass}">${status}</span>
                    </div>
                </li>
            `;
            bookingList.append(bookingItem);
        });
    }

    // Fetch data on page load
    fetchProfileData();
    fetchBookingData();
});
