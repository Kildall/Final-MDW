import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

// TODO: Define Sale type
export interface Sale {
  id: string;
  amount: number;
  customerName: string;
  date: string;
  productId: string;
  quantity: number;
}

export interface SalesState {
  sales: Sale[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  totalRevenue: number;
  currentOperation: 'fetch' | 'add' | 'update' | 'delete' | null;
}

// TODO: Define API response type
interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
  };
}

interface UpdateSalePayload {
  id: string;
  updates: Partial<Sale>;
}

// TODO: Define API lib
const API_BASE_URL = 'your-api-endpoint';

const api = {
  async fetchSales(): Promise<ApiResponse<Sale[]>> {
    const response = await fetch(`${API_BASE_URL}/sales`);
    if (!response.ok) throw new Error('Failed to fetch sales');
    return response.json();
  },

  async createSale(sale: Omit<Sale, 'id'>): Promise<ApiResponse<Sale>> {
    const response = await fetch(`${API_BASE_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sale),
    });
    if (!response.ok) throw new Error('Failed to create sale');
    return response.json();
  },

  async updateSale({ id, updates }: UpdateSalePayload): Promise<ApiResponse<Sale>> {
    const response = await fetch(`${API_BASE_URL}/sales/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update sale');
    return response.json();
  },

  async deleteSale(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/sales/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete sale');
  },
};

// Async Thunks
export const fetchSales = createAsyncThunk<
  Sale[],
  void,
  { rejectValue: string; state: RootState }
>('sales/fetchSales', async (_, { rejectWithValue }) => {
  try {
    const response = await api.fetchSales();
    return response.data;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
  }
});

export const createSale = createAsyncThunk<
  Sale,
  Omit<Sale, 'id'>,
  { rejectValue: string; state: RootState }
>('sales/createSale', async (newSale, { rejectWithValue }) => {
  try {
    const response = await api.createSale(newSale);
    return response.data;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
  }
});

export const updateSale = createAsyncThunk<
  Sale,
  UpdateSalePayload,
  { rejectValue: string; state: RootState }
>('sales/updateSale', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const response = await api.updateSale({ id, updates });
    return response.data;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
  }
});

export const deleteSale = createAsyncThunk<
  string,
  string,
  { rejectValue: string; state: RootState }
>('sales/deleteSale', async (id, { rejectWithValue }) => {
  try {
    await api.deleteSale(id);
    return id;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
  }
});

// Initial state
const initialState: SalesState = {
  sales: [],
  status: 'idle',
  error: null,
  totalRevenue: 0,
  currentOperation: null,
};

// Slice
const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    calculateTotalRevenue: (state) => {
      state.totalRevenue = state.sales.reduce(
        (total, sale) => total + sale.amount,
        0
      );
    },
    clearError: (state) => {
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    // Fetch Sales
    builder
      .addCase(fetchSales.pending, (state) => {
        state.status = 'loading';
        state.currentOperation = 'fetch';
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sales = action.payload;
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error occurred';
        state.currentOperation = null;
      })
      // Create Sale
      .addCase(createSale.pending, (state) => {
        state.status = 'loading';
        state.currentOperation = 'add';
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sales.push(action.payload);
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(createSale.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error occurred';
        state.currentOperation = null;
      })
      // Update Sale
      .addCase(updateSale.pending, (state) => {
        state.status = 'loading';
        state.currentOperation = 'update';
      })
      .addCase(updateSale.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.sales.findIndex(sale => sale.id === action.payload.id);
        if (index !== -1) {
          state.sales[index] = action.payload;
        }
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(updateSale.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error occurred';
        state.currentOperation = null;
      })
      // Delete Sale
      .addCase(deleteSale.pending, (state) => {
        state.status = 'loading';
        state.currentOperation = 'delete';
      })
      .addCase(deleteSale.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sales = state.sales.filter(sale => sale.id !== action.payload);
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(deleteSale.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error occurred';
        state.currentOperation = null;
      });
  },
});

// Export actions
export const { calculateTotalRevenue, clearError } = salesSlice.actions;

// Export selectors
export const selectAllSales = (state: RootState): Sale[] => state.sales.sales;
export const selectSalesStatus = (state: RootState): SalesState['status'] => state.sales.status;
export const selectSalesError = (state: RootState): string | null => state.sales.error;
export const selectTotalRevenue = (state: RootState): number => state.sales.totalRevenue;
export const selectCurrentOperation = (state: RootState): SalesState['currentOperation'] => 
  state.sales.currentOperation;
export const selectSaleById = (state: RootState, saleId: string): Sale | undefined =>
  state.sales.sales.find(sale => sale.id === saleId);

// Export reducer
export default salesSlice.reducer;