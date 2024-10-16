
let currentSlide = 0;
let propertyId = null; // Set this to the ID of the property you want to load

//xtract id fom url
const params = new URLSearchParams(window.location.search);
propertyId = params.get('id');  // Get the property ID from the URL

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('nav a');


    // Header background change on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(30, 58, 138, 0.9)';
        } else {
            header.style.backgroundColor = 'rgba(26, 0, 51, 0.7)';
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });

                // Add a class to trigger the transition
                targetSection.classList.add('active');

                // Remove the class after the transition
                setTimeout(() => {
                    targetSection.classList.remove('active');
                }, 1000);
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
// Fetch property details
async function fetchPropertyDetails() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/properties/detail/${propertyId}/`);
        const property = await response.json();
        displayPropertyDetails(property);
        fetchReviews();
    } catch (error) {
        console.error('Error fetching property details:', error);
    }
}

// Display property details on the page
function displayPropertyDetails(property) {
    document.getElementById('property-name').innerText = property.property.name;
    document.getElementById('property-location').innerText = `Location: ${property.property.location}`;
    document.getElementById('property-price').innerText = `Price: ₹${property.property.price}/month`;
    document.getElementById('property-size').innerText = `Size: ${property.property.size} sq ft`;

    const imagesContainer = document.querySelector('.carousel-images');
    imagesContainer.innerHTML = property.images.map(image => `<img src="${image.image.replace("image/upload/","")}" alt="Property Image">`).join('');
    
    showSlide(currentSlide); // Show the first slide
}

// Fetch reviews for the property
async function fetchReviews() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/reviews/reviews/?property_id=${propertyId}`);
        const reviews = await response.json();
        displayReviews(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

// Display reviews on the page
function displayReviews(reviews) {
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = reviews.map(review => `
        <div class="review">
            <p>Rating: ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p>
            <p>Comment: ${review.comment}</p>
        </div>
    `).join('');
}

// Carousel functionality
function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-images img');
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    const offset = -currentSlide * 100;
    document.querySelector('.carousel-images').style.transform = `translateX(${offset}%)`;
}

function moveSlide(direction) {
    showSlide(currentSlide + direction);
}

// Initialize the property details view
fetchPropertyDetails();

// Event listeners
document.getElementById('contact-btn').addEventListener('click', function() {
    alert('Contact functionality to be implemented');
});

document.getElementById('add-review-btn').addEventListener('click', function() {
    alert('Add review functionality to be implemented');
});