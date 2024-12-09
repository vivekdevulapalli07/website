---
layout: page
title: Research
---

<div class="research-content">
    <div class="carousel">
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

<script src="{{ site.baseurl }}/assets/js/carousel.js"></script>

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
