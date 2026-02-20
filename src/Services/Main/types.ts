export interface categoryPayload {
  id?: string;
  name?: string;
  active?: boolean;
  page?: number | undefined | unknown;
  page_size?: number | undefined | unknown;
  type?: string;
  brand_id?: string;
  brand_day?: boolean;
  status?: boolean;
}
export interface TripPage {
  data?: categoryPayload[];
  nextPage?: number;
}

export interface productType {
  orderId?: string;
  active?: boolean;
  page?: number | undefined | unknown;
  page_size?: number | undefined | unknown;
  trend_part?: boolean;
  wish_product?: boolean;
  pop_item?: boolean;
  new_arrival?: boolean;
  search?: string;
  segment?: any;
  brand_id?: string;
  vechicle?: string;
  year?: number;
  categories?: string;
}

export interface orderType {
  status?: string;
  page?: number | undefined | unknown;
  page_size?: number | undefined | unknown;
}

export interface OrderPaymentType {
  products: Array<{
    product_id: string;
    qty: number;
  }>;
  walletAmount?: number;
  coupon?: string;
  shippingAddress?: string;
  point?: number;
  shippingCharges?: number;
}
