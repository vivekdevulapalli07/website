---
layout: page
title: About Me
---

<div class="profile-container">
    <div class="profile">
        <img src="{{ site.baseurl }}/assets/images/profile_pic.jpeg" alt="Vivek Devulapalli">
        <div>
            <h1>Vivek Devulapalli</h1>
            <h2>Postdoctoral Researcher at EMPA</h2>
            <p>I'm an early-career postdoctoral researcher with a strong materials science background, specializing in advanced electron microscopy. I investigate materials ranging from metals to semiconductors, using aberration-corrected STEM to connect atomic structure and composition to properties across scales.</p> 
            <p>My work includes multidimensional imaging, analytical techniques, and STEM simulations for in-depth material characterization. I'm passionate about open science and science communication. Currently, I am working on studying deformation mechanics of metals and multilayer thin films using in situ tensile testing.</p>
        </div>
    </div>

    <div class="contact-brief">
        <p><strong>Email:</strong> <a href="mailto:vivek.devulapalli@empa.ch">vivek.devulapalli@empa.ch</a></p>
        <p><strong>Office:</strong> Feuerwerkstraase 39, Thun 3602</p>
        <p>
            <a href="{{ site.baseurl }}/assets/Devulapalli_CV.pdf" target="_blank" class="profile-link">CV</a> | 
            <a href="https://scholar.google.com/citations?user=TE3lrxoAAAAJ&hl=en" target="_blank" class="profile-link">Google Scholar</a> | 
            <a href="https://orcid.org/0000-0002-1743-3246" target="_blank" class="profile-link">ORCID</a> | 
            <a href="https://www.linkedin.com/in/vivek-devulapalli-stem/" target="_blank" class="profile-link">LinkedIn</a>
        </p>
        <p style="font-size: 0.9rem; margin-top: 1rem; font-style: italic;">For a complete list of my publications, please refer to <a href="https://scholar.google.com/citations?user=TE3lrxoAAAAJ&hl=en" target="_blank" class="profile-link">Google Scholar</a> or <a href="https://orcid.org/0000-0002-1743-3246" target="_blank" class="profile-link">ORCID</a>.</p>
    </div>
</div>

<div class="work-experience-section">
    <h2>Work Experience</h2>
    <div class="education-timeline">
        <div class="education-item">
            <div class="education-year">March 2024 – Present</div>
            <div class="education-content">
                <h3>Postdoctoral Researcher</h3>
                <h4>Empa - Swiss Federal Laboratories for Materials Science and Technology, Thun, Switzerland</h4>
                <ul>
                    <li>Advanced Materials Processing, Laboratory for Mechanics of Materials and Nanostructures</li>
                    <li>Focus: Deformation mechanics of metals and multilayer thin films using in situ tensile testing</li>
                </ul>
            </div>
        </div>

        <div class="education-item">
            <div class="education-year">2022 – 2024</div>
            <div class="education-content">
                <h3>Postdoctoral Researcher</h3>
                <h4>Max-Planck Institut für Eisenforschung, Düsseldorf, Germany</h4>
                <ul>
                    <li>Advanced transmission electron microscopy group</li>
                    <li>Electron microscopy-based study of hydrogen embrittlement in additively manufactured compositionally complex alloys</li>
                </ul>
            </div>
        </div>
    </div>
</div>

<div class="education-section">
    <h2>Education</h2>
    <div class="education-timeline">
        <div class="education-item">
            <div class="education-year">2018 – 2022</div>
            <div class="education-content">
                <h3>Ph.D.</h3>
                <h4>Max-Planck Institut für Eisenforschung, Düsseldorf, Germany</h4>
                <ul>
                    <li>Advanced transmission electron microscopy group, Department of structure and nano-/ micromechanics of materials</li>
                    <li>Thesis: <a href="https://doi.org/10.5281/zenodo.14909664" target="_blank" class="profile-link">Microstructure and grain boundary evolution in titanium thin films</a></li>
                    <li>Supervisor: Prof. Gerhard Dehm, Group leader: Dr. Christian Liebscher</li>
                </ul>
            </div>
        </div>

        <div class="education-item">
            <div class="education-year">2016 – 2018</div>
            <div class="education-content">
                <h3>M.Tech.</h3>
                <h4>Indian Institute of Technology, Madras, India</h4>
                <ul>
                    <li>Metallurgical and materials engineering department</li>
                    <li>Thesis: Correlative microscopy of Magnesium - rare-earth alloys</li>
                    <li>Thesis work performed as a DAAD exchange program at Materials Chemistry, RWTH Aachen, Germany with Prof. Jochen Schneider</li>
                    <li>Supervisors: Prof. B S Murty, Prof. K G Pradeep</li>
                </ul>
            </div>
        </div>

        <div class="education-item">
            <div class="education-year">2012 – 2016</div>
            <div class="education-content">
                <h3>B.Tech.</h3>
                <h4>National Institute of Technology, Raipur, India</h4>
                <ul>
                    <li>Metallurgical engineering</li>
                    <li>CGPA: 9.22/10 (Honours)</li>
                </ul>
            </div>
        </div>
    </div>
</div>

<style>
/* Profile container styles */
.profile-container {
    max-width: 800px;
    margin: 0 auto 2rem;
}

/* Profile section styles */
.profile {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
    margin-bottom: 2rem;
}

.profile img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 2px 15px rgba(0,0,0,0.1);
}

.profile div {
    flex: 1;
}

.profile h1 {
    margin: 0 0 0.25rem 0;
    color: #333;
}

.profile h2 {
    margin: 0 0 1rem 0;
    color: #666;
    font-weight: 500;
    font-size: 1.2rem;
}

.profile p {
    margin-bottom: 1rem;
    line-height: 1.6;
}

/* Contact brief styles */
.contact-brief {
    background-color: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.contact-brief p {
    margin: 0.5rem 0;
}

.profile-link {
    color: #0066cc;
    text-decoration: none;
    transition: color 0.2s;
}

.profile-link:hover {
    color: #004499;
    text-decoration: underline;
}

/* Education section styles */
.education-section {
    max-width: 800px;
    margin: 0 auto;
}

.education-section h2 {
    margin-bottom: 1.5rem;
    position: relative;
    padding-bottom: 0.5rem;
}

.education-section h2:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 50px;
    height: 3px;
    background-color: #0066cc;
}

.education-timeline {
    position: relative;
}

.education-item {
    display: flex;
    margin-bottom: 2rem;
    position: relative;
}

.education-year {
    flex: 0 0 150px;
    font-weight: 600;
    color: #555;
    padding-right: 20px;
}

.education-content {
    flex: 1;
    border-left: 3px solid #0066cc;
    padding-left: 20px;
    position: relative;
}

.education-content::before {
    content: '';
    position: absolute;
    left: -9px;
    top: 0;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #0066cc;
}

.education-content h3 {
    margin: 0 0 5px 0;
    color: #24292e;
    font-size: 1.2em;
}

.education-content h4 {
    margin: 0 0 10px 0;
    color: #586069;
    font-size: 1em;
    font-weight: 500;
}

.education-content ul {
    margin: 0;
    padding-left: 20px;
    color: #444;
}

.education-content li {
    margin-bottom: 5px;
}

/* Responsive styles */
@media (max-width: 768px) {
    .profile {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    
    .profile img {
        width: 180px;
        height: 180px;
        margin-bottom: 1rem;
    }
    
    .education-item {
        flex-direction: column;
    }
    
    .education-year {
        margin-bottom: 0.5rem;
        padding-right: 0;
    }
    
    .education-content {
        margin-left: 10px;
    }
}
</style>
