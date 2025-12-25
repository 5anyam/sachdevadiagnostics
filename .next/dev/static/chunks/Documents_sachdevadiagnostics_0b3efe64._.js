(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/sachdevadiagnostics/services/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchFromAPI",
    ()=>fetchFromAPI,
    "fetchFromAPILongCache",
    ()=>fetchFromAPILongCache,
    "fetchFromAPIRealtime",
    ()=>fetchFromAPIRealtime,
    "fetchFromAPIShortCache",
    ()=>fetchFromAPIShortCache,
    "fetchFromAPISimple",
    ()=>fetchFromAPISimple,
    "getAPIConfig",
    ()=>getAPIConfig,
    "revalidateAllWooCommerceCache",
    ()=>revalidateAllWooCommerceCache,
    "revalidateCacheTag",
    ()=>revalidateCacheTag,
    "testAPIConnection",
    ()=>testAPIConnection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// services/api.ts
// WooCommerce API Configuration
const API_URL = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://thesiswriting.xyz/wp-json/wc/v3';
const CONSUMER_KEY = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_WC_CONSUMER_KEY || 'ck_f3db9c54ccb91204a281d11979881bae4beae33c';
const CONSUMER_SECRET = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_WC_CONSUMER_SECRET || 'cs_91203108604f58127b42d9478d97412e766ec658';
// Validate configuration
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
console.log('🔧 API Configuration:', {
    url: API_URL,
    hasKey: !!CONSUMER_KEY,
    hasSecret: !!CONSUMER_SECRET
});
async function fetchFromAPI(endpoint, params = {}, method = 'GET', body, cacheOptions) {
    try {
        // Clean endpoint (remove leading slash if present)
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        // Add auth credentials to params
        const queryParams = new URLSearchParams({
            consumer_key: CONSUMER_KEY,
            consumer_secret: CONSUMER_SECRET,
            ...params
        }).toString();
        // Build full URL
        const url = `${API_URL}${cleanEndpoint}?${queryParams}`;
        console.log('🌐 API Request:', {
            method,
            endpoint: cleanEndpoint,
            params: Object.keys(params),
            cache: cacheOptions?.revalidate !== false ? `revalidate: ${cacheOptions?.revalidate || 3600}s` : 'no-store'
        });
        const requestOptions = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        // ✅ Apply cache strategy based on options
        if (cacheOptions?.revalidate === false) {
            // No cache - for real-time data
            requestOptions.cache = 'no-store';
        } else {
            // ISR with revalidation (default: 1 hour)
            const revalidateTime = cacheOptions?.revalidate ?? 3600;
            requestOptions.next = {
                revalidate: revalidateTime,
                tags: cacheOptions?.tags || [
                    `woocommerce-${cleanEndpoint}`
                ]
            };
        }
        if (method === 'POST' && body) {
            requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
        }
        const response = await fetch(url, requestOptions);
        console.log('📡 Response Status:', response.status, response.statusText);
        if (!response.ok) {
            let errorText = '';
            let errorData = null;
            try {
                errorText = await response.text();
                errorData = JSON.parse(errorText);
            } catch  {
            // If JSON parsing fails, use text as is
            }
            console.error('❌ API Response Error:', {
                status: response.status,
                statusText: response.statusText,
                endpoint: cleanEndpoint,
                errorData: errorData || errorText
            });
            const errorMessage = errorData?.message || `API error: ${response.status} ${response.statusText}`;
            const error = new Error(errorMessage);
            error.status = response.status;
            error.statusText = response.statusText;
            throw error;
        }
        const data = await response.json();
        console.log('✅ API Response Success:', {
            endpoint: cleanEndpoint,
            dataType: Array.isArray(data) ? `array[${data.length}]` : typeof data,
            hasData: !!data
        });
        return data;
    } catch (error) {
        console.error('💥 API Fetch Error:', {
            endpoint,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
    }
}
function fetchFromAPISimple(endpoint, params = {}) {
    return fetchFromAPI(endpoint, params, 'GET', undefined, {
        revalidate: 3600
    });
}
function fetchFromAPIRealtime(endpoint, params = {}) {
    return fetchFromAPI(endpoint, params, 'GET', undefined, {
        revalidate: false
    });
}
function fetchFromAPIShortCache(endpoint, params = {}) {
    return fetchFromAPI(endpoint, params, 'GET', undefined, {
        revalidate: 300
    });
}
function fetchFromAPILongCache(endpoint, params = {}) {
    return fetchFromAPI(endpoint, params, 'GET', undefined, {
        revalidate: 86400
    });
}
async function testAPIConnection() {
    try {
        console.log('🧪 Testing API connection...');
        await fetchFromAPI('/products', {
            per_page: '1'
        }, 'GET', undefined, {
            revalidate: false
        });
        console.log('✅ API Connection Test: SUCCESS');
        return true;
    } catch (error) {
        console.error('❌ API Connection Test: FAILED', error);
        return false;
    }
}
function getAPIConfig() {
    return {
        url: API_URL,
        hasConsumerKey: !!CONSUMER_KEY && CONSUMER_KEY.length > 0,
        hasConsumerSecret: !!CONSUMER_SECRET && CONSUMER_SECRET.length > 0,
        consumerKeyLength: CONSUMER_KEY?.length || 0,
        isConfigured: !!(API_URL && CONSUMER_KEY && CONSUMER_SECRET)
    };
}
async function revalidateCacheTag(tag) {
    try {
        // This would be used in an API route with revalidateTag from next/cache
        console.log(`♻️ Revalidating cache tag: ${tag}`);
    // Note: Import revalidateTag from 'next/cache' in API routes to use this
    } catch (error) {
        console.error('❌ Cache revalidation failed:', error);
    }
}
async function revalidateAllWooCommerceCache() {
    try {
        console.log('♻️ Revalidating all WooCommerce cache');
    // Note: Import revalidateTag from 'next/cache' in API routes to use this
    // revalidateTag('woocommerce-*');
    } catch (error) {
        console.error('❌ Full cache revalidation failed:', error);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/sachdevadiagnostics/services/wordpress.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatPrice",
    ()=>formatPrice,
    "getAllProducts",
    ()=>getAllProducts,
    "getCategories",
    ()=>getCategories,
    "getCategory",
    ()=>getCategory,
    "getDiscountPercentage",
    ()=>getDiscountPercentage,
    "getFeaturedProducts",
    ()=>getFeaturedProducts,
    "getHealthPackages",
    ()=>getHealthPackages,
    "getPopularTests",
    ()=>getPopularTests,
    "getProduct",
    ()=>getProduct,
    "getProductBySlug",
    ()=>getProductBySlug,
    "getProductCategories",
    ()=>getProductCategories,
    "getProductMetaValue",
    ()=>getProductMetaValue,
    "getProductPrice",
    ()=>getProductPrice,
    "getProductReviews",
    ()=>getProductReviews,
    "getProductStats",
    ()=>getProductStats,
    "getProductTags",
    ()=>getProductTags,
    "getProductVariations",
    ()=>getProductVariations,
    "getProducts",
    ()=>getProducts,
    "getProductsByCategory",
    ()=>getProductsByCategory,
    "getProductsWithFilters",
    ()=>getProductsWithFilters,
    "getRelatedProducts",
    ()=>getRelatedProducts,
    "getTag",
    ()=>getTag,
    "getTags",
    ()=>getTags,
    "getTestsByReportTAT",
    ()=>getTestsByReportTAT,
    "getTestsByType",
    ()=>getTestsByType,
    "isProductOnSale",
    ()=>isProductOnSale,
    "parseProductMeta",
    ()=>parseProductMeta,
    "searchProducts",
    ()=>searchProducts,
    "stripHtml",
    ()=>stripHtml
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/services/api.ts [app-client] (ecmascript)");
;
// -----------------------------
// 🛠️ Utility Functions
// -----------------------------
/**
 * Utility to convert any number values in params to string
 */ const toStringParams = (params = {})=>{
    return Object.fromEntries(Object.entries(params).map(([key, value])=>[
            key,
            String(value)
        ]));
};
/**
 * Fetch all pages of data automatically (handles pagination)
 */ async function fetchAllPages(endpoint, params = {}, maxPages = 10) {
    const allData = [];
    try {
        // Fetch first page
        const firstPageParams = {
            ...params,
            per_page: 100,
            page: 1
        };
        const firstPage = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFromAPISimple"])(endpoint, toStringParams(firstPageParams));
        allData.push(...firstPage);
        console.log(`📄 Fetched page 1 (${firstPage.length} items)`);
        // If we got 100 items, there might be more pages
        if (firstPage.length === 100) {
            // Fetch remaining pages
            for(let page = 2; page <= maxPages; page++){
                const pageParams = {
                    ...params,
                    per_page: 100,
                    page
                };
                const pageData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFromAPISimple"])(endpoint, toStringParams(pageParams));
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
async function getProducts(params = {}) {
    return fetchAllPages('/products', params);
}
async function getAllProducts(params = {}) {
    const defaultParams = {
        status: 'publish',
        ...params
    };
    return fetchAllPages('/products', defaultParams);
}
async function getProduct(id) {
    try {
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFromAPISimple"])(`/products/${id}`);
    } catch (error) {
        console.error('[Woo] Failed by ID, trying slug:', error);
        if (typeof id === 'string' && isNaN(Number(id))) {
            return getProductBySlug(id);
        }
        throw error;
    }
}
async function getProductBySlug(slug) {
    const products = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFromAPISimple"])('/products', {
        slug
    });
    if (products && products.length > 0) {
        return products[0];
    }
    throw new Error(`Product not found with slug: ${slug}`);
}
async function searchProducts(search, params = {}) {
    return fetchAllPages('/products', {
        search,
        ...params
    });
}
async function getFeaturedProducts(limit = 4) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFromAPISimple"])('/products', toStringParams({
        featured: true,
        per_page: limit
    }));
}
async function getProductsByCategory(categoryIdOrSlug, params = {}) {
    try {
        console.log('🔍 Fetching products for category:', categoryIdOrSlug);
        let finalCategoryId = categoryIdOrSlug;
        // If it's a string (slug), first get the category to find ID
        if (typeof categoryIdOrSlug === 'string') {
            console.log('📝 Category is slug, finding category ID...');
            const categories = await getProductCategories({
                slug: categoryIdOrSlug
            });
            if (categories.length === 0) {
                console.warn('⚠️ No category found with slug:', categoryIdOrSlug);
                return [];
            }
            finalCategoryId = categories[0].id;
            console.log('✅ Found category ID:', finalCategoryId);
        }
        // Fetch all products in this category with pagination
        const products = await fetchAllPages('/products', {
            category: finalCategoryId,
            status: 'publish',
            ...params
        });
        console.log(`✅ Found ${products.length} products in category`);
        return products;
    } catch (error) {
        console.error('❌ Error fetching products by category:', error);
        return [];
    }
}
async function getRelatedProducts(categoryId, excludeProductId, limit = 8) {
    const params = {
        category: String(categoryId),
        per_page: String(limit)
    };
    if (excludeProductId !== undefined) {
        const excludeList = Array.isArray(excludeProductId) ? excludeProductId : [
            excludeProductId
        ];
        params.exclude = excludeList.map(String).join(',');
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFromAPISimple"])('/products', params);
}
async function getCategories(params = {}) {
    return fetchAllPages('/products/categories', params);
}
async function getProductCategories(params = {}) {
    try {
        console.log('🔍 Fetching categories with params:', params);
        const defaultParams = {
            hide_empty: false,
            ...params
        };
        const categories = await fetchAllPages('/products/categories', defaultParams);
        console.log(`✅ Found ${categories.length} categories`);
        return categories;
    } catch (error) {
        console.error('❌ Error fetching categories:', error);
        return [];
    }
}
async function getCategory(idOrSlug) {
    try {
        if (typeof idOrSlug === 'number') {
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFromAPISimple"])(`/products/categories/${idOrSlug}`);
        } else {
            const categories = await getProductCategories({
                slug: idOrSlug
            });
            return categories[0] || null;
        }
    } catch (error) {
        console.error('❌ Error fetching category:', error);
        return null;
    }
}
async function getTags(params = {}) {
    return fetchAllPages('/products/tags', params);
}
async function getProductTags(params = {}) {
    return fetchAllPages('/products/tags', params);
}
async function getTag(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFromAPISimple"])(`/products/tags/${id}`);
}
async function getProductsWithFilters(filters) {
    const params = {};
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFromAPISimple"])('/products', toStringParams(params));
    }
    return fetchAllPages('/products', params);
}
async function getProductStats() {
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
async function getTestsByType(testType, limit = 10) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFromAPISimple"])('/products', toStringParams({
        meta_key: 'test_type',
        meta_value: testType,
        per_page: limit
    }));
}
async function getTestsByReportTAT(tat, limit = 10) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFromAPISimple"])('/products', toStringParams({
        meta_key: 'report_tat',
        meta_value: tat,
        per_page: limit
    }));
}
async function getHealthPackages(limit) {
    const params = {
        meta_key: 'test_type',
        meta_value: 'Health Package'
    };
    if (limit) {
        params.per_page = limit;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFromAPISimple"])('/products', toStringParams(params));
    }
    return fetchAllPages('/products', params);
}
async function getPopularTests(limit) {
    const params = {
        orderby: 'popularity',
        order: 'desc'
    };
    if (limit) {
        params.per_page = limit;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFromAPISimple"])('/products', toStringParams(params));
    }
    return fetchAllPages('/products', params);
}
async function getProductVariations(productId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFromAPISimple"])(`/products/${productId}/variations`);
}
async function getProductReviews(productId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFromAPISimple"])('/products/reviews', {
        product: String(productId)
    });
}
function formatPrice(price) {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) {
        return '₹0';
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numPrice);
}
function getProductMetaValue(product, metaKey) {
    const metaItem = product.meta_data?.find((item)=>item.key === metaKey);
    return metaItem ? String(metaItem.value) : '';
}
function parseProductMeta(product) {
    const getMetaValue = (key)=>getProductMetaValue(product, key);
    const safeJsonParse = (value, fallback = [])=>{
        try {
            if (!value) return fallback;
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : fallback;
        } catch  {
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
        clinicalSignificance: getMetaValue('clinical_significance')
    };
}
function isProductOnSale(product) {
    return !!(product.sale_price && parseFloat(product.sale_price) > 0);
}
function getDiscountPercentage(product) {
    if (!isProductOnSale(product)) return 0;
    const regular = parseFloat(product.regular_price);
    const sale = parseFloat(product.sale_price);
    if (regular === 0 || isNaN(regular) || isNaN(sale)) return 0;
    return Math.round((regular - sale) / regular * 100);
}
function getProductPrice(product) {
    if (isProductOnSale(product)) {
        return parseFloat(product.sale_price);
    }
    return parseFloat(product.price) || parseFloat(product.regular_price) || 0;
}
function stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').trim();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/sachdevadiagnostics/hooks/useWordPress.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCategories",
    ()=>useCategories,
    "useCategory",
    ()=>useCategory,
    "useFeaturedProducts",
    ()=>useFeaturedProducts,
    "useHealthPackages",
    ()=>useHealthPackages,
    "usePopularTests",
    ()=>usePopularTests,
    "useProduct",
    ()=>useProduct,
    "useProductBySlug",
    ()=>useProductBySlug,
    "useProductStats",
    ()=>useProductStats,
    "useProducts",
    ()=>useProducts,
    "useProductsByCategory",
    ()=>useProductsByCategory,
    "useProductsWithFilters",
    ()=>useProductsWithFilters,
    "useRelatedProducts",
    ()=>useRelatedProducts,
    "useSearchProducts",
    ()=>useSearchProducts,
    "useTags",
    ()=>useTags,
    "useTestsByReportTAT",
    ()=>useTestsByReportTAT,
    "useTestsByType",
    ()=>useTestsByType
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$wordpress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/services/wordpress.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature(), _s10 = __turbopack_context__.k.signature(), _s11 = __turbopack_context__.k.signature(), _s12 = __turbopack_context__.k.signature(), _s13 = __turbopack_context__.k.signature(), _s14 = __turbopack_context__.k.signature(), _s15 = __turbopack_context__.k.signature();
'use client';
;
;
function useProducts(params = {}) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'products',
            params
        ],
        queryFn: {
            "useProducts.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$wordpress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProducts"](params)
        }["useProducts.useQuery"],
        staleTime: 1000 * 60 * 5
    });
}
_s(useProducts, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useProduct(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'product',
            id
        ],
        queryFn: {
            "useProduct.useQuery": async ()=>{
                if (!id) throw new Error('Product ID is required');
                const product = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$wordpress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProduct"](id);
                if (!product) throw new Error(`Product not found: ${id}`);
                return product;
            }
        }["useProduct.useQuery"],
        enabled: !!id,
        retry: 1,
        staleTime: 1000 * 60 * 10
    });
}
_s1(useProduct, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useProductBySlug(slug) {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'productBySlug',
            slug
        ],
        queryFn: {
            "useProductBySlug.useQuery": async ()=>{
                if (!slug) throw new Error('Product slug is required');
                return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$wordpress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProductBySlug"](slug);
            }
        }["useProductBySlug.useQuery"],
        enabled: !!slug && slug.length > 0,
        retry: 1,
        staleTime: 1000 * 60 * 10
    });
}
_s2(useProductBySlug, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCategories(params = {}) {
    _s3();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'categories',
            params
        ],
        queryFn: {
            "useCategories.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$wordpress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCategories"](params)
        }["useCategories.useQuery"],
        staleTime: 1000 * 60 * 15
    });
}
_s3(useCategories, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCategory(idOrSlug) {
    _s4();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'category',
            idOrSlug
        ],
        queryFn: {
            "useCategory.useQuery": async ()=>{
                if (!idOrSlug) return null;
                return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$wordpress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCategory"](idOrSlug);
            }
        }["useCategory.useQuery"],
        enabled: !!idOrSlug,
        retry: 1,
        staleTime: 1000 * 60 * 15
    });
}
_s4(useCategory, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useFeaturedProducts(limit = 4) {
    _s5();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'featuredProducts',
            limit
        ],
        queryFn: {
            "useFeaturedProducts.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$wordpress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFeaturedProducts"](limit)
        }["useFeaturedProducts.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s5(useFeaturedProducts, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useSearchProducts(search, params = {}) {
    _s6();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'searchProducts',
            search,
            params
        ],
        queryFn: {
            "useSearchProducts.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$wordpress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchProducts"](search, params)
        }["useSearchProducts.useQuery"],
        enabled: search.length > 0,
        staleTime: 1000 * 60 * 5
    });
}
_s6(useSearchProducts, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useProductsByCategory(categoryIdOrSlug, params = {}) {
    _s7();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'productsByCategory',
            categoryIdOrSlug,
            params
        ],
        queryFn: {
            "useProductsByCategory.useQuery": async ()=>{
                if (!categoryIdOrSlug) return [];
                console.log('🔍 [Hook] Fetching products for category:', categoryIdOrSlug);
                const products = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$wordpress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProductsByCategory"](categoryIdOrSlug, params);
                console.log(`✅ [Hook] Found ${products.length} products`);
                return products;
            }
        }["useProductsByCategory.useQuery"],
        enabled: !!categoryIdOrSlug,
        retry: 2,
        staleTime: 1000 * 60 * 5
    });
}
_s7(useProductsByCategory, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useTags(params = {}) {
    _s8();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'tags',
            params
        ],
        queryFn: {
            "useTags.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$wordpress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTags"](params)
        }["useTags.useQuery"],
        staleTime: 1000 * 60 * 15
    });
}
_s8(useTags, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useRelatedProducts(categoryId, excludeProductId, limit = 8) {
    _s9();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'relatedProducts',
            categoryId,
            excludeProductId,
            limit
        ],
        queryFn: {
            "useRelatedProducts.useQuery": async ()=>{
                if (!categoryId) return [];
                return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$wordpress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRelatedProducts"](categoryId, excludeProductId, limit);
            }
        }["useRelatedProducts.useQuery"],
        enabled: !!categoryId,
        staleTime: 1000 * 60 * 10
    });
}
_s9(useRelatedProducts, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function usePopularTests(limit = 100) {
    _s10();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'popularTests',
            limit
        ],
        queryFn: {
            "usePopularTests.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$wordpress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPopularTests"](limit)
        }["usePopularTests.useQuery"],
        staleTime: 1000 * 60 * 15
    });
}
_s10(usePopularTests, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useHealthPackages(limit = 100) {
    _s11();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'healthPackages',
            limit
        ],
        queryFn: {
            "useHealthPackages.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$wordpress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getHealthPackages"](limit)
        }["useHealthPackages.useQuery"],
        staleTime: 1000 * 60 * 15
    });
}
_s11(useHealthPackages, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useTestsByType(testType, limit = 10) {
    _s12();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'testsByType',
            testType,
            limit
        ],
        queryFn: {
            "useTestsByType.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$wordpress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTestsByType"](testType, limit)
        }["useTestsByType.useQuery"],
        enabled: !!testType && testType.length > 0,
        staleTime: 1000 * 60 * 10
    });
}
_s12(useTestsByType, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useTestsByReportTAT(tat, limit = 10) {
    _s13();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'testsByReportTAT',
            tat,
            limit
        ],
        queryFn: {
            "useTestsByReportTAT.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$wordpress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTestsByReportTAT"](tat, limit)
        }["useTestsByReportTAT.useQuery"],
        enabled: !!tat && tat.length > 0,
        staleTime: 1000 * 60 * 10
    });
}
_s13(useTestsByReportTAT, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useProductStats() {
    _s14();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'productStats'
        ],
        queryFn: {
            "useProductStats.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$wordpress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProductStats"]()
        }["useProductStats.useQuery"],
        staleTime: 1000 * 60 * 30
    });
}
_s14(useProductStats, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useProductsWithFilters(filters) {
    _s15();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'productsWithFilters',
            filters
        ],
        queryFn: {
            "useProductsWithFilters.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$services$2f$wordpress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProductsWithFilters"](filters)
        }["useProductsWithFilters.useQuery"],
        enabled: Object.keys(filters).length > 0,
        staleTime: 1000 * 60 * 5
    });
}
_s15(useProductsWithFilters, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/sachdevadiagnostics/components/ui/skeleton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/lib/utils.ts [app-client] (ecmascript)");
;
;
function Skeleton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("animate-pulse rounded-md bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Documents/sachdevadiagnostics/components/ui/skeleton.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
_c = Skeleton;
;
var _c;
__turbopack_context__.k.register(_c, "Skeleton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$hooks$2f$useWordPress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/hooks/useWordPress.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/components/ui/skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const CircularCategoriesCarousel = ()=>{
    _s();
    const { data: categories, isLoading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$hooks$2f$useWordPress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCategories"])({
        per_page: "16"
    });
    const scrollContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [canScrollLeft, setCanScrollLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [canScrollRight, setCanScrollRight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const placeholderCategories = Array(16).fill(null).map((_, index)=>({
            id: index,
            name: `Category ${index + 1}`,
            slug: `category-${index + 1}`,
            image: null
        }));
    const handleScroll = ()=>{
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };
    const scrollLeft = ()=>{
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    };
    const scrollRight = ()=>{
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    };
    // Check scroll state on mount and when categories change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CircularCategoriesCarousel.useEffect": ()=>{
            if (scrollContainerRef.current) {
                handleScroll();
            }
        }
    }["CircularCategoriesCarousel.useEffect"], [
        categories
    ]);
    const displayCategories = categories || placeholderCategories;
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-12",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-red-500 text-2xl mb-2",
                        children: "😔"
                    }, void 0, false, {
                        fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                        lineNumber: 54,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-lg text-red-600",
                        children: "Unable to load categories"
                    }, void 0, false, {
                        fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                        lineNumber: 55,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-500 text-sm mt-1",
                        children: "Please try again later"
                    }, void 0, false, {
                        fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                lineNumber: 53,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
            lineNumber: 52,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "jsx-6f14ccba6ecd031d" + " " + "py-6 bg-gradient-to-br from-slate-50 via-white to-purple-50/30",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-6f14ccba6ecd031d" + " " + "container mx-auto px-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-6f14ccba6ecd031d" + " " + "relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-6f14ccba6ecd031d" + " " + "hidden lg:block",
                            children: [
                                canScrollLeft && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: scrollLeft,
                                    className: "jsx-6f14ccba6ecd031d" + " " + "absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-xl rounded-full p-3 hover:bg-white hover:scale-110 transition-all duration-300 border border-purple-100",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                        className: "h-5 w-5 text-purple-600"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                                        lineNumber: 76,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                                    lineNumber: 72,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                canScrollRight && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: scrollRight,
                                    className: "jsx-6f14ccba6ecd031d" + " " + "absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-xl rounded-full p-3 hover:bg-white hover:scale-110 transition-all duration-300 border border-purple-100",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                        className: "h-5 w-5 text-purple-600"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                                        lineNumber: 84,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                                    lineNumber: 80,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: scrollContainerRef,
                            onScroll: handleScroll,
                            style: {
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none'
                            },
                            className: "jsx-6f14ccba6ecd031d" + " " + "flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide px-4 lg:px-16 py-6",
                            children: displayCategories.map((category, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        animationDelay: `${index * 0.1}s`
                                    },
                                    className: "jsx-6f14ccba6ecd031d" + " " + "flex-shrink-0 animate-fade-in-up",
                                    children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-6f14ccba6ecd031d" + " " + "flex flex-col items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-6f14ccba6ecd031d" + " " + "w-18 h-18 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 overflow-hidden mb-3 shadow-lg",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                    className: "w-full h-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                                                    lineNumber: 105,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                                                lineNumber: 104,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                className: "h-4 w-16 md:w-20 rounded-full"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                                                lineNumber: 107,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                                        lineNumber: 103,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/categories/${category.id}`,
                                        className: "flex flex-col items-center group cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-6f14ccba6ecd031d" + " " + "relative w-18 h-18 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-purple-100 via-white to-pink-100 overflow-hidden mb-3 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-2xl border-2 border-white",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: category.image?.src || `/cat.png`,
                                                        alt: category.name,
                                                        className: "jsx-6f14ccba6ecd031d" + " " + "w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                                                        lineNumber: 116,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-6f14ccba6ecd031d" + " " + "absolute inset-0 bg-gradient-to-t from-purple-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                                                        lineNumber: 123,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-6f14ccba6ecd031d" + " " + "absolute inset-0 rounded-full border-2 border-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-110 group-hover:scale-100"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                                                        lineNumber: 126,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                                                lineNumber: 115,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-6f14ccba6ecd031d" + " " + "text-sm md:text-base font-semibold text-center max-w-[90px] md:max-w-[110px] lg:max-w-[130px] leading-tight text-gray-700 group-hover:text-purple-600 transition-colors duration-300",
                                                children: category.name
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                                                lineNumber: 130,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                                        lineNumber: 110,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, category.id || index, false, {
                                    fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                                    lineNumber: 97,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                            lineNumber: 90,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-6f14ccba6ecd031d" + " " + "flex justify-center lg:hidden mt-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-6f14ccba6ecd031d" + " " + "flex space-x-2",
                                children: [
                                    ...Array(Math.ceil(displayCategories.length / 4))
                                ].map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-6f14ccba6ecd031d" + " " + "w-2 h-2 rounded-full bg-purple-300 transition-colors duration-300"
                                    }, index, false, {
                                        fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                                        lineNumber: 143,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                            lineNumber: 140,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-6f14ccba6ecd031d" + " " + "absolute left-0 top-0 bottom-0 w-8 lg:w-16 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none z-10"
                        }, void 0, false, {
                            fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-6f14ccba6ecd031d" + " " + "absolute right-0 top-0 bottom-0 w-8 lg:w-16 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-10"
                        }, void 0, false, {
                            fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "6f14ccba6ecd031d",
                children: ".scrollbar-hide.jsx-6f14ccba6ecd031d{-ms-overflow-style:none;scrollbar-width:none}.scrollbar-hide.jsx-6f14ccba6ecd031d::-webkit-scrollbar{display:none}@keyframes fade-in-up{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.animate-fade-in-up.jsx-6f14ccba6ecd031d{opacity:0;animation:.6s ease-out forwards fade-in-up}"
            }, void 0, false, void 0, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/sachdevadiagnostics/components/CircularCategoriesCarousel.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CircularCategoriesCarousel, "+4J51bcJnHalk4jwPz9iarX63G8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$hooks$2f$useWordPress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCategories"]
    ];
});
_c = CircularCategoriesCarousel;
const __TURBOPACK__default__export__ = CircularCategoriesCarousel;
var _c;
__turbopack_context__.k.register(_c, "CircularCategoriesCarousel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeroImageSlider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$embla$2d$carousel$2d$react$2f$esm$2f$embla$2d$carousel$2d$react$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/node_modules/embla-carousel-react/esm/embla-carousel-react.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$embla$2d$carousel$2d$autoplay$2f$esm$2f$embla$2d$carousel$2d$autoplay$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/node_modules/embla-carousel-autoplay/esm/embla-carousel-autoplay.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/Documents/sachdevadiagnostics/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const DIAGNOSTIC_IMAGES = [
    {
        src: "http://thesiswriting.xyz/wp-content/uploads/2025/12/0c80446a-14b6-4948-b8a5-6404ca25b764.jpg",
        alt: "Modern Ultrasound Room with Latest Equipment",
        fallback: "bg-gradient-to-br from-blue-100 via-cyan-50 to-slate-100"
    },
    {
        src: "http://thesiswriting.xyz/wp-content/uploads/2025/12/efcd77e5-549b-4d33-9a18-648b4ada9154.jpg",
        alt: "Expert Radiologist Performing Scan",
        fallback: "bg-gradient-to-br from-purple-100 via-blue-50 to-slate-100"
    },
    {
        src: "http://thesiswriting.xyz/wp-content/uploads/2025/12/2b128fe5-0667-474e-a48c-b84a136ccf78.jpg",
        alt: "NABL Accredited Laboratory",
        fallback: "bg-gradient-to-br from-green-100 via-emerald-50 to-slate-100"
    }
];
function HeroImageSlider() {
    _s();
    const [emblaRef, emblaApi] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$embla$2d$carousel$2d$react$2f$esm$2f$embla$2d$carousel$2d$react$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        loop: true,
        duration: 20
    }, [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$embla$2d$carousel$2d$autoplay$2f$esm$2f$embla$2d$carousel$2d$autoplay$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
            delay: 4000,
            stopOnInteraction: false
        })
    ]);
    const [selectedIndex, setSelectedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [scrollSnaps, setScrollSnaps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const scrollPrev = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "HeroImageSlider.useCallback[scrollPrev]": ()=>{
            if (emblaApi) emblaApi.scrollPrev();
        }
    }["HeroImageSlider.useCallback[scrollPrev]"], [
        emblaApi
    ]);
    const scrollNext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "HeroImageSlider.useCallback[scrollNext]": ()=>{
            if (emblaApi) emblaApi.scrollNext();
        }
    }["HeroImageSlider.useCallback[scrollNext]"], [
        emblaApi
    ]);
    const scrollTo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "HeroImageSlider.useCallback[scrollTo]": (index)=>{
            if (emblaApi) emblaApi.scrollTo(index);
        }
    }["HeroImageSlider.useCallback[scrollTo]"], [
        emblaApi
    ]);
    const onSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "HeroImageSlider.useCallback[onSelect]": ()=>{
            if (!emblaApi) return;
            setSelectedIndex(emblaApi.selectedScrollSnap());
        }
    }["HeroImageSlider.useCallback[onSelect]"], [
        emblaApi
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroImageSlider.useEffect": ()=>{
            if (!emblaApi) return;
            setScrollSnaps(emblaApi.scrollSnapList());
            emblaApi.on('select', onSelect);
            onSelect();
            return ({
                "HeroImageSlider.useEffect": ()=>{
                    emblaApi.off('select', onSelect);
                }
            })["HeroImageSlider.useEffect"];
        }
    }["HeroImageSlider.useEffect"], [
        emblaApi,
        onSelect
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative h-[300px] sm:h-[450px] w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white h-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-hidden h-full",
                        ref: emblaRef,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex h-full",
                            children: DIAGNOSTIC_IMAGES.map((image, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-[0_0_100%] min-w-0 relative",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `w-full h-full ${image.fallback} flex items-center justify-center`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: image.src,
                                            alt: image.alt,
                                            fill: true,
                                            className: "object-cover",
                                            priority: index === 0,
                                            sizes: "(max-width: 768px) 100vw, 50vw",
                                            onError: (e)=>{
                                                // Hide broken image, show gradient fallback
                                                e.currentTarget.style.display = 'none';
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                                            lineNumber: 78,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                                        lineNumber: 77,
                                        columnNumber: 17
                                    }, this)
                                }, index, false, {
                                    fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                                    lineNumber: 76,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                            lineNumber: 74,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: scrollPrev,
                        className: "absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all z-10 group",
                        "aria-label": "Previous image",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                            className: "w-4 h-4 sm:w-6 sm:h-6 text-slate-700 group-hover:text-blue-700"
                        }, void 0, false, {
                            fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                            lineNumber: 102,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: scrollNext,
                        className: "absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all z-10 group",
                        "aria-label": "Next image",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                            className: "w-4 h-4 sm:w-6 sm:h-6 text-slate-700 group-hover:text-blue-700"
                        }, void 0, false, {
                            fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                            lineNumber: 110,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10",
                        children: scrollSnaps.map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>scrollTo(index),
                                className: `w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${index === selectedIndex ? 'bg-white w-6 sm:w-8' : 'bg-white/50 hover:bg-white/75'}`,
                                "aria-label": `Go to slide ${index + 1}`
                            }, index, false, {
                                fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                                lineNumber: 116,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-3 sm:top-6 right-3 sm:right-6 bg-white/95 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl border border-slate-100 z-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 sm:gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-blue-100 p-1.5 sm:p-2.5 rounded-full",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                        className: "h-4 w-4 sm:h-5 sm:w-5 text-blue-700"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                                        lineNumber: 133,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                                    lineNumber: 132,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] sm:text-xs text-slate-500 font-semibold uppercase",
                                            children: "Certified"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                                            lineNumber: 136,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs sm:text-sm font-bold text-slate-900",
                                            children: "NABL Accredited"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                                            lineNumber: 137,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                                    lineNumber: 135,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                        lineNumber: 130,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-3 sm:bottom-6 left-3 sm:left-6 bg-white/95 backdrop-blur-sm px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl border border-slate-100 z-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 sm:gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-green-100 p-1.5 sm:p-2.5 rounded-full",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                        className: "h-4 w-4 sm:h-6 sm:w-6 text-green-600"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                                        lineNumber: 146,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                                    lineNumber: 145,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] sm:text-xs text-slate-500 font-semibold uppercase",
                                            children: "Quick Turnaround"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                                            lineNumber: 149,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm sm:text-lg font-bold text-slate-900",
                                            children: "Reports in 6 Hours"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                                            lineNumber: 150,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                            lineNumber: 144,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 w-48 h-48 sm:w-72 sm:h-72 bg-blue-100/50 rounded-full blur-3xl -z-10"
            }, void 0, false, {
                fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/sachdevadiagnostics/components/HeroImageSlider.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
_s(HeroImageSlider, "JTxLuoonem2nYumbi8AUNbawHQU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$sachdevadiagnostics$2f$node_modules$2f$embla$2d$carousel$2d$react$2f$esm$2f$embla$2d$carousel$2d$react$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c = HeroImageSlider;
var _c;
__turbopack_context__.k.register(_c, "HeroImageSlider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_sachdevadiagnostics_0b3efe64._.js.map