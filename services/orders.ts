


export interface MetaData {
  key: string;
  value: string;
}

export interface LineItem {
  product_id?: number;
  sku?: string;
  name: string;
  quantity: number;
  price: string; // Remove the ? to make it required
  meta_data?: MetaData[];
}

export interface BillingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export interface FeeLine {
  name: string;
  amount: string;
}

export interface CouponLine {
  code: string;
  discount: string;
}

export interface RefundLine {
  reason?: string;
  amount: string;
}

export interface OrderData {
  billing: BillingAddress;
  shipping: ShippingAddress;
  line_items: LineItem[];
  meta_data: MetaData[];
  currency: string;
  status: string;
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  customer_note?: string;
  shipping_total?: string;
  shipping_tax?: string;
  fee_lines?: FeeLine[];
  coupon_lines?: CouponLine[];
  refunds?: RefundLine[];
}
