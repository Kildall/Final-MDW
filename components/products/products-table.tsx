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
import { Product } from "@/types/api/interfaces";

interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({ products }: ProductsTableProps) {
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
          </TableRow>
        ))}
      </TableBody>
      {products.length > 0 && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total de productos</TableCell>
            <TableCell colSpan={2} className="text-right">
              {products.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}
