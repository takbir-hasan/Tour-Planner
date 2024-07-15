$(document).ready(function () {
    const apiUrl = '/api/guides';

    // Function to format date to "yyyy-mm-dd"
    function formatDateToYMD(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    function fetchTopRatedGuides() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function (response) {
                const topRatedGuides = response.sort((a, b) => b.rating - a.rating).slice(0, 6);
                displaySuggestions(topRatedGuides);
            },
            error: function (error) {
                console.error('Error fetching top-rated guides:', error);
            },
        });
    }

    function fetchGuides(destination, date) {
        console.log("searched Date : " + date);
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function (response) {
                const formattedDate = formatDateToYMD(date);
                const filteredGuides = response.filter(guide => {
                    const isLocationMatch = guide.location.toLowerCase().includes(destination.toLowerCase());
                    const guideDate = formatDateToYMD(guide.available);
                    
                    const isAvailable = guideDate === formattedDate;
                    console.log('Guide:', guide.name, 'Location match:', isLocationMatch, 'date: ', guideDate, 'Date match:', isAvailable); // Debugging output
                    return isLocationMatch && isAvailable;
                });
                displayResults(filteredGuides, date);
            },
            error: function (error) {
                console.error('Error fetching guide data:', error);
            },
        });
    }

    function displayGuides(container, guides, date = null) {
        container.empty();

        if (guides.length === 0) {
            container.html("<p>No guides available for the selected criteria.</p>");
            return;
        }

        guides.forEach(guide => {
            const guideCard = `
                <div class="card col-md-4">
                    <img src="${guide.image}" class="card-img-top" alt="${guide.name}">
                    <div class="card-body">
                        <h5 class="card-title">${guide.name}</h5>
                        <p class="card-text"><strong>Location:</strong> ${guide.location}</p>
                        <p class="card-text"><strong>Available Date:</strong> ${guide.available} </p>
                        <p class="card-text"><strong>Price:</strong> $${guide.price}/day</p>
                        <p class="card-text"><strong>Rating:</strong> ${guide.rating}</p>
                        <a href="#" class="btn btn-primary book-Btn"
                            data-guide-id="${guide._id}"
                            data-guide-name="${guide.name}"
                            data-guide-location="${guide.location}"
                            data-date="${date || guide.available}"
                            data-rating="${guide.rating}"
                            data-guide-price="${guide.price}"
                            data-guide-image="${guide.image}">
                            Book
                        </a>
                        <a href="#" class="btn btn-warning">Show Reviews</a>
                    </div>
                </div>
            `;
            container.append(guideCard);
        });

        container.on('click', '.book-Btn', function (event) {
            event.preventDefault();

            if (!localStorage.getItem('username')) {
                alert("To proceed with your booking, kindly log in.");
                return;
            }

            const guideId = $(this).data('guide-id');
            const guideName = $(this).data('guide-name');
            const place = $(this).data('guide-location');
            const price = $(this).data('guide-price');
            const date = $(this).data('date');
            const rating = $(this).data('rating');
            const username = localStorage.getItem('username');
            const guideImage = $(this).data('guide-image');

            // Debugging output
            console.log('Guide ID:', guideId);
            console.log('Guide Name:', guideName);
            console.log('Place:', place);
            console.log('Price:', price);
            console.log('Date:', date);
            console.log('Rating:', rating);
            //console.log('Guide Image:', guideImage);

            // Construct booking data object
            const bookingData = {
                user: username,
                guideName: guideName,
                place: place,
                date: date,
                price: price,
                rating: rating,
                image: guideImage
            };
            console.log(bookingData);

            // Example: Make AJAX request to book guide
            $.ajax({
                url: '/api/guideBooking/book',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(bookingData),
                success: function (response) {
                    alert(`Booking successful!\nGuide: ${response.booking.guideName}\nDate: ${new Date(response.booking.date).toLocaleDateString()}`);
                    const button = $(event.target);
                    button.text('Booked').addClass('disabled').attr('disabled', 'disabled');
                     // Delete the booked guide from database
                    $.ajax({
                        url: `/api/guideBooking/delete/${guideId}`,
                        method: 'DELETE',
                        success: function (deleteResponse) {
                            console.log('Guide booking deleted from database:', deleteResponse);
                            const button = $(event.target);
                            button.closest('.card').remove(); // Remove the card from UI
                            button.text('Booked').addClass('disabled').attr('disabled', 'disabled');
                        },
                        error: function (xhr, status, error) {
                            console.error('Error deleting guide booking:', error);
                            alert('Failed to delete guide booking. Please try again later.');
                        }
                    });
                },
                error: function (xhr, status, error) {
                    console.error('Error booking guide:', error);
                    alert('Failed to book guide. Please try again later.');
                }
            });
        });
    }

    function displaySuggestions(suggestions) {
        const suggestionsContainer = $('#suggestions');
        displayGuides(suggestionsContainer, suggestions);
        suggestionsContainer.show();
    }

    function displayResults(results, date) {
        const resultsContainer = $('#results');
        $('#top-destinations-title').hide();
        $('#suggestions').hide();
        displayGuides(resultsContainer, results, date);
        resultsContainer.show();
    }

    function fetchPlaceSuggestions(query) {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function (response) {
                const placeSuggestions = response.filter(guide => guide.location.toLowerCase().includes(query.toLowerCase()));
                displayPlaceSuggestions(placeSuggestions.map(guide => guide.location));
            },
            error: function (error) {
                console.error('Error fetching place suggestions:', error);
            },
        });
    }

    function displayPlaceSuggestions(suggestions) {
        const datalist = $('#place-suggestions');
        datalist.empty();

        suggestions.forEach(suggestion => {
            const option = `<option value="${suggestion}"></option>`;
            datalist.append(option);
        });
    }

    $('#destination').on('input', function () {
        const query = $(this).val();
        if (query.length > 2) {
            fetchPlaceSuggestions(query);
        }
    });

    $('#search-btn').on('click', function () {
        const destination = $('#destination').val();
        const date = $('#date').val();
        if (destination && date) {
            fetchGuides(destination, date);
        } else {
            alert('Please fill in all fields.');
        }
    });

    fetchTopRatedGuides();
});
