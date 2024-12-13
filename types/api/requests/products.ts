export interface UpdateProductRequest {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  measure: number;
  brand: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  quantity: number;
  measure: number;
  brand: string;
}
