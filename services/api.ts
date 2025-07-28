// WooCommerce API credentials
const API_URL = 'https://beige-dinosaur-443055.hostingersite.com//wp-json/wc/v3';
const CONSUMER_KEY = 'ck_f3db9c54ccb91204a281d11979881bae4beae33c';
const CONSUMER_SECRET = 'cs_91203108604f58127b42d9478d97412e766ec658';


// Main API fetcher function supporting GET and POST
export const fetchFromAPI = async (
  endpoint: string, 
  params: Record<string, string> = {},
  method: 'GET' | 'POST' = 'GET',
  body?: string
) => {
  try {
    // Add auth credentials to params for GET requests or query string for POST
    const queryParams = new URLSearchParams({
      consumer_key: CONSUMER_KEY,
      consumer_secret: CONSUMER_SECRET,
      ...params
    }).toString();
    
    const url = `${API_URL}${endpoint}?${queryParams}`;
    console.log('Making API request to:', url, 'Method:', method);
    
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (method === 'POST' && body) {
      requestOptions.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url: url
      });
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('API error details:', error);
    throw error;
  }
};

// Keep the same function name for compatibility
export const fetchFromAPISimple = (endpoint: string, params: Record<string, string> = {}) => 
  fetchFromAPI(endpoint, params, 'GET');
