document.addEventListener('DOMContentLoaded', function() {
      const profileLink = document.getElementById('profileLink');
      profileLink.addEventListener('click', async function(event) {
          event.preventDefault();

          const username = localStorage.getItem('username');
          const password = localStorage.getItem('password');
          
          try {
              const response = await fetch('/login', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ username, password }),
              });
    
              if (response.ok) {
                  const data = await response.json();
                  const role = data.role;
    
                  localStorage.setItem('role',role);
    
                  if (role === 'user') {
                      window.location.href = '/user-success';
                  } else if (role === 'transport-driver') {
                      window.location.href = '/transport-driver-success';
                  } else if (role === 'guide') {
                      window.location.href = '/guide-success';
                  } else if (role === 'hotel-manager') {
                      window.location.href = '/hotel-manager-success';
                  } else {
                      alert('Unknown role. Please contact support.');
                  }
              } else {
                  const errorData = await response.json();
                  alert(errorData.message);
              }
          } catch (error) {
              alert('Error logging in. Please try again later.');
          }
      });
    });