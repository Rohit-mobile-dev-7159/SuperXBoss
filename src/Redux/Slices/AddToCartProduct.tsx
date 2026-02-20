import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// Define types
interface CartProduct {
  qty: number;
}

interface CartState {
  cartProducts: Record<string, CartProduct>;
}

// Initial state (empty object)
const initialState: CartState = {
  cartProducts: {},
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add/update product quantity
    addToCart: (
      state,
      action: PayloadAction<{productId: string; qty: number}>,
    ) => {
      const {productId, qty} = action.payload;
      state.cartProducts[productId] = {qty};
    },

    // Remove product
    removeFromCart: (state, action: PayloadAction<{productId: string}>) => {
      const {productId} = action.payload;
      delete state.cartProducts[productId];
    },

    // Increment quantity with explicit new quantity
    incrementQty: (
      state,
      action: PayloadAction<{productId: string; newQty?: number}>,
    ) => {
      const {productId, newQty} = action.payload;
      const product = state.cartProducts[productId];
      if (product) {
        product.qty = newQty !== undefined ? newQty : product.qty + 1;
      }
    },

    // Decrement quantity with explicit new quantity (minimum 0)
    decrementQty: (
      state,
      action: PayloadAction<{productId: string; newQty?: number}>,
    ) => {
      const {productId, newQty} = action.payload;
      const product = state.cartProducts[productId];
      if (product) {
        const calculatedQty = newQty !== undefined ? newQty : product.qty - 1;
        if (calculatedQty <= 0) {
          delete state.cartProducts[productId];
        } else {
          product.qty = calculatedQty;
        }
      }
    },

    // Clear entire cart
    clearCart: state => {
      state.cartProducts = {};
    },

    // Set specific quantity for a product
    setQuantity: (
      state,
      action: PayloadAction<{productId: string; qty: number}>,
    ) => {
      const {productId, qty} = action.payload;
      if (qty <= 0) {
        delete state.cartProducts[productId];
      } else {
        state.cartProducts[productId] = {qty};
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQty,
  decrementQty,
  clearCart,
  setQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
