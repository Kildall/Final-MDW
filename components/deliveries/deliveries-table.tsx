'use client';
import { Button } from "@/components/ui/button";
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
import { DELIVERY_STATUS } from "@/helpers/delivery-status";
import { fetchCustomers } from "@/lib/features/customers/customers-slice";
import { fetchDeliveries } from "@/lib/features/deliveries/deliveries-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";


export function DeliveriesTable() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDeliveries());
    dispatch(fetchCustomers());
  }, []);

  const customers = useAppSelector((state) => state.customers.customers);
  const deliveries = useAppSelector((state) => state.deliveries.deliveries);

  return (
    <Table>
      <TableCaption>Lista de entregas disponibles.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Venta</TableHead>
          <TableHead>Ultima Actualización</TableHead>
          <TableHead>Fecha de Inicio</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-center w-[150px]">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deliveries.map((delivery) => {
          let customerName = "";

          if (delivery.sale?.customerId) {
            const customer = customers.find((customer) => customer.id === delivery.sale?.customerId);
            if (customer) {
              customerName = customer.name;
            }
          }
          return (
            <TableRow key={delivery.id}>
              <TableCell className="font-medium">{customerName ?? "Sin cliente"}</TableCell>
              <TableCell>{new Date(delivery.lastUpdateDate).toLocaleDateString() ?? "Sin fecha"}</TableCell>
              <TableCell>{new Date(delivery.startDate).toLocaleDateString() ?? "Sin fecha"}</TableCell>
              <TableCell>{DELIVERY_STATUS[delivery.status] ?? "Sin estado"}</TableCell>
              <TableCell className="flex justify-center gap-2">
                <Link href={`/sales/${delivery.saleId}`}>
                  <Button variant="outline" size="icon">
                    <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
      {deliveries.length > 0 && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total de entregas</TableCell>
            <TableCell colSpan={2} className="text-right">
              {deliveries.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}
