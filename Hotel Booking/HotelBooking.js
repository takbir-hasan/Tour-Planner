$(document).ready(function () {
  const apiUrl = 'http://localhost:3000/api/hotels';

  // Function to fetch top-rated hotels
  function fetchTopRatedHotels() {
    $.ajax({
      url: apiUrl,
      method: 'GET',
      success: function (response) {
        // Sort hotels by rating and get the top 6
        const topRatedHotels = response.sort((a, b) => b.rating - a.rating).slice(0, 6);
        displaySuggestions(topRatedHotels);
      },
      error: function (error) {
        console.error('Error fetching top-rated hotels:', error);
      },
    });
  }

  // Function to fetch hotels based on search parameters
  function fetchHotels(destination, checkinDate, checkoutDate) {
    $.ajax({
      url: apiUrl,
      method: 'GET',
      success: function (response) {
        console.log('Response:', response);
        console.log('Destination:', destination);
        console.log('Check-in Date:', checkinDate);
        console.log('Check-out Date:', checkoutDate);

        // Filter hotels based on place and availability
        const filteredHotels = response.filter(hotel => {
          const isLocationMatch = hotel.location.toLowerCase().includes(destination.toLowerCase());
          const isAvailable = new Date(hotel.availableFrom.split('-').join('/')) <= new Date(checkinDate) && new Date(hotel.availableTo.split('-').join('/')) >= new Date(checkoutDate);
          
          console.log('Hotel:', hotel);
          console.log('isLocationMatch:', isLocationMatch);
          console.log('isAvailable:', isAvailable);
          
          return isLocationMatch && isAvailable;
        });

        console.log('Filtered Hotels:', filteredHotels);

        // Display filtered hotels
        displayResults(filteredHotels);
      },
      error: function (error) {
        console.error('Error fetching hotel data:', error);
      },
    });
  }

  // Function to display hotels
  function displayHotels(container, hotels) {
    container.empty(); // Clear previous hotels

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
            <p class="card-text"><strong>Price:</strong> $${hotel.price}/night</p>
            <p class="card-text"><strong>Rating:</strong> ${hotel.rating}</p>
          </div>
        </div>
      `;
      container.append(hotelCard);
    });
  }

  // Function to display top-rated hotels
  function displaySuggestions(suggestions) {
    const suggestionsContainer = $('#suggestions');
    displayHotels(suggestionsContainer, suggestions);
    suggestionsContainer.show();
  }

  // Function to display search results
  function displayResults(results) {
    const resultsContainer = $('#results');
    $('#top-destinations-title').hide();
    $('#suggestions').hide();
    displayHotels(resultsContainer, results);
    resultsContainer.show();
  }

  // Function to fetch place suggestions
  function fetchPlaceSuggestions(query) {
    $.ajax({
      url: apiUrl,
      method: 'GET',
      success: function (response) {
        // Filter hotels based on place query
        const placeSuggestions = response.filter(hotel =>
          hotel.location.toLowerCase().includes(query.toLowerCase())
        );

        // Display place suggestions
        displayPlaceSuggestions(placeSuggestions.map(hotel => hotel.location));
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
    const destination = $('#destination').val();
    const checkinDate = $('#checkin-date').val();
    const checkoutDate = $('#checkout-date').val();
    if (destination && checkinDate && checkoutDate) {
      fetchHotels(destination, checkinDate, checkoutDate);
    } else {
      alert('Please fill in all fields.');
    }
  });

  // Initial fetch of top-rated hotels
  fetchTopRatedHotels();
});
