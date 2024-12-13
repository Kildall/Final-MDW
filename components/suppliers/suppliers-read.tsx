'use client';

import { InlineLoadingIndicator } from "@/components/ui/inline-loading-indicator";
import { useToast } from "@/hooks/use-toast";
import { fetchSuppliers, selectSupplierById, updateSupplier } from "@/lib/features/suppliers/suppliers-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { UpdateSupplierSchema } from "@/lib/schemas/suppliers/update-supplier-schema";
import { FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UpdateSupplierForm } from "./suppliers-forms/suppliers-update-form";

interface SuppliersReadProps {
  id: number;
}

export function SuppliersRead({ id }: SuppliersReadProps) {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const supplier = useAppSelector((state) =>
    selectSupplierById(state, Number(id))
  );

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  async function onSubmit(
    values: UpdateSupplierSchema,
    { setSubmitting }: FormikHelpers<UpdateSupplierSchema>
  ) {
    try {
      const request = {
        ...values,
      };
      await dispatch(updateSupplier({ request }));
      toast({
        title: "Proveedor actualizado",
        description: "El proveedor ha sido actualizado correctamente.",
      });
      router.push("/suppliers/list");
    } catch {
      toast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el proveedor, inténtelo más tarde.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="flex-grow pt-12">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex-none">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-left font-doto">
            Datos del proveedor
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl font-light text-left">
            Si es necesario, puedes actualizar los datos del proveedor
          </h2>
        </div>

        {supplier ? (
          <div className="flex-grow">
            <UpdateSupplierForm
              supplier={supplier}
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