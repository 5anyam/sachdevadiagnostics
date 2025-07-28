'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { Search, Sliders } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { AspectRatio } from "../../../components/ui/aspect-ratio";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
} from "../../../components/ui/collapsible";
import { useProducts, useCategories } from "../../../hooks/useWordPress";

const ITEMS_PER_PAGE = 20;

const DecorationPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Load products and categories from API
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Apply client-side filtering
  const filteredProducts =
    products?.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" ||
        product.categories.some((cat) => cat.id.toString() === categoryFilter);
      return matchesSearch && matchesCategory;
    }) || [];

  // Apply client-side sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return Number(a.price) - Number(b.price);
    if (sortBy === "price-high") return Number(b.price) - Number(a.price);
    if (sortBy === "rating")
      return Number(b.average_rating) - Number(a.average_rating);
    return 0; // default is popularity
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Ensure current page is reset when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, sortBy]);

  // Clean up modified state when products or categories change
  useEffect(() => {
    if (
      products &&
      categoryFilter !== "all" &&
      !products.some((p) =>
        p.categories.some((c) => c.id.toString() === categoryFilter),
      )
    ) {
      setCategoryFilter("all");
    }
  }, [products, categoryFilter]);

  // Create placeholder arrays for loading states - increased to 24 products
  const productPlaceholders = Array(24).fill(null);
  const categoryPlaceholders = Array(8).fill(null);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // smooth scroll to top of grid
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Decoration Products | Decoration Cart</title>
        <meta
          name="description"
          content="Browse our wide range of decoration packages for every special occasion. Find the perfect decorations for your event."
        />
        <meta
          name="keywords"
          content="decorations, party packages, event decorations, special occasions"
        />
        <link rel="canonical" href="/products" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="container mx-auto px-4 py-12">
          {/* Header Section with Enhanced Colors */}
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium mb-4">
              ✨ Premium Decorations
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Our Decoration Products
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Browse our wide range of decoration packages for every occasion
            </p>
          </div>

          {/* Search and Filter Section with Enhanced Styling */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-purple-500" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] border-purple-200 bg-white/80 backdrop-blur-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">⭐ Popularity</SelectItem>
                  <SelectItem value="price-low">💰 Price: Low to High</SelectItem>
                  <SelectItem value="price-high">💎 Price: High to Low</SelectItem>
                  <SelectItem value="rating">⭐ Rating</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="flex items-center gap-2 border-purple-200 text-purple-600 hover:bg-purple-50 bg-white/80 backdrop-blur-sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Sliders className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Filter Options with Enhanced Colors */}
          <Collapsible
            open={isFilterOpen}
            onOpenChange={setIsFilterOpen}
            className="mb-8"
          >
            <CollapsibleContent className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-purple-100 shadow-lg">
              <div className="flex flex-wrap gap-3">
                <Button
                  key="all"
                  variant={categoryFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter("all")}
                  className={
                    categoryFilter === "all"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      : "border-purple-200 text-purple-600 hover:bg-purple-50 bg-white/80"
                  }
                >
                  🎨 All Categories
                </Button>

                {categoriesLoading
                  ? categoryPlaceholders.map((_, idx) => (
                      <Skeleton key={`cat-skeleton-${idx}`} className="h-9 w-24" />
                    ))
                  : categories?.map((category) => (
                      <Button
                        key={category.id}
                        variant={
                          categoryFilter === category.id.toString()
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setCategoryFilter(category.id.toString())}
                        className={
                          categoryFilter === category.id.toString()
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            : "border-purple-200 text-purple-600 hover:bg-purple-50 bg-white/80"
                        }
                      >
                        {category.name}
                      </Button>
                    ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Products Grid with Enhanced Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {productsLoading ? (
              productPlaceholders.map((_, index) => (
                <div key={`product-skeleton-${index}`} className="h-full">
                  <Card className="overflow-hidden h-full flex flex-col bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
                    <AspectRatio ratio={1}>
                      <Skeleton className="h-full w-full" />
                    </AspectRatio>
                    <CardContent className="p-3 flex-1">
                      <Skeleton className="h-3 w-12 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <div className="mt-2 flex justify-between items-center">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-3 w-8" />
                      </div>
                    </CardContent>
                    <CardFooter className="p-3 pt-0 mt-auto">
                      <Skeleton className="h-8 w-full" />
                    </CardFooter>
                  </Card>
                </div>
              ))
            ) : paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <div key={product.id} className="h-full">
                  <Link href={`/products/${product.id}`} className="block h-full">
                    <Card className="overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full cursor-pointer flex flex-col bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg group">
                      <AspectRatio ratio={1}>
                        <div className="relative overflow-hidden">
                          <img
                            src={
                              product.images[0]?.src ||
                              "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=500&q=80"
                            }
                            alt={product.name}
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </AspectRatio>
                      <CardContent className="p-3 flex-1">
                        <div className="text-xs font-medium text-purple-600 mb-1 bg-purple-50 px-2 py-1 rounded-full inline-block">
                          {product.categories[0]?.name || "Decoration"}
                        </div>
                        <h3 className="font-semibold text-sm md:text-base line-clamp-2 min-h-[2.5rem] text-gray-800">
                          {product.name}
                        </h3>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="font-bold text-lg text-purple-600">
                            ₹{Number(product.price).toFixed(0)}
                          </div>
                          <div className="text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
                            ⭐ {product.average_rating || "5.0"}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-3 pt-0 mt-auto">
                        <div className="w-full">
                          <Button className="w-full text-xs py-2 h-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium">
                            🛍️ View Details
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-100 shadow-lg max-w-md mx-auto">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-xl text-gray-600 mb-6">No products found</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("all");
                    }}
                    className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-white/80"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                ⬅️ Prev
              </Button>

              {[...Array(totalPages)].map((_, idx) => {
                const page = idx + 1;
                return (
                  <Button
                    key={`page-${page}`}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                    className={
                      currentPage === page
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        : "border-purple-200 text-purple-600 hover:bg-purple-50"
                    }
                  >
                    {page}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                Next ➡️
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DecorationPage;
