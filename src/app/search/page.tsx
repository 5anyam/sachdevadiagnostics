'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';
import Head from 'next/head';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardFooter } from '../../../components/ui/card';
import { AspectRatio } from '../../../components/ui/aspect-ratio';
import { Skeleton } from '../../../components/ui/skeleton';
import { useSearchProducts, useCategories } from '../../../hooks/useWordPress';

// Separate component for the search functionality that uses useSearchParams
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

  const productPlaceholders = Array(12).fill(null);

  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>{query ? `Search Results for "${query}"` : 'Search'} | Decoration Cart</title>
        <meta
          name="description"
          content={`Search results for "${query}" - Find decoration products and categories`}
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <form onSubmit={handleSearch} className="flex-1 relative max-w-2xl">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products and categories..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 w-full"
              autoFocus
            />
          </form>
        </div>

        {query && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Search Results for "{query}"</h1>
            <p className="text-muted-foreground">
              {searchLoading
                ? 'Searching...'
                : `Found ${matchingCategories.length + (searchResults?.length || 0)} results`}
            </p>
          </div>
        )}

        {query ? (
          <>
            {/* Categories */}
            {(matchingCategories.length > 0 || categoriesLoading) && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {categoriesLoading
                    ? Array(6)
                        .fill(null)
                        .map((_, index) => (
                          <Card key={`cat-skeleton-${index}`} className="overflow-hidden">
                            <AspectRatio ratio={1}>
                              <Skeleton className="h-full w-full" />
                            </AspectRatio>
                            <CardContent className="p-3">
                              <Skeleton className="h-4 w-full" />
                            </CardContent>
                          </Card>
                        ))
                    : matchingCategories.map((category) => (
                        <Link href={`/categories/${category.id}`} key={category.id}>
                          <Card className="overflow-hidden transition-all hover:shadow-lg cursor-pointer">
                            <AspectRatio ratio={1}>
                              <img
                                src={
                                  category.image?.src ||
                                  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=500&q=80'
                                }
                                alt={category.name}
                                className="object-cover w-full h-full"
                              />
                            </AspectRatio>
                            <CardContent className="p-3">
                              <h3 className="font-medium text-sm text-center line-clamp-2">
                                {category.name}
                              </h3>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                </div>
              </div>
            )}

            {/* Products */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {searchLoading
                  ? productPlaceholders.map((_, index) => (
                      <Card key={`product-skeleton-${index}`} className="overflow-hidden">
                        <AspectRatio ratio={1}>
                          <Skeleton className="h-full w-full" />
                        </AspectRatio>
                        <CardContent className="p-2 md:p-3">
                          <Skeleton className="h-3 w-12 mb-1" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <div className="mt-1 flex justify-between items-center">
                            <Skeleton className="h-3 w-12" />
                            <Skeleton className="h-3 w-8" />
                          </div>
                        </CardContent>
                        <CardFooter className="p-2 md:p-3 pt-0">
                          <Skeleton className="h-7 w-full" />
                        </CardFooter>
                      </Card>
                    ))
                  : searchResults?.length > 0
                  ? searchResults.map((product) => (
                      <Link href={`/products/${product.id}`} key={product.id} className="block">
                        <Card className="overflow-hidden transition-all hover:shadow-lg h-full cursor-pointer">
                          <AspectRatio ratio={1}>
                            <img
                              src={
                                product.images[0]?.src ||
                                'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=500&q=80'
                              }
                              alt={product.name}
                              className="object-cover w-full h-full"
                            />
                          </AspectRatio>
                          <CardContent className="p-2 md:p-3">
                            <div className="text-xs text-muted-foreground mb-1">
                              {product.categories[0]?.name || 'Decoration'}
                            </div>
                            <h3 className="font-semibold text-sm md:text-base line-clamp-2">
                              {product.name}
                            </h3>
                            <div className="mt-1 flex justify-between items-center">
                              <div className="font-medium text-sm">${Number(product.price).toFixed(2)}</div>
                              <div className="text-xs text-muted-foreground">★ {product.average_rating}</div>
                            </div>
                          </CardContent>
                          <CardFooter className="p-2 md:p-3 pt-0">
                            <Button className="w-full text-xs py-1 h-7">View Details</Button>
                          </CardFooter>
                        </Card>
                      </Link>
                    ))
                  : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-xl text-muted-foreground mb-4">
                        No products found for "{query}"
                      </p>
                      <Button variant="outline" onClick={() => router.push('/search')}>
                        Clear Search
                      </Button>
                    </div>
                  )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Search Products & Categories</h2>
            <p className="text-muted-foreground">Start typing to find what you&absop;re looking for</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Loading fallback component
const SearchFallback = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-2 rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </div>
        <div className="flex-1 relative max-w-2xl">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products and categories..."
            className="pl-10 w-full"
            disabled
          />
        </div>
      </div>
      <div className="text-center py-12">
        <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Loading Search...</h2>
        <p className="text-muted-foreground">Please wait while we prepare the search page</p>
      </div>
    </div>
  </div>
);

// Main component with Suspense wrapper
const SearchResultsPage = () => {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent />
    </Suspense>
  );
};

export default SearchResultsPage;