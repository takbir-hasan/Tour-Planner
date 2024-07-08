$(document).ready(function () {
    // Function to fetch top-rated guides
    function fetchTopRatedGuides() {
        const apiUrl = 'api/guides';

        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function (response) {
                // Sort guides by rating and get the top 6
                const topRatedGuides = response.sort((a, b) => b.rating - a.rating).slice(0, 6);
                displaySuggestions(topRatedGuides);
            },
            error: function (error) {
                console.error('Error fetching top-rated guides:', error);
            },
        });
    }

    // Function to fetch guides based on search parameters
    function fetchGuides(destination, date) {
        const apiUrl = 'http://localhost:3000/api/guides';
    
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function (response) {
                // Filter guides based on location and available dates
                const filteredGuides = response.filter(guide => {
                    const guideDates = guide.availableDates.map(date => new Date(date).toISOString().split('T')[0]);
                    const searchDate = new Date(date).toISOString().split('T')[0];
                    return (
                        guide.location.toLowerCase() === destination.toLowerCase() &&
                        guideDates.includes(searchDate)
                    );
                });
    
                // Sort filtered guides by rating
                const sortedGuides = filteredGuides.sort((a, b) => b.rating - a.rating);
    
                // Display filtered and sorted guides
                displayResults(sortedGuides);
            },
            error: function (error) {
                console.error('Error fetching guide data:', error);
            },
        });
    }

    // Function to display guides
    function displayGuides(container, guides) {
        container.empty(); // Clear previous guides
        
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
                        <p class="card-text"><strong>Rating:</strong> ${guide.rating}</p>
                        <p class="card-text"><strong>Price:</strong> ${guide.pricePerDay} BDT</p>
                        <a href="#" class="btn btn-primary">Book</a>
                     <a href="#" class="btn btn-warning">Show Reviews</a>
                    </div>
                </div>
            `;
            container.append(guideCard);
        });
    }

    // Function to display top-rated guides as suggestions
    function displaySuggestions(suggestions) {
        const suggestionsContainer = $('#suggestions');
        displayGuides(suggestionsContainer, suggestions);
        suggestionsContainer.show();
    }

    // Function to display search results
    function displayResults(results) {
        const resultsContainer = $('#results');
        $('#top-destinations-title').hide();
        $('#suggestions').hide();
        displayGuides(resultsContainer, results);
        resultsContainer.show();
    }

    // Function to fetch place suggestions
  function fetchPlaceSuggestions(query) {
    $.ajax({
      url: 'http://localhost:3000/api/guides',
      method: 'GET',
      success: function (response) {
        // Filter guides based on place query
        const placeSuggestions = response.filter(guide =>
          guide.location.toLowerCase().includes(query.toLowerCase())
        );

        // Display place suggestions
        displayPlaceSuggestions(placeSuggestions.map(guide => guide.location));
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
        const date = $('#date').val();
        if (destination && date) {
            fetchGuides(destination, date);
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Initial fetch of top-rated guides
    fetchTopRatedGuides();
});
