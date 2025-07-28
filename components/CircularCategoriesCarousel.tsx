'use client'
import Link from "next/link";
import { useCategories } from "../hooks/useWordPress";
import { Skeleton } from "../components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const CircularCategoriesCarousel = () => {
  const { data: categories, isLoading, error } = useCategories({ per_page: "16" });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const placeholderCategories = Array(16).fill(null).map((_, index) => ({
    id: index,
    name: `Category ${index + 1}`,
    slug: `category-${index + 1}`,
    image: null
  }));

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Check scroll state on mount and when categories change
  useEffect(() => {
    if (scrollContainerRef.current) {
      handleScroll();
    }
  }, [categories]);

  const displayCategories = categories || placeholderCategories;

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
          <div className="text-red-500 text-2xl mb-2">😔</div>
          <p className="text-lg text-red-600">Unable to load categories</p>
          <p className="text-red-500 text-sm mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-6 bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <div className="container mx-auto px-4">
     

        {/* Carousel Container */}
        <div className="relative">
          {/* Desktop Navigation Arrows */}
          <div className="hidden lg:block">
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-xl rounded-full p-3 hover:bg-white hover:scale-110 transition-all duration-300 border border-purple-100"
              >
                <ChevronLeft className="h-5 w-5 text-purple-600" />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-xl rounded-full p-3 hover:bg-white hover:scale-110 transition-all duration-300 border border-purple-100"
              >
                <ChevronRight className="h-5 w-5 text-purple-600" />
              </button>
            )}
          </div>

          {/* Categories Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide px-4 lg:px-16 py-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayCategories.map((category, index) => (
              <div 
                key={category.id || index} 
                className="flex-shrink-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-18 h-18 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 overflow-hidden mb-3 shadow-lg">
                      <Skeleton className="w-full h-full" />
                    </div>
                    <Skeleton className="h-4 w-16 md:w-20 rounded-full" />
                  </div>
                ) : (
                  <Link 
                    href={`/categories/${category.id}`} 
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    {/* Category Image */}
                    <div className="relative w-18 h-18 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-purple-100 via-white to-pink-100 overflow-hidden mb-3 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-2xl border-2 border-white">
                      <img 
                        src={category.image?.src || `/cat.png`}
                        alt={category.name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Hover Effect Ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-110 group-hover:scale-100" />
                    </div>
                    
                    {/* Category Name */}
                    <span className="text-sm md:text-base font-semibold text-center max-w-[90px] md:max-w-[110px] lg:max-w-[130px] leading-tight text-gray-700 group-hover:text-purple-600 transition-colors duration-300">
                      {category.name}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Scroll Indicator */}
          <div className="flex justify-center lg:hidden mt-4">
            <div className="flex space-x-2">
              {[...Array(Math.ceil(displayCategories.length / 4))].map((_, index) => (
                <div 
                  key={index} 
                  className="w-2 h-2 rounded-full bg-purple-300 transition-colors duration-300"
                />
              ))}
            </div>
          </div>

          {/* Gradient Fade Effects */}
          <div className="absolute left-0 top-0 bottom-0 w-8 lg:w-16 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-8 lg:w-16 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-10" />
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default CircularCategoriesCarousel;