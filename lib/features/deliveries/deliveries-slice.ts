import { RootState } from "@/lib/store";
import { DeliveriesService } from "@/services/deliveries-service";
import { Address, Delivery, Employee, Sale } from "@/types/api/interfaces";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Break circular dependencies while keeping all fields
type DeliveryWithoutRelations = Omit<Delivery, "sale" | "employee" | "address">;
type SaleWithoutDeliveries = Omit<Sale, "deliveries">;
type EmployeeWithoutDeliveries = Omit<Employee, "deliveries">;
type AddressWithoutDeliveries = Omit<Address, "deliveries">;

// Recreate the full type without circular references
type DeliveryFull = DeliveryWithoutRelations & {
  sale?: SaleWithoutDeliveries;
  employee?: EmployeeWithoutDeliveries | null;
  address?: AddressWithoutDeliveries;
};

export interface DeliveriesState {
  deliveries: DeliveryFull[];
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

export const fetchDeliveries = createAsyncThunk<
  DeliveryFull[],
  void,
  { rejectValue: string; state: RootState }
>("deliveries/fetchDeliveries", async (_, { rejectWithValue }) => {
  try {
    const response = await DeliveriesService.fetchDeliveries();
    if (!response.status.success) {
      return rejectWithValue(response.status.errors.join(", "));
    }
    return response.data.deliveries as DeliveryFull[];
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
});

export const fetchSharedDeliveries = createAsyncThunk<
  DeliveryFull[],
  void,
  { rejectValue: string; state: RootState }
>("deliveries/fetchSharedDeliveries", async (_, { rejectWithValue }) => {
  try {
    const response = await DeliveriesService.fetchSharedDeliveries();
    if (!response.status.success) {
      return rejectWithValue(response.status.errors.join(", "));
    }
    return response.data.deliveries as DeliveryFull[];
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
    builder
      .addCase(fetchDeliveries.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch";
      })
      .addCase(
        fetchDeliveries.fulfilled,
        (state, action: PayloadAction<DeliveryFull[]>) => {
          state.status = "succeeded";
          state.deliveries = action.payload;
          state.error = null;
          state.currentOperation = null;
        }
      )
      .addCase(fetchDeliveries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
        state.currentOperation = null;
      })
      .addCase(fetchSharedDeliveries.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch-shared";
      })
      .addCase(
        fetchSharedDeliveries.fulfilled,
        (state, action: PayloadAction<DeliveryFull[]>) => {
          state.status = "succeeded";
          state.deliveries = action.payload;
          state.error = null;
          state.currentOperation = null;
        }
      )
      .addCase(fetchSharedDeliveries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
        state.currentOperation = null;
      });
  },
});

export const { clearError } = deliveriesSlice.actions;

// Export selectors
export const selectAllDeliveries = (state: RootState): DeliveryFull[] =>
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
): DeliveryFull | undefined =>
  state.deliveries.deliveries.find((delivery) => delivery.id === deliveryId);

export default deliveriesSlice.reducer;
