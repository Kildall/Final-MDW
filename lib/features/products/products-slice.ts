import { RootState } from "@/lib/store";
import { ProductsService } from "@/services/products-service";
import { Product } from "@/types/api/interfaces";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface ProductsState {
  products: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
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
export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string; state: RootState }
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await ProductsService.fetchProducts();
    if (!response.status.success) {
      return rejectWithValue(response.status.errors.join(", "));
    }
    return response.data.products;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
});

export const fetchSharedProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string; state: RootState }
>("products/fetchSharedProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await ProductsService.fetchSharedProducts();
    if (!response.status.success) {
      return rejectWithValue(response.status.errors.join(", "));
    }
    return response.data.products;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
});

export const createProduct = createAsyncThunk<
  Product,
  Omit<Product, "id">,
  { rejectValue: string; state: RootState }
>("products/createProduct", async (newProduct, { rejectWithValue }) => {
  try {
    const response = await ProductsService.createProduct(newProduct);
    if (!response.status.success) {
      return rejectWithValue(response.status.errors.join(", "));
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
});

export const updateProduct = createAsyncThunk<
  Product,
  { id: number; updates: Partial<Product> },
  { rejectValue: string; state: RootState }
>("products/updateProduct", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const response = await ProductsService.updateProduct(id, updates);
    if (!response.status.success) {
      return rejectWithValue(response.status.errors.join(", "));
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
});

export const deleteProduct = createAsyncThunk<
  number,
  number,
  { rejectValue: string; state: RootState }
>("products/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    await ProductsService.deleteProduct(id);
    return id;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
});

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
        state.products = action.payload;
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(fetchSharedProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
        state.currentOperation = null;
      })
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
        state.currentOperation = null;
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "add";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products.push(action.payload);
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
        state.currentOperation = null;
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "update";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
        state.currentOperation = null;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "delete";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
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
export const selectProductsError = (state: RootState): string | null =>
  state.products.error;
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
