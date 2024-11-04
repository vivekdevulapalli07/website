const ResearchCarousel = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [images, setImages] = React.useState([]);
  const [debug, setDebug] = React.useState({ loaded: false, error: null });

  React.useEffect(() => {
    // Get the images from the data-images attribute
    const imagesContainer = document.getElementById('research-carousel');
    if (imagesContainer) {
      try {
        const rawData = imagesContainer.getAttribute('data-images');
        console.log('Raw image data:', rawData); // Debug log

        const imagesData = JSON.parse(rawData);
        console.log('Parsed images:', imagesData); // Debug log
        
        setImages(imagesData);
        setDebug({ loaded: true, error: null });
      } catch (error) {
        console.error('Error parsing images data:', error);
        setDebug({ loaded: false, error: error.message });
      }
    }
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  React.useEffect(() => {
    if (images.length > 0) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [images.length]);

  // If no images, show debug info
  if (images.length === 0) {
    return (
      <div className="p-4 bg-gray-100 rounded">
        <p>Status: {debug.loaded ? 'Loaded' : 'Loading...'}</p>
        {debug.error && <p className="text-red-500">Error: {debug.error}</p>}
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg bg-gray-100">
      <div className="relative h-full">
        {images.map((image, index) => {
          // Construct the image path
          const imagePath = image.file.startsWith('/')
            ? `${window.baseurl}${image.file}`
            : `${window.baseurl}/assets/images/research/${image.file}`;

          console.log('Image path:', imagePath); // Debug log

          return (
            <div
              key={image.file}
              className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="relative w-full h-full">
                <img
                  src={imagePath}
                  alt={image.caption}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', imagePath);
                    e.target.style.backgroundColor = '#eee';
                    e.target.style.padding = '2rem';
                    e.target.insertAdjacentHTML('afterend', 
                      `<div class="absolute inset-0 flex items-center justify-center">
                        <p class="text-red-500">Image failed to load: ${image.file}</p>
                      </div>`
                    );
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                  <p className="text-sm text-center">{image.caption}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full hover:bg-opacity-100 transition-all"
      >
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full hover:bg-opacity-100 transition-all"
      >
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>

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

// Debug log when mounting
console.log('Research Carousel component loaded');

// Render the component when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('research-carousel');
  if (container) {
    console.log('Container found, rendering carousel');
    const root = ReactDOM.createRoot(container);
    root.render(<ResearchCarousel />);
  } else {
    console.error('Container not found');
  }
});