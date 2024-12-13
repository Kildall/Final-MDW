import { ApiService } from "@/services/api-service";
import { ApiResponse } from "@/types/api/api";
import {
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types/api/requests/products";
import {
  CreateProductResponse,
  DeleteProductResponse,
  FetchProductsResponse,
  FetchSharedProductsResponse,
  UpdateProductResponse,
} from "@/types/api/responses/products";

export class ProductsService extends ApiService {
  static async fetchProducts(
    token: string
  ): Promise<ApiResponse<FetchProductsResponse>> {
    return this.fetch<ApiResponse<FetchProductsResponse>>(
      "/products",
      {},
      token
    );
  }

  static async fetchSharedProducts(): Promise<
    ApiResponse<FetchSharedProductsResponse>
  > {
    return this.fetch<ApiResponse<FetchSharedProductsResponse>>(
      "/shared/products"
    );
  }

  static async createProduct(
    request: CreateProductRequest,
    token: string
  ): Promise<ApiResponse<CreateProductResponse>> {
    return this.fetch<ApiResponse<CreateProductResponse>>(
      "/products",
      {
        method: "POST",
        body: JSON.stringify(request),
      },
      token
    );
  }

  static async updateProduct(
    request: UpdateProductRequest,
    token: string
  ): Promise<ApiResponse<UpdateProductResponse>> {
    return this.fetch<ApiResponse<UpdateProductResponse>>(`/products`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });
  }

  static async deleteProduct(
    id: number,
    token: string
  ): Promise<ApiResponse<DeleteProductResponse>> {
    return this.fetch<ApiResponse<DeleteProductResponse>>(
      `/products/${id}`,
      {
        method: "DELETE",
      },
      token
    );
  }
}
