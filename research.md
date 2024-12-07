---
layout: page
title: Research
permalink: /research/
---

## Research Highlights

<div class="research-carousel" data-images='{{ site.data.research_images | jsonify }}'>
    <div class="carousel-container">
        <div class="carousel-track">
            {% for image in site.data.research_images %}
            <div class="carousel-slide">
                <img src="{{ '/assets/images/research/' | append: image.file | relative_url }}" 
                     alt="{{ image.caption }}">
                <div class="carousel-caption">{{ image.caption }}</div>
            </div>
            {% endfor %}
        </div>
        <button class="carousel-button prev">❮</button>
        <button class="carousel-button next">❯</button>
        <div class="carousel-indicators">
            {% for image in site.data.research_images %}
            <button class="carousel-indicator" aria-label="Go to slide {{ forloop.index }}"></button>
            {% endfor %}
        </div>
    </div>
</div>

<h2>Highlights</h2>

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