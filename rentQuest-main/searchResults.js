document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    const searchInput = document.querySelector('#searchBar');
    const searchBtn = document.querySelector('#searchBtn');
    const suggestionsContainer = document.getElementById('suggestions');
    const propertiesContainer = document.getElementById('properties');
    const filterIcon = document.getElementById('filterIcon');
    const filterModal = document.getElementById('filterModal');
    const applyFiltersBtn = document.getElementById('applyFilters');
    
    // Filters
    const priceSlider = document.getElementById('priceSlider');
    const sizeSlider = document.getElementById('sizeSlider');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const minSize = document.getElementById('minSize');
    const maxSize = document.getElementById('maxSize');

    // Header background change on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(30, 58, 138, 0.9)';
        } else {
            header.style.backgroundColor = 'rgba(10, 25, 47, 0.7)';
        }
    });

    // Function to render search results
    function renderProperties(properties) {
        propertiesContainer.innerHTML = '';  // Clear previous results
        if (properties.length === 0) {
            propertiesContainer.innerHTML = '<p>No properties found.</p>';
            return;
        }
    
        properties.forEach(property => {
            const propertyDiv = document.createElement('div');
            propertyDiv.classList.add('property');
    
            // Use replace to remove the "image/" prefix
            const imageUrl = property.property_images[0]["image"].replace("image/upload/","");
    
            propertyDiv.innerHTML = `
                <h3>${property.name}</h3>
                <img src="${imageUrl}" alt="${property.name} image" />
                <p>Location: ${property.location}</p>
                <p>Price: ₹${property.price}</p>
                <p>Size: ${property.size} sqft</p>
            `;
    
            propertiesContainer.appendChild(propertyDiv);

            // Add fade-in animation to each property
            setTimeout(() => {
                propertyDiv.style.opacity = '1';
                propertyDiv.style.transform = 'translateY(0)';
            }, 100);
        });
    }

    // Function to perform the API call
    async function performSearch(query) {
        const minPriceValue = priceSlider.value;
        const maxPriceValue = 30000;
        const minSizeValue = sizeSlider.value;
        const maxSizeValue = 5000;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/properties/search/?query=${query}&min_price=${minPriceValue}&max_price=${maxPriceValue}&min_size=${minSizeValue}&max_size=${maxSizeValue}`);
            const data = await response.json();
            console.log(data);
            renderProperties(data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    }

    // Event listener for search button
    searchBtn.addEventListener('click', function () {
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        }
    });

    // Enter key triggers the search
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });

    // Filter modal functionality
    filterIcon.addEventListener('click', function() {
        filterModal.style.display = 'block';
    });

    window.addEventListener('click', function(event) {
        if (event.target == filterModal) {
            filterModal.style.display = 'none';
        }
    });

    applyFiltersBtn.addEventListener('click', function() {
        filterModal.style.display = 'none';
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        }
    });

    // Slider functionality
    priceSlider.addEventListener('input', function() {
        const value = this.value;
        minPrice.textContent = `₹${value}`;
        maxPrice.textContent = '₹30,000';
    });

    sizeSlider.addEventListener('input', function() {
        const value = this.value;
        minSize.textContent = `${value} sqft`;
        maxSize.textContent = '5,000 sqft';
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

    // Fade-in animation for the main content
    const mainContent = document.querySelector('main');
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(20px)';
    mainContent.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    setTimeout(() => {
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';
    }, 100);

    // Subtle hover effect for the logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.transition = 'transform 0.3s ease';
        logo.addEventListener('mouseover', () => {
            logo.style.transform = 'scale(1.05)';
        });
        logo.addEventListener('mouseout', () => {
            logo.style.transform = 'scale(1)';
        });
    }

    // Pulsating effect for the search button
    if (searchBtn) {
        searchBtn.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        setInterval(() => {
            searchBtn.style.transform = 'scale(1.05)';
            searchBtn.style.boxShadow = '0 0 15px rgba(74, 144, 226, 0.7)';
            setTimeout(() => {
                searchBtn.style.transform = 'scale(1)';
                searchBtn.style.boxShadow = 'none';
            }, 500);
        }, 3000);
    }

    // Subtle animation for search input on focus
    searchInput.addEventListener('focus', function() {
        this.style.transition = 'transform 0.3s ease';
        this.style.transform = 'translateX(5px)';
    });
    searchInput.addEventListener('blur', function() {
        this.style.transform = 'translateX(0)';
    });
});
