import { checkAuthAndGetToken } from "@/helpers/store-check-auth-get-token";
import { RootState } from "@/lib/store";
import { createSerializableError } from "@/lib/utils";
import { APIException } from "@/services/api-service";
import { CustomersService } from "@/services/customers-service";
import { Customer } from "@/types/api/interfaces";
import { SerializableError } from "@/types/redux_types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createLoadingThunk } from "../loading/loading-utils";

export interface CustomersState {
  customers: Customer[];
  customersById: { [key: number]: Customer };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: SerializableError | null;
  totalRevenue: number;
  currentOperation:
    | "fetch-shared"
    | "fetch"
    | "add"
    | "update"
    | "delete"
    | null;
}

export const fetchCustomers = createLoadingThunk<Customer[], void>(
  "customers/fetchCustomers",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = checkAuthAndGetToken(state);

      const response = await CustomersService.fetchCustomers(token);
      if (!response.status.success) {
        return rejectWithValue(
          createSerializableError(new APIException(response.status.errors))
        );
      }
      return response.data.customers as Customer[];
    } catch (error) {
      return rejectWithValue(createSerializableError(error));
    }
  }
);

export const fetchCustomerById = createLoadingThunk<Customer, number>(
  "customers/fetchCustomerById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = checkAuthAndGetToken(state);

      const response = await CustomersService.fetchCustomerById(id, token);
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

const initialState: CustomersState = {
  customers: [],
  customersById: {},
  status: "idle",
  error: null,
  totalRevenue: 0,
  currentOperation: null,
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch";
      })
      .addCase(
        fetchCustomers.fulfilled,
        (state, action: PayloadAction<Customer[]>) => {
          state.status = "succeeded";
          (state.customers as Customer[]) = action.payload;
          state.error = null;
          state.currentOperation = null;
        }
      )
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? {
          type: "Error",
          message: "Unknown error occurred",
        };
        state.currentOperation = null;
      })
      .addCase(fetchCustomerById.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch-shared";
      })
      .addCase(
        fetchCustomerById.fulfilled,
        (state, action: PayloadAction<Customer>) => {
          state.status = "succeeded";
          (state.customersById as { [key: number]: Customer })[
            action.payload.id
          ] = action.payload;
          state.error = null;
          state.currentOperation = null;
        }
      )
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? {
          type: "Error",
          message: "Unknown error occurred",
        };
        state.currentOperation = null;
      });
  },
});

export const { clearError } = customersSlice.actions;

export const selectAllCustomers = (state: RootState): Customer[] =>
  state.customers.customers;
export const selectCustomersStatus = (
  state: RootState
): CustomersState["status"] => state.customers.status;
export const selectCustomersError = (
  state: RootState
): SerializableError | null => state.customers.error;
export const selectCurrentOperation = (
  state: RootState
): CustomersState["currentOperation"] => state.customers.currentOperation;
export const selectCustomerById = (
  state: RootState,
  customerId: number | undefined
): Customer | undefined =>
  customerId ? state.customers.customersById[customerId] : undefined;

export default customersSlice.reducer;
