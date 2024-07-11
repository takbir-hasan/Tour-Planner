document.getElementById('profile-photo').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = function() {
      document.getElementById('photoBase64').value = reader.result;
    };
    
    if (file) {
      reader.readAsDataURL(file);
    }
  });

document.getElementById('edit-services-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const location = document.getElementById('location').value;
    const price = document.getElementById('price').value;
    const imageFile = document.getElementById('photoBase64').value;
    const available = document.getElementById('date').value;

            // Prepare the data to be sent to the server
            const guideData = {
                username: localStorage.getItem('username'), // Replace this with actual username if available
                name: name,
                location: location,
                price: price,
                image: imageFile,
                available: available
            };

            // Send data to the server
            fetch('/api/editguideService', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(guideData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // window.location.href = 'HotelManagerProfile.html';
                    history.back(); 
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

     
});
