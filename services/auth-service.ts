import { ApiService } from "@/services/api-service";
import { LoginRequest } from "@/types/api/requests/auth";
import { LoginResponse } from "@/types/api/responses/auth";

export class AuthService extends ApiService {
  static async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.fetch<ApiResponse<LoginResponse>>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
