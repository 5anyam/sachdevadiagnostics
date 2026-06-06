import axios from 'axios';
import { OrderData } from './orders';

const BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://navajowhite-turkey-121983.hostingersite.com/wp-json/wc/v3';
const CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || 'ck_f3db9c54ccb91204a281d11979881bae4beae33c';
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || 'cs_91203108604f58127b42d9478d97412e766ec658';

export async function createOrder(orderData: OrderData) {
  const response = await axios.post(`${BASE_URL}/orders`, orderData, {
    params: { consumer_key: CONSUMER_KEY, consumer_secret: CONSUMER_SECRET },
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
}

// Returns count of bookings per time slot for a given date (YYYY-MM-DD)
export async function getSlotCountsForDate(date: string): Promise<Record<string, number>> {
  try {
    const response = await axios.get(`${BASE_URL}/orders`, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        per_page: 100,
        status: 'pending,processing,on-hold,completed',
      },
    });
    const orders = response.data as Array<{ meta_data?: Array<{ key: string; value: string }> }>;
    const counts: Record<string, number> = {};
    orders.forEach(order => {
      const dateMeta = order.meta_data?.find(m => m.key === 'appointment_date');
      const timeMeta = order.meta_data?.find(m => m.key === 'appointment_time');
      if (dateMeta?.value === date && timeMeta?.value) {
        counts[timeMeta.value] = (counts[timeMeta.value] || 0) + 1;
      }
    });
    return counts;
  } catch {
    return {};
  }
}