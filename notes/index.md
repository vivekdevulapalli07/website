---
layout: page
title: Research Notes
---

<div class="notes-introduction">
  <p>This is a collection of personal research notes and technical references that I use in my work. Feel free to browse them, though they are primarily maintained for my own reference.</p>
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