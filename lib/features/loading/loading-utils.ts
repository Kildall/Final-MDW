import { addError } from "@/lib/features/error/error-slice";
import {
  startLoading,
  stopLoading,
} from "@/lib/features/loading/loading-slice";
import { RootState } from "@/lib/store";
import { SerializableError } from "@/types/redux_types";
import { createAsyncThunk } from "@reduxjs/toolkit";

type ThunkConfig<E = SerializableError> = {
  rejectValue: E;
  state: RootState;
};

export function createLoadingThunk<ReturnType, ArgType = void>(
  typePrefix: string,
  payloadCreator: (
    arg: ArgType,
    thunkAPI: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rejectWithValue: (error: SerializableError) => any;
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
        if (
          result &&
          typeof result === "object" &&
          "payload" in result &&
          result.payload &&
          typeof result.payload === "object" &&
          "type" in result.payload &&
          result.payload.type &&
          (result.payload.type === "APIException" ||
            result.payload.type === "Error")
        ) {
          const error = result.payload as SerializableError;
          thunkAPI.dispatch(
            addError({
              messages: error.errors ?? [
                {
                  code: 0,
                  message: error.message,
                  translatedMessage: error.message,
                },
              ],
            })
          );
        }

        return result;
      } catch (error) {
        throw error;
      } finally {
        thunkAPI.dispatch(stopLoading(typePrefix));
      }
    }
  );
}
