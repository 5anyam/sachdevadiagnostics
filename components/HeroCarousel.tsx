"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Banner {
  image: string;
  title: string;
  link: string;
}

const banners: Banner[] = [
  {
    image: "https://navajowhite-turkey-121983.hostingersite.com/wp-content/uploads/2026/02/1.jpg",
    title: "Ultrasound Services",
    link: "/category/ultrasound",
  },
  {
    image: "https://navajowhite-turkey-121983.hostingersite.com/wp-content/uploads/2026/02/Advanced-Ultrasound-Tests-1-e1770455982133.jpg",
    title: "Advanced Ultrasound Tests",
    link: "/category/routine-ultrasound",
  },
  {
    image: "https://navajowhite-turkey-121983.hostingersite.com/wp-content/uploads/2026/02/3.jpg",
    title: "Digital X-Ray",
    link: "/category/x-ray-test",
  },
  {
    image: "https://navajowhite-turkey-121983.hostingersite.com/wp-content/uploads/2026/02/4.jpg",
    title: "Lab Tests",
    link: "/category/lab-tests",
  },
  {
    image: "https://navajowhite-turkey-121983.hostingersite.com/wp-content/uploads/2026/02/5.jpg",
    title: "Health Packages",
    link: "/tests",
  },
];

const HeroCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setCurrent(prev => (prev - 1 + banners.length) % banners.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrent(prev => (prev + 1) % banners.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="w-full relative overflow-hidden bg-sky-50">
      {/* Responsive height container */}
      <div className="relative w-full h-44 sm:h-64 md:h-80 lg:h-[620px]">

        {/* Slides */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <Link
              key={index}
              href={banner.link}
              className="relative w-full h-full flex-shrink-0"
              style={{ minWidth: '100%' }}
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
              {/* Subtle bottom gradient for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </Link>
          ))}
        </div>

        {/* Prev button */}
        <button
          onClick={goToPrevious}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20
            bg-white/90 hover:bg-sky-500 text-sky-600 hover:text-white
            w-10 h-10 rounded-full transition-all duration-200 shadow-lg
            items-center justify-center border border-sky-100 hover:border-sky-500"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next button */}
        <button
          onClick={goToNext}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20
            bg-white/90 hover:bg-sky-500 text-sky-600 hover:text-white
            w-10 h-10 rounded-full transition-all duration-200 shadow-lg
            items-center justify-center border border-sky-100 hover:border-sky-500"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`rounded-full transition-all duration-300 ${
                index === current
                  ? 'bg-sky-500 w-6 h-2'
                  : 'bg-white/70 hover:bg-white w-2 h-2'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
