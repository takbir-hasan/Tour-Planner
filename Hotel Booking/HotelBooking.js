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
              data-hotel-id="${hotel.id}"
              data-hotel-name="${hotel.name}"
              data-hotel-location="${hotel.location}"
              data-checkin-date="${checkinDate || hotel.availableFrom}"
              data-checkout-date="${checkoutDate || hotel.availableTo}"
              data-rating = "${hotel.rating}"
              data-hotel-price="${hotel.price}"
              data-hotel-image="${hotel.image}">
              Book
            </a>
                    
            <a href="#" class="btn btn-warning">Show Reviews</a>
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

       // Debugging output
      /*  console.log('Hotel ID:', hotelId);
       console.log('Hotel Name:', hotelName);
       console.log('Place:', place);
       console.log('Price:', price);
       console.log('Available From:', checkInDate);
       console.log('Available To:', checkOutDate);
       console.log('Available rating: ', rating);
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
        image: hotelImage
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

  fetchTopRatedHotels();
});
