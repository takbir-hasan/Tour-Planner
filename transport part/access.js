$(document).ready(function () {
      const apiUrl = 'https://666949c82e964a6dfed47b5e.mockapi.io/tour-planner/transports';
    
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
            // Filter transports based on place, date, and passenger count
            const filteredTransports = response.filter(transport => {
              return (
                transport.location.toLowerCase().includes(destination.toLowerCase()) &&
                new Date(transport.date) <= new Date(date) &&
                transport.maxPassengers >= passengers
              );
            });
    
            // Display filtered transports
            displayResults(filteredTransports);
          },
          error: function (error) {
            console.error('Error fetching transport data:', error);
          },
        });
      }
    
      // Function to display transports
      function displayTransports(container, transports) {
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
                <p class="card-text"><strong>Price:</strong> $${transport.price}/trip</p>
                <p class="card-text"><strong>Rating:</strong> ${transport.rating}</p>
                <p class="card-text"><strong>Max Passengers:</strong> ${transport.maxPassengers}</p>
              </div>
            </div>
          `;
          container.append(transportCard);
        });
      }
    
      // Function to display top-rated transports
      function displaySuggestions(suggestions) {
        const suggestionsContainer = $('#suggestions');
        displayTransports(suggestionsContainer, suggestions);
        suggestionsContainer.show();
      }
    
      // Function to display search results
      function displayResults(results) {
        const resultsContainer = $('#results');
        $('#top-destinations-title').hide();
        $('#suggestions').hide();
        displayTransports(resultsContainer, results);
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
    
      // Initial fetch of top-rated transports
      fetchTopRatedTransports();
    });
    