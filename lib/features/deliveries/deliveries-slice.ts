import { RootState } from "@/lib/store";
import { DeliveriesService } from "@/services/deliveries-service";
import { Delivery } from "@/types/api/interfaces";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
