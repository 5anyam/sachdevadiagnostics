"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Search, ChevronRight, X, Grid3x3, List, 
  Star, Clock, Shield, Award, TrendingUp, Package,
  ArrowUpDown, Home as HomeIcon, Building2,
  TestTube, Calendar, CheckCircle2
} from "lucide-react";

import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Card, CardContent, CardFooter } from "../../../../components/ui/card";
import { Skeleton } from "../../../../components/ui/skeleton";
import { Badge } from "../../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

import { useProductsByCategory, useCategory } from "../../../../hooks/useWordPress";
import type { Product } from "../../../../services/wordpress";

type SortOption = "popularity" | "price-low" | "price-high" | "rating";
type ViewMode = "grid" | "list";

interface PriceRange {
  min: string;
  max: string;
}

export default function CategoryProductsPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;

  // Debug logs
  useEffect(() => {
    console.log('🔍 Debug Info:');
    console.log('Params:', params);
    console.log('Slug:', slug);
  }, [params, slug]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("popularity");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: "", max: "" });

  // Data fetching - fix the hooks call
  const { 
    data: products = [], 
    isLoading: productsLoading,
    error: productsError 
  } = useProductsByCategory(slug);
  
  const { 
    data: category, 
    isLoading: categoryLoading,
    error: categoryError 
  } = useCategory(slug);

  // Debug data
  useEffect(() => {
    console.log('📦 Products:', products);
    console.log('📁 Category:', category);
    console.log('⚠️ Products Error:', productsError);
    console.log('⚠️ Category Error:', categoryError);
  }, [products, category, productsError, categoryError]);

  // Client-side filtering
  let filteredProducts: Product[] = products.filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (priceRange.min || priceRange.max) {
    filteredProducts = filteredProducts.filter((product: Product) => {
      const price = Number(product.price);
      const min = priceRange.min ? Number(priceRange.min) : 0;
      const max = priceRange.max ? Number(priceRange.max) : Infinity;
      return price >= min && price <= max;
    });
  }

  const sortedProducts: Product[] = [...filteredProducts].sort((a: Product, b: Product) => {
    if (sortBy === "price-low") return Number(a.price) - Number(b.price);
    if (sortBy === "price-high") return Number(b.price) - Number(a.price);
    if (sortBy === "rating") return Number(b.average_rating) - Number(a.average_rating);
    return 0;
  });

  const clearFilters = (): void => {
    setSearchTerm("");
    setPriceRange({ min: "", max: "" });
    setSortBy("popularity");
  };

  const hasActiveFilters: boolean = Boolean(searchTerm || priceRange.min || priceRange.max);
  const productPlaceholders = Array.from({ length: 12 });

  const ProductCard = ({ product }: { product: Product }) => {
    const hasDiscount: boolean = Boolean(
      product.regular_price && product.regular_price !== product.price
    );
    const discountPercent: number = hasDiscount 
      ? Math.round(((Number(product.regular_price) - Number(product.price)) / Number(product.regular_price)) * 100)
      : 0;
    const isPopular: boolean = Boolean(
      product.total_sales && parseInt(product.total_sales) > 50
    );

    return (
      <Link href={`/test/${product.slug}`} className="block group h-full">
        <Card className="overflow-hidden border-2 border-slate-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 h-full flex flex-col bg-white group-hover:-translate-y-1">
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <Badge className="bg-green-500 text-white font-bold text-xs shadow-lg border-0">
                <Award className="h-3 w-3 mr-1" />
                NABL
              </Badge>
              {isPopular && (
                <Badge className="bg-orange-500 text-white font-bold text-xs shadow-lg border-0">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>

            {hasDiscount && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-red-500 text-white font-bold shadow-lg border-0">
                  {discountPercent}% OFF
                </Badge>
              </div>
            )}

            <div className="absolute bottom-3 right-3">
              <Badge className="bg-white/95 backdrop-blur-sm text-blue-700 font-semibold text-xs shadow-md border border-blue-200">
                {product.categories?.[0]?.name || category?.name}
              </Badge>
            </div>

          <CardContent className="p-5 flex-1 flex flex-col">
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors mb-3 line-clamp-2 min-h-[3.5rem]">
              {product.name}
            </h3>

            <p className="text-sm text-slate-600 line-clamp-2 mb-4 min-h-[2.5rem]">
              {product.short_description?.replace(/<[^>]*>/g, '') || "Professional diagnostic test with accurate results"}
            </p>

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

            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-2xl text-blue-700">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-slate-500 line-through font-medium">
                        ₹{Number(product.regular_price).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">+ Free Home Collection</span>
                </div>
                <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-orange-50 px-2.5 py-1.5 rounded-lg border border-yellow-200">
                  <Star className="h-3.5 w-3.5 text-yellow-600 fill-yellow-500" />
                  <span className="text-xs font-bold text-yellow-700">
                    {product.average_rating || "4.8"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                  <Building2 className="h-3.5 w-3.5 text-blue-700" />
                  <span className="text-xs text-blue-700 font-bold">Center</span>
                </div>
                <div className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                  <HomeIcon className="h-3.5 w-3.5 text-green-700" />
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

  // Show error state
  if (productsError || categoryError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Category</h2>
          <p className="text-slate-600 mb-4">
            {productsError?.message || categoryError?.message || 'Failed to load category data'}
          </p>
          <div className="bg-slate-100 p-4 rounded-lg mb-4 text-left">
            <p className="text-xs text-slate-600 font-mono">
              Slug: {slug || 'undefined'}<br/>
              Products Error: {productsError ? 'Yes' : 'No'}<br/>
              Category Error: {categoryError ? 'Yes' : 'No'}
            </p>
          </div>
          <Button onClick={() => window.location.reload()} className="w-full">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-16 shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <nav className="flex items-center mb-6 text-sm text-blue-200">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                <HomeIcon className="h-4 w-4" />
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link href="/tests" className="hover:text-white transition-colors">
                All Tests
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-white font-semibold">
                {categoryLoading ? "Loading…" : (category?.name || slug || "Category")}
              </span>
            </nav>

            <div className="text-center">
              {categoryLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-64 mx-auto bg-white/20" />
                  <Skeleton className="h-16 w-96 mx-auto bg-white/20" />
                </div>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                    <Package className="h-4 w-4 text-blue-300" />
                    <span className="text-sm font-semibold">Test Category</span>
                  </div>
                  <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                    {category?.name || slug || "Tests"}
                  </h1>
                  <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                    {category?.description?.replace(/<[^>]*>/g, '') || 
                     `Browse our comprehensive range of diagnostic tests with accurate results and fast reports`}
                  </p>
                </>
              )}

              <div className="flex items-center justify-center gap-8 mt-8 text-sm flex-wrap">
                {[
                  { icon: TestTube, text: `${products.length} Tests`, color: "text-blue-300" },
                  { icon: Clock, text: "Same Day Reports", color: "text-green-300" },
                  { icon: Award, text: "NABL Certified", color: "text-yellow-300" },
                  { icon: Shield, text: "100% Accurate", color: "text-purple-300" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    <span className="font-semibold">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Search and Controls Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="search"
                placeholder="Search tests in this category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-slate-900 font-medium border-slate-300 focus:border-blue-600 rounded-xl text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  type="button"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min ₹"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-28 h-14 text-slate-900 font-semibold border-slate-300 focus:border-blue-600 rounded-xl"
              />
              <Input
                type="number"
                placeholder="Max ₹"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-28 h-14 text-slate-900 font-semibold border-slate-300 focus:border-blue-600 rounded-xl"
              />
            </div>

            <Select value={sortBy} onValueChange={(value: string) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-full lg:w-56 h-14 border-slate-300 focus:border-blue-600 bg-white rounded-xl font-semibold">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-slate-300 rounded-xl shadow-xl">
                <SelectItem value="popularity" className="font-semibold">Most Popular</SelectItem>
                <SelectItem value="price-low" className="font-semibold">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="font-semibold">Price: High to Low</SelectItem>
                <SelectItem value="rating" className="font-semibold">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`h-12 px-4 ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`h-12 px-4 ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-200">
              <span className="text-sm font-semibold text-slate-700">Active Filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-semibold px-3 py-1.5 rounded-lg">
                  Search: {searchTerm}
                  <X
                    className="h-3 w-3 ml-2 cursor-pointer"
                    onClick={() => setSearchTerm('')}
                  />
                </Badge>
              )}
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

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              {productsLoading ? (
                'Loading Tests...'
              ) : (
                <>
                  <span className="text-blue-700">{sortedProducts.length}</span>
                  <span className="text-slate-600">
                    {sortedProducts.length === 1 ? 'Test' : 'Tests'} Available
                  </span>
                </>
              )}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {searchTerm ? `Showing results for "${searchTerm}"` : `All ${category?.name || ''} diagnostic tests`}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPriceRange({ min: '', max: '1000' })}
              className="text-xs border-slate-300 font-semibold hover:bg-blue-50 hover:text-blue-700"
            >
              Under ₹1000
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy('popularity')}
              className="text-xs border-slate-300 font-semibold hover:bg-blue-50 hover:text-blue-700"
            >
              Most Popular
            </Button>
          </div>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productPlaceholders.map((_, index) => (
              <Card key={`skeleton-${index}`} className="overflow-hidden border border-slate-200 h-full">
                <Skeleton className="h-56 w-full" />
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-4 w-24 rounded-full" />
                  <Skeleton className="h-6 w-full rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <div className="space-y-2 pt-3">
                    <Skeleton className="h-3 w-full rounded" />
                    <Skeleton className="h-3 w-2/3 rounded" />
                  </div>
                  <div className="flex justify-between items-center pt-3">
                    <Skeleton className="h-8 w-24 rounded" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </CardContent>
                <CardFooter className="p-5 pt-0">
                  <Skeleton className="h-12 w-full rounded-xl" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {sortedProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-300">
            <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <TestTube className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No Tests Found</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              We couldn&apos;t find any tests matching your search criteria. Try adjusting your filters or search terms.
            </p>
            <Button onClick={clearFilters} className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-6 rounded-xl font-bold">
              <X className="mr-2 h-5 w-5" />
              Clear Filters
            </Button>
          </div>
        )}

        {!productsLoading && sortedProducts.length > 0 && (
          <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                About {category?.name || "These"} Tests
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {category?.description?.replace(/<[^>]*>/g, '') || 
                 `Our tests are conducted using state-of-the-art equipment with NABL certification. We ensure accurate results with quick turnaround times, all performed by experienced medical professionals.`}
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-blue-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-slate-900">Free Home Collection</span>
                  </div>
                </div>
                <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-blue-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-slate-900">Digital Reports</span>
                  </div>
                </div>
                <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-blue-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-slate-900">Expert Consultation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
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
