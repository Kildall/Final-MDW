'use client';

import { fetchCustomerById, selectCustomerById } from "@/lib/features/customers/customers-slice";
import { fetchEmployees } from "@/lib/features/employees/employee-slice";
import { fetchProducts } from "@/lib/features/products/products-slice";
import { fetchSales, selectSaleById } from "@/lib/features/sales/sales-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import { SalesForm } from "./sales-forms/sales-form";

interface SalesReadProps {
  id: number;
}

export function SalesRead({ id }: SalesReadProps) {
  const dispatch = useAppDispatch();
  const sale = useAppSelector((state) => selectSaleById(state, id));
  const customer = useAppSelector((state) => selectCustomerById(state, sale?.customer?.id));
  const employees = useAppSelector((state) => state.employees.employees);
  const products = useAppSelector((state) => state.products.products);

  useEffect(() => {
    dispatch(fetchSales());
    dispatch(fetchProducts());
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (sale && sale.customer) {
      dispatch(fetchCustomerById(sale.customer.id));
    }
  }, [dispatch, sale]);

  if (!sale || !customer || !products) return null;

  return <SalesForm sale={sale} customer={customer} products={products} employees={employees} />;
}