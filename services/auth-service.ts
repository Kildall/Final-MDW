import { ApiService } from "@/services/api-service";
import { ApiResponse } from "@/types/api/api";
import { LoginRequest } from "@/types/api/requests/auth";
import {
  GetAuthUserResponse,
  LoginResponse,
  ValidateTokenResponse,
} from "@/types/api/responses/auth";

export class AuthService extends ApiService {
  static async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.fetch<ApiResponse<LoginResponse>>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      cache: "no-store",
    });
  }

  static async logout(token: string): Promise<ApiResponse<void>> {
    return this.fetch<ApiResponse<void>>(
      "/auth/logout",
      {
        method: "POST",
        cache: "no-store",
      },
      token
    );
  }

  static async checkSession(
    token: string
  ): Promise<ApiResponse<ValidateTokenResponse>> {
    return this.fetch<ApiResponse<ValidateTokenResponse>>(
      "/auth/validate-token",
      {
        method: "POST",
        cache: "no-store",
      },
      token
    );
  }

  static async getUser(
    token: string
  ): Promise<ApiResponse<GetAuthUserResponse>> {
    return this.fetch<ApiResponse<GetAuthUserResponse>>(
      "/auth/user",
      {
        cache: "no-store",
      },
      token
    );
  }
}
