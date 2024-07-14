// $(document).ready(function() {
//     const apiUrl = 'https://example.com/api/profile'; // Replace with your actual API endpoint

//     // Fetch existing profile data and prefill the form
//     $.ajax({
//         url: apiUrl,
//         method: 'GET',
//         success: function(response) {
//             $('#name').val(response.name);
//             $('#email').val(response.email);
//             $('#phone').val(response.phone);
//             $('#address').val(response.address);
//         },
//         error: function(error) {
//             console.error('Error fetching profile data:', error);
//         }
//     });

//     // Handle form submission
//     $('#edit-profile-form').on('submit', function(e) {
//         e.preventDefault();

//         const formData = new FormData();
//         formData.append('name', $('#name').val());
//         formData.append('email', $('#email').val());
//         formData.append('phone', $('#phone').val());
//         formData.append('address', $('#address').val());
//         const profilePicture = $('#profile-picture')[0].files[0];
//         if (profilePicture) {
//             formData.append('profilePicture', profilePicture);
//         }

//         $.ajax({
//             url: apiUrl,
//             method: 'PUT',
//             data: formData,
//             processData: false,
//             contentType: false,
//             success: function(response) {
//                 alert('Profile updated successfully!');
//                 window.location.href = 'HotelManagerProfile.html'; // Redirect to the profile page
//             },
//             error: function(error) {
//                 console.error('Error updating profile:', error);
//             }
//         });
//     });
// });
document.getElementById('profile-photo').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = function() {
      const base64String = reader.result;
      const finalBase64 = base64String.startsWith('data:image/') ? base64String : 'data:image/jpeg;base64,' + base64String;
      document.getElementById('photoBase64').value = finalBase64;
  
      // Debugging: Log the finalBase64 to verify it's correct
      console.log('Base64 String:', finalBase64);
    };
    
    if (file) {
      reader.readAsDataURL(file);
    }
  });
  // Function to update user profile
  const updateProfile = async (username, fullname, email, phoneNumber, address, photoUrl) => {
      try {
        const response = await fetch(`/api/users/${username}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullname,
            email,
            phoneNumber,
            address,
            photo: photoUrl,
          }),
        });
    
        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(errorMessage.message || 'Failed to update profile');
        }
    
        const updatedUser = await response.json();
        console.log('Updated user:', updatedUser);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    };
  
  
    // Event listener for form submission
    document.getElementById('editProfileForm').addEventListener('submit', async (event) => {
      event.preventDefault(); 
      const fullName = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      const phoneNumber = document.getElementById('phoneNumber').value;
      const address = document.getElementById('address').value;
      //const photoUrl = document.getElementById('profile-photo').value;
      const photoUrl = document.getElementById('photoBase64').value;  
      console.log('Photo URL:', photoUrl);
  
      const username = localStorage.getItem('username');
    
      await updateProfile(username, fullName, email, phoneNumber, address, photoUrl);
      alert('Profile Updated Succesfully! go to your profile and refresh.');
      window.location.href = '/profile.html';
    });

    // Fetching DataBookingHistory

async function fetchBookingHistory(username) {
  try {
      const response = await fetch(`/api/GuideManagerInfo/${username}`);
      if (response.ok) {
          const bookings = await response.json();
          updateBookingStatus(bookings);
          displayBookingHistory(bookings);
      } else {
          console.error('Failed to fetch booking history:', response.status, response.statusText);
      }
  } catch (error) {
      console.error('Error:', error);
  }
}
// Function to update booking status based on check-out date
function updateBookingStatus(bookings) {
  const currentDate = new Date();

  bookings.forEach(booking => {
      const checkOutDate = new Date(booking.checkOutDate);
      if (checkOutDate < currentDate) {
          booking.status = "Completed";
      } else {
          booking.status = "Pending";
      }
  });
}

// Displaying DataBookingHistory
function displayBookingHistory(bookings) {
  const bookingHistory = document.getElementById('booking-history');
  if (!bookingHistory) {
      console.error('No element found with ID "booking-history"');
      return;
  }
  bookingHistory.innerHTML = ''; 

  if (Array.isArray(bookings) && bookings.length > 0) {
      bookings.forEach((booking, index) => {
          const listItem = document.createElement('li');
          listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

          const bookingText = document.createElement('span');
          bookingText.textContent = `Booking ${index + 1}: Date: ${booking.checkOutDate}, Customer Name: ${booking.userInfo.fullname}, Phone Number: ${booking.userInfo.phoneNumber}`;

          const buttonGroup = document.createElement('div');
          buttonGroup.className = 'btn-group';

          if (booking.status === 'Completed') {
              const statusSpan = document.createElement('span');
              statusSpan.className = 'text-success';
              statusSpan.textContent = 'Completed';
              buttonGroup.appendChild(statusSpan);
          } else {
              const statusSpan = document.createElement('span');
              statusSpan.style.color = 'rgb(248, 198, 2)';
              statusSpan.textContent = 'Pending';
              buttonGroup.appendChild(statusSpan);
          }

          listItem.appendChild(bookingText);
          listItem.appendChild(buttonGroup);
          bookingHistory.appendChild(listItem);
      });
  } else {
      const noBookingMessage = document.createElement('p');
      noBookingMessage.textContent = 'No bookings found.';
      bookingHistory.appendChild(noBookingMessage);
  }
}

const storedUsername = localStorage.getItem('username');

if (storedUsername) {
fetchBookingHistory(storedUsername);
} else {
console.error('Username not found in localStorage');
}