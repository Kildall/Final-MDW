import authReducer from "@/lib/features/auth/auth-slice";
import deliveriesReducer from "@/lib/features/deliveries/deliveries-slice";
import productsReducer from "@/lib/features/products/products-slice";
import salesReducer from "@/lib/features/sales/sales-slice";
import { configureStore } from "@reduxjs/toolkit";

export const makeStore = () => {
  return configureStore({
    reducer: {
      sales: salesReducer,
      deliveries: deliveriesReducer,
      products: productsReducer,
      auth: authReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
