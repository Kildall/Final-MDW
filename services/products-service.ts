import { ApiService } from "@/services/api-service";
import { Product } from "@/types/api/interfaces";
import {
  FetchProductsResponse,
  FetchSharedProductsResponse,
  CreateProductResponse,
  UpdateProductResponse,
  DeleteProductResponse,
} from "@/types/api/responses/products";

export class ProductsService extends ApiService {
  static async fetchProducts(): Promise<ApiResponse<FetchProductsResponse>> {
    return this.fetch<ApiResponse<FetchProductsResponse>>("/products");
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
    updates: Partial<Product>
  ): Promise<ApiResponse<UpdateProductResponse>> {
    return this.fetch<ApiResponse<UpdateProductResponse>>(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
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
