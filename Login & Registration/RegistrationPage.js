
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const fullName = document.getElementById('fullName').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const address = document.getElementById('address').value; 
        const role = document.getElementById('role').value;


        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        const phonePattern = /^\d{11}$/;
        let valid = true;

        document.getElementById('emailError').textContent = '';
        document.getElementById('phoneError').textContent = '';
        const roleError = document.getElementById('roleError');
        roleError.textContent = '';
       
       
       
        if (!emailPattern.test(email)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address.';
            valid = false;
        }

        if (!phonePattern.test(phoneNumber)) {
            document.getElementById('phoneError').textContent = 'Please enter a valid phone number (11 digits).';
            valid = false;
        }

        if (!role) {
            roleError.textContent = 'Please select your role.';
            valid = false;
        }



        if(valid){
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('phoneNumber', phoneNumber);
        localStorage.setItem('gender', gender);
        localStorage.setItem('address', address);
        localStorage.setItem('role', role);
        
        
        window.location.href = 'UserProfile.html';
        }
    });
});

