"use client";

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { Shield, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

const DIAGNOSTIC_IMAGES = [
  {
    src: "http://thesiswriting.xyz/wp-content/uploads/2025/12/0c80446a-14b6-4948-b8a5-6404ca25b764.jpg",
    alt: "Modern Ultrasound Room with Latest Equipment",
    fallback: "bg-gradient-to-br from-blue-100 via-cyan-50 to-slate-100"
  },
  {
    src: "http://thesiswriting.xyz/wp-content/uploads/2025/12/efcd77e5-549b-4d33-9a18-648b4ada9154.jpg",
    alt: "Expert Radiologist Performing Scan",
    fallback: "bg-gradient-to-br from-purple-100 via-blue-50 to-slate-100"
  },
  {
    src: "http://thesiswriting.xyz/wp-content/uploads/2025/12/2b128fe5-0667-474e-a48c-b84a136ccf78.jpg",
    alt: "NABL Accredited Laboratory",
    fallback: "bg-gradient-to-br from-green-100 via-emerald-50 to-slate-100"
  }
];

export default function HeroImageSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 20 },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative h-[300px] sm:h-[450px] w-full">
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white h-full">
        
        {/* Embla Carousel */}
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {DIAGNOSTIC_IMAGES.map((image, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 relative">
                <div className={`w-full h-full ${image.fallback} flex items-center justify-center`}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onError={(e) => {
                      // Hide broken image, show gradient fallback
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={scrollPrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all z-10 group"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-slate-700 group-hover:text-blue-700" />
        </button>
        
        <button
          onClick={scrollNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all z-10 group"
          aria-label="Next image"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-slate-700 group-hover:text-blue-700" />
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                index === selectedIndex 
                  ? 'bg-white w-6 sm:w-8' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* NABL Badge */}
        <div className="absolute top-3 sm:top-6 right-3 sm:right-6 bg-white/95 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl border border-slate-100 z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-blue-100 p-1.5 sm:p-2.5 rounded-full">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase">Certified</p>
              <p className="text-xs sm:text-sm font-bold text-slate-900">NABL Accredited</p>
            </div>
          </div>
        </div>

        {/* Quick Report Badge */}
        <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 bg-white/95 backdrop-blur-sm px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl border border-slate-100 z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-green-100 p-1.5 sm:p-2.5 rounded-full">
              <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase">Quick Turnaround</p>
              <p className="text-sm sm:text-lg font-bold text-slate-900">Reports in 6 Hours</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 w-48 h-48 sm:w-72 sm:h-72 bg-blue-100/50 rounded-full blur-3xl -z-10"></div>
    </div>
  );
}
