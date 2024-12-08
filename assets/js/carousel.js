class ResearchCarousel {
    constructor(element) {
        this.container = element;
        this.track = element.querySelector('.carousel-track');
        this.slides = Array.from(element.querySelectorAll('.carousel-slide'));
        this.indicators = Array.from(element.querySelectorAll('.carousel-indicator'));
        this.currentIndex = 0;
        
        // Calculate slide width percentage based on number of slides
        this.slideWidth = 100 / this.slides.length;
        
        // Set up event listeners
        element.querySelector('.prev').addEventListener('click', () => this.prev());
        element.querySelector('.next').addEventListener('click', () => this.next());
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Initialize position
        this.updateCarousel();
        
        // Set up autoplay
        this.startAutoplay();
        
        // Handle mouse interactions
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }

    updateCarousel() {
        // Move the track to show the current slide
        const offset = -this.currentIndex * this.slideWidth;
        this.track.style.transform = `translateX(${offset}%)`;
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }

    goToSlide(index) {
        // Handle wrap-around
        if (index < 0) {
            index = this.slides.length - 1;
        } else if (index >= this.slides.length) {
            index = 0;
        }
        
        this.currentIndex = index;
        this.updateCarousel();
    }

    next() {
        this.goToSlide(this.currentIndex + 1);
    }

    prev() {
        this.goToSlide(this.currentIndex - 1);
    }

    startAutoplay() {
        this.stopAutoplay(); // Clear any existing interval
        this.autoplayInterval = setInterval(() => this.next(), 5000);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// Initialize all carousels when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.research-carousel');
    carousels.forEach(carousel => new ResearchCarousel(carousel));
});