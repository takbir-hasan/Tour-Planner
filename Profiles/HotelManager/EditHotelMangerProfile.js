$(document).ready(function() {
      const apiUrl = 'https://example.com/api/profile'; // Replace with your actual API endpoint
  
      // Fetch existing profile data and prefill the form
      $.ajax({
          url: apiUrl,
          method: 'GET',
          success: function(response) {
              $('#name').val(response.name);
              $('#email').val(response.email);
              $('#phone').val(response.phone);
              $('#address').val(response.address);
          },
          error: function(error) {
              console.error('Error fetching profile data:', error);
          }
      });
  
      // Handle form submission
      $('#edit-profile-form').on('submit', function(e) {
          e.preventDefault();
  
          const formData = new FormData();
          formData.append('name', $('#name').val());
          formData.append('email', $('#email').val());
          formData.append('phone', $('#phone').val());
          formData.append('address', $('#address').val());
          const profilePicture = $('#profile-picture')[0].files[0];
          if (profilePicture) {
              formData.append('profilePicture', profilePicture);
          }
  
          $.ajax({
              url: apiUrl,
              method: 'PUT',
              data: formData,
              processData: false,
              contentType: false,
              success: function(response) {
                  alert('Profile updated successfully!');
                  window.location.href = 'HotelManagerProfile.html'; // Redirect to the profile page
              },
              error: function(error) {
                  console.error('Error updating profile:', error);
              }
          });
      });
  });
  