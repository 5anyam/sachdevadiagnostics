'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Star, Heart, Sparkles, Play } from "lucide-react";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "Create Magical Moments",
      subtitle: "Transform your special occasions with our stunning decoration services. From intimate gatherings to grand celebrations, we bring your vision to life.",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      primaryCta: "Browse Collections",
      secondaryCta: "Watch Video",
      accent: "from-yellow-400 to-pink-500"
    },
    {
      title: "Perfect for Every Occasion",
      subtitle: "Birthdays, weddings, corporate events, anniversaries - we create unforgettable experiences with premium decorations tailored to your style.",
      image: "https://images.unsplash.com/photo-1464047736614-af63643285bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      primaryCta: "Book Now",
      secondaryCta: "View Packages",
      accent: "from-pink-500 to-blue-500"
    },
    {
      title: "Balloon Art & More",
      subtitle: "Stunning balloon decorations, elegant setups, and creative designs that add magic to every moment. Quality guaranteed.",
      image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      primaryCta: "View Gallery",
      secondaryCta: "Get Quote",
      accent: "from-blue-500 to-yellow-400"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-[50vh] overflow-hidden">
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: currentSlide === index ? 1 : 0,
            zIndex: currentSlide === index ? 10 : 0
          }}
          transition={{ duration: 1 }}
        >
          {/* Full Screen Background Image */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url('${slide.image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          {/* Black Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
          
          {/* Content Container */}
          <div className="relative z-20 h-full flex items-center">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-3xl">
                {/* Main Title */}
                <motion.h1
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ 
                    y: currentSlide === index ? 0 : 50, 
                    opacity: currentSlide === index ? 1 : 0 
                  }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {slide.title}
                </motion.h1>
                
                {/* Subtitle */}
                <motion.p
                  className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed max-w-2xl"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ 
                    y: currentSlide === index ? 0 : 50, 
                    opacity: currentSlide === index ? 1 : 0 
                  }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {slide.subtitle}
                </motion.p>
                
                {/* CTA Buttons */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ 
                    y: currentSlide === index ? 0 : 50, 
                    opacity: currentSlide === index ? 1 : 0 
                  }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3 mb-8"
                >
                  <Link href={index === 1 ? "/booking" : index === 2 ? "/gallery" : "/products"}>
                    <Button 
                      size="lg" 
                      className={`group px-6 py-3 text-base font-bold bg-gradient-to-r ${slide.accent} text-black hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-full border-0`}
                    >
                      {slide.primaryCta}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="group px-6 py-3 text-base font-semibold border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 rounded-full backdrop-blur-sm"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {slide.secondaryCta}
                  </Button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ 
                    y: currentSlide === index ? 0 : 30, 
                    opacity: currentSlide === index ? 1 : 0 
                  }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="flex flex-wrap gap-6"
                >
                  <div className="flex items-center gap-2 text-white">
                    <div className="p-1.5 bg-yellow-400/20 rounded-full">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    </div>
                    <div>
                      <div className="font-bold text-base">500+</div>
                      <div className="text-white/80 text-xs">Happy Events</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-white">
                    <div className="p-1.5 bg-pink-500/20 rounded-full">
                      <Heart className="h-4 w-4 text-pink-400 fill-current" />
                    </div>
                    <div>
                      <div className="font-bold text-base">Premium</div>
                      <div className="text-white/80 text-xs">Quality Service</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-white">
                    <div className="p-1.5 bg-blue-500/20 rounded-full">
                      <Sparkles className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-bold text-base">Custom</div>
                      <div className="text-white/80 text-xs">Design Solutions</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
          {slides.map((slide, index) => (
            <button
              key={index}
              className={`transition-all duration-500 ${
                currentSlide === index 
                  ? `w-8 h-3 bg-gradient-to-r ${slide.accent} rounded-full shadow-lg` 
                  : "w-3 h-3 bg-white/50 hover:bg-white/80 rounded-full"
              }`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 right-6 z-30 hidden lg:block"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-1 text-white/60">
          <span className="text-xs font-medium">Scroll</span>
          <div className="w-px h-4 bg-white/40"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;