import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { Delivery } from "@/types/api/interfaces";
import { DeliveriesService } from "@/services/deliveries-service";

export interface DeliveriesState {
  deliveries: Delivery[];
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

// Async Thunks
export const fetchDeliveries = createAsyncThunk<
  Delivery[],
  void,
  { rejectValue: string; state: RootState }
>("deliveries/fetchDeliveries", async (_, { rejectWithValue }) => {
  try {
    const response = await DeliveriesService.fetchDeliveries();
    if (!response.status.success) {
      return rejectWithValue(response.status.errors.join(", "));
    }
    return response.data.deliveries;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
});

export const fetchSharedDeliveries = createAsyncThunk<
  Delivery[],
  void,
  { rejectValue: string; state: RootState }
>("deliveries/fetchSharedDeliveries", async (_, { rejectWithValue }) => {
  try {
    const response = await DeliveriesService.fetchSharedDeliveries();
    if (!response.status.success) {
      return rejectWithValue(response.status.errors.join(", "));
    }
    return response.data.deliveries;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
});

export const createDelivery = createAsyncThunk<
  Delivery,
  Omit<Delivery, "id" | "_count">,
  { rejectValue: string; state: RootState }
>("deliveries/createDelivery", async (newDelivery, { rejectWithValue }) => {
  try {
    const response = await DeliveriesService.createDelivery(newDelivery);
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

export const updateDelivery = createAsyncThunk<
  Delivery,
  { id: number; updates: Partial<Delivery> },
  { rejectValue: string; state: RootState }
>("deliveries/updateDelivery", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const response = await DeliveriesService.updateDelivery(id, updates);
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

export const deleteDelivery = createAsyncThunk<
  number,
  number,
  { rejectValue: string; state: RootState }
>("deliveries/deleteDelivery", async (id, { rejectWithValue }) => {
  try {
    const response = await DeliveriesService.deleteDelivery(id);
    if (!response.status.success) {
      return rejectWithValue(response.status.errors.join(", "));
    }
    return id;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
});

const initialState: DeliveriesState = {
  deliveries: [],
  status: "idle",
  error: null,
  totalRevenue: 0,
  currentOperation: null,
};

const deliveriesSlice = createSlice({
  name: "deliveries",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    // Fetch Deliveries
    builder
      .addCase(fetchDeliveries.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch";
      })
      .addCase(fetchDeliveries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deliveries = action.payload;
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(fetchDeliveries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
        state.currentOperation = null;
      });
    // Fetch Shared Deliveries
    builder
      .addCase(fetchSharedDeliveries.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch-shared";
      })
      .addCase(fetchSharedDeliveries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deliveries = action.payload;
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(fetchSharedDeliveries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
        state.currentOperation = null;
      })
      // Create Delivery
      .addCase(createDelivery.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "add";
      })
      .addCase(createDelivery.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deliveries.push(action.payload);
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(createDelivery.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
        state.currentOperation = null;
      })
      // Update Delivery
      .addCase(updateDelivery.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "update";
      })
      .addCase(updateDelivery.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.deliveries.findIndex(
          (delivery) => delivery.id === action.payload.id
        );
        if (index !== -1) {
          state.deliveries[index] = action.payload;
        }
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(updateDelivery.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
        state.currentOperation = null;
      })
      // Delete Delivery
      .addCase(deleteDelivery.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "delete";
      })
      .addCase(deleteDelivery.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deliveries = state.deliveries.filter(
          (delivery) => delivery.id !== action.payload
        );
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(deleteDelivery.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
        state.currentOperation = null;
      });
  },
});

export const { clearError } = deliveriesSlice.actions;

// Export selectors
export const selectAllDeliveries = (state: RootState): Delivery[] =>
  state.deliveries.deliveries;
export const selectDeliveriesStatus = (
  state: RootState
): DeliveriesState["status"] => state.deliveries.status;
export const selectDeliveriesError = (state: RootState): string | null =>
  state.deliveries.error;
export const selectCurrentOperation = (
  state: RootState
): DeliveriesState["currentOperation"] => state.deliveries.currentOperation;
export const selectDeliveryById = (
  state: RootState,
  deliveryId: number
): Delivery | undefined =>
  state.deliveries.deliveries.find((delivery) => delivery.id === deliveryId);

export default deliveriesSlice.reducer;
