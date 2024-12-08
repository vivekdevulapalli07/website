document.addEventListener('DOMContentLoaded', function() {
    // Initialize all carousels on the page
    const carousels = document.querySelectorAll('.research-carousel');
    carousels.forEach(initializeCarousel);
});

function initializeCarousel(carousel) {
    // Only proceed if we found a carousel
    if (!carousel) return;

    // Get carousel elements
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const prevButton = carousel.querySelector('.prev');
    const nextButton = carousel.querySelector('.next');
    const indicators = Array.from(carousel.querySelectorAll('.carousel-indicator'));

    // Only proceed if we have all necessary elements
    if (!track || !slides.length) return;

    let currentIndex = 0;

    // Set initial slide positions
    function updateSlides() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    // Event listeners for navigation buttons
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlides();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlides();
        });
    }

    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateSlides();
        });
    });

    // Initialize the carousel
    updateSlides();

    // Optional: Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlides();
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlides();
        }
    });

    // Optional: Add touch support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50; // minimum distance for a swipe
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left
                currentIndex = (currentIndex + 1) % slides.length;
            } else {
                // Swipe right
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            }
            updateSlides();
        }
    }
}