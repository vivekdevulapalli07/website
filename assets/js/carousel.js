// assets/js/carousel.js
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.slide');
    const prevButton = carousel.querySelector('.carousel-control.prev');
    const nextButton = carousel.querySelector('.carousel-control.next');
    const indicators = carousel.querySelectorAll('.carousel-indicators button');
    const slideCount = slides.length;
    let currentSlide = 0;
    
    function updateCarousel() {
        const container = carousel.querySelector('.carousel-inner');
        container.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateCarousel();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateCarousel();
    }
    
    // Event listeners
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
        });
    });
    
    // Optional: Auto-advance every 5 seconds
    setInterval(nextSlide, 5000);
});
