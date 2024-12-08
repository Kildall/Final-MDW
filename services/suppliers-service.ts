import { ApiService } from "@/services/api-service";
import { Supplier } from "@/types/api/interfaces";
import {
  FetchSuppliersResponse,
  FetchSharedSuppliersResponse,
  CreateSupplierResponse,
  UpdateSupplierResponse,
  DeleteSupplierResponse,
} from "@/types/api/responses/suppliers";

export class SuppliersService extends ApiService {
  static async fetchSuppliers(): Promise<ApiResponse<FetchSuppliersResponse>> {
    return this.fetch<ApiResponse<FetchSuppliersResponse>>("/suppliers");
  }

  static async fetchSharedSuppliers(): Promise<
    ApiResponse<FetchSharedSuppliersResponse>
  > {
    return this.fetch<ApiResponse<FetchSharedSuppliersResponse>>(
      "/shared/suppliers"
    );
  }

  static async createSupplier(
    supplier: Omit<Supplier, "id" | "_count">
  ): Promise<ApiResponse<CreateSupplierResponse>> {
    return this.fetch<ApiResponse<CreateSupplierResponse>>("/suppliers", {
      method: "POST",
      body: JSON.stringify(supplier),
    });
  }

  static async updateSupplier(
    id: number,
    updates: Partial<Supplier>
  ): Promise<ApiResponse<UpdateSupplierResponse>> {
    return this.fetch<ApiResponse<UpdateSupplierResponse>>(`/suppliers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  static async deleteSupplier(
    id: number
  ): Promise<ApiResponse<DeleteSupplierResponse>> {
    return this.fetch<ApiResponse<DeleteSupplierResponse>>(`/suppliers/${id}`, {
      method: "DELETE",
    });
  }
}
