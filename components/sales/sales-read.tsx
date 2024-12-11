'use client';

import { SalesForm } from "@/components/sales/sales-forms/sales-form";
import { useToast } from "@/hooks/use-toast";
import { fetchCustomerById, selectCustomerById } from "@/lib/features/customers/customers-slice";
import { fetchEmployees } from "@/lib/features/employees/employee-slice";
import { fetchProducts } from "@/lib/features/products/products-slice";
import { fetchSaleById, selectSaleById, updateSale } from "@/lib/features/sales/sales-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { UpdateSaleSchema } from "@/lib/schemas/sales/update-sale-schema";
import { UpdateSaleRequest } from "@/types/api/requests/sales";
import { FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface SalesReadProps {
  id: number;
}

export function SalesRead({ id }: SalesReadProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const sale = useAppSelector((state) => selectSaleById(state, id));
  const customer = useAppSelector((state) => selectCustomerById(state, sale?.customer?.id));
  const employees = useAppSelector((state) => state.employees.employees);
  const products = useAppSelector((state) => state.products.products);

  useEffect(() => {
    dispatch(fetchSaleById(id));
    dispatch(fetchProducts());
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (sale && sale.customer) {
      dispatch(fetchCustomerById(sale.customer.id));
    }
  }, [dispatch, sale]);

  async function onSubmit(
    values: UpdateSaleSchema,
    { setSubmitting }: FormikHelpers<UpdateSaleSchema>
  ) {
    try {
      console.log(JSON.stringify(values, null, 2));
      const request: UpdateSaleRequest = {
        saleId: values.saleId,
        products: values.products,
        deliveries: values.deliveries,
        employeeId: values.employeeId,
        status: values.status
      };
      await dispatch(updateSale(request));
      toast({
        title: "Venta actualizada correctamente",
        description: "La venta ha sido actualizada correctamente",
        variant: "default",
      });
      router.push("/sales/list");
    } catch (error) {
      toast({
        title: "Error al actualizar la venta",
        description: "Hubo un error al actualizar la venta",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (!sale || !customer || !products) return null;

  return <SalesForm sale={sale} customer={customer} products={products} employees={employees} onSubmit={onSubmit} />;
}