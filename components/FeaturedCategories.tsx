'use client';

import Link from 'next/link';
import { Card, CardContent } from '..//components/ui/card';
import { AspectRatio } from '../components/ui/aspect-ratio';
import { Skeleton } from '../components/ui/skeleton';
import { useCategories } from '../hooks/useWordPress';

const FeaturedCategories = () => {
  const { data: categories, isLoading, error } = useCategories({ per_page: '4' });

  const placeholderCategories = Array(4).fill(null);

  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Decoration Categories</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse our wide range of decoration services for every occasion
        </p>
      </div>

      {error ? (
        <div className="text-center py-10">
          <p className="text-lg text-red-500">Failed to load categories. Please try again later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? placeholderCategories.map((_, index) => (
                <Card key={`loading-${index}`} className="overflow-hidden">
                  <AspectRatio ratio={4 / 3}>
                    <Skeleton className="h-full w-full" />
                  </AspectRatio>
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))
            : categories?.map((category) => (
                <Link href={`/categories/${category.id}`} key={category.id}>
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <AspectRatio ratio={4 / 3}>
                      <img
                        src={
                          category.image?.src ||
                          'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=500&q=80'
                        }
                        alt={category.name}
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Explore our {category.name.toLowerCase()} decorations
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedCategories;
