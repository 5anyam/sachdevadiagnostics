
// Next.js configuration helpers for SSR compatibility

// Check if running on client side
export const isClient = typeof window !== 'undefined';

// Get base URL for API calls
export const getBaseUrl = () => {
  if (isClient) return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

// SSR-safe localStorage wrapper
export const storage = {
  getItem: (key: string): string | null => {
    if (!isClient) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (!isClient) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Handle storage errors silently
    }
  },
  removeItem: (key: string): void => {
    if (!isClient) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Handle storage errors silently
    }
  }
};

// SSR-safe window object access
export const safeWindow = isClient ? window : ({} as Window);

// Environment variables helper
export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || process.env.VITE_API_URL || '',
  WP_URL: process.env.NEXT_PUBLIC_WP_URL || process.env.VITE_WP_URL || '',
};

// Image optimization helper for Next.js
export const getOptimizedImageUrl = (src: string, width?: number, height?: number) => {
  if (!src) return '';
  
  // For Next.js, you would use next/image component
  // For now, return the original URL
  return src;
};

// Meta tags helper for Next.js Head component
export const generateMetaTags = (
  title: string,
  description: string,
  image?: string,
  url?: string
) => ({
  title,
  description,
  openGraph: {
    title,
    description,
    url: url || '',
    images: image ? [{ url: image }] : [],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    image,
  },
});
