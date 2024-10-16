document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('#searchBar');
    const searchBtn = document.querySelector('#searchBtn');
    const suggestionsContainer = document.getElementById('suggestions');
    const propertiesContainer = document.getElementById('properties');
    
    // Optional filters
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const minSizeInput = document.getElementById('minSize');
    const maxSizeInput = document.getElementById('maxSize');

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
            const imageUrl = property.property_images[0]["image"].replace("image/upload/","")

    
            propertyDiv.innerHTML = `
                <h3>${property.name}</h3>
                <img src="${imageUrl}" alt="${property.name} image" /> <!-- Render image -->
                <p>Location: ${property.location}</p>
                <p>Price: ${property.price}</p>
                <p>Size: ${property.size} sqft</p>
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
            const response = await fetch(`http://127.0.0.1:8000/api/properties/search/?query=${query}&min_price=${minPrice}&max_price=${maxPrice}&min_size=${minSize}&max_size=${maxSize}`);
            const data = await response.json();
            console.log(data),
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
});
