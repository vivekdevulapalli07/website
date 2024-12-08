class ResearchCarousel {
    constructor(container) {
        // Elements
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.slides = [...container.querySelectorAll('.carousel-slide')];
        this.indicators = [...container.querySelectorAll('.carousel-indicator')];
        
        // State
        this.currentIndex = 0;
        this.slidesCount = this.slides.length;
        
        // Set initial track width
        this.track.style.width = `${this.slidesCount * 100}%`;
        
        // Bind event listeners
        container.querySelector('.prev').addEventListener('click', () => this.prev());
        container.querySelector('.next').addEventListener('click', () => this.next());
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Initial update
        this.updateSlides();
    }

    updateSlides() {
        // Move track to show current slide
        const offset = -this.currentIndex * (100 / this.slidesCount);
        this.track.style.transform = `translateX(${offset}%)`;
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.slidesCount;
        this.updateSlides();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.slidesCount) % this.slidesCount;
        this.updateSlides();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlides();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.research-carousel');
    if (carousel) {
        new ResearchCarousel(carousel);
    }
});