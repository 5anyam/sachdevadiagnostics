"use client";

import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { Card, CardContent } from "../../../components/ui/card";
import { AspectRatio } from "../../../components/ui/aspect-ratio";
import { Skeleton } from "../../../components/ui/skeleton";
import { useCategories } from "../../../hooks/useWordPress";

/**
 * CategoriesPage (Next.js App Router)
 * ---------------------------------
 * 1. Converted from React Router to Next.js.
 * 2. Uses `next/link` & `next/head` for routing and SEO.
 * 3. Marked as a Client Component because it relies on the `useCategories` hook.
 */
export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories();

  // Generate placeholders for loading state
  const placeholders = Array(8).fill(null);

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Decoration Categories | Decoration Cart</title>
        <meta
          name="description"
          content="Browse our wide range of decoration services for every special occasion. Find the perfect decorations for your event."
        />
        <meta
          name="keywords"
          content="decorations, event decorations, party decorations, special occasions"
        />
        <link rel="canonical" href="/categories" />
      </Head>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4">Decoration Categories</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our wide range of decoration services for every occasion
            </p>
          </div>

          {error ? (
            <div className="text-center py-10">
              <p className="text-lg text-red-500">
                Failed to load categories. Please try again later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? placeholders.map((_, index) => (
                    <Card
                      key={`category-skeleton-${index}`}
                      className="overflow-hidden"
                    >
                      <AspectRatio ratio={16 / 9}>
                        <Skeleton className="h-full w-full" />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <div className="flex justify-between mb-2">
                          <Skeleton className="h-6 w-32" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                  ))
                : categories?.map((category) => (
                    <Link
                      href={`/category/${category.id}`}
                      key={category.id}
                      className="block"
                    >
                      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full cursor-pointer">
                        <AspectRatio ratio={16 / 9}>
                          <Image
                            src={
                              category.image?.src ||
                              "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=500&q=80"
                            }
                            alt={category.name}
                            fill
                            className="object-cover w-full h-full"
                          />
                        </AspectRatio>
                        <CardContent className="p-6">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-semibold text-xl">
                              {category.name}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                              View products
                            </span>
                          </div>
                          <p className="text-muted-foreground">
                            {`Explore our ${category.name.toLowerCase()} decorations`}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
