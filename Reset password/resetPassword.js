
// Extract the token from the URL path (assumes URL is something like /reset-password/:token)
// const token = window.location.pathname.split('/')[2]; // Make sure this correctly extracts the token.
const params = window.location.pathname.split('/');
const userId = params[2];
const token = params[3];
console.log('extracted token', token);

document.getElementById('resetPasswordForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const responseMessage = document.getElementById('responseMessage');
    console.log(newPassword);

    if (!newPassword || !confirmPassword) {
        responseMessage.textContent = 'Please fill out both password fields.';
        responseMessage.style.color = 'red';
        return;
    }
    if (newPassword.length < 6) {
        responseMessage.textContent = 'Password must be at least 6 characters long.';
        responseMessage.style.color = 'red';
        return;
    }
    if (newPassword !== confirmPassword) {
        responseMessage.textContent = 'Passwords do not match.';
        responseMessage.style.color = 'red';
        return;
    }

    // Send a PUT request with the new password and token
    fetch(`/reset-password/${userId}/${token}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                responseMessage.textContent = 'Password reset successful!';
                responseMessage.style.color = 'green';
            } else {
                responseMessage.textContent = data.message;
                responseMessage.style.color = 'red';
            }
        })
        .catch(err => {
            responseMessage.textContent = 'An error occurred. Please try again.';
            responseMessage.style.color = 'red';
        });
});