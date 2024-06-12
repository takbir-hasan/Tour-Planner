document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      if (username === 'your_username' && password === 'your_password') {
        window.location.href = 'UserProfile.html';
      } else {
        alert('Incorrect username or password. Please try again.');
      }
    });
  });
