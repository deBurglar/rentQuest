document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const form = document.getElementById('tenantReviewForm');
    const submitBtn = document.querySelector('.submit-btn');

    // Header background change on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(30, 58, 138, 0.9)';
        } else {
            header.style.backgroundColor = 'rgba(10, 25, 47, 0.7)';
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        console.log('Form submitted:', Object.fromEntries(formData));
        // Here you would typically send this data to your server
        alert('Thank you for your review!');
        form.reset();
    });

    // Input animations
    const inputs = form.querySelectorAll('input, textarea');
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

    // Pulsating effect for the submit button
    setInterval(() => {
        submitBtn.classList.add('pulse');
        setTimeout(() => {
            submitBtn.classList.remove('pulse');
        }, 1000);
    }, 3000);
});
