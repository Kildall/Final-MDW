import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
  activeThunks: string[];
}

const initialState: LoadingState = {
  activeThunks: [],
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    startLoading: (state, action: PayloadAction<string>) => {
      state.activeThunks.push(action.payload);
    },
    stopLoading: (state, action: PayloadAction<string>) => {
      state.activeThunks = state.activeThunks.filter(
        (thunk) => thunk !== action.payload
      );
    },
  },
});

export const { startLoading, stopLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
