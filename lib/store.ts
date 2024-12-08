import { configureStore } from "@reduxjs/toolkit";
import salesReducer from "@/lib/features/sales/sales-slice";
import deliveriesReducer from "@/lib/features/deliveries/deliveries-slice";
import authReducer from "@/lib/features/auth/auth-slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      sales: salesReducer,
      deliveries: deliveriesReducer,
      auth: authReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
