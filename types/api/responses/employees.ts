import { Employee } from "@/types/api/interfaces";

export interface FetchEmployeesResponse {
  employees: Employee[];
}

export interface FetchEmployeeByIdResponse extends Employee {}
