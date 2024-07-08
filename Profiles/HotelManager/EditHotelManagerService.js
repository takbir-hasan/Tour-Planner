$(document).ready(function() {
    const apiUrl = 'https://example.com/api/services'; // Replace with your actual API endpoint

    // Fetch existing service data and prefill the form
    $.ajax({
        url: apiUrl,
        method: 'GET',
        success: function(response) {
            $('#hotel-name').val(response.hotelName);
            $('#location').val(response.location);
            $('#price').val(response.price);
            $('#image').attr('src', response.image);
        },
        error: function(error) {
            console.error('Error fetching service data:', error);
        }
    });

    // Handle form submission
    $('#edit-services-form').on('submit', function(e) {
        e.preventDefault();

        const updatedData = {
            hotelName: $('#hotel-name').val(),
            location: $('#location').val(),
            price: $('#price').val(),
            image:$('image').val()
        };

        $.ajax({
            url: apiUrl,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedData),
            success: function(response) {
                alert('Services updated successfully!');
                window.location.href = 'HotelManagerProfile.html'; // Redirect to the profile page
            },
            error: function(error) {
                console.error('Error updating services:', error);
            }
        });
    });
});
