---
layout: page
title: Research
permalink: /blog/
---

<h2>Research Highlights</h2>

<div id="research-carousel"></div>

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

<script type="text/javascript">
  document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('research-carousel');
    if (container) {
      const root = ReactDOM.createRoot(container);
      root.render(React.createElement(ResearchCarousel));
    }
  });
</script>