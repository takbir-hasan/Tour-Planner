$(document).ready(function () {
    // Function to fetch top-rated guides
    function fetchTopRatedGuides() {
        const apiUrl = 'http://localhost:3000/api/guides';

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
                    return (
                        guide.location.toLowerCase() === destination.toLowerCase() &&
                        guide.availableDates.includes(date)
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
