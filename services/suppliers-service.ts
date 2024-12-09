import { ApiService } from "@/services/api-service";
import { ApiResponse } from "@/types/api/api";
import { Supplier } from "@/types/api/interfaces";
import { UpdateSupplierRequest } from "@/types/api/requests/suppliers";
import {
  CreateSupplierResponse,
  DeleteSupplierResponse,
  FetchSharedSuppliersResponse,
  FetchSuppliersResponse,
  UpdateSupplierResponse,
} from "@/types/api/responses/suppliers";

export class SuppliersService extends ApiService {
  static async fetchSuppliers(
    token: string
  ): Promise<ApiResponse<FetchSuppliersResponse>> {
    return this.fetch<ApiResponse<FetchSuppliersResponse>>(
      "/suppliers",
      {},
      token
    );
  }

  static async fetchSharedSuppliers(): Promise<
    ApiResponse<FetchSharedSuppliersResponse>
  > {
    return this.fetch<ApiResponse<FetchSharedSuppliersResponse>>(
      "/shared/suppliers"
    );
  }

  static async createSupplier(
    supplier: Omit<Supplier, "id" | "_count">,
    token: string
  ): Promise<ApiResponse<CreateSupplierResponse>> {
    return this.fetch<ApiResponse<CreateSupplierResponse>>(
      "/suppliers",
      {
        method: "POST",
        body: JSON.stringify(supplier),
      },
      token
    );
  }

  static async updateSupplier(
    request: UpdateSupplierRequest,
    token: string
  ): Promise<ApiResponse<UpdateSupplierResponse>> {
    return this.fetch<ApiResponse<UpdateSupplierResponse>>(
      `/suppliers`,
      {
        method: "PUT",
        body: JSON.stringify(request),
      },
      token
    );
  }

  static async deleteSupplier(
    id: number
  ): Promise<ApiResponse<DeleteSupplierResponse>> {
    return this.fetch<ApiResponse<DeleteSupplierResponse>>(`/suppliers/${id}`, {
      method: "DELETE",
    });
  }
}
