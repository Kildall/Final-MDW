import { logger } from "@/lib/logger";
import { RootState } from "@/lib/store";
import { AuthService } from "@/services/auth-service";
import { AuthUser } from "@/types/api/api";
import { GetAuthUserResponse } from "@/types/api/responses/auth";
import {
  Action,
  createSelector,
  createSlice,
  PayloadAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

interface AuthState {
  token: string | null;
  expires: number | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  expires: null,
  user: null,
  isAuthenticated: false,
};

const isSessionExpired = (expiresAt: number | null): boolean => {
  if (!expiresAt) return true;
  return Date.now() >= expiresAt;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; expiresAt: string | number }>
    ) => {
      const { token, expiresAt } = action.payload;
      const expiresTimestamp =
        typeof expiresAt === "string"
          ? new Date(expiresAt).getTime()
          : expiresAt;

      state.token = token;
      state.expires = expiresTimestamp;
      state.isAuthenticated = !isSessionExpired(expiresTimestamp);
    },
    setUser: (state, action: PayloadAction<GetAuthUserResponse>) => {
      state.user = action.payload.user;
    },
    clearAuth: (state) => {
      state.token = null;
      state.expires = null;
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      return initialState;
    });
  },
});

export const { setCredentials, setUser, clearAuth } = authSlice.actions;

export const checkSessionThunk =
  (): ThunkAction<Promise<void>, RootState, undefined, Action<string>> =>
  async (dispatch, getState) => {
    const state = getState().auth;
    if (!state.token || !state.isAuthenticated) return;

    try {
      const response = await AuthService.checkSession(state.token);
      if (!response.status.success || !response.data.valid) {
        await AuthService.logout(state.token);
        dispatch(clearAuth());
        logger.info("Session invalid, logged out");
      }
    } catch (error) {
      logger.error("Session check failed:", error);
      dispatch(clearAuth());
    }
  };

export const logoutThunk =
  (): ThunkAction<Promise<void>, RootState, undefined, Action<string>> =>
  async (dispatch, getState) => {
    const state = getState().auth;
    if (state.token) {
      try {
        await AuthService.logout(state.token);
        logger.info("Logged out successfully");
      } catch (error) {
        logger.error("Logout failed:", error);
      }
    }
    dispatch(clearAuth());
    dispatch({ type: PURGE, key: ["auth"], result: () => null });
  };

export default authSlice.reducer;

export const selectAuth = (state: { auth: AuthState }) => state.auth;

export const selectIsValidSession = createSelector(
  [selectAuth],
  (auth) => auth.isAuthenticated && !isSessionExpired(auth.expires)
);

export const selectUser = createSelector([selectAuth], (auth) => auth.user);
