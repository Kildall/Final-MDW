import { ApiService } from "@/services/api-service";
import { ApiResponse } from "@/types/api/api";
import { Sale } from "@/types/api/interfaces";
import { UpdateSaleRequest } from "@/types/api/requests/sales";
import {
  CreateSaleResponse,
  DeleteSaleResponse,
  FetchSalesByIdResponse,
  FetchSalesResponse,
  FetchSharedSalesResponse,
  UpdateSaleResponse,
} from "@/types/api/responses/sales";

export class SalesService extends ApiService {
  static async fetchSales(
    token: string
  ): Promise<ApiResponse<FetchSalesResponse>> {
    return this.fetch<ApiResponse<FetchSalesResponse>>("/sales", {}, token);
  }

  static async fetchSalesById(
    id: number,
    token: string
  ): Promise<ApiResponse<FetchSalesByIdResponse>> {
    return this.fetch<ApiResponse<FetchSalesByIdResponse>>(
      `/sales/${id}`,
      {},
      token
    );
  }

  static async fetchSharedSales(): Promise<
    ApiResponse<FetchSharedSalesResponse>
  > {
    return this.fetch<ApiResponse<FetchSharedSalesResponse>>("/shared/sales");
  }

  static async createSale(
    sale: Omit<Sale, "id" | "_count">,
    token: string
  ): Promise<ApiResponse<CreateSaleResponse>> {
    return this.fetch<ApiResponse<CreateSaleResponse>>(
      "/sales",
      {
        method: "POST",
        body: JSON.stringify(sale),
      },
      token
    );
  }

  static async updateSale(
    request: UpdateSaleRequest,
    token: string
  ): Promise<ApiResponse<UpdateSaleResponse>> {
    return this.fetch<ApiResponse<UpdateSaleResponse>>(
      `/sales`,
      {
        method: "PUT",
        body: JSON.stringify(request),
      },
      token
    );
  }

  static async deleteSale(
    id: number,
    token: string
  ): Promise<ApiResponse<DeleteSaleResponse>> {
    return this.fetch<ApiResponse<DeleteSaleResponse>>(
      `/sales/${id}`,
      {
        method: "DELETE",
      },
      token
    );
  }
}
