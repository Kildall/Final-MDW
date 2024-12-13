import { checkAuthAndGetToken } from "@/helpers/store-check-auth-get-token";
import { RootState } from "@/lib/store";
import { createSerializableError } from "@/lib/utils";
import { APIException } from "@/services/api-service";
import { DeliveriesService } from "@/services/deliveries-service";
import { Address, Delivery, Employee, Sale } from "@/types/api/interfaces";
import { SerializableError } from "@/types/redux_types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createLoadingThunk } from "../loading/loading-utils";

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
  error: SerializableError | null;
  currentOperation:
    | "fetch-shared"
    | "fetch"
    | "add"
    | "update"
    | "delete"
    | null;
}

export const fetchDeliveries = createLoadingThunk<DeliveryFull[], void>(
  "deliveries/fetchDeliveries",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = checkAuthAndGetToken(state);

      const response = await DeliveriesService.fetchDeliveries(token);
      if (!response.status.success) {
        return rejectWithValue(
          createSerializableError(new APIException(response.status.errors))
        );
      }

      return response.data.deliveries as DeliveryFull[];
    } catch (error) {
      return rejectWithValue(createSerializableError(error));
    }
  }
);

export const fetchSharedDeliveries = createLoadingThunk<DeliveryFull[], void>(
  "deliveries/fetchSharedDeliveries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await DeliveriesService.fetchSharedDeliveries();
      if (!response.status.success) {
        return rejectWithValue(
          createSerializableError(new APIException(response.status.errors))
        );
      }

      return response.data.deliveries as DeliveryFull[];
    } catch (error) {
      return rejectWithValue(createSerializableError(error));
    }
  }
);

const initialState: DeliveriesState = {
  deliveries: [],
  status: "idle",
  error: null,
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
          (state.deliveries as DeliveryFull[]) = action.payload;
          state.error = null;
          state.currentOperation = null;
        }
      )
      .addCase(fetchDeliveries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? {
          type: "Error",
          message: "Unknown error occurred",
        };
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
          (state.deliveries as DeliveryFull[]) = action.payload;
          state.error = null;
          state.currentOperation = null;
        }
      )
      .addCase(fetchSharedDeliveries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? {
          type: "Error",
          message: "Unknown error occurred",
        };
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
export const selectDeliveriesError = (
  state: RootState
): SerializableError | null => state.deliveries.error;
export const selectCurrentOperation = (
  state: RootState
): DeliveriesState["currentOperation"] => state.deliveries.currentOperation;
export const selectDeliveryById = (
  state: RootState,
  deliveryId: number
): DeliveryFull | undefined =>
  state.deliveries.deliveries.find((delivery) => delivery.id === deliveryId);

export default deliveriesSlice.reducer;
