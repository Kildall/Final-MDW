'use client';

import { CreateSupplierForm } from "@/components/suppliers/suppliers-forms/suppliers-create-form";
import { useToast } from "@/hooks/use-toast";
import { createSupplier } from "@/lib/features/suppliers/suppliers-slice";
import { useAppDispatch } from "@/lib/hooks";
import { CreateSupplierSchema } from "@/lib/schemas/suppliers/create-supplier-schema";
import { CreateSupplierRequest } from "@/types/api/requests/suppliers";
import { FormikHelpers } from "formik";
import { useRouter } from "next/navigation";

export function SuppliersCreate() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit(
    values: CreateSupplierSchema,
    { setSubmitting }: FormikHelpers<CreateSupplierSchema>
  ) {
    try {
      const request: CreateSupplierRequest = {
        name: values.name
      };
      const result = await dispatch(createSupplier(request));
      if (result.meta.requestStatus === "fulfilled") {
        toast({
          title: "Proveedor creado correctamente",
          description: "El proveedor ha sido creado correctamente",
          variant: "default",
        });
        router.push("/suppliers/list");
      }
    } catch {
      toast({
        title: "Error al crear el proveedor",
        description: "Hubo un error al crear el proveedor",
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-left font-doto">Creacion de un proveedor</h1>
          <h2 className="text-lg sm:text-xl md:text-2xl font-light text-left">Ingresa los datos del proveedor</h2>
        </div>

        <div className="flex-grow">
          <CreateSupplierForm
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </section>
  );
}