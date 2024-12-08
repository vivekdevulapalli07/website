class ResearchCarousel {
    constructor(element) {
        this.container = element;
        this.track = element.querySelector('.carousel-track');
        this.slides = Array.from(element.querySelectorAll('.carousel-slide'));
        this.indicators = Array.from(element.querySelectorAll('.carousel-indicator'));
        this.prevButton = element.querySelector('.prev');
        this.nextButton = element.querySelector('.next');
        this.currentIndex = 0;
        
        // Initialize
        this.setupEventListeners();
        this.updateCarousel();
        this.startAutoplay();
    }

    setupEventListeners() {
        // Prev/Next buttons
        this.prevButton.addEventListener('click', () => this.prev());
        this.nextButton.addEventListener('click', () => this.next());

        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }

    updateCarousel() {
        // Calculate the transform value based on current index
        const transform = -(this.currentIndex * (100 / this.slides.length));
        this.track.style.transform = `translateX(${transform}%)`;

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
        this.autoplayInterval = setInterval(() => this.next(), 5000);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
}

// Initialize carousels when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.research-carousel');
    carousels.forEach(carousel => new ResearchCarousel(carousel));
});