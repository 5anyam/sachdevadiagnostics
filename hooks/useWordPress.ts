'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import * as wpService from '../services/wordpress';
import type { Product, Category, Tag } from '../services/wordpress';

// Type for params
type QueryParams = Record<string, string | number>;

/**
 * Fetch all products with optional params
 */
export function useProducts(params: QueryParams = {}): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => wpService.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch single product by ID or slug
 */
export function useProduct(id: number | string | undefined): UseQueryResult<Product, Error> {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      const product = await wpService.getProduct(id);
      if (!product) throw new Error(`Product not found: ${id}`);
      return product;
    },
    enabled: !!id,
    retry: 1,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Fetch product by slug only
 */
export function useProductBySlug(slug: string | undefined): UseQueryResult<Product, Error> {
  return useQuery({
    queryKey: ['productBySlug', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Product slug is required');
      return wpService.getProductBySlug(slug);
    },
    enabled: !!slug && slug.length > 0,
    retry: 1,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Fetch all categories
 */
export function useCategories(params: QueryParams = {}): UseQueryResult<Category[], Error> {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => wpService.getCategories(params),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

/**
 * Fetch single category by ID or slug
 */
export function useCategory(idOrSlug: number | string | undefined): UseQueryResult<Category | null, Error> {
  return useQuery({
    queryKey: ['category', idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) return null;
      return wpService.getCategory(idOrSlug);
    },
    enabled: !!idOrSlug,
    retry: 1,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

/**
 * Fetch featured products
 */
export function useFeaturedProducts(limit = 4): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['featuredProducts', limit],
    queryFn: () => wpService.getFeaturedProducts(limit),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Search products
 */
export function useSearchProducts(
  search: string,
  params: QueryParams = {}
): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['searchProducts', search, params],
    queryFn: () => wpService.searchProducts(search, params),
    enabled: search.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch products by category (accepts ID or slug) - FIXED VERSION
 */
export function useProductsByCategory(
  categoryIdOrSlug: number | string | undefined,
  params: QueryParams = {}
): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['productsByCategory', categoryIdOrSlug, params],
    queryFn: async () => {
      if (!categoryIdOrSlug) return [];
      
      console.log('🔍 [Hook] Fetching products for category:', categoryIdOrSlug);
      const products = await wpService.getProductsByCategory(categoryIdOrSlug, params);
      console.log(`✅ [Hook] Found ${products.length} products`);
      
      return products;
    },
    enabled: !!categoryIdOrSlug,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch product tags
 */
export function useTags(params: QueryParams = {}): UseQueryResult<Tag[], Error> {
  return useQuery({
    queryKey: ['tags', params],
    queryFn: () => wpService.getTags(params),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

/**
 * Fetch related products
 */
export function useRelatedProducts(
  categoryId: number | string | undefined,
  excludeProductId?: number | string | number[],
  limit = 8
): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['relatedProducts', categoryId, excludeProductId, limit],
    queryFn: async () => {
      if (!categoryId) return [];
      return wpService.getRelatedProducts(categoryId, excludeProductId, limit);
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Fetch popular tests
 */
export function usePopularTests(limit = 100): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['popularTests', limit],
    queryFn: () => wpService.getPopularTests(limit),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

/**
 * Fetch health packages
 */
export function useHealthPackages(limit = 100): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['healthPackages', limit],
    queryFn: () => wpService.getHealthPackages(limit),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

/**
 * Fetch tests by type
 */
export function useTestsByType(testType: string, limit = 10): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['testsByType', testType, limit],
    queryFn: () => wpService.getTestsByType(testType, limit),
    enabled: !!testType && testType.length > 0,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Fetch tests by report TAT
 */
export function useTestsByReportTAT(tat: string, limit = 10): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['testsByReportTAT', tat, limit],
    queryFn: () => wpService.getTestsByReportTAT(tat, limit),
    enabled: !!tat && tat.length > 0,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Fetch product stats
 */
export function useProductStats(): UseQueryResult<wpService.ProductStats, Error> {
  return useQuery({
    queryKey: ['productStats'],
    queryFn: () => wpService.getProductStats(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Fetch products with filters
 */
export function useProductsWithFilters(
  filters: wpService.ProductFilters
): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['productsWithFilters', filters],
    queryFn: () => wpService.getProductsWithFilters(filters),
    enabled: Object.keys(filters).length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
