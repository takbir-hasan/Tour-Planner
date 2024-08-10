$(document).ready(function () {
  const apiUrl = '/api/hotels';

  function fetchTopRatedHotels() {
    $.ajax({
      url: apiUrl,
      method: 'GET',
      success: function (response) {
        const topRatedHotels = response.sort((a, b) => b.rating - a.rating).slice(0, 6);
        displaySuggestions(topRatedHotels);
      },
      error: function (error) {
        console.error('Error fetching top-rated hotels:', error);
      },
    });
  }

  function fetchHotels(destination, checkinDate, checkoutDate) {
    $.ajax({
      url: apiUrl,
      method: 'GET',
      success: function (response) {
        const filteredHotels = response.filter(hotel => {
          const isLocationMatch = hotel.location.toLowerCase().includes(destination.toLowerCase());
          const isAvailable = new Date(hotel.availableFrom) <= new Date(checkinDate) && new Date(hotel.availableTo) >= new Date(checkoutDate);
          return isLocationMatch && isAvailable;
        });
        displayResults(filteredHotels, checkinDate, checkoutDate);
      },
      error: function (error) {
        console.error('Error fetching hotel data:', error);
      },
    });
  }

  function displayHotels(container, hotels, checkinDate = null, checkoutDate = null) {
    container.empty();


    if (hotels.length === 0) {
      container.html("<p>No hotels available for the selected criteria.</p>");
      return;
    }

    hotels.forEach(hotel => {
      const hotelCard = `
        <div class="card col-md-4">
          <img src="${hotel.image}" class="card-img-top" alt="${hotel.name}">
          <div class="card-body">
            <h5 class="card-title">${hotel.name}</h5>
            <p class="card-text"><strong>Location:</strong> ${hotel.location}</p>
            <p class="card-text"><strong>Available From: </strong> ${hotel.availableFrom} </p>
            <p class="card-text"><strong>Available To: </strong> ${hotel.availableTo} </p>
            <p class="card-text"><strong>Price:</strong> $${hotel.price}/night</p>
            <p class="card-text"><strong>Rating:</strong> ${hotel.rating}</p>
            <a href="#" class="btn btn-primary book-Btn"
              data-hotel-id="${hotel._id}"
              data-hotel-name="${hotel.name}"
              data-hotel-location="${hotel.location}"
              data-checkin-date="${checkinDate || hotel.availableFrom}"
              data-checkout-date="${checkoutDate || hotel.availableTo}"
              data-rating = "${hotel.rating}"
              data-hotel-price="${hotel.price}"
              data-servant = "${hotel.username}"
              data-hotel-image="${hotel.image}">
              Book
            </a>
                    
            <a href="#" class="btn btn-warning review-btn" data-servant = "${hotel.username}">Show Reviews</a>
          </div>
        </div>
      `;
      container.append(hotelCard);
    });
    const username = "";
    //username = localStorage.getItem('username');
  
    container.on('click', '.book-Btn', function(event) {

      if(!localStorage.getItem('username')) {
        alert("To proceed with your booking, kindly log in.");
        return;
      }
      event.preventDefault();
      const hotelId = $(this).data('hotel-id');
      const hotelName = $(this).data('hotel-name');
      const place = $(this).data('hotel-location');
      const price = $(this).data('hotel-price');
      const checkInDate = $(this).data('checkin-date');
      const checkOutDate = $(this).data('checkout-date');
      const rating = $(this).data('rating');
      const username = localStorage.getItem('username');
      const hotelImage = $(this).data('hotel-image');
      const serviceProvider = $(this).data('servant');

      if(username == serviceProvider) {
        alert("Failed! You Can't Book Yourself");
        return;
      }

       // Debugging output
      /*  console.log('Hotel ID:', hotelId);
       console.log('Hotel Name:', hotelName);
       console.log('Place:', place);
       console.log('Price:', price);
       console.log('Available From:', checkInDate);
       console.log('Available To:', checkOutDate);
       console.log('Available rating: ', rating);
       console.log('Servant: , serviceProvider);
        */
       
  
    // Construct booking data object
      const bookingData = {
        user: username,
        hotelName: hotelName,
        place: place,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        price: price,
        rating:rating,
        image: hotelImage,
        serviceProvider: serviceProvider
      };
      bookData = JSON.stringify(bookingData);
      console.log(bookData);
      
  
      // Example: Make AJAX request to book hotel
      $.ajax({
        url: '/api/hotelBooking/book',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(bookingData),
        success: function(response) {
            alert(`Booking successful!\nHotel: ${response.booking.hotelName}\nCheck-in: ${new Date(response.booking.checkInDate).toLocaleDateString()}\nCheck-out: ${new Date(response.booking.checkOutDate).toLocaleDateString()}`);
            const button = $(event.target);
            button.text('Booked').addClass('disabled').attr('disabled', 'disabled');
      
            //Deleting hotel
            $.ajax({
                url: `/api/hotelBooking/delete/${hotelId}`,
                method: 'DELETE',
                success: function (deleteResponse) {
                    console.log('hotel booking deleted from database:', deleteResponse);
                    const button = $(event.target);
                    button.closest('.card').remove(); // Remove the card from UI
                    button.text('Booked').addClass('disabled').attr('disabled', 'disabled');
                },
                error: function (xhr, status, error) {
                    console.error('Error deleting hotel booking:', error);
                    alert('Failed to delete hotel booking. Please try again later.');
                }
            });
        },
        error: function(xhr, status, error) {
          console.error('Error booking hotel:', error);
          alert('Failed to book hotel. Please try again later.');
        }
      });
      
  
    });
    
  }

  function displaySuggestions(suggestions) {
    const suggestionsContainer = $('#suggestions');
    displayHotels(suggestionsContainer, suggestions);
    suggestionsContainer.show();
  }

  function displayResults(results, checkinDate, checkoutDate) {
    const resultsContainer = $('#results');
    $('#top-destinations-title').hide();
    $('#suggestions').hide();
    displayHotels(resultsContainer, results, checkinDate, checkoutDate);
    resultsContainer.show();
  }

  function fetchPlaceSuggestions(query) {
    $.ajax({
      url: apiUrl,
      method: 'GET',
      success: function (response) {
        const placeSuggestions = response.filter(hotel => hotel.location.toLowerCase().includes(query.toLowerCase()));
        displayPlaceSuggestions(placeSuggestions.map(hotel => hotel.location));
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
    const checkinDate = $('#checkin-date').val();
    const checkoutDate = $('#checkout-date').val();
    if (destination && checkinDate && checkoutDate) {
      fetchHotels(destination, checkinDate, checkoutDate);
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
      url: '/api/hotelBooking/history', // Ensure this matches the route
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

  

  fetchTopRatedHotels();
});
