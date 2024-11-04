// assets/js/carousel.js

console.log('Carousel script loaded');

class ResearchCarousel {
    constructor(element) {
        console.log('Initializing carousel for:', element);
        this.carousel = element;
        this.track = element.querySelector('.carousel-track');
        this.slides = Array.from(this.track.children);
        this.nextButton = element.querySelector('.next');
        this.prevButton = element.querySelector('.prev');
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000; // 5 seconds between slides

        // Calculate and set initial positions
        this.setSlidePositions();
        
        this.setupListeners();
        this.startAutoplay();
    }

    setSlidePositions() {
        console.log('Setting slide positions');
        const slideWidth = this.slides[0].getBoundingClientRect().width;
        this.slides.forEach((slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        });
    }

    setupListeners() {
        this.nextButton.addEventListener('click', () => {
            console.log('Next button clicked');
            this.move(1);
            this.resetAutoplay();
        });

        this.prevButton.addEventListener('click', () => {
            console.log('Previous button clicked');
            this.move(-1);
            this.resetAutoplay();
        });

        this.carousel.addEventListener('mouseenter', () => {
            this.stopAutoplay();
        });

        this.carousel.addEventListener('mouseleave', () => {
            this.startAutoplay();
        });

        // Touch events
        let touchStartX = 0;
        let touchEndX = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });

        // Add window resize listener
        window.addEventListener('resize', () => {
            this.setSlidePositions();
        });
    }

    move(direction) {
        console.log('Moving carousel:', direction);
        this.currentIndex = (this.currentIndex + direction + this.slides.length) % this.slides.length;
        this.updateSlidePosition();
    }

    updateSlidePosition() {
        const moveX = -this.currentIndex * this.slides[0].getBoundingClientRect().width;
        this.track.style.transform = `translateX(${moveX}px)`;
    }

    handleSwipe(startX, endX) {
        const difference = startX - endX;
        const threshold = 50; // minimum distance for swipe

        if (Math.abs(difference) > threshold) {
            if (difference > 0) {
                // Swipe left
                this.move(1);
            } else {
                // Swipe right
                this.move(-1);
            }
            this.resetAutoplay();
        }
    }

    startAutoplay() {
        if (!this.autoplayInterval) {
            this.autoplayInterval = setInterval(() => {
                this.move(1);
            }, this.autoplayDelay);
        }
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

// Initialize all carousels when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing carousels');
    const carousels = document.querySelectorAll('.research-carousel');
    console.log('Found carousels:', carousels.length);
    carousels.forEach(carousel => new ResearchCarousel(carousel));
});