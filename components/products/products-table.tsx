import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchProducts } from "@/lib/features/products/products-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "../ui/button";


export function ProductsTable() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  const products = useAppSelector((state) => state.products.products);
  return (
    <Table>
      <TableCaption>Lista de productos disponibles.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Nombre</TableHead>
          <TableHead>Cantidad</TableHead>
          <TableHead>Unidad de medida</TableHead>
          <TableHead>Marca</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead className="text-right">Habilitado</TableHead>
          <TableHead className="text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.quantity}</TableCell>
            <TableCell>{product.measure}</TableCell>
            <TableCell>{product.brand}</TableCell>
            <TableCell>{`$${product.price.toFixed(2)}`}</TableCell>
            <TableCell className="text-right">
              {product.enabled ? "Sí" : "No"}
            </TableCell>
            <TableCell className="flex justify-center">
              <Link href={`/products/${product.id}`}>
                <Button variant="outline" size="icon">
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {products.length > 0 && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total de productos</TableCell>
            <TableCell colSpan={2} className="text-right">
              {products.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}
