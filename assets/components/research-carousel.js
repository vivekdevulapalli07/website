const ResearchCarousel = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [images, setImages] = React.useState([]);
  
  React.useEffect(() => {
    // Get the images from the data-images attribute
    const imagesContainer = document.getElementById('research-carousel');
    if (imagesContainer) {
      try {
        const imagesData = JSON.parse(imagesContainer.getAttribute('data-images'));
        setImages(imagesData);
      } catch (error) {
        console.error('Error parsing images data:', error);
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
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg bg-gray-100">
      <div className="relative h-full">
        {images.map((image, index) => (
          <div
            key={image.file}
            className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative w-full h-full">
              <img
                src={`${window.baseurl}/assets/images/research/${image.file}`}
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

// Render the component when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('research-carousel');
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<ResearchCarousel />);
  }
});