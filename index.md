---
layout: page
title: Research
---

<div class="carousel" id="research-carousel">
    <div class="carousel-inner">
        {% for image in site.data.research_images %}
        <div class="slide">
            <div class="media-container">
                {% assign file_extension = image.file | split: '.' | last %}
                {% if file_extension == 'gif' %}
                    <video autoplay loop muted playsinline>
                        <source src="{{ site.baseurl }}/assets/images/research/{{ image.file }}" type="video/gif">
                    </video>
                {% else %}
                    <img src="{{ site.baseurl }}/assets/images/research/{{ image.file }}" 
                         alt="{{ image.caption }}"
                         loading="lazy">
                {% endif %}
            </div>
            <p class="caption">{{ image.caption }}</p>
        </div>
        {% endfor %}
    </div>
    
    <button class="carousel-control prev" onclick="moveSlide(-1)">&larr;</button>
    <button class="carousel-control next" onclick="moveSlide(1)">&rarr;</button>
    
    <div class="carousel-indicators">
        {% for image in site.data.research_images %}
        <button onclick="currentSlide({{ forloop.index }})" 
                aria-label="Go to slide {{ forloop.index }}"></button>
        {% endfor %}
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

<style>
.carousel {
    position: relative;
    max-width: 800px;
    margin: 2rem auto;
    overflow: hidden;
    aspect-ratio: 16/9;
    background: #f8f9fa;
    border-radius: 8px;
}

.carousel .slide {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    padding: 1rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.carousel .slide.active {
    opacity: 1;
    z-index: 1;
}

.carousel .media-container {
    width: 100%;
    height: calc(100% - 60px); /* Reserve space for caption */
    display: flex;
    align-items: center;
    justify-content: center;
}

.carousel img, 
.carousel video {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.carousel-control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0,0,0,0.5);
    color: white;
    padding: 1rem;
    border: none;
    cursor: pointer;
    z-index: 10;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.carousel-control:hover {
    background: rgba(0,0,0,0.7);
}

.carousel-control.prev {
    left: 1rem;
}

.carousel-control.next {
    right: 1rem;
}

.carousel-indicators {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
}

.carousel-indicators button {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: none;
    background: #ccc;
    cursor: pointer;
    padding: 0;
}

.carousel-indicators button.active {
    background: #666;
}

.carousel-indicators button:hover {
    background: #999;
}
</style>

<script>
let slideIndex = 1;
let timer = null;

function showSlides(n) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.carousel-indicators button');
    
    if (!slides.length) return;
    
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
    
    slides.forEach(slide => {
        slide.style.display = 'none';
        slide.classList.remove('active');
    });
    
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    slides[slideIndex - 1].style.display = 'block';
    slides[slideIndex - 1].classList.add('active');
    indicators[slideIndex - 1].classList.add('active');
    
    // Reset timer
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => moveSlide(1), 5000);
}

function moveSlide(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

// Initialize carousel after Jekyll has loaded all content
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.carousel')) {
        showSlides(slideIndex);
    }
});
</script>