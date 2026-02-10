"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// Banner type definition
interface Banner {
  image: string;
  title: string;
  link: string;
}

// Banner Slider Component
const BannerSlider: React.FC = () => {
  const [current, setCurrent] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const banners: Banner[] = [
    {
      image: "http://thesiswriting.xyz/wp-content/uploads/2026/02/1.jpg",
      title: "Ultrasound Test",
      link: "/tests",
    },
    {
      image: "http://thesiswriting.xyz/wp-content/uploads/2026/02/Advanced-Ultrasound-Tests-1-e1770455982133.jpg",
      title: "Advanced X-ray",
      link: "/shop/magsafe-covers",
    },
    {
      image: "http://thesiswriting.xyz/wp-content/uploads/2026/02/3.jpg",
      title: "MagSafe Compatible",
      link: "/shop/magsafe-covers",
    },
    {
      image: "http://thesiswriting.xyz/wp-content/uploads/2026/02/4.jpg",
      title: "MagSafe Compatible",
      link: "/shop/magsafe-covers",
    },
    {
      image: "http://thesiswriting.xyz/wp-content/uploads/2026/02/5.jpg",
      title: "MagSafe Compatible",
      link: "/shop/magsafe-covers",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval: NodeJS.Timeout = setInterval(() => {
      setCurrent((prev: number) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  const goToPrevious = (): void => {
    setCurrent((prev: number) => (prev - 1 + banners.length) % banners.length);
    setIsAutoPlaying(false);
  };

  const goToNext = (): void => {
    setCurrent((prev: number) => (prev + 1) % banners.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number): void => {
    setCurrent(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="w-full relative rounded-xl md:rounded-3xl overflow-hidden shadow-lg">
      {/* Main carousel container - Responsive aspect ratio */}
      <div 
        className="w-full relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100"
        style={{ 
          aspectRatio: typeof window !== 'undefined' && window.innerWidth < 768 ? '4/3' : '16/6'
        }}
      >
        
        {/* Slides container */}
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {banners.map((banner: Banner, index: number) => (
            <Link
              key={index}
              href={banner.link}
              className="w-full h-full flex-shrink-0 relative group"
            >
              {/* Image container with proper containment */}
              <div className="w-full h-full overflow-hidden">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-contain transition-transform duration-500"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  style={{ objectPosition: 'center' }}
                />
              </div>
              
              {/* Overlay gradient with blue tint */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-blue-800/20 to-transparent md:from-blue-900/40 md:via-blue-800/10" />
              
              {/* Content - Fully responsive */}
              <div className="absolute inset-0 flex items-end p-4 sm:p-6 md:p-8 lg:p-12">
                <div className="w-full max-w-2xl">
                  {/* Title - responsive text */}
                
                  {/* Description - hidden on very small screens, responsive on larger */}

                  
                  {/* CTA Button - touch-friendly sizing */}
                
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation buttons - Blue theme */}
        <button
          onClick={goToPrevious}
          className="hidden md:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 
            bg-blue-600 hover:bg-blue-700 text-white
            w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 hover:scale-110
            items-center justify-center shadow-lg hover:shadow-xl"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={goToNext}
          className="hidden md:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 
            bg-blue-600 hover:bg-blue-700 text-white
            w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 hover:scale-110
            items-center justify-center shadow-lg hover:shadow-xl"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Slide indicators - Blue theme */}
        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 z-30 
          flex gap-1 sm:gap-1.5 md:gap-2 bg-white/90 backdrop-blur-sm rounded-full px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 shadow-lg">
          {banners.map((_: Banner, index: number) => (
            <button
              key={index}
              className={`rounded-full cursor-pointer transition-all duration-300 
                hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400/50 
                ${index === current
                  ? 'bg-blue-600 w-4 sm:w-6 md:w-8 h-1.5 sm:h-2 md:h-2.5' 
                  : 'bg-gray-300 hover:bg-blue-400 w-1.5 sm:w-2 md:w-2.5 h-1.5 sm:h-2 md:h-2.5'
                }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default BannerSlider;
