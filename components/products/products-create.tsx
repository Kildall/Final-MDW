'use client';

import { useToast } from "@/hooks/use-toast";
import { createProduct } from "@/lib/features/products/products-slice";
import { useAppDispatch } from "@/lib/hooks";
import { CreateProductSchema } from "@/lib/schemas/products/create-product-schema";
import { CreateProductRequest } from "@/types/api/requests/products";
import { FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { CreateProductForm } from "./products-forms/product-create-form";

export function ProductsCreate() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit(
    values: CreateProductSchema,
    { setSubmitting }: FormikHelpers<CreateProductSchema>
  ) {
    try {
      const request: CreateProductRequest = {
        name: values.name,
        price: values.price,
        measure: values.measure,
        brand: values.brand,
        quantity: values.quantity,
      };
      console.log(request);
      await dispatch(createProduct(request));
      toast({
        title: "Producto creado correctamente",
        description: "El producto ha sido creado correctamente",
        variant: "default",
      });
      router.push("/products/list");
    } catch {
      toast({
        title: "Error al crear el producto",
        description: "Hubo un error al crear el producto",
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-left font-doto">Creacion de un producto</h1>
          <h2 className="text-lg sm:text-xl md:text-2xl font-light text-left">Ingresa los datos del producto</h2>
        </div>

        <div className="flex-grow">
          <CreateProductForm
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </section>
  );
}