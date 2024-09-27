require("dotenv").config();
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('reviewForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting

        // Validate the rating
        const rating = document.querySelector('input[name="rating"]:checked').value;
        if (!rating) {
            alert('Please select a rating!');
            return;
        }

        // Validate the review text
        const review = document.getElementById('review').value.trim();
        if (review === '') {
            alert('Please enter your review!');
            return;
        }
        rev(rating,review)
    });

    async function rev( rating, review) {
        const username = localStorage.getItem('serviceProvider');

        if (!username) {
          alert('Username not found in localStorage!');
        } else {
          console.log('Searching for user in page:', username);
        }
        try {
            const formData = {
                username: username,
                rating: rating, 
                review: review    
            };
    
          const response = await fetch(`${process.env.URL}/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          if (response.ok) {
            console.log('Rating successfull');
             const id = localStorage.getItem('id');
             const service = localStorage.getItem('service');
            updateflag(id,service,rating,review); 
          } else {
            console.error('Failed');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }

      async function updateflag(id, service,rating,review) {
        try {
          const formData = {
            id,
            service,
            rating, 
            review   
        };
          const response = await fetch(`/api/flag`, {
            method: 'Post',
            headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          });
          if (response.ok) {
            console.log('Flag Updated');
            window.location.href ='/user-success';
          } else {
            console.error('Failed to cancel booking');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
     
});
