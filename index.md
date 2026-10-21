---
layout: page
title: Research
banner: large
headline: Vivek Devulapalli
eyebrow: Postdoctoral Researcher · Empa, Thun
subtitle: I use aberration-corrected and in situ electron microscopy to connect atomic structure to how metals and thin films deform and fail.
banner_links:
  - label: Download CV
    url: /assets/Devulapalli_CV.pdf
  - label: Google Scholar
    url: https://scholar.google.com/citations?user=TE3lrxoAAAAJ&hl=en
  - label: Email
    url: mailto:vivek.devulapalli@empa.ch
---

<style>
	/* Carousel Styles */
	.carousel {
		position: relative;
		max-width: 860px;
		margin: 0 auto;
		overflow: hidden;
		aspect-ratio: 16/9;
		background: #f3f6f8;
		border-radius: 6px;
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

	.carousel img,
	.carousel video {
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
		background: rgba(8,47,71,0.6);
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
		background: rgba(8,47,71,0.85);
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
		background: #c5ced6;
		cursor: pointer;
		padding: 0;
	}

	.carousel-indicators button.active {
		background: #0c4466;
	}

	.carousel-indicators button:hover {
		background: #5c6773;
	}

	.caption {
		text-align: center;
		margin-top: 1rem;
		color: #5c6773;
		font-size: 0.9rem;
		padding: 0 1rem;
	}

	/* On phones a fixed 16:9 box leaves ~110px for the image, so let each
	   slide size to its content instead (the script hides inactive slides). */
	@media (max-width: 600px) {
		.carousel {
			aspect-ratio: auto;
			margin: 1rem auto;
		}

		.carousel .slide {
			position: relative;
			padding: 0.5rem 0.5rem 2rem;
		}

		.carousel .slide:not(.active) {
			display: none;
		}

		.carousel .media-container {
			height: auto;
		}

		.carousel img,
		.carousel video {
			width: 100%;
			max-height: 70vh;
		}

		.carousel-control {
			top: 40%;
			width: 36px;
			height: 36px;
			padding: 0;
			font-size: 16px;
		}

		.carousel-control.prev {
			left: 0.5rem;
		}

		.carousel-control.next {
			right: 0.5rem;
		}

		.carousel-indicators {
			bottom: 0.75rem;
		}

		.caption {
			margin-top: 0.5rem;
			font-size: 0.85rem;
		}
	}
</style>

<section class="bio">
	<aside class="bio__side">
		<img class="bio__photo" src="{{ site.baseurl }}/assets/images/Vivek_CV_picture.jpg" alt="Portrait of Vivek Devulapalli">

		<h2 class="side-heading">Research interests</h2>
		<ul class="interest-list">
			<li>Aberration-corrected STEM</li>
			<li>In situ TEM mechanical testing</li>
			<li>4D-STEM</li>
			<li>Grain boundaries &amp; segregation</li>
			<li>Metallic &amp; amorphous multilayers</li>
			<li>Hydrogen embrittlement</li>
			<li>Correlative microscopy &amp; APT</li>
			<li>STEM image simulation</li>
		</ul>

		<h2 class="side-heading">Contact</h2>
		<p class="side-text">
			<a href="mailto:vivek.devulapalli@empa.ch">vivek.devulapalli@empa.ch</a><br>
			Laboratory for Mechanics of Materials and Nanostructures, Empa, Thun
		</p>
	</aside>

	<div class="bio__main">
		<h2 class="section-heading">About</h2>
		<p class="lead">I'm a materials scientist specializing in advanced electron microscopy. I study materials ranging from metals to semiconductors, using aberration-corrected STEM to connect atomic structure and composition to properties across length scales.</p>
		<p>My work combines multidimensional imaging, analytical techniques and STEM simulations for in-depth materials characterization. At Empa I investigate the deformation mechanics of metals and multilayer thin films with in situ TEM tensile testing, and develop methods for observing nanoscale phenomena in real time. Before that, I was a PhD student and postdoc at the Max-Planck-Institut für Eisenforschung in Düsseldorf. I care about open science and science communication.</p>

		<div class="callout">
			<p class="callout__label">Current fellowship</p>
			<h3>Mapping nanoscale deformation mechanics in amorphous oxide multilayer coatings (MOSAIC)</h3>
			<p>Empa Young Scientist Fellowship 2026 · Principal investigator · CHF 270,000</p>
			<p><a href="{{ site.baseurl }}/proposal/eysf-2026/">Read about the project &rarr;</a></p>
		</div>

		<h2 class="section-heading">Education</h2>
		<dl class="facts">
			<dt>2022</dt>
			<dd>Ph.D. · <em>Microstructure and grain boundary evolution in titanium thin films</em><span class="facts__where">Max-Planck-Institut für Eisenforschung, Düsseldorf</span></dd>
			<dt>2018</dt>
			<dd>M.Tech., Metallurgical and Materials Engineering<span class="facts__where">Indian Institute of Technology Madras</span></dd>
			<dt>2016</dt>
			<dd>B.Tech., Metallurgical Engineering<span class="facts__where">National Institute of Technology Raipur</span></dd>
		</dl>
	</div>
</section>

<section class="home-section">
	<h2 class="section-heading">Research highlights</h2>
<div class="carousel" id="research-carousel">
	<div class="carousel-inner">
		{% for image in site.data.research_images %}
			<div class="slide">
				<div class="media-container">
					{% assign file_extension = image.file | split: '.' | last | downcase %}
					{% if file_extension == 'mp4' %}
						<video controls muted loop playsinline preload="none"
							   poster="{{ site.baseurl }}/assets/images/research/{{ image.poster }}">
							<source src="{{ site.baseurl }}/assets/images/research/{{ image.file }}" type="video/mp4">
						</video>
					{% elsif file_extension == 'gif' %}
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

</section>

<section class="home-section">
	<h2 class="section-heading">Research focus</h2>
	<p class="section-intro">I study how materials behave at the atomic scale, combining aberration-corrected STEM, in situ TEM testing and multidimensional characterization to connect structure and properties across length scales.</p>

	<div class="focus-grid">
		<div class="focus-item">
			<span class="focus-item__num">01</span>
			<h3>Advanced electron microscopy</h3>
			<p>Aberration-corrected STEM imaging, analytical techniques and STEM simulations for atomic-scale characterization.</p>
		</div>

		<div class="focus-item">
			<span class="focus-item__num">02</span>
			<h3>In situ TEM testing</h3>
			<p>Real-time observation of deformation mechanisms in metals and multilayer thin films using specialized TEM holders.</p>
		</div>

		<div class="focus-item">
			<span class="focus-item__num">03</span>
			<h3>Grain boundary engineering</h3>
			<p>Grain boundary structure, segregation phenomena and their impact on material properties.</p>
		</div>

		<div class="focus-item">
			<span class="focus-item__num">04</span>
			<h3>Multiscale characterization</h3>
			<p>Connecting atomic structure and composition to macroscopic properties through comprehensive materials analysis.</p>
		</div>
	</div>
</section>

<script>
	let slideIndex = 1;
	let timer = null;

	function scheduleAutoAdvance() {
		if (timer) clearTimeout(timer);
		const activeSlide = document.querySelector('.slide.active');
		const activeVideo = activeSlide && activeSlide.querySelector('video');
		// Don't auto-advance away from a video that's currently playing
		if (activeVideo && !activeVideo.paused) return;
		timer = setTimeout(() => moveSlide(1), 8000);
	}

	function showSlides(n) {
		const slides = document.querySelectorAll('.slide');
		const indicators = document.querySelectorAll('.carousel-indicators button');
		
		if (!slides.length) return;
		
		if (n > slides.length) slideIndex = 1;
		if (n < 1) slideIndex = slides.length;
		
		slides.forEach(slide => {
			slide.style.display = 'none';
			slide.classList.remove('active');
			// Pause and rewind any video on slides we're leaving
			const video = slide.querySelector('video');
			if (video) video.pause();
		});
		
		indicators.forEach(indicator => {
			indicator.classList.remove('active');
		});
		
		slides[slideIndex - 1].style.display = 'flex';
		slides[slideIndex - 1].classList.add('active');
		indicators[slideIndex - 1].classList.add('active');
		
		scheduleAutoAdvance();
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

			// Pause auto-advance while a video is playing; resume when it stops
			document.querySelectorAll('.slide video').forEach(video => {
				video.addEventListener('play', () => { if (timer) clearTimeout(timer); });
				video.addEventListener('pause', scheduleAutoAdvance);
				video.addEventListener('ended', scheduleAutoAdvance);
			});
		}
	});
</script>