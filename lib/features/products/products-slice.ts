import { checkAuthAndGetToken } from "@/helpers/store-check-auth-get-token";
import { RootState } from "@/lib/store";
import { createSerializableError } from "@/lib/utils";
import { APIException } from "@/services/api-service";
import { ProductsService } from "@/services/products-service";
import { Product } from "@/types/api/interfaces";
import {
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types/api/requests/products";
import { SerializableError } from "@/types/redux_types";
import { createSlice } from "@reduxjs/toolkit";
import { createLoadingThunk } from "../loading/loading-utils";

export interface ProductsState {
  products: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: SerializableError | null;
  totalInventoryValue: number;
  currentOperation:
    | "fetch"
    | "fetch-shared"
    | "add"
    | "update"
    | "delete"
    | null;
}

// Async Thunks
export const fetchProducts = createLoadingThunk<Product[], void>(
  "products/fetchProducts",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = checkAuthAndGetToken(state);

      const response = await ProductsService.fetchProducts(token);
      if (!response.status.success) {
        return rejectWithValue(
          createSerializableError(new APIException(response.status.errors))
        );
      }

      return response.data.products;
    } catch (error) {
      return rejectWithValue(createSerializableError(error));
    }
  }
);

export const fetchSharedProducts = createLoadingThunk<Product[], void>(
  "products/fetchSharedProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ProductsService.fetchSharedProducts();
      if (!response.status.success) {
        return rejectWithValue(
          createSerializableError(new APIException(response.status.errors))
        );
      }

      return response.data.products;
    } catch (error) {
      return rejectWithValue(createSerializableError(error));
    }
  }
);

export const createProduct = createLoadingThunk<Product, CreateProductRequest>(
  "products/createProduct",
  async (request, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = checkAuthAndGetToken(state);

      const response = await ProductsService.createProduct(request, token);
      if (!response.status.success) {
        return rejectWithValue(
          createSerializableError(new APIException(response.status.errors))
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(createSerializableError(error));
    }
  }
);

export const updateProduct = createLoadingThunk<
  Product,
  { request: UpdateProductRequest }
>(
  "products/updateProduct",
  async ({ request }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = checkAuthAndGetToken(state);

      const response = await ProductsService.updateProduct(request, token);
      if (!response.status.success) {
        return rejectWithValue(
          createSerializableError(new APIException(response.status.errors))
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(createSerializableError(error));
    }
  }
);

export const deleteProduct = createLoadingThunk<number, number>(
  "products/deleteProduct",
  async (id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = checkAuthAndGetToken(state);

      const response = await ProductsService.deleteProduct(id, token);
      if (!response.status.success) {
        return rejectWithValue(
          createSerializableError(new APIException(response.status.errors))
        );
      }

      return id;
    } catch (error) {
      return rejectWithValue(createSerializableError(error));
    }
  }
);

const initialState: ProductsState = {
  products: [],
  status: "idle",
  error: null,
  totalInventoryValue: 0,
  currentOperation: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    calculateTotalInventoryValue: (state) => {
      state.totalInventoryValue = state.products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
    },
    clearError: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Shared Products
      .addCase(fetchSharedProducts.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch-shared";
      })
      .addCase(fetchSharedProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        (state.products as Product[]) = action.payload;
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(fetchSharedProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? {
          type: "Error",
          message: "Unknown error occurred",
        };
        state.currentOperation = null;
      })
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        (state.products as Product[]) = action.payload;
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? {
          type: "Error",
          message: "Unknown error occurred",
        };
        state.currentOperation = null;
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "add";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        (state.products as Product[]).push(action.payload);
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? {
          type: "Error",
          message: "Unknown error occurred",
        };
        state.currentOperation = null;
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "update";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = (state.products as Product[]).findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          (state.products as Product[])[index] = action.payload;
        }
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? {
          type: "Error",
          message: "Unknown error occurred",
        };
        state.currentOperation = null;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "delete";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        (state.products as Product[]) = (state.products as Product[]).filter(
          (product) => (product as Product).id !== action.payload
        );
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? {
          type: "Error",
          message: "Unknown error occurred",
        };
        state.currentOperation = null;
      });
  },
});

export const { calculateTotalInventoryValue, clearError } =
  productsSlice.actions;

// Export selectors
export const selectAllProducts = (state: RootState): Product[] =>
  state.products.products;
export const selectProductsStatus = (
  state: RootState
): ProductsState["status"] => state.products.status;
export const selectProductsError = (
  state: RootState
): SerializableError | null => state.products.error;
export const selectTotalInventoryValue = (state: RootState): number =>
  state.products.totalInventoryValue;
export const selectCurrentOperation = (
  state: RootState
): ProductsState["currentOperation"] => state.products.currentOperation;
export const selectProductById = (
  state: RootState,
  productId: number
): Product | undefined =>
  state.products.products.find((product) => product.id === productId);

export default productsSlice.reducer;
