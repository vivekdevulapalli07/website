import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ResearchCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [images, setImages] = useState([]);
  
  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await window.fs.readFile('research_images.yml', { encoding: 'utf8' });
        // Parse YAML-like content (simplified for this example)
        const imageData = response.split('\n')
          .filter(line => line.includes('file:') || line.includes('caption:'))
          .reduce((acc, line, index) => {
            if (line.includes('file:')) {
              acc.push({
                file: line.split('file:')[1].trim().replace(/["']/g, ''),
                caption: ''
              });
            } else if (line.includes('caption:')) {
              acc[acc.length - 1].caption = line.split('caption:')[1].trim().replace(/["']/g, '');
            }
            return acc;
          }, []);
        setImages(imageData);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };
    
    loadImages();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg bg-gray-100">
      {/* Slides container */}
      <div className="relative h-full">
        {images.map((image, index) => (
          <div
            key={image.file}
            className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative w-full h-full">
              {/* Using placeholder image since we can't load actual images */}
              <img
                src="/api/placeholder/800/600"
                alt={image.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                <p className="text-sm text-center">{image.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full hover:bg-opacity-100 transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full hover:bg-opacity-100 transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ResearchCarousel;