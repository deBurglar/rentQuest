document.addEventListener('DOMContentLoaded', async function () {
    const searchInput = document.querySelector('#searchBar');
    const searchBtn = document.querySelector('#searchBtn');
    const suggestionsContainer = document.getElementById('suggestions');
    const propertiesContainer = document.getElementById('properties');
    
    // Optional filters
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const minSizeInput = document.getElementById('minSize');
    const maxSizeInput = document.getElementById('maxSize');

    // Token Refresh Function
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
            localStorage.setItem('token', data.access);  // Store the new access token
            console.log('Token refreshed successfully');
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    }

    // Call the refreshToken function on page load
    await refreshToken();

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
            let imageUrl = property.property_images[0]["image"];
            if (imageUrl.startsWith('image/upload/https://res.cloudinary.com/')) {
                // Remove 'image/upload/'
                imageUrl = imageUrl.replace('image/upload/', '');
            } 
            // Else if the image URL starts with 'image/upload/', add the Cloudinary URL prefix
            else if (imageUrl.startsWith('image/upload/')) {
                imageUrl = `https://res.cloudinary.com/dl7n2c4hr/${imageUrl}`;
            }

            propertyDiv.innerHTML = `
                <a href="propertydetails.html?id=${property.id}" class="property-link">
                    <h3>${property.name}</h3>
                    <img src="${imageUrl}" alt="${property.name} image" /> <!-- Render image -->
                    <p>Location: ${property.location}</p>
                    <p>Price: ${property.price}</p>
                    <p>Size: ${property.size} sqft</p>
                </a>
            `;
    
            propertiesContainer.appendChild(propertyDiv);
        });
    }

    // Function to perform the API call
    async function performSearch(query) {
        const minPrice = minPriceInput.value || '';
        const maxPrice = maxPriceInput.value || '';
        const minSize = minSizeInput.value || '';
        const maxSize = maxSizeInput.value || '';

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/properties/search/?query=${query}&min_price=${minPrice}&max_price=${maxPrice}&min_size=${minSize}&max_size=${maxSize}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`  // Use the access token
                }
            });
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

    // Get the search query from URL and perform search
    const params = new URLSearchParams(window.location.search);
    const queryFromURL = params.get('query');
    if (queryFromURL) {
        searchInput.value = queryFromURL;  // Set the search input
        performSearch(queryFromURL);  // Perform search with the query
    }
});
