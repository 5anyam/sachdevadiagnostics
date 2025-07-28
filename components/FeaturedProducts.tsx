'use client'
import Link from "next/link";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AspectRatio } from "../components/ui/aspect-ratio";
import { useFeaturedProducts } from "../hooks/useWordPress";
import { Skeleton } from "../components/ui/skeleton";
import { TestTube, Clock, Shield, Calendar, Star, Users, Award } from "lucide-react";

const FeaturedProducts = () => {
  const { data: products, isLoading, error } = useFeaturedProducts(12);

  // Placeholder products for loading state
  const placeholderProducts = Array(12).fill(null);

  return (
    <section className="py-4 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="mx-auto px-4">
        {error ? (
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-red-500 text-2xl mb-2">😔</div>
              <p className="text-lg text-red-600 mt-2">Failed to load tests</p>
              <p className="text-red-500 text-sm">Please try again later</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading
              ? placeholderProducts.map((_, index) => (
                  <div key={`loading-${index}`} className="h-full">
                    <Card className="overflow-hidden border border-gray-200 shadow-lg bg-white h-full flex flex-col">
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
                  </div>
                ))
              : products?.map((product, index) => (
                  <div key={product.id} className="animate-fade-in-up h-full" style={{ animationDelay: `${index * 0.1}s` }}>
                    <Link href={`/tests/${product.slug}`} className="block group h-full">
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
                              {product.categories[0]?.name || "Diagnostic Test"}
                            </span>
                          </div>
                        </div>

                        <CardContent className="p-4 flex-1">
                          {/* Test Name */}
                          <h3 className="font-bold text-lg text-black group-hover:text-[#194b8c] transition-colors mb-2 line-clamp-2 min-h-[3rem]">
                            {product.name}
                          </h3>
                          
                          {/* Test Description */}
                          <p className="text-sm text-gray-600 font-medium line-clamp-2 mb-3 min-h-[2.5rem]">
                            {product.short_description?.replace(/<[^>]*>/g, '') || "Comprehensive diagnostic test with accurate results"}
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
                                  ₹{Number(product.price).toLocaleString('en-IN')}
                                </span>
                                {product.regular_price && product.regular_price !== product.price && (
                                  <span className="text-sm text-gray-500 line-through font-medium">
                                    ₹{Number(product.regular_price).toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-600 font-medium">Center Visit</span>
                            </div>
                            
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs font-semibold text-yellow-700">
                                {product.average_rating || "4.8"}
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
                  </div>
                ))}
          </div>
        )}
        
        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link href="/tests">
            <Button size="lg" className="bg-gradient-to-r from-[#194b8c] to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <TestTube className="h-5 w-5 mr-2" />
              View All Tests
            </Button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;
