import { Supplier } from "@/types/api/interfaces";

export interface FetchSuppliersResponse {
  suppliers: Supplier[];
}

export interface FetchSharedSuppliersResponse extends FetchSuppliersResponse {}

export interface CreateSupplierResponse extends Supplier {}

export interface UpdateSupplierResponse extends Supplier {}

export interface DeleteSupplierResponse {}
