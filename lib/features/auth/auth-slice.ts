import { logger } from "@/lib/logger";
import { AuthService } from "@/services/auth-service";
import { AuthUser } from "@/types/api/api";
import { GetAuthUserResponse } from "@/types/api/responses/auth";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  expires: number | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  token: null,
  expires: null,
  user: null,
  isAuthenticated: false,
  loading: false,
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
      // Convert expiresAt to absolute timestamp if it's not already
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      if (state.token) {
        AuthService.logout(state.token).then(() => {
          logger.info("Logged out");
        });
      }
      state.token = null;
      state.expires = null;
      state.isAuthenticated = false;
      state.user = null;
    },
    checkSession: (state) => {
      if (state.isAuthenticated && isSessionExpired(state.expires)) {
        if (state.token) {
          AuthService.logout(state.token).then(() => {
            logger.info("Logged out");
          });
        }
        state.token = null;
        state.expires = null;
        state.isAuthenticated = false;
        state.user = null;
      }
    },
  },
});

export const { setCredentials, setUser, setLoading, logout, checkSession } =
  authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state: { auth: AuthState }) => state.auth;

export const selectIsValidSession = createSelector(
  [selectAuth],
  (auth) => auth.isAuthenticated && !isSessionExpired(auth.expires)
);

export const selectUser = createSelector([selectAuth], (auth) => auth.user);
