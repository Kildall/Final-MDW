import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface Product {
  id: number;
  name: string;
  quantity: number;
  measure: number;
  brand: string;
  price: number;
  enabled: boolean;
}

interface SaleProduct {
  saleId: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface Sale {
  id: number;
  customerId: number;
  employeeId: number;
  startDate: string;
  lastUpdateDate: string;
  status: 'READY' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  products: SaleProduct[];
  _count: {
    products: number;
    deliveries: number;
  };
}

interface ApiResponse<T> {
  status: {
    success: boolean;
    errors: string[];
  };
  data: {
    sales: T[];
  };
}

export interface SalesState {
  sales: Sale[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  totalRevenue: number;
  currentOperation: 'fetch' | 'add' | 'update' | 'delete' | null;
}

const API_BASE_URL = 'https://api.kildall.ar/api';

const api = {
  async fetchSales(): Promise<ApiResponse<Sale>> {
    const response = await fetch(`${API_BASE_URL}/shared/sales`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch sales');
    return response.json();
  },

  async createSale(sale: Omit<Sale, 'id' | '_count'>): Promise<ApiResponse<Sale>> {
    const response = await fetch(`${API_BASE_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sale),
    });
    if (!response.ok) throw new Error('Failed to create sale');
    return response.json();
  },

  async updateSale(id: number, updates: Partial<Sale>): Promise<ApiResponse<Sale>> {
    const response = await fetch(`${API_BASE_URL}/sales/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update sale');
    return response.json();
  },

  async deleteSale(id: number): Promise<void> {
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
    if (!response.status.success) {
      return rejectWithValue(response.status.errors.join(', '));
    }
    return response.data.sales;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
  }
});

export const createSale = createAsyncThunk<
  Sale,
  Omit<Sale, 'id' | '_count'>,
  { rejectValue: string; state: RootState }
>('sales/createSale', async (newSale, { rejectWithValue }) => {
  try {
    const response = await api.createSale(newSale);
    if (!response.status.success) {
      return rejectWithValue(response.status.errors.join(', '));
    }
    return response.data.sales[0];
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
  }
});

export const updateSale = createAsyncThunk<
  Sale,
  { id: number; updates: Partial<Sale> },
  { rejectValue: string; state: RootState }
>('sales/updateSale', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const response = await api.updateSale(id, updates);
    if (!response.status.success) {
      return rejectWithValue(response.status.errors.join(', '));
    }
    return response.data.sales[0];
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
  }
});

export const deleteSale = createAsyncThunk<
  number,
  number,
  { rejectValue: string; state: RootState }
>('sales/deleteSale', async (id, { rejectWithValue }) => {
  try {
    await api.deleteSale(id);
    return id;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
  }
});

const initialState: SalesState = {
  sales: [],
  status: 'idle',
  error: null,
  totalRevenue: 0,
  currentOperation: null,
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    calculateTotalRevenue: (state) => {
      state.totalRevenue = state.sales.reduce(
        (total, sale) => total + sale.products.reduce(
          (productTotal, saleProduct) => 
            productTotal + (saleProduct.quantity * saleProduct.product.price),
          0
        ),
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

export const { calculateTotalRevenue, clearError } = salesSlice.actions;

// Export selectors
export const selectAllSales = (state: RootState): Sale[] => state.sales.sales;
export const selectSalesStatus = (state: RootState): SalesState['status'] => state.sales.status;
export const selectSalesError = (state: RootState): string | null => state.sales.error;
export const selectTotalRevenue = (state: RootState): number => state.sales.totalRevenue;
export const selectCurrentOperation = (state: RootState): SalesState['currentOperation'] => 
  state.sales.currentOperation;
export const selectSaleById = (state: RootState, saleId: number): Sale | undefined =>
  state.sales.sales.find(sale => sale.id === saleId);

export default salesSlice.reducer;