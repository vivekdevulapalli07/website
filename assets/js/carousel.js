// Save this as assets/js/carousel.js
class ResearchCarousel {
    constructor(element) {
        console.log('Initializing carousel...');
        this.container = element;
        
        // Log the raw data attribute
        console.log('Raw data-images attribute:', this.container.getAttribute('data-images'));
        
        try {
            this.images = JSON.parse(this.container.getAttribute('data-images') || '[]');
            console.log('Parsed images data:', this.images);
        } catch (error) {
            console.error('Error parsing images data:', error);
            this.images = [];
        }

        this.baseUrl = document.querySelector('meta[name="baseurl"]')?.getAttribute('content') || '';
        console.log('Base URL:', this.baseUrl);
        
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
            
            // Log the full image path being used
            const imagePath = `${this.baseUrl}/assets/images/research/${image.file}`;
            console.log(`Creating slide ${index + 1}:`, imagePath);
            
            slide.innerHTML = `
                <img src="${imagePath}" 
                     alt="${image.caption}"
                     loading="${index === 0 ? 'eager' : 'lazy'}"
                     onerror="console.error('Failed to load image:', '${imagePath}')"
                     onload="console.log('Successfully loaded image:', '${imagePath}')">
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

        // Initialize first slide
        this.currentSlide = 0;
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
        console.log('Updating to slide:', this.currentSlide);
        this.track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        // Update indicators
        const indicators = this.container.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
}

// Initialize all carousels when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Document ready, looking for carousels...');
    const carousels = document.querySelectorAll('.research-carousel');
    console.log('Found carousels:', carousels.length);
    carousels.forEach(carousel => new ResearchCarousel(carousel));
});