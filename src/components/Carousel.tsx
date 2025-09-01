import { useState, useEffect } from "react";

interface CarouselItem {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function Carousel({
  items,
  autoPlay = true,
  autoPlayInterval = 5000,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (autoPlay && items.length > 1) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, items.length]);

  if (items.length === 0) return null;

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-purple-500/20">
      {/* Main carousel container */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item) => (
          <div key={item.id} className="w-full h-full flex-shrink-0 relative">
            <div
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${item.image})` }}
            >
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center text-center px-8">
                <div className="max-w-2xl">
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-lg md:text-xl text-gray-200 drop-shadow-md">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-110"
            aria-label="Previous slide"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-110"
            aria-label="Next slide"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dots indicator */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
