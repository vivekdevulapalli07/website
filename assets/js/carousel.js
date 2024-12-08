class ResearchCarousel {
    constructor(element) {
        this.container = element;
        this.track = element.querySelector('.carousel-track');
        this.slides = Array.from(element.querySelectorAll('.carousel-slide'));
        this.indicators = Array.from(element.querySelectorAll('.carousel-indicator'));
        this.currentIndex = 0;
        this.slideWidth = 100; // percentage
        this.autoplayInterval = null;
        
        // Initialize
        this.setupEventListeners();
        this.updateCarousel();
        this.startAutoplay();
    }

    setupEventListeners() {
        // Prev/Next buttons
        this.container.querySelector('.prev').addEventListener('click', () => this.prev());
        this.container.querySelector('.next').addEventListener('click', () => this.next());

        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());

        // Handle touch events
        let touchStartX = 0;
        let touchEndX = 0;

        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        });
    }

    updateCarousel() {
        // Update transform
        const offset = -this.currentIndex * this.slideWidth;
        this.track.style.transform = `translateX(${offset}%)`;

        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }

    goToSlide(index) {
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
        if (this.slides.length > 1) {
            this.stopAutoplay(); // Clear any existing interval
            this.autoplayInterval = setInterval(() => this.next(), 5000);
        }
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
    const carousels = document.querySelectorAll('.research-carousel');
    carousels.forEach(carousel => new ResearchCarousel(carousel));
});