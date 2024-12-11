import {
  startLoading,
  stopLoading,
} from "@/lib/features/loading/loading-slice";
import { RootState } from "@/lib/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

type ThunkConfig<E = string> = {
  rejectValue: E;
  state: RootState;
};

export function createLoadingThunk<ReturnType, ArgType = void>(
  typePrefix: string,
  payloadCreator: (
    arg: ArgType,
    thunkAPI: {
      rejectWithValue: (error: string) => any;
      getState: () => RootState;
    }
  ) => Promise<ReturnType>
) {
  return createAsyncThunk<ReturnType, ArgType, ThunkConfig>(
    typePrefix,
    async (arg, thunkAPI) => {
      try {
        thunkAPI.dispatch(startLoading(typePrefix));
        const result = await payloadCreator(arg, thunkAPI);
        return result;
      } catch (error) {
        throw error;
      } finally {
        thunkAPI.dispatch(stopLoading(typePrefix));
      }
    }
  );
}
