document.addEventListener('DOMContentLoaded', function() {
    // Retrieve user information from localStorage
    const fullName = localStorage.getItem('fullName');
    const email = localStorage.getItem('email');
    const phoneNumber = localStorage.getItem('phoneNumber');
    const gender = localStorage.getItem('gender');
    const address = localStorage.getItem('address');



    // Display user information on the profile page
    document.getElementById('name').textContent = fullName;
    document.getElementById('email').textContent = email;
    document.getElementById('phone').textContent = phoneNumber;
    document.getElementById('address').textContent = address;
    document.getElementById('gender').textContent = gender;
    
    // Logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', function(event) {
        event.preventDefault();
        // Clear user information from localStorage
        localStorage.removeItem('fullName');
        localStorage.removeItem('email');
        localStorage.removeItem('phoneNumber');
        localStorage.removeItem('gender');
        localStorage.removeItem('address');
        // Redirect to login page or wherever appropriate
        window.location.href = 'LoginPage.html';
    });
});

// UserProfile.js

document.addEventListener('DOMContentLoaded', function() {
    // Logout functionality
    const logoutBtn = document.querySelector('.logout');
    logoutBtn.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'LoginPage.html';
    });
    
     
});


// Handle file input change event
const profilePhotoInput = document.getElementById('profile-photo');
profilePhotoInput.addEventListener('change', function(event) {
    console.log("File selected!"); 

    const file = event.target.files[0]; 
    const reader = new FileReader();

    reader.onload = function(e) {
        console.log("File read successfully!"); 

        const imageURL = e.target.result;
        console.log("Image URL:", imageURL); 

        const profilePhoto = document.querySelector('.profile-photo');
        profilePhoto.src = imageURL;
    };

    reader.readAsDataURL(file);
});


document.addEventListener('DOMContentLoaded', function() {
    const genderDetails = document.getElementById('genderDetails');

    genderDetails.addEventListener('change', function(event) {
        const selectedGender = event.target.value;
        console.log('Selected gender:', selectedGender);

    });
});


