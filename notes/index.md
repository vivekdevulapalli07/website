---
layout: page
title: Research Notes
---

<div class="notes-introduction">
  <p>This is a collection of personal research notes and technical references that I use in my work. Feel free to browse them, though they are primarily maintained for my own reference.</p>
  
  <div class="notes-actions">
    <a href="https://github.com/{{site.github.username}}/website/new/main/notes?filename=new-note.md&value=---%0Alayout%3A%20note%0Atitle%3A%20%22New%20Note%22%0Atags%3A%20%5Breference%5D%0A---%0A%0A%23%20New%20Note%0A%0ABrief%20description%20of%20what%20this%20note%20covers.%0A%0A%23%23%20Key%20Points%0A%0A-%20Point%201%0A-%20Point%202%0A-%20Point%203%0A%0A%23%23%20Details%0A%0AContent%20goes%20here...%0A%0A%23%23%20Examples%0A%0A%60%60%60python%0A%23%20Example%20code%0Aprint(%22Hello%20world%22)%0A%60%60%60%0A%0A%23%23%20References%0A%0A-%20Source%201%0A-%20Source%202" target="_blank" class="new-note-button">+ Create New Note</a>
  </div>
</div>

<div class="search-container">
  <input type="text" id="search-input" placeholder="Search notes...">
</div>

<div class="notes-grid">
  {% assign notes_pages = site.pages | where: "is_note", true %}
  {% for note in notes_pages %}
    {% unless note.path contains "notes/index.md" or note.path contains "notes/_template.md" %}
      <a href="{{ note.url | relative_url }}" class="note-card">
        <h3>{{ note.title }}</h3>
        <div class="note-tags">
          {% for tag in note.tags %}
            <span class="note-tag">{{ tag }}</span>
          {% endfor %}
        </div>
      </a>
    {% endunless %}
  {% endfor %}
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const noteCards = document.querySelectorAll('.note-card');
  
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    
    noteCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const tags = Array.from(card.querySelectorAll('.note-tag'))
                      .map(tag => tag.textContent.toLowerCase());
      
      if (title.includes(query) || tags.some(tag => tag.includes(query))) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});
</script>