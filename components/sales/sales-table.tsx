'use client';

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { fetchSales } from "@/lib/features/sales/sales-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export function SalesTable() {
  const dispatch = useAppDispatch();
  dispatch(fetchSales());
  const sales = useAppSelector((state) => state.sales.sales);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">ID</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Cantidad de productos</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell className="font-medium">{sale.id}</TableCell>
            <TableCell>{new Date(sale.startDate).toLocaleDateString()}</TableCell>
            <TableCell>{sale.products?.reduce((acc, product) => acc + product.quantity, 0)}</TableCell>
            <TableCell>{sale.products?.reduce((acc, product) => acc + product.quantity * (product.product?.price ?? 0), 0)}</TableCell>
            <TableCell>{sale.customer?.name}</TableCell>
            <TableCell className="flex justify-center">
              <Link href={`/sales/${sale.id}`}>
                <Button variant="outline" size="icon">
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {sales.length > 0 && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total de ventas</TableCell>
            <TableCell colSpan={2} className="text-right">
              {sales.length}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4}>Total de productos</TableCell>
            <TableCell colSpan={2} className="text-right">
              {sales.reduce((acc, sale) => acc + (sale.products?.reduce((acc, product) => acc + product.quantity, 0) ?? 0), 0)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4}>Total de ingresos</TableCell>
            <TableCell colSpan={2} className="text-right">
              $ {sales.reduce((acc, sale) => acc + (sale.products?.reduce((acc, product) => acc + product.quantity * (product.product?.price ?? 0), 0) ?? 0), 0)}
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}
