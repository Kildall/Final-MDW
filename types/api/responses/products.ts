import { Product } from "@/types/api/interfaces";

export interface FetchProductsResponse {
  products: Product[];
}

export interface FetchSharedProductsResponse extends FetchProductsResponse {}

export interface CreateProductResponse extends Product {}

export interface UpdateProductResponse extends Product {}

export interface DeleteProductResponse {}
