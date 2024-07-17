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
      window.location.href = '/HotelManagerProfile.html';
    });