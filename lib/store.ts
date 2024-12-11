import authReducer from "@/lib/features/auth/auth-slice";
import customersReducer from "@/lib/features/customers/customers-slice";
import deliveriesReducer from "@/lib/features/deliveries/deliveries-slice";
import employeesReducer from "@/lib/features/employees/employee-slice";
import loadingReducer from "@/lib/features/loading/loading-slice";
import productsReducer from "@/lib/features/products/products-slice";
import salesReducer from "@/lib/features/sales/sales-slice";
import suppliersReducer from "@/lib/features/suppliers/suppliers-slice";

import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/es/storage";

const persistConfig = {
  key: "root",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const makeStore = () =>
  configureStore({
    reducer: {
      sales: salesReducer,
      deliveries: deliveriesReducer,
      products: productsReducer,
      customers: customersReducer,
      employees: employeesReducer,
      loading: loadingReducer,
      auth: persistedAuthReducer,
      suppliers: suppliersReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

export const store = makeStore();
export const persistor = persistStore(store);

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
