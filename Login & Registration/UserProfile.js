document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/api/users';

    // Function to fetch profile data
    function fetchProfileData(username) {
        fetch(`${apiUrl}?username=${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayProfile(data);
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
            });
    }

    // Function to display profile data
    function displayProfile(data) {
        document.getElementById('name').textContent = data.fullname;
        document.getElementById('email').textContent = data.email;
        document.getElementById('email').innerHTML = `<i class="fas fa-envelope"></i> ${data.email}`;
        document.getElementById('phone').textContent = data.phoneNumber;
        document.getElementById('phone').innerHTML = `<i class="fas fa-phone"></i> ${data.phoneNumber}`;
        document.getElementById('address').textContent = data.address;
        document.getElementById('address').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.address}`;
        document.getElementById('gender').textContent = data.gender;
        document.getElementById('gender').innerHTML = `<i class="fas fa-venus-mars"></i> ${data.gender}`;
        const profilePhoto = document.querySelector('.profile-photo');
        profilePhoto.setAttribute('src', data.photo);
    }

    function getUsernameFromStorage() {
        return localStorage.getItem('username');
    }

    function setUsernameInStorage(username) {
        localStorage.setItem('username', username);
    }

    const storedUsername = getUsernameFromStorage();
    if (storedUsername) {
        fetchProfileData(storedUsername);
    } else {
        console.error('Username not found in localStorage.');
    }
});
// Function to fetch booking history
async function fetchBookingHistory(username) {
    try {
      const response = await fetch(`/api/bookings/${username}`);
      if (response.ok) {
        const bookings = await response.json();
        displayBookingHistory(bookings);
      } else {
        console.error('Failed to fetch booking history');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  // Function to fetch guide booking history
async function fetchGuideBookingHistory(username) {
    try {
      const response = await fetch(`/api/Guidebookings/${username}`);
      if (response.ok) {
        const bookings = await response.json();
        displayGuideBookingHistory(bookings);
      } else {
        console.error('Failed to fetch guide booking history');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  // Function to fetch Transport booking history
  async function fetchTransportBookingHistory(username) {
    try {
      const response = await fetch(`/api/Transportbookings/${username}`);
      if (response.ok) {
        const bookings = await response.json();
        displayTransportBookingHistory(bookings);
      } else {
        console.error('Failed to fetch guide booking history');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  
  // Function to display Hotel booking history
  function displayBookingHistory(bookings) {
    const bookingHistory = document.getElementById('booking-history');
    bookingHistory.innerHTML = ''; // Clear any existing content
  
    bookings.forEach((booking, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
  
      const bookingText = document.createElement('span');
      bookingText.textContent = `Booking ${index + 1}: Date: ${booking.checkInDate}, Hotel Name: ${booking.hotelName}, Place: ${booking.place}`;
  
      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'btn-group';
  
      if (booking.status === 'Completed') {
        const statusSpan = document.createElement('span');
        statusSpan.className = 'text';
        statusSpan.textContent = 'Completed';
  
        const reviewButton = document.createElement('button');
        reviewButton.className = 'btn btn-success btn-sm review-btn';
        reviewButton.innerHTML = '<i class="fas fa-star"></i> Write a Review';
        // reviewButton.onclick = () => writeReview(booking);
  
        buttonGroup.appendChild(statusSpan);
        buttonGroup.appendChild(reviewButton);
      } else {
        const cancelButton = document.createElement('button');
        cancelButton.className = 'btn btn-danger btn-sm cancel-btn';
        cancelButton.innerHTML = '<i class="fas fa-times"></i> Cancel';
        cancelButton.onclick = () => cancelBooking(username,booking._id);
  
        buttonGroup.appendChild(cancelButton);
      }
  
      listItem.appendChild(bookingText);
      listItem.appendChild(buttonGroup);
      bookingHistory.appendChild(listItem);
    });
  }
  // Function to handle Hotel booking cancellation
  async function cancelBooking(username, bookingId) {
    try {
      const response = await fetch(`/api/bookings/${username}/${bookingId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Booking cancelled successfully');
        fetchBookingHistory(username); 
      } else {
        console.error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  //Display Guide Booking History
  function displayGuideBookingHistory(bookings) {
    const bookingHistory = document.getElementById('guide-booking-history');
    bookingHistory.innerHTML = ''; // Clear any existing content
  
    bookings.forEach((booking, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
  
      const bookingText = document.createElement('span');
      bookingText.textContent = `Booking ${index + 1}: Date: ${booking.date}, Guide Name: ${booking.guideName}, Place: ${booking.place}`;
  
      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'btn-group';
  
      if (booking.status === 'Completed') {
        const statusSpan = document.createElement('span');
        statusSpan.className = 'text';
        statusSpan.textContent = 'Completed';
  
        const reviewButton = document.createElement('button');
        reviewButton.className = 'btn btn-success btn-sm review-btn';
        reviewButton.innerHTML = '<i class="fas fa-star"></i> Write a Review';
        // reviewButton.onclick = () => writeReview(booking);
  
        buttonGroup.appendChild(statusSpan);
        buttonGroup.appendChild(reviewButton);
      } else {
        const cancelButton = document.createElement('button');
        cancelButton.className = 'btn btn-danger btn-sm cancel-btn';
        cancelButton.innerHTML = '<i class="fas fa-times"></i> Cancel';
        cancelButton.onclick = () => cancelGuideBooking(username,booking._id);
  
        buttonGroup.appendChild(cancelButton);
      }
  
      listItem.appendChild(bookingText);
      listItem.appendChild(buttonGroup);
      bookingHistory.appendChild(listItem);
    });
  }
  //Guide cancel button handle 
  async function cancelGuideBooking(username, bookingId) {
    try {
      const response = await fetch(`/api/Guidebookings/${username}/${bookingId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Booking cancelled successfully');
        fetchGuideBookingHistory(username); 
      } else {
        console.error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  //Display Guide Booking History
  function displayTransportBookingHistory(bookings) {
    const bookingHistory = document.getElementById('transport-booking-history');
    bookingHistory.innerHTML = ''; // Clear any existing content
  
    bookings.forEach((booking, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
  
      const bookingText = document.createElement('span');
      bookingText.textContent = `Booking ${index + 1}: Date: ${booking.date}, Guide Name: ${booking.transportName}, Place: ${booking.place}`;
  
      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'btn-group';
  
      if (booking.status === 'Completed') {
        const statusSpan = document.createElement('span');
        statusSpan.className = 'text';
        statusSpan.textContent = 'Completed';
  
        const reviewButton = document.createElement('button');
        reviewButton.className = 'btn btn-success btn-sm review-btn';
        reviewButton.innerHTML = '<i class="fas fa-star"></i> Write a Review';
        // reviewButton.onclick = () => writeReview(booking);
  
        buttonGroup.appendChild(statusSpan);
        buttonGroup.appendChild(reviewButton);
      } else {
        const cancelButton = document.createElement('button');
        cancelButton.className = 'btn btn-danger btn-sm cancel-btn';
        cancelButton.innerHTML = '<i class="fas fa-times"></i> Cancel';
        cancelButton.onclick = () => cancelTransportBooking(username,booking._id);
  
        buttonGroup.appendChild(cancelButton);
      }
  
      listItem.appendChild(bookingText);
      listItem.appendChild(buttonGroup);
      bookingHistory.appendChild(listItem);
    });
  }
   //Transport cancel button handle 
   async function cancelTransportBooking(username, bookingId) {
    try {
      const response = await fetch(`/api/Transportbookings/${username}/${bookingId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Booking cancelled successfully');
        fetchTransportBookingHistory(username); 
      } else {
        console.error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  const username = localStorage.getItem('username'); 
  if (username) {
    fetchBookingHistory(username);
    fetchGuideBookingHistory(username);
    fetchTransportBookingHistory(username);

  } else {
    console.error('Username not found in localStorage');
  }
  
  