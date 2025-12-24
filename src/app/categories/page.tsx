"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "../../../components/ui/card";
import { AspectRatio } from "../../../components/ui/aspect-ratio";
import { Skeleton } from "../../../components/ui/skeleton";
import { Badge } from "../../../components/ui/badge";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { useCategories } from "../../../hooks/useWordPress";
import type { Category } from "../../../services/wordpress";
import { 
  Package, 
  ArrowRight, 
  AlertCircle,
  Grid3x3,
  Sparkles
} from "lucide-react";

/**
 * CategoriesPage - Next.js App Router
 * Browse all product categories
 */
export default function CategoriesPage() {
  const { 
    data: categories = [], 
    isLoading, 
    error 
  } = useCategories();

  // Generate placeholders for loading state
  const placeholders = Array.from({ length: 8 });

  // Category Card Component
  const CategoryCard = ({ category }: { category: Category }) => {
    const hasImage = category.image?.src;
    const productCount = category.count || 0;

    return (
      <Link
        href={`/category/${category.slug}`}
        className="block group"
      >
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full border-2 border-slate-200 hover:border-blue-400">
          {/* Category Image */}
          <div className="relative">
            <AspectRatio ratio={16 / 9}>
              {hasImage ? (
                <Image
                  src={category.image.src}
                  alt={category.name}
                  fill
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center">
                  <Package className="h-20 w-20 text-blue-300" />
                </div>
              )}
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Product Count Badge */}
              {productCount > 0 && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-blue-600 text-white font-bold shadow-lg border-0">
                    {productCount} {productCount === 1 ? 'Product' : 'Products'}
                  </Badge>
                </div>
              )}

              {/* Hover Arrow */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <div className="bg-white rounded-full p-2 shadow-lg">
                  <ArrowRight className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </AspectRatio>
          </div>

          {/* Category Info */}
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                {category.name}
              </h3>
              <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 ml-2" />
            </div>
            
            {category.description ? (
              <p className="text-sm text-slate-600 line-clamp-2">
                {category.description.replace(/<[^>]*>/g, '')}
              </p>
            ) : (
              <p className="text-sm text-slate-600">
                Explore our {category.name.toLowerCase()} collection
              </p>
            )}

            {/* View Link */}
            <div className="flex items-center gap-2 mt-4 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
              <span>View Products</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  // Loading Skeleton Component
  const CategorySkeleton = () => (
    <Card className="overflow-hidden border-2 border-slate-200">
      <AspectRatio ratio={16 / 9}>
        <Skeleton className="h-full w-full" />
      </AspectRatio>
      <CardContent className="p-6 space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-24 mt-4" />
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-16 shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Grid3x3 className="h-4 w-4 text-blue-300" />
              <span className="text-sm font-semibold">Product Categories</span>
            </div>
            
            <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Browse Categories
            </h1>
            
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Discover our wide range of products organized by category. Find exactly what you need for your next project.
            </p>

            {/* Stats */}
            {!isLoading && categories.length > 0 && (
              <div className="flex items-center justify-center gap-8 mt-8">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl">
                  <div className="text-3xl font-bold">{categories.length}</div>
                  <div className="text-sm text-blue-200">Categories</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl">
                  <div className="text-3xl font-bold">
                    {categories.reduce((sum, cat) => sum + (cat.count || 0), 0)}
                  </div>
                  <div className="text-sm text-blue-200">Total Products</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-8 border-2">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-base">
              <strong>Error loading categories:</strong>{' '}
              {error instanceof Error ? error.message : 'Failed to load categories. Please try again later.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {placeholders.map((_, index) => (
              <CategorySkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        )}

        {/* Categories Grid */}
        {!isLoading && !error && categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category: Category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && categories.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              No Categories Found
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              We could not find any categories at the moment. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
