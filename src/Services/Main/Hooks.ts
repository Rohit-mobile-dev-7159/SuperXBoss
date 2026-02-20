import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {categoryPayload, productType, TripPage} from "./types";
import {
  addRecentViewd,
  confirmOrder,
  createAddress,
  createOrder,
  fetchAddress,
  fetchAllAddToCart,
  fetchAllBrandProduct,
  fetchAllOrder,
  fetchAllProduct,
  fetchBanners,
  fetchBrands,
  fetchCategory,
  fetchCharges,
  fetchCoupon,
  fetchFAQs,
  fetchOffers,
  fetchPrivacyPolicy,
  fetchProductDetails,
  fetchRating,
  fetchRecentViewd,
  fetchUserProfile,
  fetchVehicleSegment,
  fetchWalletHistory,
  fetchWishlist,
  rechargeVerify,
  updateAddress,
  updateAddToCart,
  updateRecharge,
  updateWishlist,
} from "./apis";

// User

export const useFetchUserProfile = () => {
  return useQuery({
    queryKey: ["fetchUserProfile"],
    queryFn: () => fetchUserProfile(),
  });
};

// Category
export const useFetchCategory = (payload: categoryPayload) => {
  return useInfiniteQuery<TripPage, Error>({
    queryKey: ["fetchCategory", payload],
    queryFn: ({pageParam = 1}) =>
      fetchCategory({
        ...payload,
        page: pageParam,
        page_size: payload.page_size,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) =>
      lastPage?.pagination?.page < lastPage?.pagination?.totalPages
        ? lastPage?.pagination?.page + 1
        : undefined,

    select: data => {
      const mergedResults = data.pages.flatMap(
        (page: any) => page._payload ?? [],
      );
      return {
        ...data,
        result: mergedResults,
      };
    },
  });
};

// Brand
export const useFetchBrand = (payload: categoryPayload) => {
  return useInfiniteQuery<TripPage, Error>({
    queryKey: ["fetchBrands", payload],
    queryFn: ({pageParam = 1}) =>
      fetchBrands({
        ...payload,
        page: pageParam,
        page_size: payload.page_size,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) =>
      lastPage?.pagination?.page < lastPage?.pagination?.totalPages
        ? lastPage?.pagination?.page + 1
        : undefined,

    select: data => {
      const mergedResults = data.pages.flatMap(
        (page: any) => page._payload ?? [],
      );
      return {
        ...data,
        result: mergedResults,
      };
    },
  });
};
// Banner
export const useFetchBanners = (
  payload: Omit<categoryPayload, "page" | "page_size">,
) => {
  return useQuery({
    queryKey: ["fetchBanners", payload],
    queryFn: () =>
      fetchBanners({
        ...payload,
        page: 1,
        page_size: 10,
      }),
  });
};
// Vehicle Segment
export const useFetchVehicleSegment = (
  payload: Omit<categoryPayload, "page" | "page_size">,
) => {
  return useInfiniteQuery<TripPage, Error>({
    queryKey: ["fetchVehicleSegment", payload],
    queryFn: ({pageParam = 1}) =>
      fetchVehicleSegment({
        ...payload,
        page: pageParam,
        page_size: 20,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) =>
      lastPage?.pagination?.page < lastPage?.pagination?.totalPages
        ? lastPage?.pagination?.page + 1
        : undefined,

    select: data => {
      const mergedResults = data.pages.flatMap(
        (page: any) => page._payload ?? [],
      );
      return {
        ...data,
        result: mergedResults,
      };
    },
  });
};
// Products
export const useFetchAllProduct = (payload: productType) => {
  return useInfiniteQuery<TripPage, Error>({
    queryKey: ["fetchAllProduct", payload],
    queryFn: ({pageParam = 1}) =>
      fetchAllProduct({
        ...payload,
        page: pageParam,
        page_size: 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) =>
      lastPage?.pagination?.page < lastPage?.pagination?.totalPages
        ? lastPage?.pagination?.page + 1
        : undefined,

    select: data => {
      const mergedResults = data.pages.flatMap(
        (page: any) => page._payload ?? [],
      );
      return {
        ...data,
        result: mergedResults,
      };
    },
  });
};
export const useFetchAllBrandProduct = (payload: productType) => {
  return useInfiniteQuery<TripPage, Error>({
    queryKey: ["fetchAllBrandProduct", payload],
    queryFn: ({pageParam = 1}) =>
      fetchAllBrandProduct({
        ...payload,
        page: pageParam,
        page_size: 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) =>
      lastPage?.pagination?.page < lastPage?.pagination?.totalPages
        ? lastPage?.pagination?.page + 1
        : undefined,

    select: data => {
      const mergedResults = data.pages.flatMap(
        (page: any) => page._payload ?? [],
      );
      return {
        ...data,
        result: mergedResults,
      };
    },
  });
};
export const useFetchProductDetail = (payload: {_id: string}) => {
  return useQuery({
    queryKey: ["fetchProductDetails", payload],
    queryFn: () => fetchProductDetails({...payload}),
  });
};

export const useRecentViewedProduct = () => {
  return useMutation({
    mutationFn: (data: {product: string}) => addRecentViewd(data),
  });
};

export const useUpdateWishlist = () => {
  return useMutation({
    mutationFn: (data: {product: string}) => updateWishlist(data),
  });
};
export const useFetchWishlistProduct = () => {
  return useQuery({
    queryKey: ["fetchWishlist"],
    queryFn: () => fetchWishlist(),
  });
};
export const useFetchRecentViewedProduct = (payload: {
  page: number;
  page_size: number;
}) => {
  return useQuery({
    queryKey: ["fetchRecentViewd", payload],
    queryFn: () => fetchRecentViewd(payload),
  });
};

export const useAddToCart = () => {
  return useMutation({
    mutationFn: (data: {product: string; qty: number}) => updateAddToCart(data),
  });
};

export const useFetchAllAddToCartProduct = (payload: productType) => {
  return useInfiniteQuery<TripPage, Error>({
    queryKey: ["fetchAllAddToCart", payload],
    queryFn: ({}) => fetchAllAddToCart(),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage?.nextPage ?? undefined,

    select: data => {
      const mergedResults = data.pages.flatMap(
        (page: any) => page._payload ?? [],
      );
      return {
        ...data,
        result: mergedResults,
      };
    },
  });
};

// Rating
export const useFetchRating = () => {
  return useQuery({
    queryKey: ["fetchBanners"],
    queryFn: () => fetchRating(),
  });
};

// coupon

export const useFetchCoupon = (payload: productType) => {
  return useInfiniteQuery<TripPage, Error>({
    queryKey: ["fetchCoupon", payload],
    queryFn: ({pageParam = 1}) =>
      fetchCoupon({
        ...payload,
        page: pageParam,
        page_size: 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) =>
      lastPage?.pagination?.page < lastPage?.pagination?.totalPages
        ? lastPage?.pagination?.page + 1
        : undefined,

    select: data => {
      const mergedResults = data.pages.flatMap(
        (page: any) => page._payload ?? [],
      );
      return {
        ...data,
        result: mergedResults,
      };
    },
  });
};

// Products
export const useFetchAllOrder = (payload: productType) => {
  return useInfiniteQuery<TripPage, Error>({
    queryKey: ["fetchAllOrder", payload],
    queryFn: ({pageParam = 1}) =>
      fetchAllOrder({
        ...payload,
        page: pageParam,
        page_size: 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) =>
      lastPage?.pagination?.page < lastPage?.pagination?.totalPages
        ? lastPage?.pagination?.page + 1
        : undefined,

    select: data => {
      const mergedResults = data.pages.flatMap(
        (page: any) => page._payload ?? [],
      );
      return {
        ...data,
        result: mergedResults,
      };
    },
  });
};

// Add Address
export const useCreateAddress = () => {
  return useMutation({
    mutationFn: (data: any) => createAddress(data),
  });
};

export const useFetchAddress = () => {
  return useQuery({
    queryKey: ["fetchAddress"],
    queryFn: () => fetchAddress(),
  });
};

export const useUpdateAddress = () => {
  return useMutation({
    mutationFn: (data: any) => updateAddress(data),
  });
};

// Recharge Wallet

export const useRechargeWallet = () => {
  return useMutation({
    mutationFn: (data: {amount?: number; offer_id?: string}) =>
      updateRecharge(data),
  });
};

export const useRechargeWalletVerify = () => {
  return useMutation({
    mutationFn: (data: any) => rechargeVerify(data),
  });
};

export const useFetchWalletHistory = (payload: any) => {
  return useInfiniteQuery({
    queryKey: ["fetchWalletHistory", payload],
    queryFn: ({pageParam = 1}) =>
      fetchWalletHistory({
        ...payload,
        page: pageParam,
        page_size: payload?.page_size ?? 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      if (!lastPage?.pagination) {
        return undefined;
      }
      return lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined;
    },
    select: data => {
      // ✅ Always return a stable shape
      const mergedResults = data.pages.flatMap(
        (page: any) => page?._payload ?? [],
      );
      return {
        ...data,
        result: mergedResults ?? [],
      };
    },
  });
};

// Order Payment
export const useOrderPaymnet = () => {
  return useMutation({
    mutationFn: (data: any) => createOrder(data),
  });
};
export const useOrderConfirm = () => {
  return useMutation({
    mutationFn: (data: any) => confirmOrder(data),
  });
};

// Charges

export const useKmPointCharge = () => {
  return useQuery({
    queryKey: ["fetchCharges"],
    queryFn: () => fetchCharges(),
  });
};

// FAQs
export const useFetchFAQs = (payload: any) => {
  return useInfiniteQuery({
    queryKey: ["fetchFAQs", payload],
    queryFn: ({pageParam = 1}) => fetchFAQs({page: pageParam, page_size: 10}),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) =>
      lastPage?.pagination?.page < lastPage?.pagination?.totalPages
        ? lastPage?.pagination?.page + 1
        : undefined,

    select: data => {
      const mergedResults = data.pages.flatMap(
        (page: any) => page._payload ?? [],
      );
      return {
        ...data,
        result: mergedResults,
      };
    },
  });
};

// Offers
export const useFetchOffers = (payload: categoryPayload) => {
  return useInfiniteQuery<TripPage, Error>({
    queryKey: ["fetchOffers", payload],
    queryFn: ({pageParam = 1}) =>
      fetchOffers({
        ...payload,
        page: pageParam,
        page_size: payload.page_size,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) =>
      lastPage?.pagination?.page < lastPage?.pagination?.totalPages
        ? lastPage?.pagination?.page + 1
        : undefined,

    select: data => {
      const mergedResults = data.pages.flatMap(
        (page: any) => page._payload ?? [],
      );
      return {
        ...data,
        result: mergedResults,
      };
    },
  });
};

// PrivacyPolicy

export const usePrivacyPolicy = () => {
  return useQuery({
    queryKey: ["fetchPrivacyPolicy"],
    queryFn: () => fetchPrivacyPolicy(),
  });
};
