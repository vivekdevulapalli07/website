class ResearchCarousel {
    constructor(element) {
        this.container = element;
        this.currentSlide = 0;
        this.images = JSON.parse(this.container.getAttribute('data-images') || '[]');
        this.baseUrl = document.querySelector('meta[name="baseurl"]')?.getAttribute('content') || '';
        
        this.init();
    }

    init() {
        // Create carousel structure
        this.container.innerHTML = `
            <div class="carousel-container">
                <div class="carousel-track"></div>
                <button class="carousel-button prev" aria-label="Previous slide">❮</button>
                <button class="carousel-button next" aria-label="Next slide">❯</button>
                <div class="carousel-indicators"></div>
            </div>
        `;

        this.track = this.container.querySelector('.carousel-track');
        
        // Create slides
        this.images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `
                <img src="${this.baseUrl}/assets/images/research/${image.file}" 
                     alt="${image.caption}" 
                     loading="${index === 0 ? 'eager' : 'lazy'}">
                <div class="carousel-caption">${image.caption}</div>
            `;
            this.track.appendChild(slide);
        });

        // Create indicators
        const indicators = this.container.querySelector('.carousel-indicators');
        this.images.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
            indicator.addEventListener('click', () => this.goToSlide(index));
            indicators.appendChild(indicator);
        });

        // Add event listeners
        this.container.querySelector('.prev').addEventListener('click', () => this.prevSlide());
        this.container.querySelector('.next').addEventListener('click', () => this.nextSlide());

        // Start autoplay
        this.startAutoplay();
        
        // Update initial state
        this.updateSlides();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlides();
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.images.length;
        this.updateSlides();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.images.length) % this.images.length;
        this.updateSlides();
    }

    updateSlides() {
        // Update track position
        this.track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        // Update indicators
        const indicators = this.container.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    startAutoplay() {
        this.stopAutoplay(); // Clear any existing interval
        this.autoplayInterval = setInterval(() => this.nextSlide(), 5000);
        
        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
}

// Initialize all carousels when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.research-carousel');
    carousels.forEach(carousel => new ResearchCarousel(carousel));
});