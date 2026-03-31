'use client';

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowLeft, FileText, Package, Clock, Star, Activity, Shield, Building2, Home } from 'lucide-react';
import Head from 'next/head';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardFooter } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Skeleton } from '../../../components/ui/skeleton';
import { useSearchProducts, useCategories } from '../../../hooks/useWordPress';
import { Product, getProductMetaValue } from '../../../services/wordpress';


// ✅ Ye categories mein Home Collection nahi dikhegi
const NO_HOME_COLLECTION_SLUGS = [
  '3d-4d-ultrasound',
  'pregnancy-ultrasound',
  'color-doppler-ultrasound',
  'routine-ultrasound',
  'special-ultrasound',
  'x-ray-test',
];

function isNoHomeCollection(product: Product): boolean {
  return product.categories?.some(cat =>
    NO_HOME_COLLECTION_SLUGS.includes(cat.slug)
  ) ?? false;
}


const SearchContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);

  const { data: searchResults, isLoading: searchLoading } = useSearchProducts(query, {
    per_page: '50',
  });
  const { data: allCategories, isLoading: categoriesLoading } = useCategories();

  const matchingCategories =
    allCategories?.filter((category) =>
      category.name.toLowerCase().includes(query.toLowerCase())
    ) || [];

  // ✅ Price high to low sort
  const sortedResults = useMemo(() => {
    if (!searchResults) return [];
    return [...searchResults].sort((a, b) => Number(a.price) - Number(b.price));
  }, [searchResults]);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchInput.trim());
      router.push(`/search?${params.toString()}`);
    }
  };

  const productPlaceholders = Array(8).fill(null);
  const categoryPlaceholders = Array(6).fill(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <Head>
        <title>{query ? `Search Results for "${query}"` : 'Search Tests'} | Sachdeva Diagnostics</title>
        <meta
          name="description"
          content={`Search results for "${query}" - Find diagnostic tests and health packages`}
        />
      </Head>

      {/* Search Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-700" />
            </Link>
            <form onSubmit={handleSearch} className="flex-1 relative max-w-3xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="search"
                placeholder="Search tests, health packages, services..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-12 pr-4 h-12 sm:h-14 w-full border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 placeholder:text-slate-400 font-medium"
                autoFocus
              />
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {query ? (
          <>
            {/* Results Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Search Results for &quot;{query}&quot;
              </h1>
              <p className="text-slate-600 text-sm sm:text-base">
                {searchLoading || categoriesLoading
                  ? 'Searching...'
                  : `Found ${matchingCategories.length + (sortedResults.length || 0)} results`}
              </p>
            </div>

            {/* Categories Section */}
            {(matchingCategories.length > 0 || categoriesLoading) && (
              <div className="mb-8 sm:mb-12">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Categories</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {categoriesLoading
                    ? categoryPlaceholders.map((_, index) => (
                        <Card key={`cat-skeleton-${index}`} className="overflow-hidden border-2 border-slate-200">
                          <div className="aspect-square">
                            <Skeleton className="h-full w-full" />
                          </div>
                          <CardContent className="p-3">
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-3 w-12" />
                          </CardContent>
                        </Card>
                      ))
                    : matchingCategories.map((category) => (
                        <Link href={`/category/${category.slug}`} key={category.id}>
                          <Card className="overflow-hidden border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                            <div className="aspect-square relative bg-gradient-to-br from-blue-50 to-slate-50">
                              {category.image?.src ? (
                                <Image
                                  src={category.image.src}
                                  alt={category.name}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Activity className="w-12 h-12 sm:w-16 sm:h-16 text-blue-300" />
                                </div>
                              )}
                            </div>
                            <CardContent className="p-3">
                              <h3 className="font-bold text-sm text-slate-900 text-center line-clamp-2 mb-1">
                                {category.name}
                              </h3>
                              <p className="text-xs text-slate-500 text-center">
                                {category.count} {category.count === 1 ? 'test' : 'tests'}
                              </p>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                </div>
              </div>
            )}

            {/* Products/Tests Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Tests & Packages</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {searchLoading
                  ? productPlaceholders.map((_, index) => (
                      // ✅ Skeleton bhi image ke bina
                      <Card key={`product-skeleton-${index}`} className="overflow-hidden border-2 border-slate-200">
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
                          <Skeleton className="h-10 w-full rounded-xl" />
                        </CardFooter>
                      </Card>
                    ))
                  : sortedResults.length ? (
                      sortedResults.map((product: Product) => {
                        const reportTat = getProductMetaValue(product, 'report_tat') || 'Same Day';
                        const hasDiscount = product.regular_price && product.regular_price !== product.price;

                        // ✅ Home collection check
                        const hideHomeCollection = isNoHomeCollection(product);

                        return (
                          <Link href={`/test/${product.slug}`} key={product.id} className="block group h-full">
                            {/* ✅ NO IMAGE — sirf content card */}
                            <Card className="overflow-hidden border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white group-hover:-translate-y-1">
                              <CardContent className="p-5 flex-1 flex flex-col">

                                {/* Badges */}
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold text-xs">
                                    {product.categories[0]?.name || 'Diagnostic Test'}
                                  </Badge>
                                  <Badge className="bg-green-100 text-green-700 border-0 font-bold text-xs shadow-none">
                                    <Shield className="h-3 w-3 mr-1" />
                                    NABL
                                  </Badge>
                                </div>

                                {/* Test Name */}
                                <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-700 transition-colors mb-3 line-clamp-2 min-h-[3.5rem]">
                                  {product.name}
                                </h3>

                                {/* Description */}
                                <div
                                  className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1 min-h-[2.5rem]"
                                  dangerouslySetInnerHTML={{
                                    __html: product.short_description || product.description
                                  }}
                                />

                                {/* Features */}
                                <div className="space-y-2 mb-4">
                                  <div className="flex items-center gap-2 text-xs text-slate-700">
                                    <div className="bg-blue-100 p-1 rounded">
                                      <Clock className="h-3 w-3 text-blue-700" />
                                    </div>
                                    <span className="font-semibold">Report: {reportTat}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-slate-700">
                                    <div className="bg-green-100 p-1 rounded">
                                      <Shield className="h-3 w-3 text-green-700" />
                                    </div>
                                    <span className="font-semibold">30+ Years Trusted</span>
                                  </div>
                                </div>

                                {/* Price */}
                                <div className="pt-4 border-t border-slate-200">
                                  <div className="flex items-end justify-between mb-3">
                                    <div>
                                      {hasDiscount && (
                                        <div className="text-slate-400 text-xs line-through mb-0.5">
                                          ₹{Number(product.regular_price).toLocaleString('en-IN')}
                                        </div>
                                      )}
                                      <div className="text-blue-700 font-bold text-xl sm:text-2xl">
                                        ₹{Number(product.price).toLocaleString('en-IN')}
                                      </div>
                                      {/* ✅ Home Collection text conditional */}
                                      {!hideHomeCollection && (
                                        <span className="text-xs text-slate-500 font-medium">
                                          + Free Home Collection
                                        </span>
                                      )}
                                    </div>
                                    {product.average_rating && Number(product.average_rating) > 0 && (
                                      <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-orange-50 px-2.5 py-1.5 rounded-lg border border-yellow-200">
                                        <Star className="h-3.5 w-3.5 text-yellow-600 fill-yellow-500" />
                                        <span className="text-xs font-bold text-yellow-700">
                                          {Number(product.average_rating).toFixed(1)}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* ✅ Collection Type Badges — conditional */}
                                  <div className="flex gap-2">
                                    <div className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                                      <Building2 className="h-3.5 w-3.5 text-blue-700" />
                                      <span className="text-xs text-blue-700 font-bold">Center Visit</span>
                                    </div>
                                    {!hideHomeCollection && (
                                      <div className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                                        <Home className="h-3.5 w-3.5 text-green-700" />
                                        <span className="text-xs text-green-700 font-bold">Home</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>

                              <CardFooter className="p-5 pt-0">
                                <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
                                  Book Test Now
                                </Button>
                              </CardFooter>
                            </Card>
                          </Link>
                        );
                      })
                    ) : (
                      <div className="col-span-full text-center py-16">
                        <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="h-10 w-10 text-slate-400" />
                        </div>
                        <p className="text-xl font-semibold text-slate-900 mb-2">
                          No tests found for &quot;{query}&quot;
                        </p>
                        <p className="text-slate-600 mb-6">
                          Try searching with different keywords or browse our categories
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button variant="outline" onClick={() => router.push('/search')}>
                            Clear Search
                          </Button>
                          <Link href="/tests">
                            <Button className="bg-blue-700 hover:bg-blue-800">
                              Browse All Tests
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16 sm:py-24">
            <div className="bg-blue-50 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 sm:h-12 sm:w-12 text-blue-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Search Tests & Health Packages
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mb-8 max-w-md mx-auto">
              Start typing to find diagnostic tests, health packages, and services
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <Badge variant="outline" className="px-4 py-2">Ultrasound</Badge>
              <Badge variant="outline" className="px-4 py-2">X-Ray</Badge>
              <Badge variant="outline" className="px-4 py-2">Blood Test</Badge>
              <Badge variant="outline" className="px-4 py-2">Health Package</Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


const SearchFallback = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg">
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </div>
          <div className="flex-1 relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="search"
              placeholder="Search tests, health packages, services..."
              className="pl-12 h-14 w-full border-2 border-slate-200 rounded-xl"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
    <div className="container mx-auto px-4">
      <div className="text-center py-24">
        <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="h-12 w-12 text-blue-700 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Loading Search...</h2>
        <p className="text-slate-600">Please wait while we prepare the search page</p>
      </div>
    </div>
  </div>
);


const SearchResultsPage = () => {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent />
    </Suspense>
  );
};

export default SearchResultsPage;