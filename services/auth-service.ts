import { ApiService } from "@/services/api-service";
import { ApiResponse } from "@/types/api/api";
import { LoginRequest } from "@/types/api/requests/auth";
import { GetAuthUserResponse, LoginResponse } from "@/types/api/responses/auth";

export class AuthService extends ApiService {
  static async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.fetch<ApiResponse<LoginResponse>>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async logout(token: string): Promise<ApiResponse<void>> {
    return this.fetch<ApiResponse<void>>(
      "/auth/logout",
      {
        method: "POST",
      },
      token
    );
  }

  static async getUser(
    token: string
  ): Promise<ApiResponse<GetAuthUserResponse>> {
    return this.fetch<ApiResponse<GetAuthUserResponse>>(
      "/auth/user",
      {},
      token
    );
  }
}
