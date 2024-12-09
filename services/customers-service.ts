import { ApiService } from "@/services/api-service";
import { ApiResponse } from "@/types/api/api";
import {
  FetchCustomerByIdResponse,
  FetchCustomersResponse,
} from "@/types/api/responses/customers";

export class CustomersService extends ApiService {
  static async fetchCustomers(
    token: string
  ): Promise<ApiResponse<FetchCustomersResponse>> {
    return this.fetch<ApiResponse<FetchCustomersResponse>>(
      "/customers",
      {},
      token
    );
  }

  static async fetchCustomerById(
    id: number,
    token: string
  ): Promise<ApiResponse<FetchCustomerByIdResponse>> {
    return this.fetch<ApiResponse<FetchCustomerByIdResponse>>(
      `/customers/${id}`,
      {},
      token
    );
  }
}
