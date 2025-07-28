'use client';

import { useQuery } from '@tanstack/react-query';
import * as wpService from '../services/wordpress'; // ✅ nextjs path alias preferred

export const useProducts = (params: Record<string, string> = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => wpService.getProducts(params),
  });
};

export const useProduct = (id: number | string | undefined) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => {
      if (!id) throw new Error('Product ID is required');
      return wpService.getProduct(id);
    },
    enabled: !!id,
    retry: 1,
  });
};

export const useProductBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['productBySlug', slug],
    queryFn: () => {
      if (!slug) throw new Error('Product slug is required');
      return wpService.getProductBySlug(slug);
    },
    enabled: !!slug && slug.length > 0,
    retry: 1,
  });
};

export const useCategories = (params: Record<string, string> = {}) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => wpService.getCategories(params),
  });
};

export const useCategory = (id: number | string | undefined) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => wpService.getCategory(id as string),
    enabled: !!id,
  });
};

export const useFeaturedProducts = (limit = 4) => {
  return useQuery({
    queryKey: ['featuredProducts', limit],
    queryFn: () => wpService.getFeaturedProducts(limit),
  });
};

export const useSearchProducts = (
  search: string,
  params: Record<string, string> = {}
) => {
  return useQuery({
    queryKey: ['searchProducts', search, params],
    queryFn: () => wpService.searchProducts(search, params),
    enabled: search.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

export const useProductsByCategory = (
  categoryId: number | string | undefined,
  categorySlug : number | string | undefined,
  params: Record<string, string> = {}
) => {
  return useQuery({
    queryKey: ['productsByCategory', categoryId, params],
    queryFn: () =>
      wpService.getProductsByCategory(categoryId as string, params),
    enabled: !!categoryId,
  });
};
