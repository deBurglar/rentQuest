document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const signupForm = document.getElementById('signupForm');
    const inputs = signupForm.querySelectorAll('input');

    // Header background change on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(30, 58, 138, 0.9)';
        } else {
            header.style.backgroundColor = 'rgba(10, 25, 47, 0.7)';
        }
    });

    // Form submission with Fetch API
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();  // Prevent default form submission
        
        const formData = new FormData(signupForm);
        const signupData = Object.fromEntries(formData.entries());

        // Send data to Django backend using Fetch API
        fetch('http://127.0.0.1:8000/api/users/', {  // Adjust to actual endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')  // CSRF token required for Django
            },
            body: JSON.stringify(signupData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Signup successful!');
                window.location.href = 'loginPage.html';  // Show success message or redirect
            } else {
                alert('Error during sign-up: ' + data.error);  // Show error message
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Input animations
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', function() {
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
});

// Function to get CSRF token from cookies (required for Django)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}










/* document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const signupForm = document.getElementById('signupForm');
    const inputs = signupForm.querySelectorAll('input');

    // Header background change on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(30, 58, 138, 0.9)';
        } else {
            header.style.backgroundColor = 'rgba(10, 25, 47, 0.7)';
        }
    });

    // Form submission with Fetch API
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();  // Prevent default form submission
        
        const formData = new FormData(signupForm);
        const signupData = Object.fromEntries(formData.entries());

        console.log('Signup attempt:', signupData);  // For debugging

        // Send data to Django backend using Fetch API
        fetch('/api/signup/', {  // Replace '/api/signup/' with your actual Django endpoint URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')  // CSRF token required for Django
            },
            body: JSON.stringify(signupData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Signup successful!');  // Show success message or redirect
            } else {
                alert('Error during sign-up: ' + data.error);  // Show error message
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Input animations
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', function() {
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
});

// Function to get CSRF token from cookies (required for Django)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
 */