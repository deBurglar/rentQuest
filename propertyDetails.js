let currentSlide = 0;
let propertyId = null; // Set this to the ID of the property you want to load

// Extract id from URL
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

    // Add review button functionality
    const addReviewBtn = document.getElementById('add-review-btn');
    addReviewBtn.addEventListener('click', function() {
        window.location.href = `review.html?propertyId=${propertyId}`;
    });
});

// Fetch property details
async function fetchPropertyDetails() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/properties/detail/${propertyId}/`);
        const property = await response.json();
        displayPropertyDetails(property);

        // Fetch nearby places after getting property details
        const lat = property.property.latitude;  // Ensure these fields exist in your API response
        const lng = property.property.longitude;
        fetchNearbyPlaces(lat, lng);

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

    // const imagesContainer = document.querySelector('.carousel-images');
    // imagesContainer.innerHTML = property.images.map(image => `<img src="${image.image.replace("image/upload/","")}" alt="Property Image">`).join('');

    const imagesContainer = document.querySelector('.carousel-images');
    imagesContainer.innerHTML = property.images.map(image => {
        let imageUrl = image.image;

        // If the image URL starts with 'image/upload/https://res.cloudinary.com/'
        if (imageUrl.startsWith('image/upload/https://res.cloudinary.com/')) {
            // Remove 'image/upload/'
            imageUrl = imageUrl.replace('image/upload/', '');
        } 
        // Else if the image URL starts with 'image/upload/', add the Cloudinary URL prefix
        else if (imageUrl.startsWith('image/upload/')) {
            imageUrl = `https://res.cloudinary.com/dl7n2c4hr/${imageUrl}`;
        }

        return `<img src="${imageUrl}" alt="Property Image">`;
    }).join('');
    
    showSlide(currentSlide); // Show the first slide
}

// Fetch nearby places
async function fetchNearbyPlaces(lat, lng) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/properties/nearby-places/?lat=${lat}&lng=${lng}`);
        const data = await response.json();
        displayNearbyPlaces(data.results);  // Pass the results to display function
    } catch (error) {
        console.error('Error fetching nearby places:', error);
    }
}
function displayNearbyPlaces(places) {
    const placesContainer = document.getElementById('places-container');
    placesContainer.innerHTML = '';

    if (places.length === 0) {
        placesContainer.innerHTML = '<p>No nearby places found.</p>';
        return;
    }

    places.forEach(place => {
        // Create the anchor tag for clickable behavior
        const placeLink = document.createElement('a');
        placeLink.href = `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;
        placeLink.target = '_blank';  // Open in a new tab
        placeLink.classList.add('place-link');

        const placeDiv = document.createElement('div');
        placeDiv.classList.add('place-item');

        const placeContent = document.createElement('div');
        placeContent.classList.add('place-content');

        const placeImage = document.createElement('img');
        placeImage.src = place.icon || 'placeholder-image.jpg';
        placeImage.alt = `${place.name} icon`;
        placeImage.classList.add('place-image');

        const placeDetails = document.createElement('div');
        placeDetails.classList.add('place-details');

        const placeName = document.createElement('h3');
        placeName.innerText = place.name || 'No Name Available';

        const placeVicinity = document.createElement('p');
        placeVicinity.innerText = place.vicinity || 'N/A';

        const placeRating = document.createElement('p');
        placeRating.classList.add('place-rating');
        placeRating.innerHTML = place.rating ? `${'★'.repeat(Math.round(place.rating))}${'☆'.repeat(5 - Math.round(place.rating))} (${place.rating})` : 'No rating';

        const placeStatus = document.createElement('p');
        placeStatus.classList.add('place-status');
        placeStatus.classList.add(place.business_status === "OPERATIONAL" ? "status-open" : "status-closed");
        placeStatus.innerText = place.business_status === "OPERATIONAL" ? "Open" : "Closed";

        const placeType = document.createElement('p');
        placeType.innerText = place.types ? place.types[0].replace(/_/g, ' ') : 'N/A';

        placeDetails.appendChild(placeName);
        placeDetails.appendChild(placeVicinity);
        placeDetails.appendChild(placeRating);
        placeDetails.appendChild(placeStatus);
        placeDetails.appendChild(placeType);

        placeContent.appendChild(placeImage);
        placeContent.appendChild(placeDetails);

        placeDiv.appendChild(placeContent);

        // Append the placeDiv to the anchor
        placeLink.appendChild(placeDiv);

        // Append the clickable link (anchor) to the container
        placesContainer.appendChild(placeLink);
    });
}

// // Display nearby places
// function displayNearbyPlaces(places) {
//     const placesContainer = document.getElementById('places-container');
//     placesContainer.innerHTML = '';

//     if (places.length === 0) {
//         placesContainer.innerHTML = '<p>No nearby places found.</p>';
//         return;
//     }

//     places.forEach(place => {
//         const placeDiv = document.createElement('div');
//         placeDiv.classList.add('place-item');

//         const placeContent = document.createElement('div');
//         placeContent.classList.add('place-content');

//         const placeImage = document.createElement('img');
//         placeImage.src = place.icon || 'placeholder-image.jpg';
//         placeImage.alt = `${place.name} icon`;
//         placeImage.classList.add('place-image');

//         const placeDetails = document.createElement('div');
//         placeDetails.classList.add('place-details');

//         const placeName = document.createElement('h3');
//         placeName.innerText = place.name || 'No Name Available';

//         const placeVicinity = document.createElement('p');
//         placeVicinity.innerText = place.vicinity || 'N/A';

//         const placeRating = document.createElement('p');
//         placeRating.classList.add('place-rating');
//         placeRating.innerHTML = place.rating ? `${'★'.repeat(Math.round(place.rating))}${'☆'.repeat(5 - Math.round(place.rating))} (${place.rating})` : 'No rating';

//         const placeStatus = document.createElement('p');
//         placeStatus.classList.add('place-status');
//         placeStatus.classList.add(place.business_status === "OPERATIONAL" ? "status-open" : "status-closed");
//         placeStatus.innerText = place.business_status === "OPERATIONAL" ? "Open" : "Closed";

//         const placeType = document.createElement('p');
//         placeType.innerText = place.types ? place.types[0].replace(/_/g, ' ') : 'N/A';

//         placeDetails.appendChild(placeName);
//         placeDetails.appendChild(placeVicinity);
//         placeDetails.appendChild(placeRating);
//         placeDetails.appendChild(placeStatus);
//         placeDetails.appendChild(placeType);

//         placeContent.appendChild(placeImage);
//         placeContent.appendChild(placeDetails);

//         placeDiv.appendChild(placeContent);
//         placesContainer.appendChild(placeDiv);
//     });
// }


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



// Fetch landlord contact after successful payment
function fetchLandlordContact() {
    const dummyContactInfo = "9999999999"; // Dummy number
    alert(`Landlord's contact: ${dummyContactInfo}`);
}