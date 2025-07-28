import { fetchFromAPISimple as fetchFromAPI } from './api';

/**
 * ----------------------------------------------
 * WordPress ⇄ WooCommerce API helpers
 * ----------------------------------------------
 */

// -----------------------------
// 🧾 Type Definitions
// -----------------------------

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: { src: string };
  count?: number; // ✅ Added for category filter counts
}

export interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  options: string[];
}

export interface ProductMetaData {
  id: number;
  key: string;
  value: unknown; // better than "any", but flexible
}

// ✅ Added Tag interface for test tags
export interface Tag {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  categories: Category[];
  tags?: Tag[]; // ✅ Added tags support
  images: ProductImage[];
  attributes: ProductAttribute[];
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  meta_data: ProductMetaData[];
  total_sales?: string; // ✅ Added for popularity sorting
  status?: string; // ✅ Added for filtering published products
  type?: string; // ✅ Added for product type filtering
}

// -----------------------------
// 📦 Product Helpers
// -----------------------------

/**
 * Utility to convert any number values in params to string
 */
const toStringParams = (params: Record<string, string | number> = {}): Record<string, string> => {
  return Object.fromEntries(Object.entries(params).map(([key, value]) => [key, String(value)]));
};

// ... (keep all your type definitions as-is, no need to change anything there)

// -----------------------------
// 📦 Product Helpers
// -----------------------------

export const getProducts = async (params = {}): Promise<Product[]> => {
  return fetchFromAPI('/products', toStringParams(params));
};

export const getAllProducts = async (params = {}): Promise<Product[]> => {
  const defaultParams = {
    per_page: 100,
    status: 'publish',
    type: 'simple',
    ...params
  };
  return fetchFromAPI('/products', toStringParams(defaultParams));
};

export const getProduct = async (id: number | string): Promise<Product> => {
  try {
    return await fetchFromAPI(`/products/${id}`);
  } catch (error) {
    console.error('[Woo] Failed by ID, trying slug:', error);
    if (typeof id === 'string' && isNaN(Number(id))) {
      return getProductBySlug(id);
    }
    throw error;
  }
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
  const products: Product[] = await fetchFromAPI('/products', { slug });
  if (products?.length > 0) return products[0];
  throw new Error('Product not found');
};

export const searchProducts = async (
  search: string,
  params = {}
): Promise<Product[]> => {
  return fetchFromAPI('/products', toStringParams({ search, ...params }));
};

export const getFeaturedProducts = async (limit = 4): Promise<Product[]> => {
  return fetchFromAPI('/products', toStringParams({ featured: 'true', per_page: limit }));
};

export const getProductsByCategory = async (
  categoryId: number | string,
  params = {}
): Promise<Product[]> => {
  return fetchFromAPI('/products', toStringParams({
    category: categoryId,
    ...params,
  }));
};

export const getRelatedProducts = async (
  categoryId: number | string,
  excludeProductId?: number | string | number[],
  limit = 8
): Promise<Product[]> => {
  const params: Record<string, string> = {
    category: String(categoryId),
    per_page: String(limit),
  };

  if (excludeProductId !== undefined) {
    const excludeList = Array.isArray(excludeProductId)
      ? excludeProductId
      : [excludeProductId];
    params.exclude = excludeList.map(String).join(',');
  }

  return fetchFromAPI('/products', params);
};

// -----------------------------
// 🗂 Category Helpers
// -----------------------------

export const getCategories = async (params = {}): Promise<Category[]> => {
  return fetchFromAPI('/products/categories', toStringParams(params));
};

export const getProductCategories = async (params = {}): Promise<Category[]> => {
  const defaultParams = {
    per_page: '100',
  status: 'publish',
  type: 'simple',
    ...params
  };
  return fetchFromAPI('/products/categories', toStringParams(defaultParams));
};

export const getCategory = async (id: number | string): Promise<Category> => {
  return fetchFromAPI(`/products/categories/${id}`);
};

// -----------------------------
// 🏷 Tag Helpers
// -----------------------------

export const getTags = async (params = {}): Promise<Tag[]> => {
  return fetchFromAPI('/products/tags', toStringParams(params));
};

export const getProductTags = async (params = {}): Promise<Tag[]> => {
  const defaultParams = {
    per_page: '100',
  status: 'publish',
  type: 'simple',
    ...params
  };
  return fetchFromAPI('/products/tags', toStringParams(defaultParams));
};

export const getTag = async (id: number | string): Promise<Tag> => {
  return fetchFromAPI(`/products/tags/${id}`);
};

// -----------------------------
// 🔍 Filtered Product Search
// -----------------------------

export const getProductsWithFilters = async (filters: {
  search?: string;
  categories?: string[];
  tags?: string[];
  min_price?: number;
  max_price?: number;
  orderby?: 'date' | 'title' | 'price' | 'popularity' | 'rating';
  order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
  status?: string;
  type?: string;
}): Promise<Product[]> => {
  const params: Record<string, string> = {};

  if (filters.search) params.search = filters.search;
  if (filters.categories?.length) params.category = filters.categories.join(',');
  if (filters.tags?.length) params.tag = filters.tags.join(',');
  if (filters.min_price !== undefined) params.min_price = String(filters.min_price);
  if (filters.max_price !== undefined) params.max_price = String(filters.max_price);
  if (filters.orderby) params.orderby = filters.orderby;
  if (filters.order) params.order = filters.order;
  if (filters.per_page !== undefined) params.per_page = String(filters.per_page);
  if (filters.page !== undefined) params.page = String(filters.page);
  if (filters.status) params.status = filters.status;
  if (filters.type) params.type = filters.type;

  return fetchFromAPI('/products', params);
};

// -----------------------------
// 📊 Stats
// -----------------------------

export const getProductStats = async (): Promise<{
  total_products: number;
  total_categories: number;
  total_tags: number;
}> => {
  try {
    const [products, categories, tags] = await Promise.all([
      fetchFromAPI('/products', { per_page: '1' }),
      fetchFromAPI('/products/categories', { per_page: '1' }),
      fetchFromAPI('/products/tags', { per_page: '1' })
    ]);

    return {
      total_products: products.length || 0,
      total_categories: categories.length || 0,
      total_tags: tags.length || 0
    };
  } catch (error) {
    console.error('Error fetching product stats:', error);
    return {
      total_products: 0,
      total_categories: 0,
      total_tags: 0
    };
  }
};

// -----------------------------
// 🧪 Medical Test Helpers
// -----------------------------

export const getTestsByType = async (testType: string, limit = 10): Promise<Product[]> => {
  return fetchFromAPI('/products', toStringParams({
    meta_key: 'test_type',
    meta_value: testType,
    per_page: limit
  }));
};

export const getTestsByReportTAT = async (tat: string, limit = 10): Promise<Product[]> => {
  return fetchFromAPI('/products', toStringParams({
    meta_key: 'report_tat',
    meta_value: tat,
    per_page: limit
  }));
};

export const getHealthPackages = async (limit = 10): Promise<Product[]> => {
  return fetchFromAPI('/products', toStringParams({
    meta_key: 'test_type',
    meta_value: 'Health Package',
    per_page: limit
  }));
};

export const getPopularTests = async (limit = 10): Promise<Product[]> => {
  return fetchFromAPI('/products', toStringParams({
    orderby: 'popularity',
    order: 'desc',
    per_page: limit
  }));
};

// -----------------------------
// 🛒 Woo Product Add-ons
// -----------------------------

export const getProductVariations = async (productId: number): Promise<[]> => {
  return fetchFromAPI(`/products/${productId}/variations`);
};

export const getProductReviews = async (productId: number): Promise<[]> => {
  return fetchFromAPI(`/products/reviews`, { product: String(productId) });
};

// -----------------------------
// 💡 Utilities
// -----------------------------

export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
};

export const getProductMetaValue = (product: Product, metaKey: string): string => {
  const metaItem = product.meta_data?.find(item => item.key === metaKey);
  return metaItem ? String(metaItem.value) : '';
};

export const parseProductMeta = (product: Product) => {
  const getMetaValue = (key: string) => getProductMetaValue(product, key);
  
  return {
    alsoKnownAs: getMetaValue('also_known_as'),
    preparationInstructions: getMetaValue('preparation_instructions'),
    fastingRequired: getMetaValue('fasting_required'),
    reportTat: getMetaValue('report_tat') || 'Same Day',
    testType: getMetaValue('test_type') || 'Diagnostic Test',
    includedTests: getMetaValue('included_tests') ? 
      JSON.parse(getMetaValue('included_tests')) : [],
    sampleType: getMetaValue('sample_type') || 'Blood',
    testComponents: getMetaValue('test_components') ? 
      JSON.parse(getMetaValue('test_components')) : [],
    normalRange: getMetaValue('normal_range'),
    clinicalSignificance: getMetaValue('clinical_significance'),
  };
};
