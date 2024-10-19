document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('property-form');
    const responseMessage = document.getElementById('response-message');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Create a FormData object for the property data
        const formData = new FormData(form);
        const token = localStorage.getItem('token');  // Assuming you're storing tokens in localStorage

        // Remove the images from the property FormData to send them separately
        const images = formData.getAll('images'); // Store the images for later
        const propertyId = formData.get('property_id'); // Get the property ID
        formData.delete('images'); // Remove images from the property data

        try {
            // Send the property data first
            const response = await fetch('http://127.0.0.1:8000/api/properties/properties/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                // Show success message for property creation
                responseMessage.style.display = 'block';
                responseMessage.textContent = 'Property created successfully! Property ID: ' + result.id;
                responseMessage.style.color = 'green';

                // Now upload the images to the specified endpoint
                const imageFormData = new FormData();
                images.forEach(image => {
                    imageFormData.append('image', image); // Use 'image' field name
                });

                // Include the property_id in the imageFormData
                imageFormData.append('property_id', result.id);

                try {
                    // Send the images to the PropertyImage endpoint
                    const imageResponse = await fetch(`http://127.0.0.1:8000/api/properties/property-images/`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: imageFormData
                    });

                    const imageResult = await imageResponse.json();

                    if (!imageResponse.ok) {
                        throw new Error(imageResult.message || 'Error uploading images');
                    }

                    // Optionally, redirect to the property list or details page
                    setTimeout(() => {
                        window.location.href = `propertyDetails.html?id=${result.id}`;
                    }, 3000);

                } catch (imageError) {
                    // Show error message for image upload
                    responseMessage.style.display = 'block';
                    responseMessage.textContent = 'Error uploading images: ' + imageError.message;
                    responseMessage.style.color = 'red';
                }

            } else {
                // Show error message for property creation
                responseMessage.style.display = 'block';
                responseMessage.textContent = result.message || 'Error creating property';
                responseMessage.style.color = 'red';
            }
        } catch (error) {
            // Show error message for network issues
            responseMessage.style.display = 'block';
            responseMessage.textContent = 'An error occurred: ' + error.message;
            responseMessage.style.color = 'red';
        }
    });
});
