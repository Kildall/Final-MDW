import { checkAuthAndGetToken } from "@/helpers/store-check-auth-get-token";
import { RootState } from "@/lib/store";
import { createSerializableError } from "@/lib/utils";
import { APIException } from "@/services/api-service";
import { EmployeesService } from "@/services/employees-service";
import { Employee } from "@/types/api/interfaces";
import { SerializableError } from "@/types/redux_types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createLoadingThunk } from "../loading/loading-utils";

export interface EmployeesState {
  employees: Employee[];
  employeesById: { [key: number]: Employee };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: SerializableError | null;
  totalRevenue: number;
  currentOperation: "fetch" | "add" | "update" | "delete" | null;
}

export const fetchEmployees = createLoadingThunk<Employee[], void>(
  "employees/fetchEmployees",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = checkAuthAndGetToken(state);

      const response = await EmployeesService.fetchEmployees(token);
      if (!response.status.success) {
        return rejectWithValue(
          createSerializableError(new APIException(response.status.errors))
        );
      }

      return response.data.employees;
    } catch (error) {
      return rejectWithValue(createSerializableError(error));
    }
  }
);

export const fetchEmployeeById = createLoadingThunk<Employee, number>(
  "employees/fetchEmployeeById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = checkAuthAndGetToken(state);

      const response = await EmployeesService.fetchEmployeeById(id, token);
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

const initialState: EmployeesState = {
  employees: [],
  employeesById: {},
  status: "idle",
  error: null,
  totalRevenue: 0,
  currentOperation: null,
};

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch";
      })
      .addCase(
        fetchEmployees.fulfilled,
        (state, action: PayloadAction<Employee[]>) => {
          state.status = "succeeded";
          (state.employees as Employee[]) = action.payload;
          state.error = null;
          state.currentOperation = null;
        }
      )
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? {
          type: "Error",
          message: "Unknown error occurred",
        };
        state.currentOperation = null;
      })
      .addCase(fetchEmployeeById.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch";
      })
      .addCase(
        fetchEmployeeById.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.status = "succeeded";
          (state.employeesById as { [key: number]: Employee })[
            action.payload.id
          ] = action.payload;
          state.error = null;
          state.currentOperation = null;
        }
      )
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? {
          type: "Error",
          message: "Unknown error occurred",
        };
        state.currentOperation = null;
      });
  },
});

export const { clearError } = employeesSlice.actions;

// Export selectors
export const selectAllEmployees = (state: RootState): Employee[] =>
  state.employees.employees;
export const selectEmployeesStatus = (
  state: RootState
): EmployeesState["status"] => state.employees.status;
export const selectEmployeesError = (
  state: RootState
): SerializableError | null => state.employees.error;
export const selectCurrentOperation = (
  state: RootState
): EmployeesState["currentOperation"] => state.employees.currentOperation;
export const selectEmployeeById = (
  state: RootState,
  employeeId: number | undefined
): Employee | undefined =>
  employeeId ? state.employees.employeesById[employeeId] : undefined;

export default employeesSlice.reducer;
