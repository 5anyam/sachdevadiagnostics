'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import Image from 'next/image';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#194b8c] text-white py-3 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <a href="tel:+919990048085" className="flex items-center gap-2 hover:text-yellow-300 transition-colors duration-200">
                <Phone size={16} className="text-yellow-300" />
                <span className="font-medium">+91-9811582086</span>
              </a>
              <div className="flex items-center gap-2 text-green-300">
                <MapPin size={16} />
                <span>Home Sample Collection Available</span>
              </div>
              <div className="flex items-center gap-2 text-blue-300">
                <Clock size={16} />
                <span>Mon-Sat: 7 AM - 9 PM | Sun: 8 AM - 6 PM</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/contact" className="hover:text-yellow-300 transition-colors duration-200 font-medium">Contact Us</Link>
              <Link href="/book-test" className="bg-yellow-500 text-[#194b8c] px-4 py-1 rounded-full hover:bg-yellow-400 transition-all duration-200 font-semibold">
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
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative flex items-center">
                <Image src="/sachdeva-diagnostics-logo.png" alt='sachdeva diagnostics logo' height="100" width="100"/>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-green-400 group-hover:w-full transition-all duration-300"></div>
              </div>
            </Link>

            {/* Desktop Search */}
            <div className="hidden lg:flex items-center flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <input
                  type="search"
                  placeholder="Search tests, health packages, services..."
                  className="pl-12 pr-4 py-3 w-full border-2 border-blue-300 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 text-black placeholder-gray-400 outline-none"
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
                  className={`relative px-4 py-2 font-semibold transition-all duration-200 rounded-lg group ${
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

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/book-test">
                <Button className="bg-gradient-to-r from-yellow-400 to-green-400 hover:from-yellow-500 hover:to-green-500 text-[#194b8c] px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  Book Test
                </Button>
              </Link>
              <Link href="/emergency" className="relative p-3 rounded-xl bg-red-100 hover:bg-red-200 transition-all duration-200 group">
                <Phone size={22} className="text-red-600 group-hover:text-red-700" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-3 rounded-xl hover:bg-blue-700 transition-all duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 top-3' : 'top-1'}`}></span>
                <span className={`absolute block w-6 h-0.5 bg-white transition-all duration-300 top-3 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`absolute block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 top-3' : 'top-5'}`}></span>
              </div>
            </button>
          </div>

          {/* Mobile Search - Always visible on mobile */}
          <div className="lg:hidden pb-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              <input
                type="search"
                placeholder="Search tests and packages..."
                className="pl-10 pr-4 py-3 w-full border-2 border-blue-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all duration-200 text-black placeholder-gray-400 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 py-6 bg-[#194b8c] border-t border-blue-400">
            <div className="space-y-2">
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
                  className={`block px-4 py-3 font-semibold rounded-lg transition-all duration-200 ${
                    pathname === item.href 
                      ? 'text-yellow-300 bg-blue-700 border-l-4 border-yellow-400' 
                      : 'text-white hover:text-yellow-300 hover:bg-blue-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-blue-400">
              <Link href="/book-test" className="block mb-3">
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-green-400 hover:from-yellow-500 hover:to-green-500 text-[#194b8c] py-3 rounded-lg font-semibold shadow-lg">
                  Book Your Test
                </Button>
              </Link>
              <Link href="/emergency" className="block">
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold shadow-lg">
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
