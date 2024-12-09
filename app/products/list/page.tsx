"use client";

import { AuthGuard } from "@/components/auth-guard";
import { ProductsTable } from "@/components/products/products-table";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/lib/hooks";
import { ProductsService } from "@/services/products-service";
import { Product } from "@/types/api/interfaces";
import { useEffect, useState } from "react";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const token = useAppSelector((state) => state.auth.token)!;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const response = await ProductsService.fetchProducts(token);
        if (response.status.success) {
          setProducts(response.data.products);
          setLoading(false);
        } else {
          toast({
            title: "Error al obtener los productos.",
            description:
              "No se pudieron obtener los productos intentelo de nuevo más tarde.",
          });
        }
      } catch (error) {
        toast({
          title: "Error al obtener los productos.",
          description:
            "No se pudieron obtener los productos. Inténtelo de nuevo más tarde",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Puedes reemplazar esto con un spinner u otro indicador de carga
  }

  return (
    <AuthGuard>
      <ProductsTable products={products} />
    </AuthGuard>
  );
}
