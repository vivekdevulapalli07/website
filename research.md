---
layout: page
title: Research
permalink: /research/
---

<h2>Research Highlights</h2>

<!-- Debug info -->
<script>
console.log('Page loaded');
</script>

{% assign images = site.data.research_images %}
<!-- Debug output -->
<div style="display: none;">
  Raw data: {{ images | inspect }}
</div>

<div id="research-carousel" 
     data-images='{{ images | jsonify | replace: "'", "&#39;" }}'
     data-debug="true">
</div>

<script>
  window.baseurl = "{{ site.baseurl }}";
  console.log('Base URL:', window.baseurl);
  console.log('Carousel container:', document.getElementById('research-carousel'));
  console.log('Images data:', {{ images | jsonify }});
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