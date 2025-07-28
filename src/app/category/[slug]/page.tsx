"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Search, ChevronRight } from "lucide-react";

import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Card, CardContent, CardFooter } from "../../../../components/ui/card";
import { AspectRatio } from "../../../../components/ui/aspect-ratio";
import { Skeleton } from "../../../../components/ui/skeleton";

import { useProductsByCategory, useCategory } from "../../../../hooks/useWordPress";

/**
 * Next.js (App Router) version of the CategoryProductsPage component.
 * This file lives at `app/categories/[slug]/page.tsx`, giving us the
 * `/categories/:slug` route automatically.
 */
export default function CategoryProductsPage() {
  // Access the dynamic route param `/categories/[slug]`
  const params = useParams();
  const slug = params?.slug as string | undefined;

  // Local UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "popularity" | "price-low" | "price-high" | "rating"
  >("popularity");

  // Data fetching hooks (client-side fetching).
  const {
    data: products = [],
    isLoading: productsLoading,
  } = useProductsByCategory(slug, slug);
  const {
    data: category,
    isLoading: categoryLoading,
  } = useCategory(slug);

  // Client-side search filtering
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Client-side sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return Number(a.price) - Number(b.price);
    if (sortBy === "price-high") return Number(b.price) - Number(a.price);
    if (sortBy === "rating")
      return Number(b.average_rating) - Number(a.average_rating);
    return 0; // popularity (default)
  });

  // Skeleton placeholders
  const productPlaceholders = Array.from({ length: 8 });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* ---------------------------------------------- */}
        {/* Header & SEO-friendly copy                    */}
        {/* ---------------------------------------------- */}
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">
            {categoryLoading ? "Loading Category…" : `${category?.name} Decorations`}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our wide range of {category?.name?.toLowerCase() || "decoration"} packages for every occasion
          </p>
        </header>

        {/* ---------------------------------------------- */}
        {/* Breadcrumbs                                   */}
        {/* ---------------------------------------------- */}
        <nav className="flex items-center mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/categories" className="hover:text-foreground transition-colors">
            Categories
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground">
            {categoryLoading ? "Loading…" : category?.name}
          </span>
        </nav>

        {/* ---------------------------------------------- */}
        {/* Search + Sort Controls                        */}
        {/* ---------------------------------------------- */}
        <section className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort */}
          <div className="flex gap-3">
            <select
              className="border border-input rounded-md px-3 py-2 bg-transparent"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "popularity" | "price-low" | "price-high" | "rating")
              }
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </section>

        {/* ---------------------------------------------- */}
        {/* Products Grid                                 */}
        {/* ---------------------------------------------- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productsLoading ? (
            /* Loading Skeletons */
            productPlaceholders.map((_, index) => (
              <Card key={`product-skeleton-${index}`} className="overflow-hidden">
                <AspectRatio ratio={1}>
                  <Skeleton className="h-full w-full" />
                </AspectRatio>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-5 w-full mb-2" />
                  <div className="mt-2 flex justify-between items-center">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))
          ) : sortedProducts.length > 0 ? (
            /* Actual Products */
            sortedProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="block">
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full">
                  <AspectRatio ratio={1}>
                    <img
                      src={
                        product.images?.[0]?.src ||
                        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=500&q=80"
                      }
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <CardContent className="p-4">
                    <span className="text-sm text-muted-foreground mb-1 block">
                      {product.categories?.[0]?.name || "Decoration"}
                    </span>
                    <h3 className="font-semibold text-lg leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="font-medium">₹{Number(product.price).toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">★ {product.average_rating}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full">View Details</Button>
                  </CardFooter>
                </Card>
              </Link>
            ))
          ) : (
            /* Nothing matched search */
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-muted-foreground mb-4">No products found</p>
              <Button variant="outline" onClick={() => setSearchTerm("")}>Clear Search</Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
