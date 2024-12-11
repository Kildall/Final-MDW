export interface UpdateSaleRequest {
  saleId: number;
  products: { productId: number; quantity: number }[];
  deliveries: { employeeId: number; addressId: number; startDate: string }[];
  employeeId: number;
  status: string;
}
