import { checkAuthAndGetToken } from "@/helpers/store-check-auth-get-token";
import { createLoadingThunk } from "@/lib/features/loading/loading-utils";
import { RootState } from "@/lib/store";
import { createSerializableError } from "@/lib/utils";
import { APIException } from "@/services/api-service";
import { SuppliersService } from "@/services/suppliers-service";
import { Supplier } from "@/types/api/interfaces";
import {
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from "@/types/api/requests/suppliers";
import { SerializableError } from "@/types/redux_types";
import { createSlice } from "@reduxjs/toolkit";

export interface SuppliersState {
  suppliers: Supplier[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: SerializableError | null;
  currentOperation:
    | "fetch"
    | "fetch-shared"
    | "add"
    | "update"
    | "delete"
    | null;
}

// Async Thunks
export const fetchSuppliers = createLoadingThunk<Supplier[], void>(
  "suppliers/fetchSuppliers",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = checkAuthAndGetToken(state);

      const response = await SuppliersService.fetchSuppliers(token);
      if (!response.status.success) {
        return rejectWithValue(
          createSerializableError(new APIException(response.status.errors))
        );
      }

      return response.data.suppliers;
    } catch (error) {
      return rejectWithValue(createSerializableError(error));
    }
  }
);

export const fetchSharedSuppliers = createLoadingThunk<Supplier[], void>(
  "suppliers/fetchSharedSuppliers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await SuppliersService.fetchSharedSuppliers();
      if (!response.status.success) {
        return rejectWithValue(
          createSerializableError(new APIException(response.status.errors))
        );
      }

      return response.data.suppliers;
    } catch (error) {
      return rejectWithValue(createSerializableError(error));
    }
  }
);

export const createSupplier = createLoadingThunk<
  Supplier,
  CreateSupplierRequest
>(
  "suppliers/createSupplier",
  async (request, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = checkAuthAndGetToken(state);

      const response = await SuppliersService.createSupplier(request, token);
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

export const updateSupplier = createLoadingThunk<
  Supplier,
  { request: UpdateSupplierRequest }
>(
  "suppliers/updateSupplier",
  async ({ request }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = checkAuthAndGetToken(state);

      const response = await SuppliersService.updateSupplier(request, token);
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

export const deleteSupplier = createLoadingThunk<number, number>(
  "suppliers/deleteSupplier",
  async (id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = checkAuthAndGetToken(state);

      const response = await SuppliersService.deleteSupplier(id, token);
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

const initialState: SuppliersState = {
  suppliers: [],
  status: "idle",
  error: null,
  currentOperation: null,
};

const suppliersSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Shared Suppliers
      .addCase(fetchSharedSuppliers.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch-shared";
      })
      .addCase(fetchSharedSuppliers.fulfilled, (state, action) => {
        state.status = "succeeded";
        (state.suppliers as Supplier[]) = action.payload;
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(fetchSharedSuppliers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? {
          type: "Error",
          message: "Unknown error occurred",
        };
        state.currentOperation = null;
      })
      // Fetch Suppliers
      .addCase(fetchSuppliers.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch";
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.status = "succeeded";
        (state.suppliers as Supplier[]) = action.payload;
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? {
          type: "Error",
          message: "Unknown error occurred",
        };
        state.currentOperation = null;
      })
      // Create Supplier
      .addCase(createSupplier.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "add";
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.status = "succeeded";
        (state.suppliers as Supplier[]).push(action.payload);
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? {
          type: "Error",
          message: "Unknown error occurred",
        };
        state.currentOperation = null;
      })
      // Update Supplier
      .addCase(updateSupplier.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "update";
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.suppliers.findIndex(
          (supplier) => supplier.id === action.payload.id
        );
        if (index !== -1) {
          (state.suppliers as Supplier[])[index] = action.payload;
        }
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? {
          type: "Error",
          message: "Unknown error occurred",
        };
        state.currentOperation = null;
      })
      // Delete Supplier
      .addCase(deleteSupplier.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "delete";
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.status = "succeeded";
        (state.suppliers as Supplier[]) = (
          state.suppliers as Supplier[]
        ).filter((supplier) => supplier.id !== action.payload);
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? {
          type: "Error",
          message: "Unknown error occurred",
        };
        state.currentOperation = null;
      });
  },
});

export const { clearError } = suppliersSlice.actions;

// Export selectors
export const selectAllSuppliers = (state: RootState): Supplier[] =>
  state.suppliers.suppliers;
export const selectSuppliersStatus = (
  state: RootState
): SuppliersState["status"] => state.suppliers.status;
export const selectSuppliersError = (
  state: RootState
): SerializableError | null => state.suppliers.error;
export const selectCurrentOperation = (
  state: RootState
): SuppliersState["currentOperation"] => state.suppliers.currentOperation;
export const selectSupplierById = (
  state: RootState,
  supplierId: number
): Supplier | undefined =>
  state.suppliers.suppliers.find((supplier) => supplier.id === supplierId);

export default suppliersSlice.reducer;
