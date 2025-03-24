---
layout: post
title: "In-situ Tensile Testing in TEM"
date: 2024-11-01
categories: [research, microscopy]
---

I joined EMPA as a postdoc in April 2024. Like many postdocs, I quickly found myself juggling multiple projects at once. In the beginning, it was a challenge to shift gears between different topics within the same week. I often wonder if postdocs would benefit from focusing on just one project at a time. Just when you start gaining momentum on one, you have to switch to another, and that flow is lost.

That said, I was fortunate to be funded by a project that gave me the freedom to explore my own scientific interests—an incredible luxury for any aspiring researcher. However, not having a dedicated project can be a double-edged sword. It can mean spending time on ideas that, while interesting, may not be impactful for the broader scientific community or might have a high risk of failure.

One of the main projects I dove into was in-situ tensile testing using our Gatan 654 straining holder in the TEM. The biggest limitation of this holder is that it lacks a load cell, meaning you can observe deformation mechanisms but can’t directly correlate them with stress-strain data. However, at small length scales, stress-strain curves often exhibit significant statistical spread due to size effects, so their usefulness is debatable anyway. Despite this drawback, the Gatan 654 remains a powerful tool for visualizing deformation mechanisms in real time. Many successful experiments have been performed using the Gatan PI 95 indentation holder, which enables nanopillar compression in TEM while still obtaining reasonable stress-strain curves.

In my case, I designed a custom Cu clip to hold my sample, which I mounted using a focused ion beam (FIB). You can download the CAD file from the Zenodo link below. The sample was positioned at the inner edge of the clip, which was crucial because the outer edge is nearly 1 mm away from the center—right at the limit of what most TEM stages can accommodate. For reference, the ThermoFisher Titan G2 200 I used has a 1 mm stage limit.

For imaging, I relied on the standard CCD Ceta camera. While it offers fast acquisition speeds (down to 25 ms per frame, or 40 fps), the resulting data is quite noisy. I found that 200 ms per frame (5 fps) struck the best balance—providing enough intensity for parallel beam illumination, a strong signal-to-noise ratio, and sufficient temporal resolution to capture dynamic events effectively.

One challenge with the Gatan 654 holder is that it’s single-tilt, meaning limited control over orientation to reach a specific zone axis. To overcome this, I frequently switched to STEM mode for better defect visualization (Phillips, Ultramicroscopy 111, 2011). I took periodic STEM images between straining steps, and by saving FEG registers and alignment files, I found it relatively easy to switch back and forth between TEM and STEM while maintaining beam stability.

Why not use STEM for the entire experiment? While modern STEM offers fast scan rates, this approach generates massive file sizes—50 GB instead of 2 GB for a short clip—which makes data processing a nightmare. Additionally, during in-situ straining, the sample is not mechanically stable enough for STEM’s scanning mode. The best strategy is to capture dynamic events in TEM and periodically switch to STEM for higher-resolution imaging before applying further strain. This method has been widely used in recent studies on disconnections and grain boundary mobility.

In my case, I strained a multilayer thin film of Cu-10%Al, with 2 nm amorphous Al₂O₃ interlayers. These interlayers significantly enhanced the film’s strength and toughness, allowing for highly controlled straining. Whenever I paused the straining, the material stopped deforming under the applied load. The Al₂O₃ layers acted like fiber reinforcement, holding the surrounding metal together. Interestingly, while bulk Al₂O₃ is brittle and prone to catastrophic failure, at these small scales, it exhibited surprising ductility—deforming from 2 nm thickness down to just a few hundred picometers before ultimate failure.

For more technical details, check out our upcoming publication.

This project has been an exciting journey into the world of in-situ TEM deformation studies. It’s fascinating to watch materials fail in real time at the nanoscale, revealing deformation mechanisms that often remain hidden in conventional bulk tests. I look forward to pushing the boundaries of what we can learn from in-situ TEM experiments in the future!
