'use client';

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, X, TestTube, Clock, Shield, Award, Users, Calendar, Star, 
  SlidersHorizontal, TrendingUp, Home, Building2, Zap, Filter, ArrowUpDown, Grid3x3, List,
  Package
} from 'lucide-react';
import Link from 'next/link';

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

// WordPress API integration
import { getAllProducts, getProductCategories } from '../../../services/wordpress';

// Filters Component
const FiltersContent = ({
  categories,
  selectedCategories,
  handleCategoryToggle,
  priceRange,
  setPriceRange,
  clearFilters,
  filteredCount,
}) => (
  <div className="space-y-4">
    {/* Filter Header */}
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-blue-700" />
        <h3 className="text-lg font-bold text-slate-900">Filters</h3>
        {(selectedCategories.length > 0 || priceRange.min || priceRange.max) && (
          <Badge className="bg-blue-100 text-blue-700 font-bold">
            {selectedCategories.length + (priceRange.min || priceRange.max ? 1 : 0)}
          </Badge>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={clearFilters}
        className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold"
      >
        Clear All
      </Button>
    </div>

    {/* Categories Filter */}
    <Card className="border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-slate-50 p-4 border-b border-slate-200">
        <h4 className="font-bold text-slate-900 flex items-center gap-2">
          <Package className="h-4 w-4 text-blue-700" />
          Test Categories
        </h4>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
            >
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={() => handleCategoryToggle(category.name)}
                className="border-slate-300 data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700"
              />
              <div className="flex-1">
                <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {category.name}
                </span>
                <span className="ml-2 text-xs text-slate-500 font-medium">
                  ({category.count || 0})
                </span>
              </div>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Price Range Filter */}
    <Card className="border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-slate-200">
        <h4 className="font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-700" />
          Price Range
        </h4>
      </div>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Min Price</label>
            <Input
              type="number"
              placeholder="₹ 0"
              value={priceRange.min}
              onChange={e => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="h-10 text-slate-900 font-semibold border-slate-300 focus:border-blue-600"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Max Price</label>
            <Input
              type="number"
              placeholder="₹ 10,000"
              value={priceRange.max}
              onChange={e => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="h-10 text-slate-900 font-semibold border-slate-300 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Quick Price Filters */}
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-2 block">Quick Select</label>
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
                className="text-xs border-slate-300 text-slate-700 font-semibold hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Results Summary */}
    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 font-medium">Showing Results</p>
          <p className="text-2xl font-bold text-blue-700">{filteredCount}</p>
        </div>
        <div className="bg-white p-3 rounded-full shadow-md">
          <TestTube className="h-6 w-6 text-blue-700" />
        </div>
      </div>
    </div>
  </div>
);

function TestsPageContent() {
  const searchParams = useSearchParams();

  // State Management
  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const itemsPerPage = 12;

  // Fetch tests and categories from WordPress
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [testsData, categoriesData] = await Promise.all([
          getAllProducts({
            per_page: 100,
            status: 'publish',
            type: 'simple',
          }),
          getProductCategories()
        ]);

        setTests(testsData || []);
        setCategories(categoriesData || []);

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

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(test =>
        test.name.toLowerCase().includes(query) ||
        test.short_description?.toLowerCase().includes(query) ||
        test.categories?.some(cat => cat.name.toLowerCase().includes(query))
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(test =>
        test.categories?.some(cat =>
          selectedCategories.includes(cat.name) || selectedCategories.includes(cat.id.toString())
        )
      );
    }

    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(test => {
        const price = Number(test.price);
        const min = priceRange.min ? Number(priceRange.min) : 0;
        const max = priceRange.max ? Number(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

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
    setSortBy('popularity');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(12).fill(null).map((_, index) => (
        <Card key={index} className="overflow-hidden border border-slate-200 h-full">
          {/* Replaced Image Skeleton with just content padding */}
          <CardContent className="p-5 space-y-3 pt-6">
            <div className="flex gap-2 mb-2">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
            </div>
            <Skeleton className="h-6 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
            <div className="space-y-2 pt-3">
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-2/3 rounded" />
            </div>
            <div className="flex justify-between items-center pt-3 mt-4 border-t border-slate-100">
              <Skeleton className="h-8 w-24 rounded" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </CardContent>
          <CardFooter className="p-5 pt-0">
            <Skeleton className="h-11 w-full rounded-xl" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  // Test card component - Grid View
  const TestCardGrid = ({ test }) => {
    const isPopular = test.total_sales && parseInt(test.total_sales) > 50;
    const hasDiscount = test.regular_price && test.regular_price !== test.price;

    return (
      <Link href={`/test/${test.slug}`} className="block group h-full">
        <Card className="overflow-hidden border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white group-hover:-translate-y-1">
          
          <CardContent className="p-5 flex-1 flex flex-col">
            {/* Badges Row - Moved here from Image Section and reorganized */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
               {/* Category Badge */}
               <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold">
                {test.categories[0]?.name || "Test"}
              </Badge>
              
               {/* NABL Badge */}
              <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0 font-bold shadow-none">
                <Award className="h-3 w-3 mr-1" />
                NABL
              </Badge>

              {/* Popular Badge */}
              {isPopular && (
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0 font-bold animate-pulse shadow-none">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}

            </div>

            {/* Test Name */}
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors mb-3 line-clamp-2 min-h-[3.5rem]">
              {test.name}
            </h3>

            {/* Test Description */}
            <p className="text-sm text-slate-600 line-clamp-2 mb-4 min-h-[2.5rem]">
              {test.short_description?.replace(/<[^>]*>/g, '') || "Professional diagnostic test with accurate results"}
            </p>

            {/* Features */}
            <div className="space-y-2 mb-4 flex-1">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <div className="bg-blue-100 p-1 rounded">
                  <Clock className="h-3 w-3 text-blue-700" />
                </div>
                <span className="font-semibold">Report: Same Day</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <div className="bg-green-100 p-1 rounded">
                  <Shield className="h-3 w-3 text-green-700" />
                </div>
                <span className="font-semibold">30+ Years Trusted</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-2xl text-blue-700">
                      ₹{Number(test.price).toLocaleString('en-IN')}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-slate-500 line-through font-medium">
                        ₹{Number(test.regular_price).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">+ Free Home Collection</span>
                </div>
                <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-orange-50 px-2.5 py-1.5 rounded-lg border border-yellow-200">
                  <Star className="h-3.5 w-3.5 text-yellow-600 fill-yellow-500" />
                  <span className="text-xs font-bold text-yellow-700">
                    {test.average_rating || "4.8"}
                  </span>
                </div>
              </div>

              {/* Collection Options */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                  <Building2 className="h-3.5 w-3.5 text-blue-700" />
                  <span className="text-xs text-blue-700 font-bold">Center</span>
                </div>
                <div className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                  <Home className="h-3.5 w-3.5 text-green-700" />
                  <span className="text-xs text-green-700 font-bold">Home</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-5 pt-0">
            <Button className="w-full h-12 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
              <Calendar className="h-4 w-4 mr-2" />
              Book Test Now
            </Button>
          </CardFooter>
        </Card>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-12 shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-semibold">Most Trusted Diagnostic Center</span>
            </div>
            <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Diagnostic Tests & Health Packages
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              NABL certified lab • Same-day reports • 30+ years of excellence
            </p>
            <div className="flex items-center justify-center gap-8 text-sm">
              {[
                { icon: Award, text: "NABL Accredited" },
                { icon: Clock, text: "6 Hour Reports" },
                { icon: Shield, text: "100% Accurate" },
                { icon: Users, text: "50,000+ Patients" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <item.icon className="h-4 w-4 text-blue-300" />
                  <span className="font-semibold">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Controls Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="search"
                placeholder="Search by test name, condition, or health concern..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-12 h-14 text-slate-900 font-medium border-slate-300 focus:border-blue-600 rounded-xl text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-64 h-14 border-slate-300 focus:border-blue-600 bg-white rounded-xl font-semibold">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-slate-300 rounded-xl shadow-xl">
                <SelectItem value="popularity" className="font-semibold">Most Popular</SelectItem>
                <SelectItem value="name" className="font-semibold">Name (A-Z)</SelectItem>
                <SelectItem value="price-low" className="font-semibold">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="font-semibold">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Button */}
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button className="lg:hidden h-14 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl">
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filters
                  {(selectedCategories.length > 0 || priceRange.min || priceRange.max) && (
                    <Badge className="ml-2 bg-white text-blue-700 font-bold">
                      {selectedCategories.length + (priceRange.min || priceRange.max ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-slate-50 w-full sm:w-96">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-2xl font-bold text-slate-900">Filter Tests</SheetTitle>
                  <SheetDescription className="text-slate-600">
                    Refine your search to find the perfect test
                  </SheetDescription>
                </SheetHeader>
                <FiltersContent
                  categories={categories}
                  selectedCategories={selectedCategories}
                  handleCategoryToggle={handleCategoryToggle}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  clearFilters={clearFilters}
                  filteredCount={filteredTests.length}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters Pills */}
          {(selectedCategories.length > 0 || priceRange.min || priceRange.max || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-200">
              <span className="text-sm font-semibold text-slate-700">Active Filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-semibold px-3 py-1.5 rounded-lg">
                  Search: {searchQuery}
                  <X
                    className="h-3 w-3 ml-2 cursor-pointer"
                    onClick={() => setSearchQuery('')}
                  />
                </Badge>
              )}
              {selectedCategories.map(category => (
                <Badge key={category} variant="secondary" className="bg-purple-100 text-purple-800 font-semibold px-3 py-1.5 rounded-lg">
                  {category}
                  <X
                    className="h-3 w-3 ml-2 cursor-pointer"
                    onClick={() => handleCategoryToggle(category)}
                  />
                </Badge>
              ))}
              {(priceRange.min || priceRange.max) && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 font-semibold px-3 py-1.5 rounded-lg">
                  ₹{priceRange.min || '0'} - ₹{priceRange.max || '∞'}
                  <X
                    className="h-3 w-3 ml-2 cursor-pointer"
                    onClick={() => setPriceRange({ min: '', max: '' })}
                  />
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters} 
                className="text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold ml-auto"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-4">
              <FiltersContent
                categories={categories}
                selectedCategories={selectedCategories}
                handleCategoryToggle={handleCategoryToggle}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                clearFilters={clearFilters}
                filteredCount={filteredTests.length}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  {loading ? (
                    'Loading Tests...'
                  ) : (
                    <>
                      <span className="text-blue-700">{filteredTests.length}</span>
                      <span className="text-slate-600">Tests Available</span>
                    </>
                  )}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {searchQuery ? `Results for "${searchQuery}"` : 'Showing all diagnostic tests'}
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-white shadow-sm' : ''}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-white shadow-sm' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tests Grid/List */}
            {loading ? (
              renderSkeleton()
            ) : filteredTests.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-300">
                <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TestTube className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">No Tests Found</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  We could not find any tests matching your criteria. Try adjusting your filters or search terms.
                </p>
                <Button onClick={clearFilters} className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-6 rounded-xl font-bold">
                  <X className="mr-2 h-5 w-5" />
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10" 
                  : "space-y-4 mb-10"
                }>
                  {paginatedTests.map((test) => (
                    <TestCardGrid key={test.id} test={test} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm text-slate-600 font-medium">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredTests.length)} of {filteredTests.length} tests
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="border-slate-300 font-semibold hover:bg-slate-50 disabled:opacity-50"
                      >
                        Previous
                      </Button>
                      <div className="flex gap-1">
                        {getPaginationButtons().map(page => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => handlePageChange(page)}
                            className={
                              currentPage === page
                                ? "bg-blue-700 text-white hover:bg-blue-800 font-bold min-w-[40px]"
                                : "border-slate-300 font-semibold hover:bg-slate-50 min-w-[40px]"
                            }
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="border-slate-300 font-semibold hover:bg-slate-50 disabled:opacity-50"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default function TestsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-700 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-slate-700">Loading tests...</p>
          </div>
        </div>
      }
    >
      <TestsPageContent />
    </Suspense>
  );
}
