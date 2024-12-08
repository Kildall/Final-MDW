import authReducer from "@/lib/features/auth/auth-slice";
import deliveriesReducer from "@/lib/features/deliveries/deliveries-slice";
import productsReducer from "@/lib/features/products/products-slice";
import salesReducer from "@/lib/features/sales/sales-slice";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const makeStore = () =>
  configureStore({
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
        thunk: true,
      }),
    reducer: {
      sales: salesReducer,
      deliveries: deliveriesReducer,
      products: productsReducer,
      auth: persistedAuthReducer,
    },
  });

export const store = makeStore();

export const persistor = persistStore(store);

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
