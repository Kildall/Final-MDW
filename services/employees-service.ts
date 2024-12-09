import { ApiService } from "@/services/api-service";
import { ApiResponse } from "@/types/api/api";
import {
  FetchEmployeeByIdResponse,
  FetchEmployeesResponse,
} from "@/types/api/responses/employees";

export class EmployeesService extends ApiService {
  static async fetchEmployees(
    token: string
  ): Promise<ApiResponse<FetchEmployeesResponse>> {
    return this.fetch<ApiResponse<FetchEmployeesResponse>>(
      "/employees",
      {},
      token
    );
  }

  static async fetchEmployeeById(
    id: number,
    token: string
  ): Promise<ApiResponse<FetchEmployeeByIdResponse>> {
    return this.fetch<ApiResponse<FetchEmployeeByIdResponse>>(
      `/employees/${id}`,
      {},
      token
    );
  }
}
