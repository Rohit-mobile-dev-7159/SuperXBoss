import {configureStore} from "@reduxjs/toolkit";
import {combineReducers} from "redux";
import {persistStore, persistReducer} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {tokenSlice} from "./Slices/Token";
import {cartSlice} from "./Slices/AddToCartProduct";
import {searchSlice} from "./Slices/searchSlice";

const rootReducer = combineReducers({
  token: tokenSlice.reducer,
  cart: cartSlice.reducer,
  search: searchSlice.reducer,
});
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["token", "cart", "search"],
};
const persistReducers = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistReducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
