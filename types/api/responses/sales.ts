import { Sale } from "@/types/api/interfaces";

export interface FetchSalesResponse {
  sales: Sale[];
}

export interface FetchSalesByIdResponse extends Sale {}

export interface FetchSharedSalesResponse extends FetchSalesResponse {}

export interface CreateSaleResponse extends Sale {}

export interface UpdateSaleResponse extends Sale {}

export interface DeleteSaleResponse {}
