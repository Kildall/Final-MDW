'use client';

import { CreateSaleForm } from "@/components/sales/sales-forms/sales-create-form";
import { InlineLoadingIndicator } from "@/components/ui/inline-loading-indicator";
import { useToast } from "@/hooks/use-toast";
import { fetchCustomers } from "@/lib/features/customers/customers-slice";
import { fetchEmployees } from "@/lib/features/employees/employee-slice";
import { fetchProducts } from "@/lib/features/products/products-slice";
import { createSale } from "@/lib/features/sales/sales-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { CreateSaleSchema } from "@/lib/schemas/sales/create-sale-schema";
import { CreateSaleRequest } from "@/types/api/requests/sales";
import { FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SalesCreate() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const customers = useAppSelector((state) => state.customers.customers);
  const employees = useAppSelector((state) => state.employees.employees);
  const products = useAppSelector((state) => state.products.products);

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
    dispatch(fetchEmployees());
  }, [dispatch]);

  async function onSubmit(
    values: CreateSaleSchema,
    { setSubmitting }: FormikHelpers<CreateSaleSchema>
  ) {
    try {
      const request: CreateSaleRequest = {
        customerId: values.customerId,
        products: values.products,
        deliveries: values.deliveries,
        employeeId: values.employeeId,
        startDate: values.startDate
      };
      console.log(request);
      await dispatch(createSale(request));
      toast({
        title: "Venta creada correctamente",
        description: "La venta ha sido creada correctamente",
        variant: "default",
      });
      router.push("/sales/list");
    } catch (error) {
      toast({
        title: "Error al crear la venta",
        description: "Hubo un error al crear la venta",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="flex-grow pt-12">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex-none">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-left font-doto">Creacion de una venta</h1>
          <h2 className="text-lg sm:text-xl md:text-2xl font-light text-left">Ingresa los datos de la venta</h2>
        </div>

        {customers && products && employees ? (
          <div className="flex-grow">
            <CreateSaleForm
              products={products}
              employees={employees}
              customers={customers}
              onSubmit={onSubmit}
            />
          </div>
        ) : (
          <InlineLoadingIndicator />
        )}
      </div>
    </section>
  );
}