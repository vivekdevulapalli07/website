---
layout: page
title: Research
---

<style>
	/* Carousel Styles */
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
		height: calc(100% - 60px);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.carousel img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0,0,0,0.1);
	}

	.carousel img.gif-image {
		pointer-events: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
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
		position: absolute;
		bottom: 1rem;
		left: 0;
		right: 0;
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

	.caption {
		text-align: center;
		margin-top: 1rem;
		color: #333;
		font-size: 0.9rem;
		padding: 0 1rem;
	}

	/* Research Overview Section */
	.research-overview {
		max-width: 800px;
		margin: 4rem auto 2rem;
		padding: 0 1rem;
		text-align: center;
	}

	.research-overview h2 {
		color: #333;
		margin-bottom: 1.5rem;
	}

	.research-overview p {
		font-size: 1.1rem;
		line-height: 1.7;
		color: #555;
		margin-bottom: 1rem;
	}

	.research-highlights {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		margin: 3rem auto;
		max-width: 800px;
	}

	.highlight-card {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 15px rgba(0,0,0,0.1);
		transition: transform 0.2s ease;
	}

	.highlight-card:hover {
		transform: translateY(-3px);
	}

	.highlight-card h3 {
		color: #0066cc;
		margin-bottom: 1rem;
	}

	.highlight-card p {
		color: #666;
		font-size: 0.95rem;
		line-height: 1.6;
	}
</style>

<!-- Research Carousel -->
<div class="carousel" id="research-carousel">
	<div class="carousel-inner">
		{% for image in site.data.research_images %}
			<div class="slide">
				<div class="media-container">
					{% assign file_extension = image.file | split: '.' | last %}
					{% if file_extension == 'gif' %}
						<img src="{{ site.baseurl }}/assets/images/research/{{ image.file }}" 
							 alt="{{ image.caption }}"
							 class="gif-image"
							 loading="lazy">
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
					aria-label="Go to slide {{ forloop.index }}"
					class="{% if forloop.first %}active{% endif %}">
			</button>
		{% endfor %}
	</div>
</div>

<!-- Research Overview Section -->
<div class="research-overview">
	<h2>Research Focus</h2>
	<p>My research focuses on understanding materials behavior at the atomic scale using advanced electron microscopy techniques. I specialize in aberration-corrected STEM, in-situ TEM testing, and multidimensional characterization to connect structure and properties across different length scales.</p>
	
	<p>Currently at EMPA, I investigate deformation mechanics of metals and multilayer thin films using in-situ tensile testing, while developing new methodologies for real-time observation of nanoscale phenomena.</p>
</div>

<!-- Research Highlights -->
<div class="research-highlights">
	<div class="highlight-card">
		<h3>Advanced Electron Microscopy</h3>
		<p>Aberration-corrected STEM imaging, analytical techniques, and STEM simulations for atomic-scale material characterization.</p>
	</div>
	
	<div class="highlight-card">
		<h3>In-situ TEM Testing</h3>
		<p>Real-time observation of deformation mechanisms in metals and multilayer thin films using specialized TEM holders.</p>
	</div>
	
	<div class="highlight-card">
		<h3>Grain Boundary Engineering</h3>
		<p>Understanding grain boundary structure, segregation phenomena, and their impact on material properties.</p>
	</div>
	
	<div class="highlight-card">
		<h3>Multiscale Characterization</h3>
		<p>Connecting atomic structure and composition to macroscopic properties through comprehensive material analysis.</p>
	</div>
</div>

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
		
		slides[slideIndex - 1].style.display = 'flex';
		slides[slideIndex - 1].classList.add('active');
		indicators[slideIndex - 1].classList.add('active');
		
		// Reset timer
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => moveSlide(1), 8000);
	}

	function moveSlide(n) {
		showSlides(slideIndex += n);
	}

	function currentSlide(n) {
		showSlides(slideIndex = n);
	}

	// Initialize carousel
	document.addEventListener('DOMContentLoaded', function() {
		if (document.querySelector('.carousel')) {
			showSlides(slideIndex);
		}
	});
</script>