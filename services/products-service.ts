import { ApiService } from "@/services/api-service";
import { ApiResponse } from "@/types/api/api";
import { Product } from "@/types/api/interfaces";
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
    product: Omit<Product, "id" | "_count">
  ): Promise<ApiResponse<CreateProductResponse>> {
    return this.fetch<ApiResponse<CreateProductResponse>>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
  }

  static async updateProduct(
    id: number,
    updates: Partial<Product>,
    token: string
  ): Promise<ApiResponse<UpdateProductResponse>> {
    return this.fetch<ApiResponse<UpdateProductResponse>>(`/products`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: id,
        ...updates,
      }),
    });
  }

  static async deleteProduct(
    id: number
  ): Promise<ApiResponse<DeleteProductResponse>> {
    return this.fetch<ApiResponse<DeleteProductResponse>>(`/products/${id}`, {
      method: "DELETE",
    });
  }
}
