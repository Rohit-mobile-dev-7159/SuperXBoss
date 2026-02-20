import Variable from "./Variable";

// Customer
const Login = `${Variable.Main_Base}/customer/login`;
const OtpVerify = `${Variable.Main_Base}/customer/verify_otp`;
const userUpdate = `${Variable.Main_Base}/customer`;
const userLogout = `${Variable.Main_Base}/customer/logout`;
const userInfo = `${Variable.Main_Base}/customer/info`;

// Category
const categoryApi = `${Variable.Main_Base}/category`;

// Brand
const brandsApi = `${Variable.Main_Base}/brand`;

// Brand
const bannersApi = `${Variable.Main_Base}/banner/position`;

// Vehicle Segment
const segmentApi = `${Variable.Main_Base}/vehicleSegmentType/without-page`;
const vehicleApi = `${Variable.Main_Base}/vehicle`;

// Products
const productApi = `${Variable.Main_Base}/product`;
const brandProductApi = `${Variable.Main_Base}/product/assigned`;
const ProductDetailsApi = `${Variable.Main_Base}/product`;
const ProductWishlistApi = `${Variable.Main_Base}/wish-list`;
const recentViewedProductApi = `${Variable.Main_Base}/view`;
const updateAddToCartApi = `${Variable.Main_Base}/add-to-cart`;
const brandCategoryApi = `${Variable.Main_Base}/category/brand`;

// Rating
const ratingApi = `${Variable.Main_Base}/rating`;

// Coupon
const couponApi = `${Variable.Main_Base}/coupon`;

// Orders
const orderApi = `${Variable.Main_Base}/order`;

// Address
const addressApi = `${Variable.Main_Base}/address`;
const addressStatusApi = `${Variable.Main_Base}/address/status`;

// Recharge
const rechrgeWalletApi = `${Variable.Main_Base}/wallets/create-order`;
const rechrgeWalletVerifyApi = `${Variable.Main_Base}/wallets/verify`;
const rechrgeWalletHistoryApi = `${Variable.Main_Base}/wallets`;

// Order Payment
const orderPaymentApi = `${Variable.Main_Base}/order/init`;
const orderConfirmApi = `${Variable.Main_Base}/order/callback`;

// Charges
const chargesApi = `${Variable.Main_Base}/charges`;
// FAQs
const FAQsApi = `${Variable.Main_Base}/faq`;

// offers
const offersApi = `${Variable.Main_Base}/recharge`;
// PrivacyPolicy
const privacyPolicyApi = `${Variable.Main_Base}/documents`;

const AllUrls = {
  Login,
  OtpVerify,
  userUpdate,
  userLogout,
  categoryApi,
  brandsApi,
  bannersApi,
  segmentApi,
  productApi,
  brandProductApi,
  ProductDetailsApi,
  ratingApi,
  ProductWishlistApi,
  recentViewedProductApi,
  updateAddToCartApi,
  vehicleApi,
  brandCategoryApi,
  userInfo,
  couponApi,
  orderApi,
  addressApi,
  addressStatusApi,
  rechrgeWalletApi,
  orderPaymentApi,
  orderConfirmApi,
  rechrgeWalletVerifyApi,
  chargesApi,
  FAQsApi,
  rechrgeWalletHistoryApi,
  offersApi,
  privacyPolicyApi,
};
export default AllUrls;
