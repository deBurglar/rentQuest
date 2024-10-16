document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const searchInput = document.querySelector('input[type="text"]');
    const searchBtn = document.querySelector('#searchBtn');
    const suggestionsContainer = document.getElementById('suggestions');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const serviceItems = document.querySelectorAll('.service-item');
    const typewriterElement = document.getElementById('typewriter');
    
    // Typewriter effect
    const text = "FIND YOUR PERFECT ACCOMMODATION";
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            typewriterElement.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    typeWriter();

    // Header background change on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(30, 58, 138, 0.9)';
        } else {
            header.style.backgroundColor = 'rgba(26, 0, 51, 0.7)';
        }
    });

    // Search input animations
    searchInput.addEventListener('focus', function() {
        this.classList.add('pulse');
    });
    searchInput.addEventListener('blur', function() {
        this.classList.remove('pulse');
    });

    // Locations data
    const locations = {
        'H': ['Hussainpur', 'Howrah', 'Hazra', 'Hindustan Park', 'Hatiara', 'Hatibagan'],
        'R': ['Ruby', 'Rajarhat', 'Ranikuthi', 'Rabindra Sadan', 'Rashbehari', 'Ripon Street'],
        'B': ['Baguiati', 'Ballygunge', 'Behala', 'Bansdroni', 'Baranagar', 'Barrackpore'],
        'M': ['Maheshtala', 'Maniktala', 'Minto Park', 'Metiabruz', 'Madhyamgram'],
        'S': ['Salt Lake', 'Shyambazar', 'Sonarpur', 'Sealdah', 'Santoshpur']
    };

    // Function to show suggestions
    function showSuggestions(value) {
        suggestionsContainer.innerHTML = '';
        if (value === '') {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const firstLetter = value.charAt(0).toUpperCase();
        
        const matchingLocations = locations[firstLetter] || [];
        const filtered = matchingLocations.filter(place => 
            place.toLowerCase().startsWith(value.toLowerCase())
        );

        if (filtered.length > 0) {
            filtered.forEach(place => {
                const div = document.createElement('div');
                div.textContent = place;
                div.addEventListener('click', () => {
                    searchInput.value = place;
                    suggestionsContainer.style.display = 'none';
                });
                suggestionsContainer.appendChild(div);
            });
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    }

    // Event listener for input changes
    searchInput.addEventListener('input', function() {
        showSuggestions(this.value);
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target !== searchInput && e.target !== suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    });

    // Prevent form submission on Enter key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });

    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            // Redirect to searchresults.html with the query as a URL parameter
            window.location.href = `searchresults.html?query=${encodeURIComponent(query)}`;
        }
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

    // Intersection Observer for gallery items
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    galleryItems.forEach(item => {
        observer.observe(item);
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });

            // Add a class to trigger the transition
            targetSection.classList.add('active');

            // Remove the class after the transition
            setTimeout(() => {
                targetSection.classList.remove('active');
            }, 1000);
        });
    });

    // Intersection Observer for service items
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    serviceItems.forEach(item => {
        serviceObserver.observe(item);
    });
});

// document.addEventListener('DOMContentLoaded', function() {
//     const header = document.querySelector('header');
//     const searchInput = document.querySelector('input[type="text"]');
//     const searchBtn = document.querySelector('#searchBtn');
//     const suggestionsContainer = document.getElementById('suggestions');
//     const galleryItems = document.querySelectorAll('.gallery-item');
//     const serviceItems = document.querySelectorAll('.service-item');
    
//     // Header background change on scroll
//     window.addEventListener('scroll', function() {
//         if (window.scrollY > 50) {
//             header.style.backgroundColor = 'rgba(30, 58, 138, 0.9)';
//         } else {
//             header.style.backgroundColor = 'rgba(26, 0, 51, 0.7)';
//         }
//     });

//     // Search input animations
//     searchInput.addEventListener('focus', function() {
//         this.classList.add('pulse');
//     });
//     searchInput.addEventListener('blur', function() {
//         this.classList.remove('pulse');
//     });

//     // Locations data
//     const locations = {
//         'H': ['Hussainpur', 'Howrah', 'Hazra', 'Hindustan Park', 'Hatiara', 'Hatibagan'],
//         'R': ['Ruby', 'Rajarhat', 'Ranikuthi', 'Rabindra Sadan', 'Rashbehari', 'Ripon Street'],
//         'B': ['Baguiati', 'Ballygunge', 'Behala', 'Bansdroni', 'Baranagar', 'Barrackpore'],
//         'M': ['Maheshtala', 'Maniktala', 'Minto Park', 'Metiabruz', 'Madhyamgram'],
//         'S': ['Salt Lake', 'Shyambazar', 'Sonarpur', 'Sealdah', 'Santoshpur']
//     };

//     // Function to show suggestions
//     function showSuggestions(value) {
//         suggestionsContainer.innerHTML = '';
//         if (value === '') {
//             suggestionsContainer.style.display = 'none';
//             return;
//         }

//         const firstLetter = value.charAt(0).toUpperCase();
        
//         const matchingLocations = locations[firstLetter] || [];
//         const filtered = matchingLocations.filter(place => 
//             place.toLowerCase().startsWith(value.toLowerCase())
//         );

//         if (filtered.length > 0) {
//             filtered.forEach(place => {
//                 const div = document.createElement('div');
//                 div.textContent = place;
//                 div.addEventListener('click', () => {
//                     searchInput.value = place;
//                     suggestionsContainer.style.display = 'none';
//                 });
//                 suggestionsContainer.appendChild(div);
//             });
//             suggestionsContainer.style.display = 'block';
//         } else {
//             suggestionsContainer.style.display = 'none';
//         }
//     }

//     // Event listener for input changes
//     searchInput.addEventListener('input', function() {
//         showSuggestions(this.value);
//     });

//     // Close suggestions when clicking outside
//     document.addEventListener('click', function(e) {
//         if (e.target !== searchInput && e.target !== suggestionsContainer) {
//             suggestionsContainer.style.display = 'none';
//         }
//     });

//     // Prevent form submission on Enter key
//     searchInput.addEventListener('keydown', function(e) {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//         }
//     });

//     searchBtn.addEventListener('click', function() {
//         const query = searchInput.value.trim();
//         if (query) {
//             // Redirect to searchresults.html with the query as a URL parameter
//             window.location.href = `searchresults.html?query=${encodeURIComponent(query)}`;
//         }
//     });

//     // Animated background
//     const starsElement = document.querySelector('.stars');
//     let starsPosition = 0;
//     function animateStars() {
//         starsPosition -= 0.1;
//         if (starsPosition <= -100) {
//             starsPosition = 0;
//         }
//         starsElement.style.backgroundPosition = `0 ${starsPosition}%`;
//         requestAnimationFrame(animateStars);
//     }
//     animateStars();

//     // Intersection Observer for gallery items
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 entry.target.classList.add('visible');
//             }
//         });
//     }, { threshold: 0.1 });

//     galleryItems.forEach(item => {
//         observer.observe(item);
//     });

//     // Smooth scrolling for navigation links
//     const navLinks = document.querySelectorAll('nav a');

//     navLinks.forEach(link => {
//         link.addEventListener('click', function(e) {
//             e.preventDefault();
//             const targetId = this.getAttribute('href');
//             const targetSection = document.querySelector(targetId);
            
//             targetSection.scrollIntoView({
//                 behavior: 'smooth'
//             });

//             // Add a class to trigger the transition
//             targetSection.classList.add('active');

//             // Remove the class after the transition
//             setTimeout(() => {
//                 targetSection.classList.remove('active');
//             }, 1000);
//         });
//     });

//     // Intersection Observer for service items
//     const serviceObserver = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 entry.target.classList.add('visible');
//             }
//         });
//     }, { threshold: 0.1 });

//     serviceItems.forEach(item => {
//         serviceObserver.observe(item);
//     });
// });