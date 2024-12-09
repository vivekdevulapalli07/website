---
layout: page
title: Research
---

<div class="research-content">
    <div class="carousel" id="research-carousel">
        <div class="carousel-inner">
            {% for image in site.data.research_images %}
            <div class="slide">
                <img src="{{ site.baseurl }}/assets/images/research/{{ image.file }}" alt="{{ image.caption }}">
                <p class="caption">{{ image.caption }}</p>
            </div>
            {% endfor %}
        </div>
        
        <button class="carousel-control prev" aria-label="Previous slide">&larr;</button>
        <button class="carousel-control next" aria-label="Next slide">&rarr;</button>
        
        <div class="carousel-indicators">
            {% for image in site.data.research_images %}
            <button aria-label="Go to slide {{ forloop.index }}"></button>
            {% endfor %}
        </div>
    </div>
</div>


<div class="blog-posts">
    {% for post in site.posts %}
    <article class="post-preview">
        <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
        <p class="post-meta">{{ post.date | date: "%B %d, %Y" }}</p>
        {{ post.excerpt }}
        <a href="{{ post.url | relative_url }}" class="read-more">Read More</a>
    </article>
    {% endfor %}
</div>


<!-- Add script at the bottom of the page -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('research-carousel');
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
    if (prevButton) prevButton.addEventListener('click', prevSlide);
    if (nextButton) nextButton.addEventListener('click', nextSlide);
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
        });
    });
    
    // Optional: Auto-advance every 5 seconds
    setInterval(nextSlide, 5000);
});
</script>
