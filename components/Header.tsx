'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Phone, MapPin, Clock, X } from 'lucide-react';
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
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
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
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#194b8c] text-white py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <a href="tel:+919990048085" className="flex items-center gap-2 hover:text-yellow-300 transition-colors duration-200">
                <Phone size={14} className="text-yellow-300" />
                <span className="font-medium">+91-9811582086</span>
              </a>
              <div className="flex items-center gap-2 text-green-300">
                <MapPin size={14} />
                <span>Home Sample Collection Available</span>
              </div>
              <div className="flex items-center gap-2 text-blue-300">
                <Clock size={14} />
                <span>Mon-Sat: 7 AM - 9 PM | Sun: 8 AM - 6 PM</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/contact" className="hover:text-yellow-300 transition-colors duration-200 font-medium">Contact Us</Link>
              <Link href="/book-test" className="bg-yellow-500 text-[#194b8c] px-3 py-1 rounded-full hover:bg-yellow-400 transition-all duration-200 font-semibold text-xs">
                Book Test
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          isScrolled 
            ? "bg-[#194b8c]/95 shadow-xl backdrop-blur-md border-b border-blue-200" 
            : "bg-[#194b8c] shadow-sm"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative flex items-center">
                <Image src="/sachdeva-diagnostics-logo.png" alt='sachdeva diagnostics logo' height="90" width="90"/>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-green-400 group-hover:w-full transition-all duration-300"></div>
              </div>
            </Link>

            {/* Desktop Search */}
            <div className="hidden lg:flex items-center flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <input
                  type="search"
                  placeholder="Search tests, health packages, services..."
                  className="pl-11 pr-4 py-2 w-full border-2 border-blue-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all duration-200 text-black placeholder-gray-400 outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {[
                { href: '/', label: 'Home' },
                { href: '/tests', label: 'Tests' },
                { href: '/packages', label: 'Health Packages' },
                { href: '/reports', label: 'Reports' },
                { href: '/about', label: 'About' }
              ].map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`relative px-3 py-1 font-medium transition-all duration-200 rounded-md group text-sm ${
                    pathname === item.href 
                      ? 'text-yellow-300 bg-blue-700' 
                      : 'text-white hover:text-yellow-300 hover:bg-blue-700'
                  }`}
                >
                  {item.label}
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-green-400 group-hover:w-3/4 group-hover:left-1/8 transition-all duration-300"></div>
                </Link>
              ))}
            </nav>

            {/* Action Buttons & Mobile Search */}
            <div className="flex items-center space-x-2">
              {/* Desktop Book Test Button */}
              <div className="hidden md:flex">
                <Link href="/book-test">
                  <Button className="bg-gradient-to-r from-yellow-400 to-green-400 hover:from-yellow-500 hover:to-green-500 text-[#194b8c] px-4 py-1 rounded-md font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm">
                    Book Test
                  </Button>
                </Link>
              </div>

              {/* Mobile Search Button */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
                onClick={toggleSearch}
                aria-label="Toggle search"
              >
                {isSearchOpen ? (
                  <X size={20} className="text-white" />
                ) : (
                  <Search size={20} className="text-white" />
                )}
              </button>

              {/* Emergency Button */}
              <Link href="/emergency" className="relative p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-all duration-200 group">
                <Phone size={18} className="text-red-600 group-hover:text-red-700" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <div className="relative w-5 h-5">
                  <span className={`absolute block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 top-2.5' : 'top-1'}`}></span>
                  <span className={`absolute block w-5 h-0.5 bg-white transition-all duration-300 top-2.5 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`absolute block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 top-2.5' : 'top-4'}`}></span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Search - Animated Slide Down */}
          <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isSearchOpen ? 'max-h-20 opacity-100 pb-3' : 'max-h-0 opacity-0'
          }`}>
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <input
                  type="search"
                  placeholder="Search tests and packages..."
                  className="pl-10 pr-4 py-2.5 w-full border-2 border-blue-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all duration-200 text-black placeholder-gray-400 outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus={isSearchOpen}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={16} className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 py-4 bg-[#194b8c] border-t border-blue-400">
            <div className="space-y-1">
              {[
                { href: '/', label: 'Home' },
                { href: '/tests', label: 'Tests' },
                { href: '/packages', label: 'Health Packages' },
                { href: '/reports', label: 'Reports' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' }
              ].map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`block px-3 py-2 font-medium rounded-md transition-all duration-200 text-sm ${
                    pathname === item.href 
                      ? 'text-yellow-300 bg-blue-700 border-l-4 border-yellow-400' 
                      : 'text-white hover:text-yellow-300 hover:bg-blue-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-blue-400 space-y-2">
              <Link href="/book-test" className="block">
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-green-400 hover:from-yellow-500 hover:to-green-500 text-[#194b8c] py-2 rounded-md font-semibold shadow-lg text-sm">
                  Book Your Test
                </Button>
              </Link>
              <Link href="/emergency" className="block">
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold shadow-lg text-sm">
                  Emergency Contact
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
