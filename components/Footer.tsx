"use client"
import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, MessageCircle, TestTube, Shield, Award, Clock, ExternalLink } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <>
      {/* Fixed Contact Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a 
          href="https://wa.me/919811582086" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110"
          aria-label="WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
        <a 
          href="tel:+919811582086"
          className="bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110"
          aria-label="Call Now"
        >
          <Phone className="h-6 w-6" />
        </a>
      </div>

      <footer className="bg-slate-900 text-white">
       
        
        {/* Main Footer */}
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {/* Brand Section */}
            <div>
              <div className="mb-4">
                <Image 
                  src="/sachdeva-diagnostics-logo.png" 
                  alt="Sachdeva Diagnostics Logo" 
                  width={150} 
                  height={78} 
                  className="object-contain"
                />
              </div>
              <p className="mb-6 text-slate-300 leading-relaxed text-sm">
                Providing accurate and reliable diagnostic services for over 30 years. NABL accredited lab with state-of-the-art technology.
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="flex items-center gap-2 bg-blue-700 px-3 py-1.5 rounded-lg">
                  <Award className="w-4 h-4 text-white" />
                  <span className="text-xs text-white font-medium">NABL Accredited</span>
                </div>
                <div className="flex items-center gap-2 bg-green-600 px-3 py-1.5 rounded-lg">
                  <Shield className="w-4 h-4 text-white" />
                  <span className="text-xs text-white font-medium">ISO Certified</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                <a href="https://facebook.com/sachdevadiagnostics" className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition-all" aria-label="Facebook">
                  <Facebook size={18} className="text-white" />
                </a>
                <a href="https://instagram.com/sachdevadiagnostics" className="bg-pink-600 hover:bg-pink-700 p-3 rounded-lg transition-all" aria-label="Instagram">
                  <Instagram size={18} className="text-white" />
                </a>
                <a href="https://twitter.com/sachdevadiagnostics" className="bg-blue-500 hover:bg-blue-600 p-3 rounded-lg transition-all" aria-label="Twitter">
                  <Twitter size={18} className="text-white" />
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
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
                      className="text-slate-300 hover:text-white hover:pl-2 transition-all duration-200 flex items-center text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Services */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Our Services</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Ultrasound', href: '/tests?category=ultrasound' },
                  { name: 'X-Ray Tests', href: '/tests?category=x-ray' },
                  { name: 'Doppler Scan', href: '/tests?category=doppler' },
                  { name: 'Health Packages', href: '/packages' },
                  { name: 'LifeCell Delhi', href: '/lifecell' },
                  { name: 'Home Collection', href: '/home-collection' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="text-slate-300 hover:text-white hover:pl-2 transition-all duration-200 flex items-center text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Contact Info</h3>
              
              {/* Operating Hours */}
              <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold text-white">Operating Hours</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mon-Sat: 7:00 AM - 8:00 PM<br />
                  Sunday: 8:00 AM - 6:00 PM
                </p>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <a 
                    href="https://maps.google.com/?q=E-991,+Block+E,+Saraswati+Vihar,+Pitampura,+Delhi,+110034"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    E-991, Block E, Saraswati Vihar,<br/>
                    Pitampura, Delhi - 110034<br/>
                    <span className="text-green-400 text-xs">Serving: Punjabi Bagh & nearby</span>
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-400" />
                  <a href="tel:+919811582086" className="text-sm text-slate-300 hover:text-white transition-colors font-medium">
                    098115 82086
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <a href="mailto:info@sachdevadiagnostics.com" className="text-xs text-slate-300 hover:text-white transition-colors break-all">
                    info@sachdevadiagnostics.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <ExternalLink className="w-5 h-5 text-purple-400" />
                  <a 
                    href="http://sachdevadiagnostics.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    sachdevadiagnostics.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Copyright Section */}
          <div className="border-t border-slate-800 mt-12 pt-8">
            <div className="bg-slate-800 rounded-lg p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-slate-400 text-center">
                &copy; {currentYear} <span className="text-white font-semibold">Sachdeva Diagnostics</span> - Ultrasound | Doppler | NT Scan | Lab | X-Ray | Health Packages | LifeCell Delhi
                <br className="sm:hidden" />
                <span className="hidden sm:inline"> | </span>
                <span className="text-xs">Trusted Healthcare Partner for 30+ Years</span>
              </p>
              
              <p className="text-center text-xs text-slate-500 mt-3">
                Developed with ❤️ by <Link href="https://www.proshala.com" target="_blank" className="text-blue-400 hover:text-blue-300 transition-all font-medium">Proshala</Link>
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mt-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  NABL Accredited
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-3 h-3" />
                  ISO Certified
                </span>
                <span className="flex items-center gap-1.5">
                  <TestTube className="w-3 h-3" />
                  Quality Assured
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  Pitampura, Delhi
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
