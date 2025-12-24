// services/api.ts

// WooCommerce API Configuration
const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://thesiswriting.xyz/wp-json/wc/v3';
const CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || 'ck_f3db9c54ccb91204a281d11979881bae4beae33c';
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || 'cs_91203108604f58127b42d9478d97412e766ec658';

// API Configuration interface
export interface APIConfig {
  url: string;
  hasConsumerKey: boolean;
  hasConsumerSecret: boolean;
  consumerKeyLength: number;
  isConfigured: boolean;
}

// API Error interface
export interface APIError {
  message: string;
  status?: number;
  statusText?: string;
  code?: string;
}

// Request options interface
interface FetchOptions extends RequestInit {
  method: 'GET' | 'POST';
}

// Validate configuration
if (!API_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
  console.error('⚠️ WordPress API credentials not configured properly');
}

console.log('🔧 API Configuration:', {
  url: API_URL,
  hasKey: !!CONSUMER_KEY,
  hasSecret: !!CONSUMER_SECRET
});

/**
 * Main API fetcher function supporting GET and POST requests
 * @template T - The expected response type
 * @param endpoint - API endpoint (e.g., '/products')
 * @param params - Query parameters
 * @param method - HTTP method (GET or POST)
 * @param body - Request body for POST requests
 * @returns Promise with typed response
 */
export async function fetchFromAPI<T = unknown>(
  endpoint: string, 
  params: Record<string, string> = {},
  method: 'GET' | 'POST' = 'GET',
  body?: Record<string, unknown> | string
): Promise<T> {
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
      url: url.replace(CONSUMER_SECRET, '***SECRET***')
    });
    
    const requestOptions: FetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    };

    if (method === 'POST' && body) {
      requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    
    const response = await fetch(url, requestOptions);
    
    console.log('📡 Response Status:', response.status, response.statusText);
    
    if (!response.ok) {
      let errorText = '';
      let errorData: APIError | null = null;
      
      try {
        errorText = await response.text();
        errorData = JSON.parse(errorText) as APIError;
      } catch {
        // If JSON parsing fails, use text as is
      }
      
      console.error('❌ API Response Error:', {
        status: response.status,
        statusText: response.statusText,
        endpoint: cleanEndpoint,
        errorData: errorData || errorText,
        url: url.replace(CONSUMER_SECRET, '***SECRET***')
      });
      
      const errorMessage = errorData?.message || 
        `API error: ${response.status} ${response.statusText}`;
      
      const error = new Error(errorMessage) as Error & { status: number; statusText: string };
      error.status = response.status;
      error.statusText = response.statusText;
      
      throw error;
    }
    
    const data = await response.json() as T;
    
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

/**
 * Simple GET request helper (for compatibility)
 * @template T - The expected response type
 * @param endpoint - API endpoint
 * @param params - Query parameters
 * @returns Promise with typed response
 */
export function fetchFromAPISimple<T = unknown>(
  endpoint: string, 
  params: Record<string, string> = {}
): Promise<T> {
  return fetchFromAPI<T>(endpoint, params, 'GET');
}

/**
 * Test API connection
 * @returns Promise<boolean> - True if connection successful
 */
export async function testAPIConnection(): Promise<boolean> {
  try {
    console.log('🧪 Testing API connection...');
    await fetchFromAPI('/products', { per_page: '1' });
    console.log('✅ API Connection Test: SUCCESS');
    return true;
  } catch (error) {
    console.error('❌ API Connection Test: FAILED', error);
    return false;
  }
}

/**
 * Get API configuration for debugging
 * @returns APIConfig object
 */
export function getAPIConfig(): APIConfig {
  return {
    url: API_URL,
    hasConsumerKey: !!CONSUMER_KEY && CONSUMER_KEY.length > 0,
    hasConsumerSecret: !!CONSUMER_SECRET && CONSUMER_SECRET.length > 0,
    consumerKeyLength: CONSUMER_KEY?.length || 0,
    isConfigured: !!(API_URL && CONSUMER_KEY && CONSUMER_SECRET)
  };
}
