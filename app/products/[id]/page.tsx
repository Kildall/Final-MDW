"use client";

import { useToast } from "@/hooks/use-toast";
import { fetchProducts, selectProductById, updateProduct } from "@/lib/features/products/products-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Product } from "@/types/api/interfaces";
import { UpdateProductRequest } from "@/types/api/requests/products";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params; // Extraemos el ID de la URL.
  const { toast } = useToast();
  const router = useRouter();
  const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null);
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) =>
    selectProductById(state, Number(id))
  );

  useEffect(() => {
    dispatch(fetchProducts());
    if (product) {
      setUpdatedProduct(product);
    }
  }, []);

  // Función para manejar el envío del formulario
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!updatedProduct) return;

    try {
      const request: UpdateProductRequest = {
        productId: Number(id),
        ...updatedProduct,
      };
      dispatch(updateProduct({ request }));
      toast({
        title: "Producto actualizado",
        description: "El producto ha sido actualizado correctamente.",
      });
      router.push("/products/list");
    } catch {
      toast({
        title: "Error al actualizar",
        description:
          "No se pudo actualizar el producto, inténtelo más tarde."
      });
    }
  }

  if (!updatedProduct) {
    return <div>Producto no encontrado.</div>;
  }

  return (
    <>
      {
        updatedProduct ? (

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Nombre del Producto
              </label>
              <input
                id="name"
                type="text"
                value={updatedProduct.name}
                onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
                className="mt-1 block w-full bg-transparent border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium">
                Precio
              </label>
              <input
                id="price"
                type="number"
                value={updatedProduct.price}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, price: Number(e.target.value) })
                }
                className="mt-1 block w-full bg-transparent border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium">
                Cantidad
              </label>
              <input
                id="quantity"
                type="number"
                value={updatedProduct.quantity}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, quantity: Number(e.target.value) })
                }
                className="mt-1 block w-full bg-transparent border border-gray-300 rounded-md p-2"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Actualizar Producto
            </button>
          </form>) : <div>Cargando...</div>
      }
    </>
  );
}
