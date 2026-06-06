"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Search, ChevronRight, X, Clock, Shield, TrendingUp,
  Home as HomeIcon, TestTube, Calendar, CheckCircle2, Sparkles
} from "lucide-react";

import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Card, CardContent, CardFooter } from "../../../../components/ui/card";
import { Skeleton } from "../../../../components/ui/skeleton";
import { Badge } from "../../../../components/ui/badge";

import { useProductsByCategory, useCategory } from "../../../../hooks/useWordPress";
import type { Product } from "../../../../services/wordpress";

export default function CategoryProductsPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;

  const [searchTerm, setSearchTerm] = useState<string>("");

  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
  } = useProductsByCategory(slug);

  const {
    data: category,
    isLoading: categoryLoading,
    error: categoryError,
  } = useCategory(slug);

  const displayedProducts: Product[] = products
    .filter((p: Product) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a: Product, b: Product) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

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
        <Card className="relative overflow-hidden border-2 border-slate-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 h-full flex flex-col bg-white group-hover:-translate-y-1">
          {product.featured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-amber-500 text-white font-bold text-xs shadow-lg border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}

          {!product.featured && isPopular && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-orange-500 text-white font-bold text-xs shadow-lg border-0">
                <TrendingUp className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            </div>
          )}

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
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors mb-2 line-clamp-2 min-h-[3.5rem]">
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
          <Button onClick={() => window.location.reload()} className="w-full">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-8 sm:py-14 shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <nav className="flex items-center mb-4 sm:mb-6 text-xs sm:text-sm text-blue-200">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                <HomeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 mx-1.5 sm:mx-2" />
              <Link href="/tests" className="hover:text-white transition-colors">
                All Tests
              </Link>
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 mx-1.5 sm:mx-2" />
              <span className="text-white font-semibold truncate max-w-[120px] sm:max-w-none">
                {categoryLoading ? "Loading…" : (category?.name || slug || "Category")}
              </span>
            </nav>

            <div className="text-center">
              {categoryLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 sm:h-12 w-48 sm:w-64 mx-auto bg-white/20" />
                  <Skeleton className="h-12 sm:h-16 w-72 sm:w-96 mx-auto bg-white/20" />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                    {category?.name || slug || "Tests"}
                  </h1>
                  <p className="text-sm sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
                    {category?.description?.replace(/<[^>]*>/g, '') ||
                     `Browse our comprehensive range of diagnostic tests with accurate results and fast reports`}
                  </p>
                </>
              )}

              <div className="flex items-center justify-center gap-2 sm:gap-4 mt-5 sm:mt-8 text-xs sm:text-sm flex-wrap">
                {[
                  { icon: TestTube, text: `${products.length} Tests`, color: "text-blue-300" },
                  { icon: Clock, text: "Same Day Reports", color: "text-green-300" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg">
                    <item.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${item.color}`} />
                    <span className="font-semibold">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Search bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search tests in this category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 text-slate-900 font-medium border-slate-300 focus:border-blue-600 rounded-xl text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                type="button"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-base sm:text-lg font-bold text-slate-900">
            {productsLoading ? 'Loading…' : (
              <><span className="text-blue-700">{displayedProducts.length}</span> {displayedProducts.length === 1 ? 'Test' : 'Tests'} Available</>
            )}
          </p>
          {searchTerm && (
            <p className="text-xs text-slate-500">Results for &ldquo;{searchTerm}&rdquo;</p>
          )}
        </div>

        {/* Grid */}
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
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product: Product) => (
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
              No tests match your search. Try a different keyword.
            </p>
            <Button onClick={() => setSearchTerm('')} className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-6 rounded-xl font-bold">
              <X className="mr-2 h-5 w-5" />
              Clear Search
            </Button>
          </div>
        )}

        {!productsLoading && displayedProducts.length > 0 && (
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
                {[
                  "Free Home Collection",
                  "Digital Reports",
                  "Expert Consultation",
                ].map((label) => (
                  <div key={label} className="bg-white px-6 py-3 rounded-xl shadow-sm border border-blue-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-slate-900">{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
