'use client';

import { UpdateSaleForm } from "@/components/sales/sales-forms/sales-update-form";
import { InlineLoadingIndicator } from "@/components/ui/inline-loading-indicator";
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
  }, [dispatch, id]);

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
      const request: UpdateSaleRequest = {
        saleId: values.saleId,
        products: values.products,
        deliveries: values.deliveries,
        employeeId: values.employeeId,
        status: values.status
      };
      const result = await dispatch(updateSale(request));
      if (result.meta.requestStatus === "fulfilled") {
        toast({
          title: "Venta actualizada correctamente",
          description: "La venta ha sido actualizada correctamente",
          variant: "default",
        });
        router.push("/sales/list");
      }
    } catch {
      toast({
        title: "Error al actualizar la venta",
        description: "Hubo un error al actualizar la venta",
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-left font-doto">Datos de la venta</h1>
          <h2 className="text-lg sm:text-xl md:text-2xl font-light text-left">Si es necesario, puedes actualizar los datos de la venta</h2>
        </div>

        {sale && customer && products && employees ? (
          <div className="flex-grow">
            <UpdateSaleForm
              sale={sale}
              customer={customer}
              products={products}
              employees={employees}
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