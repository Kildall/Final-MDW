"use client";

import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/lib/hooks";
import { ProductsService } from "@/services/products-service";
import { Product } from "@/types/api/interfaces";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params; // Extraemos el ID de la URL.
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token)!;

  // Cargar los datos del producto
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await ProductsService.fetchProducts(token);
        if (response.status.success) {
          const foundProduct = response.data.products.find(
            (prod) => prod.id === Number(id)
          );
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            toast({
              title: "Producto no encontrado",
              description: "El producto no existe o fue eliminado.",
            });
            router.push("/products");
          }
        } else {
          toast({
            title: "Error al cargar el producto",
            description: "No se pudo cargar el producto. Inténtelo más tarde.",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Hubo un error al cargar los datos del producto.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id, router, toast, token]);

  // Función para manejar el envío del formulario
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!product) return;

    try {
      setUpdating(true);
      const response = await ProductsService.updateProduct(
        product.id,
        product,
        token
      );
      if (response.status.success) {
        toast({
          title: "Producto actualizado",
          description: "El producto se actualizó correctamente.",
        });
        router.push("/products");
      } else {
        toast({
          title: "Error al actualizar",
          description:
            "No se pudo actualizar el producto. Inténtelo más tarde." +
            "Error: " +
            JSON.stringify(response.status),
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Hubo un error al actualizar el producto." + JSON.stringify(error),
      });
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!product) {
    return <div>Producto no encontrado.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Nombre del Producto
        </label>
        <input
          id="name"
          type="text"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
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
          value={product.price}
          onChange={(e) =>
            setProduct({ ...product, price: Number(e.target.value) })
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
          value={product.quantity}
          onChange={(e) =>
            setProduct({ ...product, quantity: Number(e.target.value) })
          }
          className="mt-1 block w-full bg-transparent border border-gray-300 rounded-md p-2"
        />
      </div>

      <button
        type="submit"
        disabled={updating}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {updating ? "Actualizando..." : "Actualizar Producto"}
      </button>
    </form>
  );
}
