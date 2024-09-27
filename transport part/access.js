$(document).ready(function () {
  const apiUrl = '/api/transports';

  // Function to format date to "yyyy-mm-dd"
  function formatDateToYMD(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // Function to fetch top-rated transports
  function fetchTopRatedTransports() {
    $.ajax({
      url: apiUrl,
      method: 'GET',
      success: function (response) {
        // Sort transports by rating and get the top 6
        const topRatedTransports = response.sort((a, b) => b.rating - a.rating).slice(0, 6);
        displaySuggestions(topRatedTransports);
      },
      error: function (error) {
        console.error('Error fetching top-rated transports:', error);
      },
    });
  }

  // Function to fetch transports based on search parameters
  function fetchTransports(destination, date, passengers) {
    $.ajax({
      url: apiUrl,
      method: 'GET',
      success: function (response) {
          const formattedDate = formatDateToYMD(date);
          const filteredTransports = response.filter(transport => {
              const isLocationMatch = transport.location.toLowerCase().includes(destination.toLowerCase());
              const transportDate = formatDateToYMD(transport.available);
              
              const isAvailable = transportDate === formattedDate;
              console.log('transport:', transport.name, 'Location match:', isLocationMatch, 'date: ', transportDate, 'Date match:', isAvailable); // Debugging output
              return isLocationMatch && isAvailable;
          });
          displayResults(filteredTransports, date, passengers);
      },
      error: function (error) {
        console.error('Error fetching transport data:', error);
      },
    });
  }

  // Function to display transports
  function displayTransports(container, transports, date, passengers) {
    container.empty(); // Clear previous transports

    if (transports.length === 0) {
      container.html("<p>No transports available for the selected criteria.</p>");
      return;
    }

    transports.forEach(transport => {
      const transportCard = `
        <div class="card col-md-4">
          <img src="${transport.image}" class="card-img-top" alt="${transport.name}">
          <div class="card-body">
            <h5 class="card-title">${transport.name}</h5>
            <p class="card-text"><strong>Location:</strong> ${transport.location}</p>
            <p class="card-text"><strong>Available Date:</strong> ${transport.available} </p>
            <p class="card-text"><strong>Price:</strong> $${transport.price}/trip</p>
            <p class="card-text"><strong>Rating:</strong> ${transport.rating}</p>
            <p class="card-text"><strong>Max Passengers:</strong> ${transport.maxPassengers}</p>
            <a href="#" class="btn btn-primary book-Btn"
               data-transport-id="${transport._id}"
               data-transport-name="${transport.name}"
               data-transport-location="${transport.location}"
               data-transport-date="${date || transport.available}"
               data-transport-rating="${transport.rating}"
               data-transport-price="${transport.price}"
               data-transport-passengers="${passengers || transport.maxPassengers}"
               data-servant = "${transport.username}"
               data-transport-image="${transport.image}">
              Book
            </a>
            <a href="#" class="btn btn-warning review-btn " data-servant = "${transport.username}">Show Reviews</a>
          </div>
        </div>
      `;
      container.append(transportCard);
    });

    container.on('click', '.book-Btn', function (event) {
      event.preventDefault();

      if (!localStorage.getItem('username')) {
        alert("To proceed with your booking, kindly log in.");
        return;
      }

      const transportId = $(this).data('transport-id');
      const transportName = $(this).data('transport-name');
      const place = $(this).data('transport-location');
      const price = $(this).data('transport-price');
      const date = $(this).data('transport-date');
      const rating = $(this).data('transport-rating');
      const passengers = $(this).data('transport-passengers');
      const username = localStorage.getItem('username');
      const transportImage = $(this).data('transport-image');
      const serviceProvider = $(this).data('servant');

      if(username == serviceProvider) {
        alert("Failed! You Can't Book Yourself");
        return;
      }

      // Debugging output
     /*  console.log('Transport ID:', transportId);
      console.log('Transport Name:', transportName);
      console.log('Place:', place);
      console.log('Price:', price);
      console.log('Date:', date);
      console.log('Rating:', rating);
      console.log('Passengers:', passengers);
      console.log('servant:', serviceProvider);
    */
      // Construct booking data object
      const bookingData = {
        user: username,
        transportName: transportName,
        place: place,
        date: date,
        passengers: passengers,
        price: price,
        rating: rating,
        image: transportImage,
        serviceProvider: serviceProvider
      };
      // console.log('Stringified Booking Data:', JSON.stringify(bookingData));
     // alert(bookingData.user +" "+ bookingData.transportName +" "+ bookingData.place +" "+ bookingData.date +" "+ bookingData.passengers +" "+ bookingData.price +" "+ bookingData.rating);

      // Example: Make AJAX request to book transport
      $.ajax({

        url: '/api/transportBooking/book', // Endpoint URL on your server
        method: 'POST', // HTTP method
        contentType: 'application/json', // Content type of the request body
        data: JSON.stringify(bookingData), // Data to send, converted to JSON string

        success: function (response) { // Success callback function
          alert(`Booking successful!\nTransport: ${response.booking.transportName}\nDate: ${new Date(response.booking.date).toLocaleDateString()}`);
          const button = $(event.target);
          button.text('Booked').addClass('disabled').attr('disabled', 'disabled');

          //deleting transport
          $.ajax({
              url: `/api/transportBooking/delete/${transportId}`,
              method: 'DELETE',
              success: function (deleteResponse) {
                  // console.log('transport booking deleted from database:', deleteResponse);
                  const button = $(event.target);
                  button.closest('.card').remove(); // Remove the card from UI
                  button.text('Booked').addClass('disabled').attr('disabled', 'disabled');
              },
              error: function (xhr, status, error) {
                  console.error('Error deleting transport booking:', error);
                  alert('Failed to delete transport booking. Please try again later.');
              }
          });

        },
        error: function (xhr, status, error) { // Error callback function
          console.error('Error booking transport:', error);
          alert('Failed to book transport. Please try again later.');
        }
        
      });

    });
  }

  // Function to display top-rated transports
  function displaySuggestions(suggestions) {
    const suggestionsContainer = $('#suggestions');
    displayTransports(suggestionsContainer, suggestions);
    suggestionsContainer.show();
  }

  // Function to display search results
  function displayResults(results, date, passengers) {
    const resultsContainer = $('#results');
    $('#top-destinations-title').hide();
    $('#suggestions').hide();
    displayTransports(resultsContainer, results, date, passengers);
    resultsContainer.show();
  }

  // Function to fetch place suggestions
  function fetchPlaceSuggestions(query) {
    $.ajax({
      url: apiUrl,
      method: 'GET',
      success: function (response) {
        // Filter transports based on place query
        const placeSuggestions = response
          .filter(transport => transport.location.toLowerCase().includes(query.toLowerCase()))
          .map(transport => transport.location);

        // Remove duplicates
        const uniqueSuggestions = [...new Set(placeSuggestions)];

        // Display place suggestions
        displayPlaceSuggestions(uniqueSuggestions);
      },
      error: function (error) {
        console.error('Error fetching place suggestions:', error);
      },
    });
  }

  // Function to display place suggestions
  function displayPlaceSuggestions(suggestions) {
    const datalist = $('#place-suggestions');
    datalist.empty(); // Clear previous suggestions

    suggestions.forEach(suggestion => {
      const option = `<option value="${suggestion}"></option>`;
      datalist.append(option);
    });
  }

  // Event listener for destination input field
  $('#destination').on('input', function () {
    const query = $(this).val();
    if (query.length > 2) { // Fetch suggestions after 3 characters
      fetchPlaceSuggestions(query);
    }
  });

  // Event listener for search button
  $('#search-btn').on('click', function () {
    const destination = $('#destination').val().trim();
    const date = $('#checkin-date').val().trim();
    const passengers = parseInt($('#passengers').val().trim(), 10);

    if (destination && date && !isNaN(passengers)) {
      fetchTransports(destination, date, passengers);
    } else {
      alert('Please fill in all fields correctly.');
    }
  });

  // Event handler for the review button click
$(document).on('click', '.review-btn', function() {
  // Get the service provider from the button's data attribute
  const serviceProvider = $(this).data('servant');
  console.log('Service Provider:', serviceProvider);

  // Make an AJAX call to fetch all hotel booking histories
  $.ajax({
      url: '/api/transportBooking/history', // Ensure this matches the route
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


  // Initial fetch of top-rated transports
  fetchTopRatedTransports();
});
