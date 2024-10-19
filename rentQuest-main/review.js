// Function to refresh token
async function refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        console.log('No refresh token found.');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/login/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refresh: refreshToken })
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        localStorage.setItem('token', data.access);  // Update the access token
        console.log('Token refreshed successfully');
    } catch (error) {
        console.error('Error refreshing token:', error);
    }
}

// Function to send the review
async function sendReview(formData) {
    await refreshToken();  // Ensure token is refreshed before making the request

    const token = localStorage.getItem('token');  // Get updated token from localStorage
    const response = await fetch('http://127.0.0.1:8000/api/reviews/reviews/', {  // Adjust the endpoint accordingly
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,  // Include the refreshed token
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();  // Return the server response
}

document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    const form = document.getElementById('tenantReviewForm');
    const submitBtn = document.querySelector('.submit-btn');

    // Set the propertyId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('propertyId');
    document.getElementById('propertyId').value = propertyId;

    // Header background change on scroll
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(30, 58, 138, 0.9)';
        } else {
            header.style.backgroundColor = 'rgba(10, 25, 47, 0.7)';
        }
    });

    // Form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(form);

        // Modify formData to match backend model field names
        formData.append('property', propertyId);  // Set the property ID as 'property' field
        formData.delete('propertyId');  // Remove unnecessary 'propertyId' field

        // Optionally remove unnecessary fields (e.g., fullName, email)
        formData.delete('fullName');
        formData.delete('email');
        formData.delete('propertyName');  // Assuming not needed based on propertyId

        console.log('Form submitted:', Object.fromEntries(formData));  // Log the form data

        sendReview(formData).then(() => {
            alert('Thank you for your review!');
            window.location.href = `propertyDetails.html?id=${propertyId}`;  // Redirect back to the property details page
        }).catch(error => {
            console.error('Error submitting review:', error);
        });

        form.reset();  // Reset the form after submission
    });

    // Input animations
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', function () {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Animated background
    const starsElement = document.querySelector('.stars');
    let starsPosition = 0;
    function animateStars() {
        starsPosition -= 0.1;
        if (starsPosition <= -100) {
            starsPosition = 0;
        }
        starsElement.style.backgroundPosition = `0 ${starsPosition}%`;

        requestAnimationFrame(animateStars);
    }
    animateStars();

    // Pulsating effect for the submit button
    setInterval(() => {
        submitBtn.classList.add('pulse');
        setTimeout(() => {
            submitBtn.classList.remove('pulse');
        }, 1000);
    }, 3000);
});
