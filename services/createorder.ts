import axios from 'axios';
import { OrderData } from './orders'; // or just use directly if same file

const API_URL = 'https://beige-dinosaur-443055.hostingersite.com//wp-json/wc/v3';
const CONSUMER_KEY = 'ck_f3db9c54ccb91204a281d11979881bae4beae33c';
const CONSUMER_SECRET = 'cs_91203108604f58127b42d9478d97412e766ec658';

export async function createOrder(orderData: OrderData) {
  const authParams = {
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
  };

  const response = await axios.post(API_URL, orderData, {
    params: authParams,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}