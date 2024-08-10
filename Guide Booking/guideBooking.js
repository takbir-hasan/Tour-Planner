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
                            data-guide-image="${guide.image}"
                            data-servant = "${guide.username}">
                            Book
                        </a>
                        <a href="#" class="btn btn-warning review-btn" data-servant = "${guide.username}">Show Reviews</a>
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
            const ServiceProvider = $(this).data('servant');

            if(username == ServiceProvider) {
                alert("Failed! You Can't Book Yourself");
                return;
            }

            // Debugging output
            console.log('Guide ID:', guideId);
            console.log('Guide Name:', guideName);
            console.log('Place:', place);
            console.log('Price:', price);
            console.log('Date:', date);
            console.log('Rating:', rating);
            console.log('Service Provide: ' , ServiceProvider);

            //console.log('Guide Image:', guideImage);

            // Construct booking data object
            const bookingData = {
                user: username,
                guideName: guideName,
                place: place,
                date: date,
                price: price,
                rating: rating,
                image: guideImage,
                serviceProvider: ServiceProvider
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

  // Event handler for the review button click
$(document).on('click', '.review-btn', function() {
    // Get the service provider from the button's data attribute
    const serviceProvider = $(this).data('servant');
    console.log('Service Provider:', serviceProvider);
  
    // Make an AJAX call to fetch all hotel booking histories
    $.ajax({
        url: '/api/guideBooking/history', // Ensure this matches the route
        method: 'GET',
        success: function(response) {
            // Filter the histories based on the serviceProvider
            const filteredHistories = response.filter(history => history.serviceProvider === serviceProvider && history.review !== null);
  
            // Display the filtered reviews
            displayReviews(filteredHistories);
        },
        error: function(error) {
            console.error('Error fetching histories:', error);
            $('#reviewModalBody').html('<p>Error fetching reviews. Please try again later.</p>');
            $('#reviewModal').modal('show');
        }
    });
  });
  
  // Event handler for the close button click (if needed, for additional handling)
  $(document).on('click', '.close, .btn-secondary', function() {
    // Optional: Add any specific logic you need when closing the modal
    $('#reviewModal').modal('hide');
  });
  
  // Function to display reviews
  function displayReviews(histories) {
    console.log(histories.length);
    let reviewsHtml = '';
  
    if (histories.length > 0) {
        histories.forEach(history => {
            reviewsHtml += `
              <div class="review-item" style="padding: 10px; border-bottom: 1px solid #ddd;">
                <h4 style = "color: #3383FF"><strong>${history.user}</strong></h3>
                <br>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Rating: </strong>${history.rating}</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Review: </strong>${history.review || 'No review available'}</p>
                <hr>
             </div>
            `;
        });
    } else {
        reviewsHtml = '<p>No reviews found for this service provider.</p>';
    }
  
    // Inject the reviews into the modal body
    $('#reviewModalBody').html(reviewsHtml);
  
    // Show the modal
    $('#reviewModal').modal('show');
  }




    fetchTopRatedGuides();
});
