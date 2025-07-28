'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X, TestTube, Clock, Shield, Award, Users, Calendar, Star, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

// UI Components
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardFooter } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Skeleton } from '../../../components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../../components/ui/sheet';
import { Checkbox } from '../../../components/ui/checkbox';
import { AspectRatio } from '../../../components/ui/aspect-ratio';

// WordPress API integration
import { getAllProducts, getProductCategories } from '../../../services/wordpress';

const TestsPage = () => {
  const searchParams = useSearchParams();
  
  // State Management
  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const itemsPerPage = 16;

  // Fetch tests and categories from WordPress
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all tests (products) and categories
        const [testsData, categoriesData] = await Promise.all([
          getAllProducts({ 
            per_page: 100, // Fetch more for client-side iltering
            status: 'publish',
            type: 'simple'
          }),
          getProductCategories()
        ]);
        
        setTests(testsData || []);
        setCategories(categoriesData || []);
        
        // Set initial category filter from URL
        const categoryParam = searchParams?.get('category');
        if (categoryParam) {
          setSelectedCategories([categoryParam]);
        }
        
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  // Filter and search logic
  const filteredTests = useMemo(() => {
    let filtered = [...tests];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(test => 
        test.name.toLowerCase().includes(query) ||
        test.short_description?.toLowerCase().includes(query) ||
        test.categories?.some(cat => cat.name.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(test =>
        test.categories?.some(cat => 
          selectedCategories.includes(cat.name) || selectedCategories.includes(cat.id.toString())
        )
      );
    }

    // Price range filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(test => {
        const price = Number(test.price);
        const min = priceRange.min ? Number(priceRange.min) : 0;
        const max = priceRange.max ? Number(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Sort tests
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return Number(a.price) - Number(b.price);
        case 'price-high':
          return Number(b.price) - Number(a.price);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popularity':
          return (Number(b.total_sales) || 0) - (Number(a.total_sales) || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [tests, searchQuery, selectedCategories, priceRange, sortBy]);

  // Pagination
  const paginatedTests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filteredTests.slice(startIndex, endIndex);
    
    setTotalPages(Math.ceil(filteredTests.length / itemsPerPage));
    
    return paginated;
  }, [filteredTests, currentPage]);

  // Handlers
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    setSearchQuery('');
    setSortBy('name');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate pagination buttons
  const getPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }
    
    return buttons;
  };

  // Loading skeleton
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array(12).fill(null).map((_, index) => (
        <Card key={index} className="overflow-hidden border border-gray-200 shadow-lg bg-white h-full flex flex-col">
          <AspectRatio ratio={4/3}>
            <Skeleton className="h-full w-full" />
          </AspectRatio>
          <CardContent className="p-4 flex-1">
            <Skeleton className="h-4 w-20 mb-2 rounded-full" />
            <Skeleton className="h-5 w-full mb-2 rounded" />
            <Skeleton className="h-4 w-3/4 mb-3 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-2/3 rounded" />
            </div>
            <div className="flex justify-between items-center mt-4">
              <Skeleton className="h-6 w-20 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 mt-auto">
            <Skeleton className="h-10 w-full rounded-lg" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  // Test card component
  const TestCard = ({ test }) => (
    <Link href={`/tests/${test.slug}`} className="block group h-full">
      <Card className="overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full cursor-pointer bg-white group-hover:scale-[1.02] flex flex-col">
        {/* Test Image */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-green-50">
          
          {/* NABL Badge */}
          <div className="absolute top-3 left-3">
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Award className="h-3 w-3" />
              NABL
            </div>
          </div>

          {/* Test Type Badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#194b8c] text-white">
              <TestTube className="h-3 w-3 mr-1" />
              {test.categories[0]?.name || "Diagnostic Test"}
            </span>
          </div>
        </div>

        <CardContent className="p-4 flex-1">
          {/* Test Name */}
          <h3 className="font-bold text-lg text-black group-hover:text-[#194b8c] transition-colors mb-2 line-clamp-2 min-h-[3rem]">
            {test.name}
          </h3>
          
          {/* Test Description */}
          <p className="text-sm text-gray-600 font-medium line-clamp-2 mb-3 min-h-[2.5rem]">
            {test.short_description?.replace(/<[^>]*>/g, '') || "Comprehensive diagnostic test with accurate results"}
          </p>

          {/* Test Features */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <Clock className="h-3 w-3 text-[#194b8c]" />
              <span className="font-medium">Report: Same Day</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <Shield className="h-3 w-3 text-green-500" />
              <span className="font-medium">30+ Years Trusted</span>
            </div>
          </div>
          
          {/* Price and Rating */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-xl text-[#194b8c]">
                  ₹{Number(test.price).toLocaleString('en-IN')}
                </span>
                {test.regular_price && test.regular_price !== test.price && (
                  <span className="text-sm text-gray-500 line-through font-medium">
                    ₹{Number(test.regular_price).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-600 font-medium">Center Visit</span>
            </div>
            
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
              <span className="text-xs font-semibold text-yellow-700">
                {test.average_rating || "4.8"}
              </span>
            </div>
          </div>

          {/* Collection Options */}
          <div className="flex gap-2 mt-3">
            <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-xs">
              <Users className="h-3 w-3 text-[#194b8c]" />
              <span className="text-[#194b8c] font-medium">Center</span>
            </div>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-xs">
              <Calendar className="h-3 w-3 text-green-600" />
              <span className="text-green-600 font-medium">Home</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 mt-auto">
          <Button className="w-full bg-gradient-to-r from-[#194b8c] to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white border-0 rounded-lg font-semibold transition-all duration-300 group-hover:shadow-lg">
            <TestTube className="h-4 w-4 mr-2" />
            Book Test
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#194b8c] to-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Diagnostic Tests</h1>
            <p className="text-xl opacity-90">Comprehensive health testing with 30+ years of trusted expertise</p>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>NABL Accredited</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Same Day Reports</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Quality Assured</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters Header */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search tests, packages, or health conditions..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 h-12 text-black font-medium border-gray-300 focus:border-[#194b8c]"
            />
          </div>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48 h-12 border-gray-300 focus:border-[#194b8c] bg-white text-black font-medium">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 shadow-lg">
              <SelectItem value="name" className="text-black hover:bg-gray-100 font-medium">Name A-Z</SelectItem>
              <SelectItem value="price-low" className="text-black hover:bg-gray-100 font-medium">Price: Low to High</SelectItem>
              <SelectItem value="price-high" className="text-black hover:bg-gray-100 font-medium">Price: High to Low</SelectItem>
              <SelectItem value="popularity" className="text-black hover:bg-gray-100 font-medium">Most Popular</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile Filter Button */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden h-12 border-gray-300 text-black font-medium">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white">
              <SheetHeader>
                <SheetTitle className="text-black">Filter Tests</SheetTitle>
                <SheetDescription>
                  Narrow down your search with these filters
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                {/* Mobile filters content - same as desktop but in sheet */}
                <FiltersContent 
                  categories={categories}
                  selectedCategories={selectedCategories}
                  handleCategoryToggle={handleCategoryToggle}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  clearFilters={clearFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <FiltersContent 
              categories={categories}
              selectedCategories={selectedCategories}
              handleCategoryToggle={handleCategoryToggle}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              clearFilters={clearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-black">
                  {loading ? 'Loading...' : `${filteredTests.length} Tests Found`}
                </h2>
                {searchQuery && (
                  <p className="text-gray-600 font-medium">
                    Results for {searchQuery}
                  </p>
                )}
              </div>

              {/* Active Filters */}
              {(selectedCategories.length > 0 || priceRange.min || priceRange.max) && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Filters:</span>
                  {selectedCategories.map(category => (
                    <Badge key={category} variant="secondary" className="bg-[#194b8c] text-white">
                      {category}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => handleCategoryToggle(category)}
                      />
                    </Badge>
                  ))}
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600 hover:text-red-700">
                    Clear All
                  </Button>
                </div>
              )}
            </div>

            {/* Tests Grid */}
            {loading ? (
              renderSkeleton()
            ) : filteredTests.length === 0 ? (
              <div className="text-center py-16">
                <TestTube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tests found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters} className="bg-[#194b8c] hover:bg-blue-700">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedTests.map((test) => (
                    <TestCard key={test.id} test={test} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="border-gray-300 text-black font-medium hover:bg-gray-50"
                    >
                      Previous
                    </Button>
                    
                    {getPaginationButtons().map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page 
                          ? "bg-[#194b8c] text-white" 
                          : "border-gray-300 text-black font-medium hover:bg-gray-50"
                        }
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="border-gray-300 text-black font-medium hover:bg-gray-50"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        [data-radix-select-content] {
          background-color: white !important;
          color: black !important;
          border: 1px solid #d1d5db !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
          z-index: 50 !important;
        }
        
        [data-radix-select-item] {
          color: black !important;
          background-color: white !important;
          padding: 8px 12px !important;
          cursor: pointer !important;
          font-weight: 500 !important;
        }
        
        [data-radix-select-item]:hover,
        [data-radix-select-item][data-highlighted] {
          background-color: #f3f4f6 !important;
          color: #194b8c !important;
        }
      `}</style>
    </div>
  );
};

// Filters Component
const FiltersContent = ({ 
  categories, 
  selectedCategories, 
  handleCategoryToggle, 
  priceRange, 
  setPriceRange, 
  clearFilters 
}) => (
  <div className="space-y-6">
    <Card className="border border-gray-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-black">Filters</h3>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600 hover:text-red-700">
            Clear All
          </Button>
        </div>

        {/* Categories Filter */}
        <div className="mb-6">
          <h4 className="font-semibold text-black mb-3">Test Categories</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.name)}
                  onCheckedChange={() => handleCategoryToggle(category.name)}
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-medium text-gray-700 cursor-pointer flex-1"
                >
                  {category.name} ({category.count || 0})
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h4 className="font-semibold text-black mb-3">Price Range</h4>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min ₹"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="text-black font-medium border-gray-300 focus:border-[#194b8c]"
            />
            <Input
              type="number"
              placeholder="Max ₹"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="text-black font-medium border-gray-300 focus:border-[#194b8c]"
            />
          </div>
        </div>

        {/* Quick Price Filters */}
        <div className="mt-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Quick Price Filters</h5>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Under ₹500', min: '', max: '500' },
              { label: '₹500 - ₹1000', min: '500', max: '1000' },
              { label: '₹1000 - ₹2000', min: '1000', max: '2000' },
              { label: 'Above ₹2000', min: '2000', max: '' },
            ].map((range) => (
              <Button
                key={range.label}
                variant="outline"
                size="sm"
                onClick={() => setPriceRange({ min: range.min, max: range.max })}
                className="text-xs border-gray-300 text-black font-medium hover:bg-gray-50"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default TestsPage;
