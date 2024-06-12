$(document).ready(function () {
      // Function to fetch top-rated hotels
      function fetchTopRatedHotels() {
        const apiUrl = 'https://666949c82e964a6dfed47b5e.mockapi.io/tour-planner/hotels';
    
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
        const apiUrl = 'https://666949c82e964a6dfed47b5e.mockapi.io/tour-planner/hotels';
    
        $.ajax({
          url: apiUrl,
          method: 'GET',
          success: function (response) {
            // Filter hotels based on place and availability
            const filteredHotels = response.filter(hotel => {
              return (
                hotel.location.toLowerCase().includes(destination.toLowerCase()) &&
                new Date(hotel.availableFrom) <= new Date(checkinDate) &&
                new Date(hotel.availableTo) >= new Date(checkoutDate)
              );
            });
    
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
    