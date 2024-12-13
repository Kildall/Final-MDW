'use client';

import { UpdateProductForm } from "@/components/products/products-forms/product-update-form";
import { InlineLoadingIndicator } from "@/components/ui/inline-loading-indicator";
import { useToast } from "@/hooks/use-toast";
import { fetchProducts, selectProductById, updateProduct } from "@/lib/features/products/products-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { UpdateProductSchema } from "@/lib/schemas/products/update-product-schema";
import { FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProductReadProps {
  id: number;
}

export function ProductRead({ id }: ProductReadProps) {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) =>
    selectProductById(state, Number(id))
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  async function onSubmit(
    values: UpdateProductSchema,
    { setSubmitting }: FormikHelpers<UpdateProductSchema>
  ) {
    try {
      const request = {
        ...values,
        productId: Number(id),
      };
      await dispatch(updateProduct({ request }));
      toast({
        title: "Producto actualizado",
        description: "El producto ha sido actualizado correctamente.",
      });
      router.push("/products/list");
    } catch {
      toast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el producto, inténtelo más tarde.",
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
            Datos del producto
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl font-light text-left">
            Si es necesario, puedes actualizar los datos del producto
          </h2>
        </div>

        {product ? (
          <div className="flex-grow">
            <UpdateProductForm
              product={product}
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