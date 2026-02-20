import {apiCall} from '../../Axios/Axios';
import AllUrls from '../../Constant/AllUrls';
import {
  categoryPayload,
  OrderPaymentType,
  orderType,
  productType,
} from './types';
// User
export const fetchUserProfile = async (): Promise<any> => {
  const data = await apiCall<any>('get', `${AllUrls.userInfo}`);
  return data;
};

export const updateProfile = async (payload: any): Promise<any> => {
  console.log('put', `${AllUrls.userInfo}`, payload, {}, 'multipart/form-data');

  const data = await apiCall<any>(
    'put',
    `${AllUrls.userInfo}`,
    payload,
    {},
    'multipart/form-data',
  );
  return data;
};
// Category
export const fetchCategory = async (payload: categoryPayload): Promise<any> => {
  const data = await apiCall<any>('get', `${AllUrls.categoryApi}`, {}, payload);
  return data;
};

// Brand
export const fetchBrands = async (payload: categoryPayload): Promise<any> => {
  const data = await apiCall<any>('get', `${AllUrls.brandsApi}`, {}, payload);
  return data;
};
export const fetchVehicles = async (
  payload: categoryPayload,
  brand_id: number,
): Promise<any> => {
  const data = await apiCall<any>(
    'get',
    `${AllUrls.vehicleApi}/${brand_id}`,
    {},
    payload,
  );
  return data;
};

export const fetchBrandCategory = async (
  payload: categoryPayload,
): Promise<any> => {
  const data = await apiCall<any>(
    'get',
    `${AllUrls.brandCategoryApi}/${payload?.brand_id}`,
    {},
    payload,
  );
  return data;
};

// Banner
export const fetchBanners = async (payload: categoryPayload): Promise<any> => {
  const data = await apiCall<any>('get', `${AllUrls.bannersApi}`, payload);
  return data;
};

// Vehicle Segment
export const fetchVehicleSegment = async (
  payload: categoryPayload,
): Promise<any> => {
  const data = await apiCall<any>('get', `${AllUrls.segmentApi}`, {}, payload);
  return data;
};

// products
export const fetchAllProduct = async (payload: productType): Promise<any> => {
  const data = await apiCall<any>('get', `${AllUrls.productApi}`, {}, payload);
  return data;
};
export const fetchAllBrandProduct = async (
  payload: productType,
): Promise<any> => {
  // console.log(payload,'-----------------------------------------------++++++++++++');

  const data = await apiCall<any>(
    'get',
    `${AllUrls.brandProductApi}`,
    {},
    payload,
  );
  return data;
};

export const fetchProductDetails = async (payload: {
  _id: string;
}): Promise<any> => {
  const data = await apiCall<any>(
    'get',
    `${AllUrls.ProductDetailsApi}/${payload._id}`,
  );
  return data;
};

export const updateWishlist = async (payload: {
  product: string;
}): Promise<any> => {
  const data = await apiCall<any>(
    'post',
    `${AllUrls.ProductWishlistApi}`,
    payload,
  );
  return data;
};
export const updateAddToCart = async (payload: {
  product: string;
  qty: number;
}): Promise<any> => {
  const data = await apiCall<any>(
    'post',
    `${AllUrls.updateAddToCartApi}`,
    payload,
  );
  return data;
};
export const fetchWishlist = async (): Promise<any> => {
  const data = await apiCall<any>('get', `${AllUrls.ProductWishlistApi}`);
  return data;
};
export const addRecentViewd = async (payload: {
  product: string;
}): Promise<any> => {
  const data = await apiCall<any>(
    'post',
    `${AllUrls.recentViewedProductApi}`,
    payload,
  );
  return data;
};
export const fetchRecentViewd = async (payload: {
  page: number;
  page_size: number;
}): Promise<any> => {
  const data = await apiCall<any>(
    'get',
    `${AllUrls.recentViewedProductApi}`,
    {},
    payload,
  );
  return data;
};
export const fetchAllAddToCart = async (): Promise<any> => {
  const data = await apiCall<any>('get', `${AllUrls.updateAddToCartApi}`);
  return data;
};

// Rating
export const fetchRating = async (): Promise<any> => {
  const data = await apiCall<any>('get', `${AllUrls.ratingApi}`);
  return data;
};

// Coupon
export const fetchCoupon = async (payload: any): Promise<any> => {
  const data = await apiCall<any>(
    'get',
    `${AllUrls.couponApi}`,
    {},
    {status: true, ...payload},
  );
  return data;
};

// Orders
export const fetchAllOrder = async (payload: orderType): Promise<any> => {
  const data = await apiCall<any>('get', `${AllUrls.orderApi}`, {}, payload);
  return data;
};

// Add Address
export const createAddress = async (payload: any): Promise<any> => {
  const data = await apiCall<any>('post', `${AllUrls.addressApi}`, payload);
  return data;
};
export const fetchAddress = async (): Promise<any> => {
  const data = await apiCall<any>('get', `${AllUrls.addressApi}`);
  return data;
};

export const updateAddress = async (payload: any): Promise<any> => {
  const data = await apiCall<any>(
    'put',
    `${AllUrls.addressStatusApi}/${payload._id}`,
    payload,
  );
  return data;
};

export const updateRecharge = async (payload: {
  amount?: number;
  offer_id?: string;
}): Promise<any> => {
  const data = await apiCall<any>(
    'post',
    `${AllUrls.rechrgeWalletApi}`,
    payload,
  );
  return data;
};
export const rechargeVerify = async (payload: any): Promise<any> => {
  const data = await apiCall<any>(
    'put',
    `${AllUrls.rechrgeWalletVerifyApi}`,
    payload,
  );
  return data;
};

// Order Payment
export const createOrder = async (payload: OrderPaymentType): Promise<any> => {
  const data = await apiCall<any>(
    'post',
    `${AllUrls.orderPaymentApi}`,
    payload,
  );
  return data;
};

export const confirmOrder = async (payload: any): Promise<any> => {
  const data = await apiCall<any>('put', `${AllUrls.orderConfirmApi}`, payload);
  return data;
};

// Charges
export const fetchCharges = async (): Promise<any> => {
  const data = await apiCall<any>('get', `${AllUrls.chargesApi}`);
  return data;
};

// Coupon
export const fetchFAQs = async (payload: any): Promise<any> => {
  const data = await apiCall<any>(
    'get',
    `${AllUrls.FAQsApi}`,
    {},
    {...payload, status: true},
  );
  return data;
};

// Wallet History
export const fetchWalletHistory = async (
  payload: categoryPayload,
): Promise<any> => {
  const data = await apiCall<any>(
    'get',
    `${AllUrls.rechrgeWalletHistoryApi}`,
    {},
    {...payload, status: 'success'},
  );
  return data;
};

// Offers
export const fetchOffers = async (payload: categoryPayload): Promise<any> => {
  const data = await apiCall<any>('get', `${AllUrls.offersApi}`, {}, payload);
  return data;
};

// Charges
export const fetchPrivacyPolicy = async (): Promise<any> => {
  const data = await apiCall<any>('get', `${AllUrls.privacyPolicyApi}`);
  return data;
};
