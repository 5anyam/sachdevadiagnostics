"use client"
import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, MessageCircle, TestTube, Shield, Award, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <>
      {/* Fixed Contact Buttons with Medical Theme */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a 
          href="https://wa.me/9990048085" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12"
          aria-label="WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
        <a 
          href="tel:+919990048085"
          className="bg-gradient-to-r from-[#194b8c] to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-rotate-12"
          aria-label="Call Now"
        >
          <Phone className="h-6 w-6" />
        </a>
      </div>

      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        {/* Medical Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-[#194b8c] rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
        </div>

        {/* Newsletter Section with Medical Gradient */}
        <div className="bg-gradient-to-r from-[#194b8c] via-blue-600 to-green-600 py-16 relative">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                  Stay Updated with Health News
                </h3>
                <p className="text-white/90 text-lg">Get updates on new tests, health tips and special offers</p>
              </div>
              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm h-12 px-6 rounded-full focus:ring-2 focus:ring-green-400 transition-all"
                />
                <Button className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-black font-semibold h-12 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Subscribe Now
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Footer */}
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section with Sachdeva Logo */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                
                  
                    <Image 
                      src="/sachdeva-diagnostics-logo.png" 
                      alt="Sachdeva Diagnostics Logo" 
                      width={186} 
                      height={96} 
                      className="object-contain rounded-md"
                    />
               
               
              </div>
              <p className="mb-8 text-gray-300 leading-relaxed">
                Providing accurate and reliable diagnostic services for over 30 years. NABL accredited lab with state-of-the-art technology and experienced professionals.
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                  <Award className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400 font-medium">NABL Accredited</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-blue-400 font-medium">Quality Assured</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <a href="https://facebook.com/sachdevadiagnostics" className="group bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-full hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-110 shadow-lg" aria-label="Facebook">
                  <Facebook size={20} className="text-white group-hover:animate-bounce" />
                </a>
                <a href="https://instagram.com/sachdevadiagnostics" className="group bg-gradient-to-r from-pink-600 to-purple-600 p-3 rounded-full hover:from-pink-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-110 shadow-lg" aria-label="Instagram">
                  <Instagram size={20} className="text-white group-hover:animate-bounce" />
                </a>
                <a href="https://twitter.com/sachdevadiagnostics" className="group bg-gradient-to-r from-blue-400 to-blue-500 p-3 rounded-full hover:from-blue-300 hover:to-blue-400 transition-all duration-300 transform hover:scale-110 shadow-lg" aria-label="Twitter">
                  <Twitter size={20} className="text-white group-hover:animate-bounce" />
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-8 text-transparent bg-gradient-to-r from-[#194b8c] to-blue-400 bg-clip-text">Quick Links</h3>
              <ul className="space-y-4">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'Tests', href: '/tests' },
                  { name: 'Health Packages', href: '/packages' },
                  { name: 'Book Test', href: '/book-test' },
                  { name: 'Reports', href: '/reports' },
                  { name: 'About Us', href: '/about' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="text-gray-300 hover:text-transparent hover:bg-gradient-to-r hover:from-[#194b8c] hover:to-blue-400 hover:bg-clip-text transition-all duration-300 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-gradient-to-r from-green-400 to-[#194b8c] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Services */}
            <div>
              <h3 className="text-xl font-semibold mb-8 text-transparent bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text">Our Services</h3>
              <ul className="space-y-4">
                {[
                  'Blood Tests',
                  'Urine Analysis', 
                  'Health Checkups',
                  'Cardiac Profile',
                  'Diabetes Panel',
                  'Home Collection'
                ].map((item) => (
                  <li key={item}>
                    <Link 
                      href={`/tests?category=${item.toLowerCase().replace(' ', '-')}`} 
                      className="text-gray-300 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-green-400 hover:bg-clip-text transition-all duration-300 flex items-center group"
                    >
                      <TestTube className="w-3 h-3 text-blue-400 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold mb-8 text-transparent bg-gradient-to-r from-green-400 to-[#194b8c] bg-clip-text">Contact Info</h3>
              
              {/* Operating Hours */}
              <div className="mb-6 p-4 bg-gradient-to-r from-[#194b8c]/20 to-green-500/20 rounded-lg border border-[#194b8c]/30">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold text-green-400">Operating Hours</span>
                </div>
                <p className="text-xs text-gray-300">
                  Mon-Sat: 7:00 AM - 9:00 PM<br />
                  Sunday: 8:00 AM - 6:00 PM
                </p>
              </div>

              <ul className="space-y-6">
                <li className="flex items-start gap-4 group">
                  <div className="bg-gradient-to-r from-[#194b8c] to-blue-500 p-2 rounded-full mt-1 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="text-white" size={18} />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    Sachdeva Diagnostics Center<br/>
                    Main Branch, Delhi<br/>
                    Near Metro Station
                  </span>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Phone className="text-white" size={18} />
                  </div>
                  <a href="tel:+919990048085" className="text-gray-300 hover:text-transparent hover:bg-gradient-to-r hover:from-green-400 hover:to-blue-400 hover:bg-clip-text transition-all">
                    +91 99900 48085
                  </a>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="bg-gradient-to-r from-blue-500 to-[#194b8c] p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Mail className="text-white" size={18} />
                  </div>
                  <a href="mailto:info@sachdevadiagnostics.com" className="text-gray-300 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-[#194b8c] hover:bg-clip-text transition-all">
                    info@sachdevadiagnostics.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Copyright Section */}
          <div className="border-t border-gradient-to-r from-[#194b8c]/30 via-blue-500/30 to-green-500/30 mt-16 pt-8 text-center">
            <div className="bg-gradient-to-r from-[#194b8c]/10 via-blue-500/10 to-green-500/10 rounded-lg p-6 backdrop-blur-sm">
              <p className="text-gray-400">
                &copy; {currentYear} <span className="text-white font-semibold">Sachdeva Diagnostics</span>. All rights reserved. 
                <br className="sm:hidden" />
                <span className="hidden sm:inline"> | </span>
                <span className="text-sm">Trusted Healthcare Partner for 30+ Years</span>
                <br className="sm:hidden" />
                <span className="hidden sm:inline"> | </span>
                Developed with ❤️ by <Link href="https://www.proshala.com" className="text-white transition-all duration-300">Proshala</Link>
              </p>
              
              {/* Additional Trust Elements */}
              <div className="flex justify-center items-center gap-6 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  NABL Accredited
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  ISO Certified
                </span>
                <span className="flex items-center gap-1">
                  <TestTube className="w-3 h-3" />
                  Quality Assured
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
