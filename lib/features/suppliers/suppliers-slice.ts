import { checkAuthAndGetToken } from "@/helpers/store-check-auth-get-token";
import { RootState } from "@/lib/store"; // Asegúrate de que la ruta sea correcta
import { SuppliersService } from "@/services/suppliers-service"; // Asegúrate de que tienes un servicio para manejar la lógica de proveedores
import { Supplier } from "@/types/api/interfaces"; // Define el tipo de Supplier según tu estructura de datos
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Definir los tipos
interface SuppliersState {
  suppliers: Supplier[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  currentOperation: "fetch" | "add" | "update" | "delete" | null;
}

// Estado inicial
const initialState: SuppliersState = {
  suppliers: [],
  status: "idle",
  error: null,
  currentOperation: null,
};

// Acción asincrónica para obtener los proveedores
export const fetchSuppliers = createAsyncThunk<
  Supplier[],
  void,
  { rejectValue: string; state: RootState }
>("suppliers/fetchSuppliers", async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const token = checkAuthAndGetToken(state);
    const response = await SuppliersService.fetchSuppliers(token);
    if (!response.status.success) {
      return rejectWithValue(response.status.errors.join(", "));
    }
    return response.data.suppliers;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
});

// Crear el slice
const suppliersSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    setSuppliers: (state, action: PayloadAction<Supplier[]>) => {
      (state.suppliers as Supplier[]) = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload ?? "Unknown error occurred";
        state.currentOperation = null;
      });
  },
});

export const { setSuppliers, clearError } = suppliersSlice.actions;

// Selectores
export const selectAllSuppliers = (state: RootState): Supplier[] =>
  state.suppliers.suppliers;
export const selectSuppliersStatus = (
  state: RootState
): SuppliersState["status"] => state.suppliers.status;
export const selectSuppliersError = (state: RootState): string | null =>
  state.suppliers.error;
export const selectCurrentOperation = (
  state: RootState
): SuppliersState["currentOperation"] => state.suppliers.currentOperation;

export default suppliersSlice.reducer;
