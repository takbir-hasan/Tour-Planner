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
