---
layout: page
title: Education
---

<div class="education-timeline">
    <div class="education-item">
        <div class="education-year">2018 – 2022</div>
        <div class="education-content">
            <h3>Ph.D.</h3>
            <h4>Max-Planck Institut für Eisenforschung, Düsseldorf, Germany</h4>
            <ul>
                <li>Advanced transmission electron microscopy group, Department of structure and nano-/ micromechanics of materials</li>
                <li>Thesis: Microstructure and grain boundary evolution in titanium thin films</li>
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

<style>
.education-timeline {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.education-item {
    display: flex;
    margin-bottom: 30px;
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
    border-left: 3px solid #0366d6;
    padding-left: 20px;
    position: relative;
}

.education-content::before {
    content: '';
    position: absolute;
    left: -7px;
    top: 0;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: #0366d6;
}

.education-content h3 {
    margin: 0 0 5px 0;
    color: #24292e;
    font-size: 1.4em;
}

.education-content h4 {
    margin: 0 0 10px 0;
    color: #586069;
    font-size: 1.1em;
    font-weight: 400;
}

.education-content ul {
    margin: 0;
    padding-left: 20px;
    color: #444;
}

.education-content li {
    margin-bottom: 5px;
}

@media (max-width: 600px) {
    .education-item {
        flex-direction: column;
    }
    
    .education-year {
        margin-bottom: 10px;
    }
}
</style>
