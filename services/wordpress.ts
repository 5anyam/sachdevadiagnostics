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
  count?: number;
  description?: string;
  parent?: number;
}

export interface ProductImage {
  id: number;
  src: string;
  alt: string;
  name?: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  options: string[];
  position?: number;
  visible?: boolean;
  variation?: boolean;
}

export interface ProductMetaData {
  id: number;
  key: string;
  value: unknown;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  count?: number;
  description?: string;
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
  tags?: Tag[];
  images: ProductImage[];
  attributes: ProductAttribute[];
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  meta_data: ProductMetaData[];
  total_sales?: string;
  status?: string;
  type?: string;
  featured?: boolean;
  stock_status?: string;
  stock_quantity?: number;
}

export interface ProductReview {
  id: number;
  product_id: number;
  reviewer: string;
  reviewer_email: string;
  review: string;
  rating: number;
  date_created: string;
  verified: boolean;
}

export interface ProductVariation {
  id: number;
  product_id: number;
  attributes: ProductAttribute[];
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: string;
  image: ProductImage;
}

export interface ProductStats {
  total_products: number;
  total_categories: number;
  total_tags: number;
}

export interface ParsedProductMeta {
  alsoKnownAs: string;
  preparationInstructions: string;
  fastingRequired: string;
  reportTat: string;
  testType: string;
  includedTests: string[];
  sampleType: string;
  testComponents: string[];
  normalRange: string;
  clinicalSignificance: string;
}

// -----------------------------
// 🛠️ Utility Functions
// -----------------------------

/**
 * Utility to convert any number values in params to string
 */
const toStringParams = (params: Record<string, string | number | boolean> = {}): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  );
};

/**
 * Fetch all pages of data automatically (handles pagination)
 */
async function fetchAllPages<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {},
  maxPages = 10
): Promise<T[]> {
  const allData: T[] = [];
  
  try {
    // Fetch first page
    const firstPageParams = { ...params, per_page: 100, page: 1 };
    const firstPage = await fetchFromAPI<T[]>(endpoint, toStringParams(firstPageParams));
    
    allData.push(...firstPage);
    console.log(`📄 Fetched page 1 (${firstPage.length} items)`);
    
    // If we got 100 items, there might be more pages
    if (firstPage.length === 100) {
      // Fetch remaining pages
      for (let page = 2; page <= maxPages; page++) {
        const pageParams = { ...params, per_page: 100, page };
        const pageData = await fetchFromAPI<T[]>(endpoint, toStringParams(pageParams));
        
        if (pageData.length === 0) {
          console.log(`📄 No more data at page ${page}`);
          break;
        }
        
        allData.push(...pageData);
        console.log(`📄 Fetched page ${page} (${pageData.length} items)`);
        
        // If we got less than 100, this is the last page
        if (pageData.length < 100) {
          console.log(`📄 Last page reached at page ${page}`);
          break;
        }
      }
    }
    
    console.log(`✅ Total items fetched: ${allData.length}`);
    return allData;
  } catch (error) {
    console.error('❌ Error fetching all pages:', error);
    throw error;
  }
}

// -----------------------------
// 📦 Product Helpers
// -----------------------------

export async function getProducts(params: Record<string, string | number> = {}): Promise<Product[]> {
  return fetchAllPages<Product>('/products', params);
}

export async function getAllProducts(params: Record<string, string | number> = {}): Promise<Product[]> {
  const defaultParams = {
    status: 'publish',
    ...params
  };
  return fetchAllPages<Product>('/products', defaultParams);
}

export async function getProduct(id: number | string): Promise<Product> {
  try {
    return await fetchFromAPI<Product>(`/products/${id}`);
  } catch (error) {
    console.error('[Woo] Failed by ID, trying slug:', error);
    if (typeof id === 'string' && isNaN(Number(id))) {
      return getProductBySlug(id);
    }
    throw error;
  }
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const products = await fetchFromAPI<Product[]>('/products', { slug });
  if (products && products.length > 0) {
    return products[0];
  }
  throw new Error(`Product not found with slug: ${slug}`);
}

export async function searchProducts(
  search: string,
  params: Record<string, string | number> = {}
): Promise<Product[]> {
  return fetchAllPages<Product>('/products', { search, ...params });
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return fetchFromAPI<Product[]>('/products', toStringParams({ 
    featured: true, 
    per_page: limit 
  }));
}

export async function getProductsByCategory(
  categoryIdOrSlug: number | string,
  params: Record<string, string | number> = {}
): Promise<Product[]> {
  try {
    console.log('🔍 Fetching products for category:', categoryIdOrSlug);
    
    let finalCategoryId: number | string = categoryIdOrSlug;
    
    // If it's a string (slug), first get the category to find ID
    if (typeof categoryIdOrSlug === 'string') {
      console.log('📝 Category is slug, finding category ID...');
      const categories = await getProductCategories({ slug: categoryIdOrSlug });
      
      if (categories.length === 0) {
        console.warn('⚠️ No category found with slug:', categoryIdOrSlug);
        return [];
      }
      
      finalCategoryId = categories[0].id;
      console.log('✅ Found category ID:', finalCategoryId);
    }
    
    // Fetch all products in this category with pagination
    const products = await fetchAllPages<Product>('/products', {
      category: finalCategoryId,
      status: 'publish',
      ...params,
    });
    
    console.log(`✅ Found ${products.length} products in category`);
    return products;
  } catch (error) {
    console.error('❌ Error fetching products by category:', error);
    return [];
  }
}

export async function getRelatedProducts(
  categoryId: number | string,
  excludeProductId?: number | string | number[],
  limit = 8
): Promise<Product[]> {
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

  return fetchFromAPI<Product[]>('/products', params);
}

// -----------------------------
// 🗂 Category Helpers
// -----------------------------

export async function getCategories(params: Record<string, string | number> = {}): Promise<Category[]> {
  return fetchAllPages<Category>('/products/categories', params);
}

export async function getProductCategories(params: Record<string, string | number> = {}): Promise<Category[]> {
  try {
    console.log('🔍 Fetching categories with params:', params);
    const defaultParams = {
      hide_empty: false,
      ...params
    };
    
    const categories = await fetchAllPages<Category>(
      '/products/categories', 
      defaultParams
    );
    
    console.log(`✅ Found ${categories.length} categories`);
    return categories;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
}

export async function getCategory(idOrSlug: number | string): Promise<Category | null> {
  try {
    if (typeof idOrSlug === 'number') {
      return await fetchFromAPI<Category>(`/products/categories/${idOrSlug}`);
    } else {
      const categories = await getProductCategories({ slug: idOrSlug });
      return categories[0] || null;
    }
  } catch (error) {
    console.error('❌ Error fetching category:', error);
    return null;
  }
}

// -----------------------------
// 🏷 Tag Helpers
// -----------------------------

export async function getTags(params: Record<string, string | number> = {}): Promise<Tag[]> {
  return fetchAllPages<Tag>('/products/tags', params);
}

export async function getProductTags(params: Record<string, string | number> = {}): Promise<Tag[]> {
  return fetchAllPages<Tag>('/products/tags', params);
}

export async function getTag(id: number | string): Promise<Tag> {
  return fetchFromAPI<Tag>(`/products/tags/${id}`);
}

// -----------------------------
// 🔍 Filtered Product Search
// -----------------------------

export interface ProductFilters {
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
  featured?: boolean;
}

export async function getProductsWithFilters(filters: ProductFilters): Promise<Product[]> {
  const params: Record<string, string | number | boolean> = {};

  if (filters.search) params.search = filters.search;
  if (filters.categories?.length) params.category = filters.categories.join(',');
  if (filters.tags?.length) params.tag = filters.tags.join(',');
  if (filters.min_price !== undefined) params.min_price = filters.min_price;
  if (filters.max_price !== undefined) params.max_price = filters.max_price;
  if (filters.orderby) params.orderby = filters.orderby;
  if (filters.order) params.order = filters.order;
  if (filters.status) params.status = filters.status;
  if (filters.type) params.type = filters.type;
  if (filters.featured !== undefined) params.featured = filters.featured;

  // If specific page requested, don't use fetchAllPages
  if (filters.page !== undefined || filters.per_page !== undefined) {
    if (filters.per_page !== undefined) params.per_page = filters.per_page;
    if (filters.page !== undefined) params.page = filters.page;
    return fetchFromAPI<Product[]>('/products', toStringParams(params));
  }

  return fetchAllPages<Product>('/products', params);
}

// -----------------------------
// 📊 Stats
// -----------------------------

export async function getProductStats(): Promise<ProductStats> {
  try {
    const [products, categories, tags] = await Promise.all([
      getAllProducts(),
      getProductCategories(),
      getProductTags()
    ]);

    return {
      total_products: products.length,
      total_categories: categories.length,
      total_tags: tags.length
    };
  } catch (error) {
    console.error('❌ Error fetching product stats:', error);
    return {
      total_products: 0,
      total_categories: 0,
      total_tags: 0
    };
  }
}

// -----------------------------
// 🧪 Medical Test Helpers
// -----------------------------

export async function getTestsByType(testType: string, limit = 10): Promise<Product[]> {
  return fetchFromAPI<Product[]>('/products', toStringParams({
    meta_key: 'test_type',
    meta_value: testType,
    per_page: limit
  }));
}

export async function getTestsByReportTAT(tat: string, limit = 10): Promise<Product[]> {
  return fetchFromAPI<Product[]>('/products', toStringParams({
    meta_key: 'report_tat',
    meta_value: tat,
    per_page: limit
  }));
}

export async function getHealthPackages(limit?: number): Promise<Product[]> {
  const params: Record<string, string | number> = {
    meta_key: 'test_type',
    meta_value: 'Health Package'
  };
  
  if (limit) {
    params.per_page = limit;
    return fetchFromAPI<Product[]>('/products', toStringParams(params));
  }
  
  return fetchAllPages<Product>('/products', params);
}

export async function getPopularTests(limit?: number): Promise<Product[]> {
  const params: Record<string, string | number> = {
    orderby: 'popularity',
    order: 'desc'
  };
  
  if (limit) {
    params.per_page = limit;
    return fetchFromAPI<Product[]>('/products', toStringParams(params));
  }
  
  return fetchAllPages<Product>('/products', params);
}

// -----------------------------
// 🛒 Woo Product Add-ons
// -----------------------------

export async function getProductVariations(productId: number): Promise<ProductVariation[]> {
  return fetchFromAPI<ProductVariation[]>(`/products/${productId}/variations`);
}

export async function getProductReviews(productId: number): Promise<ProductReview[]> {
  return fetchFromAPI<ProductReview[]>('/products/reviews', { product: String(productId) });
}

// -----------------------------
// 💡 Utilities
// -----------------------------

export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return '₹0';
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
}

export function getProductMetaValue(product: Product, metaKey: string): string {
  const metaItem = product.meta_data?.find(item => item.key === metaKey);
  return metaItem ? String(metaItem.value) : '';
}

export function parseProductMeta(product: Product): ParsedProductMeta {
  const getMetaValue = (key: string): string => getProductMetaValue(product, key);
  
  const safeJsonParse = (value: string, fallback: string[] = []): string[] => {
    try {
      if (!value) return fallback;
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  };

  return {
    alsoKnownAs: getMetaValue('also_known_as'),
    preparationInstructions: getMetaValue('preparation_instructions'),
    fastingRequired: getMetaValue('fasting_required'),
    reportTat: getMetaValue('report_tat') || 'Same Day',
    testType: getMetaValue('test_type') || 'Diagnostic Test',
    includedTests: safeJsonParse(getMetaValue('included_tests')),
    sampleType: getMetaValue('sample_type') || 'Blood',
    testComponents: safeJsonParse(getMetaValue('test_components')),
    normalRange: getMetaValue('normal_range'),
    clinicalSignificance: getMetaValue('clinical_significance'),
  };
}

// -----------------------------
// 🔧 Helper: Check if product is on sale
// -----------------------------

export function isProductOnSale(product: Product): boolean {
  return !!(product.sale_price && parseFloat(product.sale_price) > 0);
}

// -----------------------------
// 🔧 Helper: Get discount percentage
// -----------------------------

export function getDiscountPercentage(product: Product): number {
  if (!isProductOnSale(product)) return 0;
  
  const regular = parseFloat(product.regular_price);
  const sale = parseFloat(product.sale_price);
  
  if (regular === 0 || isNaN(regular) || isNaN(sale)) return 0;
  
  return Math.round(((regular - sale) / regular) * 100);
}

// -----------------------------
// 🔧 Helper: Get product price (sale or regular)
// -----------------------------

export function getProductPrice(product: Product): number {
  if (isProductOnSale(product)) {
    return parseFloat(product.sale_price);
  }
  return parseFloat(product.price) || parseFloat(product.regular_price) || 0;
}

// -----------------------------
// 🔧 Helper: Strip HTML tags
// -----------------------------

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}
