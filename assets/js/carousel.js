// Save as assets/js/carousel.js
class ResearchCarousel {
    constructor(element) {
        console.log('Initializing carousel...');
        this.container = element;
        this.currentSlide = 0;
        
        // Get the track and slides that are already in the DOM
        this.track = this.container.querySelector('.carousel-track');
        this.slides = Array.from(this.container.querySelectorAll('.carousel-slide'));
        
        console.log(`Found ${this.slides.length} slides`);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize first slide
        this.updateSlides();
        
        // Start autoplay if more than one slide
        if (this.slides.length > 1) {
            this.startAutoplay();
        }
    }

    setupEventListeners() {
        // Navigation buttons
        const prevButton = this.container.querySelector('.prev');
        const nextButton = this.container.querySelector('.next');
        
        if (prevButton) prevButton.addEventListener('click', () => this.prevSlide());
        if (nextButton) nextButton.addEventListener('click', () => this.nextSlide());
        
        // Indicator buttons
        const indicators = this.container.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }

    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.currentSlide = index;
            this.updateSlides();
        }
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlides();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlides();
    }

    updateSlides() {
        // Update track position
        if (this.track) {
            this.track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }
        
        // Update indicators
        const indicators = this.container.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    startAutoplay() {
        this.stopAutoplay(); // Clear any existing interval
        this.autoplayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// Initialize all carousels when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Document ready, looking for carousels...');
    const carousels = document.querySelectorAll('.research-carousel');
    console.log('Found carousels:', carousels.length);
    carousels.forEach(carousel => new ResearchCarousel(carousel));
});