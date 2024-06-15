document.addEventListener('DOMContentLoaded', function () {
    // Profile photo upload functionality
    const profilePhotoLabel = document.getElementById('profile-photo-label');
    const profilePhotoInput = document.getElementById('profile-photo');
    const profilePhoto = document.querySelector('.profile-photo');
  
    profilePhotoLabel.addEventListener('click', function () {
        profilePhotoInput.click();
    });
  
    profilePhotoInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePhoto.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
  
    // Form validation and update profile
    const editProfileForm = document.getElementById('editProfileForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phoneNumber');
    const addressInput = document.getElementById('address');
    const genderDetails = document.getElementById('genderDetails');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
  
    
    editProfileForm.addEventListener('submit', function (event) {
        event.preventDefault();
        let valid = true;
  
        // Validate email
        if (!validateEmail(emailInput.value)) {
            emailError.textContent = 'Please enter a valid email.';
            valid = false;
        } else {
            emailError.textContent = '';
        }
  
        // Validate phone number
        if (!validatePhoneNumber(phoneInput.value)) {
            phoneError.textContent = 'Please enter a valid phone number.';
            valid = false;
        } else {
            phoneError.textContent = '';
        }
  
        if (valid) {
            // Save the updated information to localStorage
            localStorage.setItem('fullName', fullNameInput.value);
            localStorage.setItem('email', emailInput.value);
            localStorage.setItem('phoneNumber', phoneInput.value);
            localStorage.setItem('address', addressInput.value);
            localStorage.setItem('gender', genderDetails.value);

            // Update profile display
            updateProfileDisplay();

            window.location.href = 'UserProfile.html';

        }
    });
  
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
  
    function validatePhoneNumber(phone) {
        const re = /^\d{11}$/;
        return re.test(phone);
    }

    function updateProfileDisplay() {
        const fullName = localStorage.getItem('fullName');
        const email = localStorage.getItem('email');
        const phoneNumber = localStorage.getItem('phoneNumber');
        const address = localStorage.getItem('address');
        const gender = localStorage.getItem('gender');

        document.getElementById('name').textContent = fullName;
        document.getElementById('email').textContent = email;
        document.getElementById('phone').textContent = phoneNumber;
        document.getElementById('address').textContent = address;
        document.getElementById('gender').textContent = gender;
    }

    // Update profile display on page load
    updateProfileDisplay();
});

document.addEventListener('DOMContentLoaded', function () {
    const updateProfileBtn = document.getElementById('updateProfileBtn');

    updateProfileBtn.addEventListener('click', function () {
        // Redirect to UserProfile.html
        window.location.href = 'UserProfile.html';
    });
});