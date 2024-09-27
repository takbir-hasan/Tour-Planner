
document.getElementById('forgotPasswordForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const responseMessage = document.getElementById('responseMessage');

    if (email) {
        // Send email to the server to verify and send reset link
        fetch('/forgetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                responseMessage.textContent = "Password reset link sent to your email.";
                responseMessage.style.color = 'green';
            } else {
                responseMessage.textContent = "Email not found. Please try again.";
            }
            console.log(data);
        })
        .catch(err => {
            responseMessage.textContent = "An error occurred. Please try again later.";
        });
    } else {
        responseMessage.textContent = "Please enter a valid email address.";
    }
});
