import { checkAuthAndGetToken } from "@/helpers/store-check-auth-get-token";
import { RootState } from "@/lib/store";
import { SalesService } from "@/services/sales-service";
import { Sale } from "@/types/api/interfaces";
import { UpdateSaleRequest } from "@/types/api/requests/sales";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createLoadingThunk } from "../loading/loading-utils";

export interface SalesState {
  sales: Sale[];
  salesById: Record<Sale["id"], Sale>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  totalRevenue: number;
  currentOperation:
    | "fetch-shared"
    | "fetch"
    | "add"
    | "update"
    | "delete"
    | null;
}

export const fetchSales = createLoadingThunk<Sale[], void>(
  "sales/fetchSales",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = checkAuthAndGetToken(state);

      const response = await SalesService.fetchSales(token);
      if (!response.status.success) {
        return rejectWithValue(response.status.errors.join(", "));
      }
      return response.data.sales;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  }
);

export const fetchSharedSales = createLoadingThunk<Sale[], void>(
  "sales/fetchSharedSales",
  async (_, { rejectWithValue }) => {
    try {
      const response = await SalesService.fetchSharedSales();
      if (!response.status.success) {
        return rejectWithValue(response.status.errors.join(", "));
      }
      return response.data.sales;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  }
);

export const createSale = createLoadingThunk<Sale, Omit<Sale, "id" | "_count">>(
  "sales/createSale",
  async (newSale, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = checkAuthAndGetToken(state);

      const response = await SalesService.createSale(newSale, token);
      if (!response.status.success) {
        return rejectWithValue(response.status.errors.join(", "));
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  }
);

export const updateSale = createLoadingThunk<Sale, UpdateSaleRequest>(
  "sales/updateSale",
  async (request, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = checkAuthAndGetToken(state);

      const response = await SalesService.updateSale(request, token);
      if (!response.status.success) {
        return rejectWithValue(response.status.errors.join(", "));
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  }
);

export const deleteSale = createLoadingThunk<number, number>(
  "sales/deleteSale",
  async (id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = checkAuthAndGetToken(state);

      await SalesService.deleteSale(id, token);
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  }
);

export const fetchSaleById = createLoadingThunk<Sale, number>(
  "sales/fetchSaleById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = checkAuthAndGetToken(state);

      const response = await SalesService.fetchSalesById(id, token);
      if (!response.status.success) {
        return rejectWithValue(response.status.errors.join(", "));
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  }
);

const initialState: SalesState = {
  sales: [],
  salesById: {},
  status: "idle",
  error: null,
  totalRevenue: 0,
  currentOperation: null,
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    calculateTotalRevenue: (state) => {
      if (state.sales.length === 0) {
        state.totalRevenue = 0;
        return;
      }

      state.totalRevenue = state.sales.reduce((total, sale) => {
        if (!sale.products) return total;
        return (
          total +
          sale.products.reduce((productTotal, saleProduct) => {
            if (!saleProduct.product) return productTotal;
            return (
              productTotal + saleProduct.quantity * saleProduct.product.price
            );
          }, 0)
        );
      }, 0);
    },
    clearError: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    // Fetch Sales
    builder
      .addCase(fetchSales.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch";
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.status = "succeeded";
        (state.sales as Sale[]) = action.payload;
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
        state.currentOperation = null;
      });
    builder
      .addCase(fetchSaleById.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch-shared";
      })
      .addCase(
        fetchSaleById.fulfilled,
        (state, action: PayloadAction<Sale>) => {
          state.status = "succeeded";
          (state.salesById as { [key: number]: Sale })[action.payload.id] =
            action.payload;
          state.error = null;
          state.currentOperation = null;
        }
      )
      .addCase(fetchSaleById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
        state.currentOperation = null;
      });
    // Fetch Shared Sales
    builder
      .addCase(fetchSharedSales.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch-shared";
      })
      .addCase(fetchSharedSales.fulfilled, (state, action) => {
        state.status = "succeeded";
        (state.sales as Sale[]) = action.payload;
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(fetchSharedSales.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
        state.currentOperation = null;
      })
      // Create Sale
      .addCase(createSale.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "add";
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.status = "succeeded";
        (state.sales as Sale[]) = [...(state.sales as Sale[]), action.payload];
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(createSale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
        state.currentOperation = null;
      })
      // Update Sale
      .addCase(updateSale.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "update";
      })
      .addCase(updateSale.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.sales.findIndex(
          (sale) => sale.id === action.payload.id
        );
        if (index !== -1) {
          (state.sales as Sale[])[index] = action.payload;
        }
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(updateSale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
        state.currentOperation = null;
      })
      // Delete Sale
      .addCase(deleteSale.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "delete";
      })
      .addCase(deleteSale.fulfilled, (state, action) => {
        state.status = "succeeded";
        (state.sales as Sale[]) = (state.sales as Sale[]).filter(
          (sale) => sale.id !== action.payload
        );
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(deleteSale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
        state.currentOperation = null;
      });
  },
});

export const { calculateTotalRevenue, clearError } = salesSlice.actions;

// Export selectors
export const selectAllSales = (state: RootState): Sale[] => state.sales.sales;
export const selectSalesStatus = (state: RootState): SalesState["status"] =>
  state.sales.status;
export const selectSalesError = (state: RootState): string | null =>
  state.sales.error;
export const selectTotalRevenue = (state: RootState): number =>
  state.sales.totalRevenue;
export const selectCurrentOperation = (
  state: RootState
): SalesState["currentOperation"] => state.sales.currentOperation;
export const selectSaleById = (
  state: RootState,
  saleId: number
): Sale | undefined => state.sales.salesById[saleId];

export default salesSlice.reducer;
