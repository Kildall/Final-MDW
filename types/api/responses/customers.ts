import { Customer } from "@/types/api/interfaces";

export interface FetchCustomersResponse {
  customers: Customer[];
}

export interface FetchCustomerByIdResponse extends Customer {}
