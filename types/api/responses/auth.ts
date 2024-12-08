import { AuthUser } from "@/types/api/api";

export interface LoginResponse {
  expires: Date;
  token: string;
  verified: boolean;
}

export interface GetAuthUserResponse {
  user: AuthUser;
}
