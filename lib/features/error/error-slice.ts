import { TranslatedResponseError } from "@/types/api/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ErrorState {
  errors: Array<{
    id: string;
    messages: TranslatedResponseError[];
    timestamp: number;
  }>;
}

const initialState: ErrorState = {
  errors: [],
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    addError: (
      state,
      action: PayloadAction<{ messages: TranslatedResponseError[] }>
    ) => {
      state.errors.push({
        id: crypto.randomUUID(),
        messages: action.payload.messages,
        timestamp: Date.now(),
      });
    },
    removeError: (state, action: PayloadAction<string>) => {
      state.errors = state.errors.filter(
        (error) => error.id !== action.payload
      );
    },
  },
});

export const { addError, removeError } = errorSlice.actions;
export default errorSlice.reducer;
