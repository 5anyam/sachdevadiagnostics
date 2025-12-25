'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Phone, MapPin, Clock, X, Menu, Calendar, FileText, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import Image from 'next/image';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const navItems = [
    { href: '/', label: 'Home', icon: null },
    { href: '/tests', label: 'Tests', icon: FileText },
    { href: '/packages', label: 'Health Packages', icon: Package },
    { href: '/reports', label: 'Reports', icon: FileText },
    { href: '/about', label: 'About', icon: null }
  ];

  return (
    <>
      {/* Top Bar - Hidden on Mobile */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-2 hidden lg:block border-b border-blue-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center space-x-6">
              <a href="tel:+919811582086" className="flex items-center gap-2 hover:text-yellow-300 transition-colors duration-200 group">
                <Phone size={14} className="text-green-400 group-hover:text-yellow-300" />
                <span className="font-semibold">+91-9811582086</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-green-400" />
                <span className="font-medium">Home Sample Collection Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-blue-300" />
                <span>Mon-Sat: 7 AM - 9 PM | Sun: 8 AM - 6 PM</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/contact" className="hover:text-yellow-300 transition-colors duration-200 font-semibold">
                Contact Us
              </Link>
              <Link href="/book-test" className="bg-yellow-500 text-blue-900 px-4 py-1.5 rounded-full hover:bg-yellow-400 transition-all duration-200 font-bold shadow-md hover:shadow-lg">
                Book Test
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled 
            ? "bg-white shadow-lg border-b border-slate-200" 
            : "bg-white shadow-md"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group flex-shrink-0">
              <div className="relative">
                <Image 
                  src="/sachdeva-diagnostics-logo.png" 
                  alt='Sachdeva Diagnostics' 
                  height={120} 
                  width={120}
                  className="h-12 w-12 sm:h-20 sm:w-24 object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex items-center flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
                <input
                  type="search"
                  placeholder="Search tests, health packages, services..."
                  className="pl-12 pr-4 py-3 w-full border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-slate-900 placeholder-slate-400 outline-none font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`relative px-4 py-2 font-semibold transition-all duration-200 rounded-lg group ${
                    pathname === item.href 
                      ? 'text-blue-700 bg-blue-50' 
                      : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </span>
                  {pathname === item.href && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-700 rounded-full"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop Book Test Button */}
              <Link href="/book-test" className="hidden lg:block">
                <Button className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Book Test
                </Button>
              </Link>

              {/* Mobile Search Toggle */}
              <button
                className="lg:hidden p-2.5 rounded-lg hover:bg-slate-100 transition-all duration-200"
                onClick={toggleSearch}
                aria-label="Toggle search"
              >
                {isSearchOpen ? (
                  <X size={20} className="text-slate-700" />
                ) : (
                  <Search size={20} className="text-slate-700" />
                )}
              </button>

              {/* Emergency Call Button */}
              <a 
                href="tel:+919811582086" 
                className="relative p-2.5 rounded-lg bg-green-50 hover:bg-green-100 transition-all duration-200 group hidden sm:flex"
              >
                <Phone size={18} className="text-green-600 group-hover:text-green-700" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </a>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2.5 rounded-lg hover:bg-slate-100 transition-all duration-200"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X size={22} className="text-slate-700" />
                ) : (
                  <Menu size={22} className="text-slate-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar - Slide Down */}
          <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isSearchOpen ? 'max-h-24 opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
              <input
                type="search"
                placeholder="Search tests and packages..."
                className="pl-11 pr-10 py-3 w-full border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-slate-900 placeholder-slate-400 outline-none font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={isSearchOpen}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} className="text-slate-400" />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden border-t border-slate-200 ${
          isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={`flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all duration-200 ${
                      pathname === item.href 
                        ? 'text-blue-700 bg-blue-50 border-l-4 border-blue-700' 
                        : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    {item.label}
                  </Link>
                ))}
                <Link 
                  href="/contact"
                  className="flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all duration-200 text-slate-700 hover:text-blue-700 hover:bg-slate-50"
                >
                  <Phone className="h-5 w-5" />
                  Contact
                </Link>
              </div>

              {/* Mobile Action Buttons */}
              <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                <Link href="/book-test" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Book Your Test
                  </Button>
                </Link>
                <a href="tel:+919811582086" className="block">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                    <Phone className="h-5 w-5" />
                    Call: +91-9811582086
                  </Button>
                </a>
              </div>

              {/* Mobile Contact Info */}
              <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <MapPin size={14} className="text-green-500" />
                  <span>Home Sample Collection Available</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Clock size={14} className="text-blue-500" />
                  <span>Mon-Sat: 7 AM - 9 PM | Sun: 8 AM - 6 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
