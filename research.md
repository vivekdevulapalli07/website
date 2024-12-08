---
layout: page
title: Research
permalink: /research/
---


<h2>Research Highlights</h2>

<div class="research-carousel">
  <div class="carousel-container">
    <div class="carousel-track">
      {% for image in site.data.research_images %}
        <div class="carousel-slide">
          <img src="{{ site.baseurl }}/assets/images/research/{{ image.file }}" alt="{{ image.caption }}">
          <p class="carousel-caption">{{ image.caption }}</p>
        </div>
      {% endfor %}
    </div>
  </div>
  
  <button class="carousel-button prev" aria-label="Previous slide">❮</button>
  <button class="carousel-button next" aria-label="Next slide">❯</button>
  
  <div class="carousel-indicators">
    {% for image in site.data.research_images %}
      <button class="carousel-indicator {% if forloop.first %}active{% endif %}" 
              aria-label="Go to slide {{ forloop.index }}"></button>
    {% endfor %}
  </div>
</div>

<!-- Initialize carousel -->
<script src="{{ site.baseurl }}/assets/js/carousel.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    new ResearchCarousel(document.querySelector('.research-carousel'));
  });
</script>

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