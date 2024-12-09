import { RootState } from "@/lib/store";

const checkAuthAndGetToken = (state: RootState): string => {
  const token = state.auth.token;
  if (!token || !state.auth.isAuthenticated) {
    throw new Error("Authentication required");
  }
  return token;
};

export { checkAuthAndGetToken };
