export interface UpdateSaleRequest {
  saleId: number;
  products: { productId: number; quantity: number }[];
  deliveries: { employeeId: number; addressId: number; startDate: string }[];
  employeeId: number;
  status: string;
}

export interface CreateSaleRequest {
  customerId: number;
  products: { productId: number; quantity: number }[];
  deliveries: { employeeId: number; addressId: number; startDate: string }[];
  employeeId: number;
  startDate: string;
}
